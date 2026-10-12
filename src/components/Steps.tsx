import { useLang } from '../i18n/LangContext';
import type { TranslationKey } from '../i18n/translations';

const STEPS: { num: string; title: TranslationKey; desc: TranslationKey; items: TranslationKey[] }[] = [
  { num: '1', title: 'step1_title', desc: 'step1_desc', items: ['step1_li1', 'step1_li2'] },
  { num: '2', title: 'step2_title', desc: 'step2_desc', items: ['step2_li1', 'step2_li2'] },
  { num: '3', title: 'step3_title', desc: 'step3_desc', items: ['step3_li1', 'step3_li2'] },
];

export default function Steps() {
  const { t } = useLang();

  return (
    <section className="section steps">
      <div className="section-inner">
        <div className="section-head reveal">
          <div className="kicker">{t('steps_kicker')}</div>
          <h2 dangerouslySetInnerHTML={{ __html: t('steps_h2') }} />
          <p>{t('steps_desc')}</p>
        </div>

        <div className="step-grid">
          {STEPS.map((s) => (
            <div className="step reveal" key={s.num}>
              <div className="step-num">{s.num}</div>
              <h3>{t(s.title)}</h3>
              <p>{t(s.desc)}</p>
              <ul>
                {s.items.map((item) => <li key={item}>{t(item)}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
