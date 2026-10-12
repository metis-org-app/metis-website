import { useLang } from '../i18n/LangContext';

const TEACHER_IMG =
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=hand-drawn%20black%20ink%20line%20art%20illustration%20of%20a%20smiling%20young%20university%20teacher%20working%20at%20a%20desk%20with%20an%20open%20laptop%2C%20floating%20exam%20papers%20and%20open%20books%20around%20her%2C%20laurel%20leaves%20and%20sparkle%20doodles%2C%20warm%20cream%20paper%20background%2C%20antique%20gold%20and%20warm%20ochre%20accents%20only%2C%20cute%20elegant%20academic%20storybook%20doodle%20style%2C%20clean%20thick%20outlines%2C%20flat%2C%20no%20text&image_size=landscape_4_3';

export default function ProductPreview() {
  const { t } = useLang();

  return (
    <section className="section product" id="como-funciona">
      <div className="section-inner">
        <div className="section-head reveal">
          <div className="kicker">{t('product_kicker')}</div>
          <h2 dangerouslySetInnerHTML={{ __html: t('product_h2') }} />
          <p>{t('product_desc')}</p>
        </div>

        <div className="browser reveal">
          <div className="browser-bar">
            <i></i><i></i><i></i>
            <span className="browser-url">app.metiscampus.com</span>
          </div>
          <div className="browser-body">
            <div>
              <div className="eyebrow" style={{ marginBottom: '18px' }}><span className="dot"></span> <span>{t('product_badge')}</span></div>
              <h2 dangerouslySetInnerHTML={{ __html: t('product_body_h2') }} />
              <p className="desc">{t('product_body_desc')}</p>
              <div className="browser-btns">
                <a href="#" className="btn btn-dark">{t('cta_start')}</a>
                <a href="#" className="btn btn-ghost">{t('cta_demo')}</a>
              </div>
            </div>
            <div className="art-scene">
              <img src={TEACHER_IMG} alt={t('alt_teacher')} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
