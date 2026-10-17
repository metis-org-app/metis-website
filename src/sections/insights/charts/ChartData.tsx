import { useI18n } from '../../../i18n/useI18n';

/**
 * The numbers behind a chart, in a table people can open. It is the accessible fallback the charts rely
 * on: the visual encodings are never the only way to read the data.
 */
export function ChartData({
  caption,
  columns,
  rows,
}: {
  caption: string;
  columns: readonly string[];
  rows: ReadonlyArray<readonly (string | number)[]>;
}) {
  const { m } = useI18n();
  return (
    <details className="border-t border-line">
      <summary className="label-mono flex min-h-11 cursor-pointer items-center gap-2 text-xs text-soft hover:text-ink">
        {m.insights.analyses.showData}
      </summary>
      <div className="overflow-x-auto pb-2">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="label-mono text-left text-xs text-soft">
              {columns.map((column, i) => (
                <th
                  key={column}
                  scope="col"
                  className={`border-b border-line py-1.5 font-medium ${i ? 'pl-3 text-right' : ''}`}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([head, ...cells]) => (
              <tr key={String(head)}>
                <th scope="row" className="border-b border-line2 py-1.5 text-left font-normal">
                  {head}
                </th>
                {cells.map((cell, i) => (
                  <td key={columns[i + 1]} className="border-b border-line2 py-1.5 pl-3 text-right font-mono">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
