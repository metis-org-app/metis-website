import { useLang } from '../i18n/LangContext';

export default function Showcase() {
  const { t } = useLang();

  return (
    <section className="section showcase">
      <div className="section-inner showcase-grid">
        <div className="exam-card reveal">
          <div className="exam-head">
            <div>
              <h4>{t('exam_title')}</h4>
              <p>{t('exam_subtitle')}</p>
            </div>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
              <path d="M12 2.5c-3 2.2-4.6 5-4.6 8.1 0 3.4 2 6.4 4.6 8.9 2.6-2.5 4.6-5.5 4.6-8.9 0-3.1-1.6-5.9-4.6-8.1z" stroke="#C2933C" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M12 21.5V9" stroke="#C2933C" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </div>
          <div className="exam-progress"><i></i></div>
          <p className="exam-q" dangerouslySetInnerHTML={{ __html: t('exam_q') }} />
          <div className="exam-opt"><div className="radio"></div><span>{t('exam_opt1')}</span></div>
          <div className="exam-opt sel"><div className="radio"></div><span>{t('exam_opt2')}</span></div>
          <div className="exam-opt"><div className="radio"></div><span>{t('exam_opt3')}</span></div>
          <div className="exam-foot">
            <span>{t('exam_foot_q')}</span>{' '}
            <strong>{t('exam_foot_pts')}</strong>
          </div>
        </div>

        <div>
          <div className="section-head reveal" style={{ textAlign: 'left', margin: '0 0 36px' }}>
            <div className="kicker" style={{ justifyContent: 'flex-start' }}>{t('specs_kicker')}</div>
            <h2 dangerouslySetInnerHTML={{ __html: t('specs_h2') }} />
          </div>
          <div className="spec-list">
            <div className="spec-item reveal">
              <div className="spec-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3l1.6 5.2L19 10l-5.4 1.8L12 17l-1.6-5.2L5 10l5.4-1.8z" stroke="#221B10" strokeWidth="1.7" strokeLinejoin="round" /></svg>
              </div>
              <div>
                <h4>{t('spec1_title')}</h4>
                <p>{t('spec1_desc')}</p>
              </div>
            </div>
            <div className="spec-item reveal">
              <div className="spec-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6.5" stroke="#221B10" strokeWidth="1.7" /><path d="M16 16l4.5 4.5" stroke="#221B10" strokeWidth="1.7" strokeLinecap="round" /></svg>
              </div>
              <div>
                <h4>{t('spec2_title')}</h4>
                <p>{t('spec2_desc')}</p>
              </div>
            </div>
            <div className="spec-item reveal">
              <div className="spec-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 15V4M8 8l4-4 4 4" stroke="#221B10" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 13v5a2 2 0 002 2h10a2 2 0 002-2v-5" stroke="#221B10" strokeWidth="1.7" strokeLinecap="round" /></svg>
              </div>
              <div>
                <h4>{t('spec3_title')}</h4>
                <p>{t('spec3_desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
