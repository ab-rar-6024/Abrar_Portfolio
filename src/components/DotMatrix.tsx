import React, { useEffect, useRef, useState } from 'react';

const N = 23;              // dots per side
const CELL = 10;           // canvas pixels sampled per dot
const SIZE = N * CELL;

type Bitmap = boolean[];

// draw onto an offscreen canvas, then light every dot whose cell is mostly covered
function rasterize(draw: (ctx: CanvasRenderingContext2D) => void): Bitmap {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) return Array(N * N).fill(false);
  draw(ctx);
  const { data } = ctx.getImageData(0, 0, SIZE, SIZE);
  const out: Bitmap = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      let ink = 0;
      for (let y = 0; y < CELL; y++) {
        for (let x = 0; x < CELL; x++) {
          if (data[((r * CELL + y) * SIZE + c * CELL + x) * 4 + 3] > 128) ink++;
        }
      }
      out.push(ink / (CELL * CELL) > 0.3);
    }
  }
  return out;
}

// an icon already rendered on the page (lucide <svg>) turned into dots
async function fromSvg(svg: SVGSVGElement): Promise<Bitmap> {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('width', String(SIZE));
  clone.setAttribute('height', String(SIZE));
  clone.setAttribute('stroke', '#000');
  const img = new Image();
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(clone))}`;
  await img.decode();
  const pad = CELL * 2;
  return rasterize(ctx => ctx.drawImage(img, pad, pad, SIZE - pad * 2, SIZE - pad * 2));
}

function fromText(text: string): Bitmap {
  return rasterize(ctx => {
    ctx.font = `700 ${SIZE * 0.62}px "Space Grotesk", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, SIZE / 2, SIZE * 0.47);
  });
}

interface Props {
  /** the shapes it can show, keyed by name: lucide icons rendered as React nodes */
  icons: Record<string, React.ReactNode>;
  /** which icon to show; null shows the idle text */
  active: string | null;
  idleText?: string;
}

// A square of dots that redraws itself, dot by dot, into whichever icon is active.
const DotMatrix: React.FC<Props> = ({ icons, active, idleText = 'hi' }) => {
  const hiddenRef = useRef<HTMLDivElement>(null);
  const [maps, setMaps] = useState<Record<string, Bitmap>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await document.fonts?.ready;
      const next: Record<string, Bitmap> = { __idle: fromText(idleText) };
      const holders = hiddenRef.current?.querySelectorAll<HTMLElement>('[data-icon]') ?? [];
      for (const h of holders) {
        const svg = h.querySelector('svg');
        if (svg) next[h.dataset.icon!] = await fromSvg(svg);
      }
      if (!cancelled) setMaps(next);
    })();
    return () => { cancelled = true; };
  }, [idleText]);

  const shown = maps[active ?? '__idle'] ?? maps.__idle;

  return (
    <div className="dm" aria-hidden>
      <div className="dm-grid" style={{ gridTemplateColumns: `repeat(${N}, 1fr)` }}>
        {Array.from({ length: N * N }, (_, i) => {
          const r = Math.floor(i / N), c = i % N;
          return <i key={i} className={shown?.[i] ? 'on' : ''} style={{ transitionDelay: `${(r + c) * 2}ms` }} />;
        })}
      </div>
      <div className="dm-src" ref={hiddenRef}>
        {Object.entries(icons).map(([k, node]) => <span key={k} data-icon={k}>{node}</span>)}
      </div>

      <style>{`
        .dm{width:100%;max-width:440px;aspect-ratio:1}
        .dm-grid{display:grid;width:100%;height:100%;gap:0}
        .dm-grid i{display:block;width:72%;aspect-ratio:1;margin:auto;border-radius:50%;background:#ededed;
          transform:scale(.16);opacity:.22;transition:transform .2s cubic-bezier(.34,1.4,.64,1),opacity .15s}
        .dm-grid i.on{transform:scale(1);opacity:1}
        .dm-src{position:absolute;width:0;height:0;overflow:hidden;visibility:hidden}
        @media (prefers-reduced-motion:reduce){ .dm-grid i{transition:none} }
      `}</style>
    </div>
  );
};

export default DotMatrix;
