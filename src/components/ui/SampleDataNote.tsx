import { useI18n } from '../../i18n/useI18n';

/** Marks figures that come from the sample quiz, so they are not read as real usage numbers. */
export function SampleDataNote() {
  const { m } = useI18n();
  return (
    <p className="label-mono m-0 w-fit border border-dashed border-soft px-2 py-1 text-xs text-soft">
      {m.sampleData}
    </p>
  );
}
