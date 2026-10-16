import { LANGS } from '../../i18n/detect';
import { useI18n } from '../../i18n/useI18n';
import { ToggleGroup } from '../ui/ToggleGroup';

export function LangSwitch() {
  const { lang, m, setLang } = useI18n();
  return (
    <ToggleGroup label={m.a11y.language}>
      <div className="flex items-center">
        {LANGS.map((code, i) => {
          const active = code === lang;
          return (
            <span key={code} className="flex items-center">
              {i > 0 && (
                <span aria-hidden="true" className="px-0.5 text-line">
                  /
                </span>
              )}
              <button
                type="button"
                lang={code}
                aria-pressed={active}
                aria-label={m.a11y.langNames[code]}
                onClick={() => setLang(code)}
                className={`label-mono min-h-11 min-w-11 px-1 text-xs ${active ? 'text-ink underline decoration-accent decoration-2 underline-offset-4' : 'text-soft hover:text-ink'}`}
              >
                {code.toUpperCase()}
              </button>
            </span>
          );
        })}
      </div>
    </ToggleGroup>
  );
}
