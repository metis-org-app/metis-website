import thumb from '../../assets/metis-thumb.png';

/**
 * Small decorative Metis thumbnail (24–46 px): a 96 px grayscale raster, cheaper than the animated SVG.
 * Always decorative — the surrounding text names Metis.
 */
export function MetisThumb({
  size,
  corner = false,
  className = '',
}: {
  size: number;
  corner?: boolean;
  className?: string;
}) {
  // Sized by the image's own width/height attributes (the border adds 1 px per side), never by a
  // style attribute: the prerendered HTML must not need inline styles under the CSP.
  const inner = size - 2;
  return (
    <span
      aria-hidden="true"
      className={`relative inline-block shrink-0 overflow-hidden border border-ink bg-surface ${className}`}
    >
      <img
        src={thumb}
        alt=""
        width={inner}
        height={inner}
        decoding="async"
        className="block object-cover mix-blend-multiply"
      />
      {corner && (
        <span className={`absolute right-0 bottom-0 bg-accent ${size < 28 ? 'size-1.5' : 'size-2'}`} />
      )}
    </span>
  );
}
