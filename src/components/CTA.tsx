import { useLang } from '../i18n/LangContext';

const OWL_IMG =
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=hand-drawn%20black%20ink%20line%20art%20illustration%20of%20a%20cute%20wise%20owl%20perched%20on%20a%20stack%20of%20open%20books%20with%20a%20small%20gold%20laurel%20wreath%2C%20twinkling%20four-point%20sparkle%20doodles%20floating%20around%2C%20warm%20cream%20paper%20background%2C%20antique%20gold%20and%20warm%20ochre%20color%20accents%20only%2C%20elegant%20whimsical%20academic%20storybook%20doodle%20style%2C%20clean%20thick%20outlines%2C%20flat%2C%20no%20text&image_size=square_hd';

export default function CTA() {
  const { t } = useLang();

  return (
    <section className="section cta">
      <div className="cta-dots"></div>
      <div className="cta-inner">
        <div className="reveal">
          <h2 dangerouslySetInnerHTML={{ __html: t('cta_h2') }} />
          <p>{t('cta_desc')}</p>
          <div className="cta-btns">
            <a href="#" className="btn btn-gold">{t('cta_start')} <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
            <a href="#" className="btn btn-ghost">{t('cta_team')}</a>
          </div>
          <div className="cta-note">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#E9D9AE" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span>{t('cta_note')}</span>
          </div>
        </div>
        <div className="cta-art reveal">
          <img src={OWL_IMG} alt={t('alt_owl')} />
        </div>
      </div>
    </section>
  );
}
