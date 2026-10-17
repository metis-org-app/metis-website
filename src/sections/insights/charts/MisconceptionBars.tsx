import { ITEM05_INCORRECT, MISCONCEPTIONS } from '../../../content/demo-data';
import { useHydrated } from '../../../hooks/useHydrated';
import { useI18n } from '../../../i18n/useI18n';
import { MetisThumb } from '../../../components/avatar/MetisThumb';
import { ChartData } from './ChartData';

const NAMED = MISCONCEPTIONS.filter((item) => item.id !== 'unclear');
const NAMED_TOTAL = NAMED.reduce((sum, item) => sum + item.students, 0);
const LARGEST = Math.max(...MISCONCEPTIONS.map((item) => item.students));

/**
 * Evidence: the beliefs behind the wrong answers on one item (horizontal bars, largest first, labelled
 * directly), the quotes they come from, and the recommendation Metis writes for the next class.
 * Bar lengths are SVG attributes, so they are right in the prerendered HTML without inline styles.
 */
export function MisconceptionBars({ active }: { active: boolean }) {
  const { m } = useI18n();
  const copy = m.insights.analyses.evidence;
  const hydrated = useHydrated();

  return (
    <figure className="m-0 flex flex-col gap-4">
      <figcaption className="label-mono text-xs text-soft">{copy.caption}</figcaption>
      <ol
        aria-label={copy.summary(NAMED_TOTAL, ITEM05_INCORRECT)}
        className="m-0 flex list-none flex-col p-0"
      >
        {MISCONCEPTIONS.map((item, i) => {
          const named = item.id !== 'unclear';
          return (
            <li key={item.id} className="flex flex-col gap-1.5 border-b border-line py-2.5">
              <span className="flex items-baseline justify-between gap-3">
                <span className={`text-sm ${named ? 'font-semibold' : 'text-soft'}`}>
                  {copy.names[item.id]}
                </span>
                <span className="font-mono text-xs whitespace-nowrap">{copy.students(item.students)}</span>
              </span>
              <svg aria-hidden="true" className="block h-2 w-full" preserveAspectRatio="none">
                <rect width="100%" height="100%" className="fill-line2" />
                <rect
                  width={`${(item.students / LARGEST) * 100}%`}
                  height="100%"
                  className={`origin-left [transform-box:fill-box] ${named ? 'fill-ink' : 'fill-soft'} ${active ? 'motion-safe:animate-bar-x' : ''}`}
                  style={hydrated ? { animationDelay: `${i * 80}ms` } : undefined}
                />
              </svg>
            </li>
          );
        })}
      </ol>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <h5 className="label-mono m-0 text-xs font-normal text-soft">{copy.quotesTitle}</h5>
          {copy.quotes.map((quote) => (
            <blockquote key={quote.who} className="m-0 flex flex-col gap-1 border-l-[3px] border-ink pl-3">
              <q className="text-sm">{quote.text}</q>
              <cite className="label-mono text-xs text-soft not-italic">{quote.who}</cite>
            </blockquote>
          ))}
        </div>
        <div className="flex flex-col gap-2 border border-l-[3px] border-ink border-l-accent bg-bg p-3">
          <span className="label-mono inline-flex items-center gap-2 text-xs text-accent">
            <MetisThumb size={24} corner />
            {copy.teachTitle}
          </span>
          <p className="m-0 text-sm text-pretty">{copy.teach}</p>
        </div>
      </div>
      <ChartData
        caption={copy.caption}
        columns={[copy.columns.belief, copy.columns.students]}
        rows={MISCONCEPTIONS.map((item) => [copy.names[item.id], item.students])}
      />
    </figure>
  );
}
