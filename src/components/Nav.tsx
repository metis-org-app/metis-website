import { useState } from 'react';
import { useLang } from '../i18n/LangContext';

export default function Nav() {
  const { t, lang, toggle } = useLang();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="nav">
      <div className="nav-inner">
        <a className="brand" href="#inicio">
          <div className="brand-mark" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2.5c-3 2.2-4.6 5-4.6 8.1 0 3.4 2 6.4 4.6 8.9 2.6-2.5 4.6-5.5 4.6-8.9 0-3.1-1.6-5.9-4.6-8.1z" stroke="#E9D9AE" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M12 21.5V8.8M12 12.4c-1.6-.4-2.7-1.4-3.4-2.8M12 15.2c1.6-.4 2.7-1.4 3.4-2.8" stroke="#E9D9AE" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="brand-name">METIS <em>CAMPUS</em></div>
        </a>
        <nav className={open ? 'nav-links open' : 'nav-links'} id="navLinks">
          <a href="#inicio" onClick={close}>{t('nav_home')}</a>
          <a href="#como-funciona" onClick={close}>{t('nav_how')}</a>
          <a href="#plataforma" onClick={close}>{t('nav_platform')}</a>
          <a href="#plantillas" onClick={close}>{t('nav_templates')}</a>
          <a href="#" className="btn btn-nav" style={{ letterSpacing: '.12em' }} onClick={close}>{t('nav_register')}</a>
        </nav>
        <button
          className="lang-toggle"
          id="langToggle"
          aria-label={lang === 'es' ? 'Switch to English' : 'Cambiar a español'}
          onClick={toggle}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" /><path d="M2 12h20M12 2a15 15 0 014 10 15 15 0 01-4 10 15 15 0 01-4-10A15 15 0 0112 2z" stroke="currentColor" strokeWidth="1.8" /></svg>
          <span id="langLabel">{lang === 'es' ? 'EN' : 'ES'}</span>
        </button>
        <button
          className="nav-toggle"
          id="navToggle"
          aria-label={lang === 'es' ? 'Menú' : 'Menu'}
          onClick={() => setOpen(!open)}
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>
  );
}
