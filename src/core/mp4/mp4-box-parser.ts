/**
 * Pure TypeScript ISOBMFF / MP4 Box Parser
 * Parses standard MP4 container structures, atoms, timescales, and keyframe tables.
 */

export interface MP4BoxHeader {
  type: string;
  offset: number;
  size: number;
  headerSize: number;
}

export interface MP4StructureSummary {
  boxes: MP4BoxHeader[];
  hasFtyp: boolean;
  hasMoov: boolean;
  hasMdat: boolean;
  isFastStart: boolean; // moov appears before mdat
  moovBox?: MP4BoxHeader;
  mdatBox?: MP4BoxHeader;
  timescale?: number;
  duration?: number;
  syncSampleOffsets?: number[];
}

export class MP4BoxParser {
  private view: DataView;
  private buffer: ArrayBuffer;

  constructor(buffer: ArrayBuffer) {
    this.buffer = buffer;
    this.view = new DataView(buffer);
  }

  /**
   * Scans top-level boxes in the provided buffer
   */
  public parseTopLevelBoxes(): MP4StructureSummary {
    const boxes: MP4BoxHeader[] = [];
    let offset = 0;
    const totalLength = this.buffer.byteLength;

    let hasFtyp = false;
    let hasMoov = false;
    let hasMdat = false;
    let moovBox: MP4BoxHeader | undefined;
    let mdatBox: MP4BoxHeader | undefined;
    let isFastStart = false;

    while (offset + 8 <= totalLength) {
      let size = this.view.getUint32(offset);
      const type = this.readFourCC(offset + 4);
      let headerSize = 8;

      if (size === 1) {
        // 64-bit extended size
        if (offset + 16 > totalLength) break;
        // High 32 bits + Low 32 bits
        const high = this.view.getUint32(offset + 8);
        const low = this.view.getUint32(offset + 12);
        size = high * 4294967296 + low;
        headerSize = 16;
      } else if (size === 0) {
        // Box extends to end of file
        size = totalLength - offset;
      }

      if (size < headerSize || offset + size > totalLength) {
        // Incomplete box at end of buffer
        boxes.push({ type, offset, size: totalLength - offset, headerSize });
        break;
      }

      const boxHeader: MP4BoxHeader = { type, offset, size, headerSize };
      boxes.push(boxHeader);

      if (type === 'ftyp') hasFtyp = true;
      if (type === 'moov') {
        hasMoov = true;
        moovBox = boxHeader;
        if (!hasMdat) {
          isFastStart = true;
        }
      }
      if (type === 'mdat') {
        hasMdat = true;
        mdatBox = boxHeader;
      }

      offset += size;
    }

    const summary: MP4StructureSummary = {
      boxes,
      hasFtyp,
      hasMoov,
      hasMdat,
      isFastStart,
      moovBox,
      mdatBox,
    };

    // If moov exists, inspect movie header (mvhd)
    if (moovBox) {
      const mvhd = this.findSubBox(moovBox.offset + moovBox.headerSize, moovBox.offset + moovBox.size, 'mvhd');
      if (mvhd) {
        const mvhdDataOffset = mvhd.offset + mvhd.headerSize;
        if (mvhdDataOffset + 24 <= this.buffer.byteLength) {
          const version = this.view.getUint8(mvhdDataOffset);
          if (version === 0) {
            // 32-bit times
            const timescale = this.view.getUint32(mvhdDataOffset + 12);
            const duration = this.view.getUint32(mvhdDataOffset + 16);
            summary.timescale = timescale;
            summary.duration = timescale > 0 ? duration / timescale : 0;
          } else if (version === 1 && mvhdDataOffset + 32 <= this.buffer.byteLength) {
            // 64-bit times
            const timescale = this.view.getUint32(mvhdDataOffset + 20);
            const highDur = this.view.getUint32(mvhdDataOffset + 24);
            const lowDur = this.view.getUint32(mvhdDataOffset + 28);
            const duration = highDur * 4294967296 + lowDur;
            summary.timescale = timescale;
            summary.duration = timescale > 0 ? duration / timescale : 0;
          }
        }
      }
    }

    return summary;
  }

  /**
   * Helper to find a child box within a parent box range
   */
  public findSubBox(startOffset: number, endOffset: number, targetType: string): MP4BoxHeader | null {
    let offset = startOffset;
    const max = Math.min(endOffset, this.buffer.byteLength);

    while (offset + 8 <= max) {
      let size = this.view.getUint32(offset);
      const type = this.readFourCC(offset + 4);
      let headerSize = 8;

      if (size === 1) {
        if (offset + 16 > max) break;
        const high = this.view.getUint32(offset + 8);
        const low = this.view.getUint32(offset + 12);
        size = high * 4294967296 + low;
        headerSize = 16;
      } else if (size === 0) {
        size = max - offset;
      }

      if (size < headerSize) break;

      if (type === targetType) {
        return { type, offset, size, headerSize };
      }

      offset += size;
    }

    return null;
  }

  private readFourCC(offset: number): string {
    return String.fromCharCode(
      this.view.getUint8(offset),
      this.view.getUint8(offset + 1),
      this.view.getUint8(offset + 2),
      this.view.getUint8(offset + 3)
    );
  }
}
