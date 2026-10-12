import { useLang } from '../i18n/LangContext';

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <a className="brand" href="#inicio">
          <div className="brand-mark" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2.5c-3 2.2-4.6 5-4.6 8.1 0 3.4 2 6.4 4.6 8.9 2.6-2.5 4.6-5.5 4.6-8.9 0-3.1-1.6-5.9-4.6-8.1z" stroke="#E9D9AE" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M12 21.5V8.8M12 12.4c-1.6-.4-2.7-1.4-3.4-2.8M12 15.2c1.6-.4 2.7-1.4 3.4-2.8" stroke="#E9D9AE" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="brand-name">METIS <em>CAMPUS</em></div>
        </a>
        <nav className="footer-links">
          <a href="#">{t('footer_privacy')}</a>
          <a href="#">{t('footer_terms')}</a>
          <a href="#">{t('footer_contact')}</a>
        </nav>
        <span className="footer-copy">{t('footer_copy')}</span>
      </div>
    </footer>
  );
}
