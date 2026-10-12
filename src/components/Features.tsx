import type { ReactNode } from 'react';
import { useLang } from '../i18n/LangContext';
import type { TranslationKey } from '../i18n/translations';

const FEATURES: { tag: string; icon: ReactNode; title: TranslationKey; desc: TranslationKey }[] = [
  {
    tag: 'IA',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 3l1.6 5.2L19 10l-5.4 1.8L12 17l-1.6-5.2L5 10l5.4-1.8z" stroke="#221B10" strokeWidth="1.8" strokeLinejoin="round" /><path d="M18.5 16l.7 2.2 2.3.8-2.3.8-.7 2.2-.7-2.2-2.3-.8 2.3-.8z" fill="#221B10" /></svg>,
    title: 'feat1_title',
    desc: 'feat1_desc',
  },
  {
    tag: 'PLANTILLAS',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="12" height="15" rx="2" stroke="#221B10" strokeWidth="1.8" /><path d="M8 21h10a2 2 0 002-2V8" stroke="#221B10" strokeWidth="1.8" strokeLinecap="round" /><path d="M7 7h6M7 10.5h6M7 14h4" stroke="#221B10" strokeWidth="1.6" strokeLinecap="round" /></svg>,
    title: 'feat2_title',
    desc: 'feat2_desc',
  },
  {
    tag: 'EDITOR',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M14.5 5.5l4 4L9 19H5v-4z" stroke="#221B10" strokeWidth="1.8" strokeLinejoin="round" /><path d="M13 7l4 4" stroke="#221B10" strokeWidth="1.8" /><path d="M4 21h16" stroke="#221B10" strokeWidth="1.8" strokeLinecap="round" /></svg>,
    title: 'feat3_title',
    desc: 'feat3_desc',
  },
  {
    tag: 'FUENTES',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6.5" stroke="#221B10" strokeWidth="1.8" /><path d="M16 16l4.5 4.5" stroke="#221B10" strokeWidth="1.8" strokeLinecap="round" /><path d="M8.5 11l1.8 1.8 3.2-3.4" stroke="#221B10" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    title: 'feat4_title',
    desc: 'feat4_desc',
  },
  {
    tag: 'EXPORT',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 15V4M8 8l4-4 4 4" stroke="#221B10" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 13v5a2 2 0 002 2h10a2 2 0 002-2v-5" stroke="#221B10" strokeWidth="1.8" strokeLinecap="round" /></svg>,
    title: 'feat5_title',
    desc: 'feat5_desc',
  },
  {
    tag: 'DATOS',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M5 19V10M12 19V5M19 19v-6" stroke="#221B10" strokeWidth="2" strokeLinecap="round" /><path d="M3 21h18" stroke="#221B10" strokeWidth="1.8" strokeLinecap="round" /></svg>,
    title: 'feat6_title',
    desc: 'feat6_desc',
  },
];

export default function Features() {
  const { t } = useLang();

  return (
    <section className="section features" id="plantillas">
      <div className="section-inner">
        <div className="section-head reveal">
          <div className="kicker">{t('features_kicker')}</div>
          <h2 dangerouslySetInnerHTML={{ __html: t('features_h2') }} />
          <p>{t('features_desc')}</p>
        </div>

        <div className="feature-grid">
          {FEATURES.map((f) => (
            <div className="feature-card reveal" key={f.tag}>
              <span className="feature-tag">{f.tag}</span>
              <div className="feature-icon">{f.icon}</div>
              <h3>{t(f.title)}</h3>
              <p>{t(f.desc)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
