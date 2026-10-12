import { useLang } from '../i18n/LangContext';
import { MARQUEE } from '../i18n/translations';

export default function Marquee() {
  const { lang } = useLang();
  const row = MARQUEE[lang];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {row.map((word) => <span key={word}>{word}</span>)}
        {row.map((word) => <span key={`dup-${word}`}>{word}</span>)}
      </div>
    </div>
  );
}
