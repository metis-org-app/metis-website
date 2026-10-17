import { LANGS, pathForLang } from '../../i18n/detect';
import { useI18n } from '../../i18n/useI18n';

/**
 * Links to each language's page. A plain click switches in place (and updates the URL); a modified click
 * (new tab, new window) follows the link, which also works without JavaScript.
 */
export function LangSwitch() {
  const { lang, m, setLang } = useI18n();
  return (
    <div role="group" aria-label={m.a11y.language} className="flex items-center">
      {LANGS.map((code, i) => {
        const active = code === lang;
        return (
          <span key={code} className="flex items-center">
            {i > 0 && (
              <span aria-hidden="true" className="px-0.5 text-line">
                /
              </span>
            )}
            <a
              href={pathForLang(code)}
              hrefLang={code}
              lang={code}
              aria-current={active ? 'page' : undefined}
              aria-label={m.a11y.langNames[code]}
              onClick={(event) => {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)
                  return;
                event.preventDefault();
                if (!active) setLang(code);
              }}
              className={`label-mono flex min-h-11 min-w-11 items-center justify-center px-1 text-xs no-underline ${active ? 'text-ink underline decoration-accent decoration-2 underline-offset-4' : 'text-soft hover:text-ink'}`}
            >
              {code.toUpperCase()}
            </a>
          </span>
        );
      })}
    </div>
  );
}
