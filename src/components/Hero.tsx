import { useLang } from '../i18n/LangContext';

export default function Hero() {
  const { t } = useLang();

  return (
    <section className="hero" id="inicio">
      <div className="hero-dots"></div>

      {/* floating doodles */}
      <svg className="sparkle float-a" style={{ top: '12%', left: '6%' }} width="34" height="34" viewBox="0 0 24 24"><path d="M12 2l1.8 7.2L21 12l-7.2 1.8L12 21l-1.8-7.2L3 12l7.2-1.8z" fill="#C2933C" opacity=".7" /></svg>
      <svg className="sparkle twinkle" style={{ top: '22%', left: '46%' }} width="22" height="22" viewBox="0 0 24 24"><path d="M12 2l1.8 7.2L21 12l-7.2 1.8L12 21l-1.8-7.2L3 12l7.2-1.8z" fill="#E0A45C" /></svg>
      <svg className="sparkle float-b" style={{ bottom: '16%', left: '10%' }} width="26" height="26" viewBox="0 0 24 24"><path d="M12 2l1.8 7.2L21 12l-7.2 1.8L12 21l-1.8-7.2L3 12l7.2-1.8z" fill="#C2933C" opacity=".55" /></svg>
      <svg className="sparkle twinkle" style={{ top: '70%', right: '44%' }} width="18" height="18" viewBox="0 0 24 24"><path d="M12 2l1.8 7.2L21 12l-7.2 1.8L12 21l-1.8-7.2L3 12l7.2-1.8z" fill="#E8B4A0" /></svg>

      <div className="hero-inner">
        <div>
          <div className="eyebrow reveal"><span className="dot"></span> <span>{t('hero_eyebrow')}</span></div>
          <h1 className="reveal" dangerouslySetInnerHTML={{ __html: t('hero_h1') }} />
          <svg className="squiggle reveal" viewBox="0 0 320 18" fill="none">
            <path d="M3 12c40-9 76-9 116-2 40 7 76 7 116-2 24-5 48-6 82-1" stroke="#C2933C" strokeWidth="5" strokeLinecap="round" />
          </svg>
          <p className="hero-sub">{t('hero_sub')}</p>
          <p className="hero-desc">{t('hero_desc')}</p>
          <div className="hero-cta">
            <a href="#" className="btn btn-dark">{t('cta_start')} <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
            <a href="#como-funciona" className="btn btn-ghost">{t('cta_demo')}</a>
          </div>
          <div className="hero-trust">
            <span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#A87B2C" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {t('trust_canvas')}
            </span>
            <span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#A87B2C" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {t('trust_export')}
            </span>
            <span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#A87B2C" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {t('trust_free')}
            </span>
          </div>
        </div>

        {/* avatar hero art */}
        <div className="hero-art reveal">
        <div className="art-halo"></div>
        <div className="art-ring"></div>
        <div className="avatar-wrap float-a">
          <img src="/avatar.png" alt={t('alt_avatar')} />
        </div>
        <div className="art-badge b1 float-b"><b>10 s</b><span dangerouslySetInnerHTML={{ __html: t('badge_generate') }} /></div>
        <div className="art-badge b2 float-a"><b>+100</b><span dangerouslySetInnerHTML={{ __html: t('badge_templates') }} /></div>
        <svg className="sparkle twinkle" style={{ top: '14%', right: '12%' }} width="24" height="24" viewBox="0 0 24 24"><path d="M12 2l1.8 7.2L21 12l-7.2 1.8L12 21l-1.8-7.2L3 12l7.2-1.8z" fill="#C2933C" /></svg>
        <svg className="sparkle float-b" style={{ bottom: '8%', left: '14%' }} width="20" height="20" viewBox="0 0 24 24"><path d="M12 2l1.8 7.2L21 12l-7.2 1.8L12 21l-1.8-7.2L3 12l7.2-1.8z" fill="#E0A45C" /></svg>
        </div>
      </div>
    </section>
  );
}
