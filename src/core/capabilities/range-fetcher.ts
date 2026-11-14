/**
 * Utilities for fetching precise byte ranges and container metadata (moov)
 * from HTTP Range-compliant video servers.
 */

export interface MoovBoxLocation {
  headerBuffer: ArrayBuffer;
  moovOffset: number;
  moovSize: number;
  isFastStart: boolean;
}

/**
 * Fetches a specific byte slice [startByte, endByte] from a media URL
 */
export async function fetchByteRange(
  url: string,
  startByte: number,
  endByte: number,
  signal?: AbortSignal,
  onProgress?: (bytesLoaded: number, totalRangeBytes: number) => void
): Promise<ArrayBuffer> {
  const rangeHeader = `bytes=${startByte}-${endByte}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Range: rangeHeader,
      Accept: '*/*',
    },
    signal,
    cache: 'no-store',
  });

  if (response.status !== 206 && response.status !== 200) {
    throw new Error(`Server returned HTTP ${response.status} for range ${rangeHeader}`);
  }

  const expectedLength = endByte - startByte + 1;
  const reader = response.body?.getReader();

  if (reader) {
    const chunks: Uint8Array[] = [];
    let received = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        received += value.byteLength;
        if (onProgress) {
          onProgress(received, expectedLength);
        }
      }
    }

    const fullBuffer = new Uint8Array(received);
    let offset = 0;
    for (const chunk of chunks) {
      fullBuffer.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return fullBuffer.buffer;
  }

  return await response.arrayBuffer();
}

/**
 * Locates and downloads only the complete container header (`ftyp` and `moov` boxes)
 * without downloading the multi-gigabyte `mdat` media data.
 */
export async function fetchMoovHeader(
  url: string,
  totalFileSize: number,
  signal?: AbortSignal
): Promise<MoovBoxLocation> {
  // Step 1: Fetch initial 512 KB chunk to detect box layout
  const initialFetchSize = Math.min(512 * 1024, totalFileSize > 0 ? totalFileSize : 512 * 1024);
  const initialBuffer = await fetchByteRange(url, 0, initialFetchSize - 1, signal);

  const view = new DataView(initialBuffer);
  let offset = 0;
  const totalInitial = initialBuffer.byteLength;

  let moovOffset = -1;
  let moovSize = -1;
  let hasMdat = false;

  while (offset + 8 <= totalInitial) {
    let size = view.getUint32(offset);
    const type = String.fromCharCode(
      view.getUint8(offset + 4),
      view.getUint8(offset + 5),
      view.getUint8(offset + 6),
      view.getUint8(offset + 7)
    );

    let headerSize = 8;
    if (size === 1) {
      if (offset + 16 > totalInitial) break;
      const high = view.getUint32(offset + 8);
      const low = view.getUint32(offset + 12);
      size = high * 4294967296 + low;
      headerSize = 16;
    } else if (size === 0) {
      size = totalFileSize > 0 ? totalFileSize - offset : totalInitial - offset;
    }

    if (type === 'mdat') {
      hasMdat = true;
    }

    if (type === 'moov') {
      moovOffset = offset;
      moovSize = size;
      break;
    }

    if (size < headerSize) break;
    offset += size;
  }

  // Case A: moov is in initial chunk and fits completely
  if (moovOffset >= 0 && moovOffset + moovSize <= totalInitial) {
    const completeHeader = initialBuffer.slice(0, moovOffset + moovSize);
    return {
      headerBuffer: completeHeader,
      moovOffset,
      moovSize,
      isFastStart: !hasMdat,
    };
  }

  // Case B: moov was found at the beginning (Fast Start) but is larger than 512 KB
  // (common in multi-hour videos like 3.5h lecture videos where moov is 5MB - 12MB)
  if (moovOffset >= 0) {
    const endByteToFetch = Math.min(totalFileSize > 0 ? totalFileSize - 1 : moovOffset + moovSize, moovOffset + moovSize - 1);
    const completeHeader = await fetchByteRange(url, 0, endByteToFetch, signal);
    return {
      headerBuffer: completeHeader,
      moovOffset,
      moovSize,
      isFastStart: !hasMdat,
    };
  }

  // Case C: moov is at the end of the file (un-optimized MP4)
  if (totalFileSize > initialFetchSize) {
    const tailFetchSize = Math.min(2 * 1024 * 1024, totalFileSize - initialFetchSize); // Fetch last 2MB
    const tailStart = totalFileSize - tailFetchSize;
    const tailBuffer = await fetchByteRange(url, tailStart, totalFileSize - 1, signal);

    const tailView = new DataView(tailBuffer);
    let tOffset = 0;
    while (tOffset + 8 <= tailBuffer.byteLength) {
      let size = tailView.getUint32(tOffset);
      const type = String.fromCharCode(
        tailView.getUint8(tOffset + 4),
        tailView.getUint8(tOffset + 5),
        tailView.getUint8(tOffset + 6),
        tailView.getUint8(tOffset + 7)
      );

      if (type === 'moov') {
        const actualFileOffset = tailStart + tOffset;
        let completeMoov: ArrayBuffer;
        if (tOffset + size <= tailBuffer.byteLength) {
          completeMoov = tailBuffer.slice(tOffset, tOffset + size);
        } else {
          completeMoov = await fetchByteRange(url, actualFileOffset, actualFileOffset + size - 1, signal);
        }

        // Combine ftyp from initial chunk with tail moov
        const ftypSize = view.getUint32(0);
        const ftypBuffer = initialBuffer.slice(0, Math.min(ftypSize, 128));
        const combined = new Uint8Array(ftypBuffer.byteLength + completeMoov.byteLength);
        combined.set(new Uint8Array(ftypBuffer), 0);
        combined.set(new Uint8Array(completeMoov), ftypBuffer.byteLength);

        return {
          headerBuffer: combined.buffer,
          moovOffset: actualFileOffset,
          moovSize: size,
          isFastStart: false,
        };
      }
      tOffset += Math.max(8, size);
    }
  }

  throw new Error('Could not locate moov container box in video stream.');
}
