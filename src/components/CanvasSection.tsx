import { useLang } from '../i18n/LangContext';

export default function CanvasSection() {
  const { t } = useLang();

  return (
    <section className="section canvas-sec" id="plataforma">
      <div className="section-inner canvas-grid">
        <div className="canvas-copy reveal">
          <div className="kicker" style={{ justifyContent: 'flex-start' }}>{t('canvas_kicker')}</div>
          <h2 dangerouslySetInnerHTML={{ __html: t('canvas_h2') }} />
          <p>{t('canvas_p1')}</p>
          <p>{t('canvas_p2')}</p>
          <div className="pill-row">
            <span className="pill">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 3v12M7 10l5 5 5-5M4 19h16" stroke="#A87B2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {t('canvas_pill1')}
            </span>
            <span className="pill">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#A87B2C" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {t('canvas_pill2')}
            </span>
            <span className="pill">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2l1.8 7.2L21 12l-7.2 1.8L12 21l-1.8-7.2L3 12l7.2-1.8z" fill="#C2933C" /></svg>
              {t('canvas_pill3')}
            </span>
          </div>
        </div>

        <div className="lms-card reveal">
          <div className="lms-top">
            <b>{t('lms_panel')}</b>
            <div className="lms-user">M</div>
          </div>
          <div className="lms-body">
            <nav className="lms-side">
              <a className="active" href="#">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M4 5h16v14H4zM4 9h16M9 9v10" stroke="#E9D9AE" strokeWidth="1.8" /></svg>
                {t('lms_courses')}
              </a>
              <a href="#">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M5 6h14M5 12h14M5 18h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                {t('lms_modules')}
              </a>
              <a href="#">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="5" y="4" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M9 10l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {t('lms_assignments')}
              </a>
              <a href="#">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M5 19V9M12 19V5M19 19v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                {t('lms_grades')}
              </a>
              <a href="#">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M4 10h16M9 3v4M15 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                {t('lms_calendar')}
              </a>
              <a href="#">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="9" r="3.2" stroke="currentColor" strokeWidth="1.8" /><path d="M3.5 19c.7-2.8 2.9-4.3 5.5-4.3s4.8 1.5 5.5 4.3M15 7.5h5M15 11h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                {t('lms_people')}
              </a>
            </nav>
            <div className="lms-main">
              <h4>{t('lms_course_title')}</h4>
              <div className="course-row">
                <div className="course-chip">
                  <small>{t('module1_label')}</small>
                  <div className="bar" style={{ width: '82%' }}></div>
                  <p>{t('module1_title')}</p>
                </div>
                <div className="course-chip">
                  <small>{t('module2_label')}</small>
                  <div className="bar" style={{ width: '64%' }}></div>
                  <p>{t('module2_title')}</p>
                </div>
                <div className="course-chip">
                  <small>{t('module3_label')}</small>
                  <div className="bar" style={{ width: '30%' }}></div>
                  <p>{t('module3_title')}</p>
                </div>
              </div>
              <div className="assign-list">
                <div className="assign-item">
                  <div className="tick done">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#E9D9AE" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <span>{t('assign1')}</span>
                  <time>{t('assign1_status')}</time>
                </div>
                <div className="assign-item">
                  <div className="tick"></div>
                  <span>{t('assign2')}</span>
                  <time>12 OCT</time>
                </div>
                <div className="assign-item">
                  <div className="tick"></div>
                  <span>{t('assign3')}</span>
                  <time>20 OCT</time>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
