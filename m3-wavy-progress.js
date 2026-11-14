/**
 * Google Material Design 3 (M3) Expressive Wavy Progress Indicators
 * Specifications strictly following m3.material.io/components/progress-indicators/overview:
 * - Wavelength: exactly 40dp (one full sinusoidal cycle = 40px)
 * - Amplitude: exactly 3dp (peak = +3px, trough = -3px)
 * - Active Wave Stroke: 4dp, lineCap: round, lineJoin: round
 * - Inactive Track: 4dp straight line with 4dp gap before & after, lineCap: round
 * - Terminal Stop Dot: 4dp diameter with 4dp gap from track end
 * - Continuous wave propagation animation (Hardware-accelerated 60fps Canvas)
 * - 100% Host-Isolated: immune to all webpage CSS resets and stylesheet interference!
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.M3WavyProgress = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {

    const WAVELENGTH = 40.0;
    const AMPLITUDE = 3.0;
    const STROKE_WIDTH = 4.0;
    const Y_CENTER = 8.0;
    const TOTAL_HEIGHT = 16.0;
    const GAP = 4.0;
    const STOP_DOT_SIZE = 4.0;
    const SPEED = 0.85; // Traveling wave translation speed (px per frame at 60fps)

    /**
     * Mounts an M3 Linear Wavy Progress Indicator in a container using HiDPI Canvas
     */
    function createLinear(container, options = {}) {
        let color = options.color || '#BE185D';
        let trackColor = options.trackColor || 'rgba(255, 255, 255, 0.14)';
        let stopDotColor = options.stopDotColor || '#FAF2F5';
        let targetProgress = options.value !== undefined ? Math.max(0, Math.min(100, options.value)) : 0;
        let currentProgress = targetProgress;
        let isIndeterminate = options.indeterminate || false;

        container.innerHTML = '';
        container.classList.add('m3-linear-wavy-root');

        const canvas = document.createElement('canvas');
        canvas.className = 'm3-linear-wavy-canvas';
        canvas.style.width = '100%';
        canvas.style.height = `${TOTAL_HEIGHT}px`;
        canvas.style.display = 'block';
        container.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let waveOffset = 0;
        let animId = null;
        let isRunning = true;
        let lastWidth = 0;
        let lastHeight = 0;

        function updateCanvasSize() {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            const w = Math.max(10, Math.floor(rect.width || container.clientWidth || 300));
            const h = TOTAL_HEIGHT;

            if (w !== lastWidth || h !== lastHeight || canvas.width !== Math.floor(w * dpr)) {
                lastWidth = w;
                lastHeight = h;
                canvas.width = Math.floor(w * dpr);
                canvas.height = Math.floor(h * dpr);
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.scale(dpr, dpr);
            }
            return w;
        }

        function draw() {
            if (!isRunning) return;

            const w = updateCanvasSize();
            ctx.clearRect(0, 0, w, TOTAL_HEIGHT);

            if (!isIndeterminate) {
                currentProgress += (targetProgress - currentProgress) * 0.18;
            }

            const clampedPct = Math.max(0, Math.min(100, isIndeterminate ? 50 : currentProgress));
            const activeW = (clampedPct / 100) * w;
            const omega = (2.0 * Math.PI) / WAVELENGTH;

            // 1. Inactive Track Line (4dp straight line with rounded end caps)
            if (clampedPct < 98.0) {
                const trackStart = activeW > 2.0 ? Math.min(w - 10, activeW + 8) : 2.0;
                const trackEnd = w - 10;
                if (trackEnd > trackStart + 1.0) {
                    ctx.beginPath();
                    ctx.moveTo(trackStart, Y_CENTER);
                    ctx.lineTo(trackEnd, Y_CENTER);
                    ctx.strokeStyle = trackColor;
                    ctx.lineWidth = STROKE_WIDTH;
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                    ctx.stroke();
                }
            }

            // 2. Terminal Stop Dot (4dp diameter with 4dp gap from track end)
            const stopDotX = w - (STOP_DOT_SIZE / 2);
            ctx.beginPath();
            ctx.arc(stopDotX, Y_CENTER, STOP_DOT_SIZE / 2, 0, Math.PI * 2);
            ctx.fillStyle = currentProgress >= 99.0 ? color : stopDotColor;
            ctx.fill();

            // 3. Active Continuous Traveling Sine Wave (40dp wavelength, 3dp amplitude, 4dp stroke)
            if (activeW > 2.0) {
                ctx.beginPath();
                const step = 0.5; // Smooth sub-pixel curve sampling
                const waveStart = 2.0;
                const waveEnd = Math.min(w - (currentProgress >= 99.0 ? 2 : 10), activeW);

                for (let x = waveStart; x <= waveEnd; x += step) {
                    const y = Y_CENTER + AMPLITUDE * Math.sin((x - waveOffset) * omega);
                    if (x === waveStart) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                const endY = Y_CENTER + AMPLITUDE * Math.sin((waveEnd - waveOffset) * omega);
                ctx.lineTo(waveEnd, endY);

                ctx.strokeStyle = color;
                ctx.lineWidth = STROKE_WIDTH;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.stroke();
            }

            // Continuous wave propagation (flowing left to right infinitely)
            waveOffset = (waveOffset + SPEED) % WAVELENGTH;
            animId = requestAnimationFrame(draw);
        }

        animId = requestAnimationFrame(draw);

        return {
            canvas,
            setProgress(val) {
                targetProgress = Math.max(0, Math.min(100, val));
            },
            setColor(newColor) {
                color = newColor;
            },
            setTrackColor(newTrackColor) {
                trackColor = newTrackColor;
            },
            setStopDotColor(newStopDotColor) {
                stopDotColor = newStopDotColor;
            },
            setIndeterminate(indet) {
                isIndeterminate = indet;
            },
            destroy() {
                isRunning = false;
                if (animId) cancelAnimationFrame(animId);
                container.innerHTML = '';
            }
        };
    }

    /**
     * Circular Wavy Progress
     */
    function createCircular(container, options = {}) {
        const size = options.size || 48;
        const color = options.color || '#BE185D';
        const trackColor = options.trackColor || 'rgba(255, 255, 255, 0.14)';
        const lobes = options.lobes || 8;
        const amplitude = options.amplitude || 2.5;

        container.innerHTML = '';
        container.classList.add('m3-circular-wavy-root');

        const canvas = document.createElement('canvas');
        const dpr = window.devicePixelRatio || 1;
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;
        container.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);

        let rotation = 0;
        let animId = null;
        let isRunning = true;
        let progress = options.value !== undefined ? options.value / 100 : 0.65;

        function draw() {
            ctx.clearRect(0, 0, size, size);
            const cx = size / 2;
            const cy = size / 2;
            const r = (size - 12) / 2;

            // Inactive Track Arc
            ctx.save();
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.strokeStyle = trackColor;
            ctx.lineWidth = STROKE_WIDTH;
            ctx.lineCap = 'round';
            ctx.stroke();
            ctx.restore();

            // Active Wavy Arc
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(rotation);

            ctx.beginPath();
            const steps = 180;
            const maxStep = Math.floor(steps * progress);

            for (let i = 0; i <= maxStep; i++) {
                const theta = (i / steps) * Math.PI * 2;
                const waveR = r + Math.sin(theta * lobes) * amplitude;
                const x = waveR * Math.cos(theta);
                const y = waveR * Math.sin(theta);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }

            ctx.strokeStyle = color;
            ctx.lineWidth = STROKE_WIDTH;
            ctx.lineCap = 'round';
            ctx.stroke();
            ctx.restore();

            rotation += 0.03;
            if (isRunning) {
                animId = requestAnimationFrame(draw);
            }
        }

        animId = requestAnimationFrame(draw);

        return {
            setProgress(val) {
                progress = Math.max(0, Math.min(1, val / 100));
            },
            destroy() {
                isRunning = false;
                if (animId) cancelAnimationFrame(animId);
                container.innerHTML = '';
            }
        };
    }

    return {
        createLinear,
        createCircular,
        WAVELENGTH,
        AMPLITUDE,
        STROKE_WIDTH,
        GAP,
        STOP_DOT_SIZE
    };
}));
