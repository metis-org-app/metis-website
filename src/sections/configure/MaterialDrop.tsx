import { useEffect, useRef, useState, type Dispatch } from 'react';
import { SAMPLE_FILE_SIZES } from '../../content/demo-data';
import {
  MATERIAL_EXTENSIONS,
  MAX_DEMO_FILES,
  READ_MS,
  READ_STAGGER_MS,
  formatSize,
  materialKind,
  readyTopics,
  type MaterialAction,
  type MaterialFile,
  type MaterialState,
} from '../../features/material/material';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useI18n } from '../../i18n/useI18n';

const ACCEPT = MATERIAL_EXTENSIONS.map((ext) => `.${ext}`).join(',');

const carriesFiles = (event: { dataTransfer: DataTransfer | null }) =>
  Array.from(event.dataTransfer?.types ?? []).includes('Files');

interface Props {
  state: MaterialState;
  dispatch: Dispatch<MaterialAction>;
}

/**
 * Drop zone of the configurator demo. Files can be dragged in, chosen with the file picker, or added as
 * one of the sample files (the click and keyboard alternatives to dragging). Nothing is uploaded: each
 * file is "read" for a moment and then reports sample topics, which the preview uses.
 */
export function MaterialDrop({ state, dispatch }: Props) {
  const { m } = useI18n();
  const copy = m.configure.material;
  const reduced = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const timers = useRef(new Map<number, number>());
  const [dragging, setDragging] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const addFiles = (list: ArrayLike<{ name: string; size: number }>) => {
    const files = Array.from(list, ({ name, size }) => ({ name, size }));
    if (!files.length) return;
    dispatch({ type: 'add', files, instant: reduced });
    const room = Math.max(0, MAX_DEMO_FILES - state.files.length);
    const rejected = files.slice(0, room).filter((file) => !materialKind(file.name));
    if (files.length > room) setAnnouncement(copy.overflow(MAX_DEMO_FILES));
    else if (rejected.length) setAnnouncement(`${rejected[0]!.name}: ${copy.unsupported}`);
  };

  // Each accepted file "reads" for a moment; files added together finish one after another.
  useEffect(() => {
    const pending = timers.current;
    for (const file of state.files) {
      if (file.status !== 'reading' || pending.has(file.id)) continue;
      const delay = READ_MS + pending.size * READ_STAGGER_MS;
      const timer = window.setTimeout(() => {
        pending.delete(file.id);
        dispatch({ type: 'ready', id: file.id });
        setAnnouncement(copy.announceFound(file.name, file.topics.length));
      }, delay);
      pending.set(file.id, timer);
    }
  }, [state.files, dispatch, copy]);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      for (const timer of pending.values()) window.clearTimeout(timer);
      pending.clear();
    };
  }, []);

  // A file dropped next to the zone would make the browser open it and leave the page.
  useEffect(() => {
    const guard = (event: DragEvent) => {
      if (!carriesFiles(event) || zoneRef.current?.contains(event.target as Node)) return;
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'none';
    };
    window.addEventListener('dragover', guard);
    window.addEventListener('drop', guard);
    return () => {
      window.removeEventListener('dragover', guard);
      window.removeEventListener('drop', guard);
    };
  }, []);

  return (
    <div className="flex min-w-0 flex-col gap-4 lg:col-span-8">
      <h3 className="label-mono m-0 text-xs font-normal text-soft">{copy.heading}</h3>
      <div
        ref={zoneRef}
        onDragEnter={(event) => {
          if (!carriesFiles(event)) return;
          event.preventDefault();
          setDragging(true);
        }}
        onDragOver={(event) => {
          if (!carriesFiles(event)) return;
          event.preventDefault();
          event.dataTransfer.dropEffect = 'copy';
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          addFiles(event.dataTransfer.files);
        }}
        className={`flex flex-col items-center gap-4 border-2 border-dashed px-5 py-8 text-center transition-colors duration-200 ${dragging ? 'border-accent bg-tint' : 'border-ink/40 bg-surface'}`}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 48 48"
          width="44"
          height="44"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className={`text-ink transition-transform duration-200 ${dragging ? '-translate-y-1' : ''}`}
        >
          <path d="M24 30V8M15 17l9-9 9 9" strokeLinecap="square" />
          <path d="M8 28v12h32V28" strokeLinecap="square" />
        </svg>
        <div className="flex flex-col gap-1.5">
          <p className="m-0 text-xl leading-tight font-bold">
            {dragging ? (
              copy.dropActive
            ) : (
              <>
                {/* Touch screens cannot drag files in, so they get the plain call to action. */}
                <span className="pointer-coarse:hidden">{copy.drop}</span>
                <span className="hidden pointer-coarse:inline">{copy.pick}</span>
              </>
            )}
          </p>
          <p className="label-mono m-0 text-xs text-soft">{copy.formats}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="label-mono min-h-11 border border-ink bg-ink px-4 text-[13px] text-bg transition-colors hover:border-accent hover:bg-accent hover:text-accent-fg"
          >
            {copy.choose}
          </button>
          <span className="px-1 text-sm text-soft">{copy.sampleLead}</span>
          {copy.samples.map((name, i) => (
            <button
              key={name}
              type="button"
              aria-label={copy.sampleLabel(name)}
              onClick={() => addFiles([{ name, size: SAMPLE_FILE_SIZES[i] ?? SAMPLE_FILE_SIZES[0] }])}
              className="min-h-11 border border-ink bg-bg px-3 font-mono text-[13px] text-ink transition-colors hover:bg-ink hover:text-bg"
            >
              {name}
            </button>
          ))}
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          accept={ACCEPT}
          onChange={(event) => {
            addFiles(event.target.files ?? []);
            event.target.value = '';
          }}
        />
      </div>

      {state.overflow > 0 && <p className="m-0 text-sm text-accent">{copy.overflow(MAX_DEMO_FILES)}</p>}

      {state.files.length > 0 && (
        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-3 border-b border-ink">
            <span className="label-mono text-xs text-soft">
              {copy.fileList} · {state.files.length}/{MAX_DEMO_FILES}
            </span>
            <button
              type="button"
              onClick={() => dispatch({ type: 'clear' })}
              className="label-mono min-h-11 px-1 text-xs text-soft underline-offset-4 hover:text-ink hover:underline"
            >
              {copy.clear}
            </button>
          </div>
          <ul aria-label={copy.fileList} className="m-0 flex list-none flex-col p-0">
            {state.files.map((file) => (
              <FileRow key={file.id} file={file} onRemove={() => dispatch({ type: 'remove', id: file.id })} />
            ))}
          </ul>
        </div>
      )}

      <p className="label-mono m-0 text-xs text-soft">{copy.privacy}</p>
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}

function FileRow({ file, onRemove }: { file: MaterialFile; onRemove: () => void }) {
  const { m, lang } = useI18n();
  const copy = m.configure.material;
  const ext = file.name.includes('.') ? file.name.split('.').pop()!.slice(0, 4).toUpperCase() : '?';

  return (
    <li className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-line py-2.5 motion-safe:animate-fade-up">
      <span
        aria-hidden="true"
        className={`label-mono inline-flex h-10 w-12 items-center justify-center border text-xs ${file.status === 'error' ? 'border-accent text-accent' : 'border-ink'}`}
      >
        {ext}
      </span>
      <div className="flex min-w-0 flex-col gap-1">
        <span className="truncate font-semibold">{file.name}</span>
        <span className="flex flex-wrap items-center gap-x-2 font-mono text-xs text-soft">
          <span>{formatSize(file.size, lang)}</span>
          {file.status === 'reading' && <span>· {copy.reading}</span>}
          {file.status === 'ready' && (
            <span className="inline-flex items-center gap-1 text-ink">
              ·
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                width="13"
                height="13"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path d="M5 12l5 5L20 7" strokeLinecap="square" />
              </svg>
              {copy.found(file.topics.length)}
            </span>
          )}
        </span>
        {file.status === 'reading' && (
          <span aria-hidden="true" className="block h-1 overflow-hidden bg-line2">
            <span
              className="block h-full origin-left bg-accent motion-safe:animate-progress"
              style={{ animationDuration: `${READ_MS}ms` }}
            />
          </span>
        )}
        {file.status === 'error' && <span className="text-sm text-accent">{copy.unsupported}</span>}
      </div>
      <button
        type="button"
        aria-label={copy.remove(file.name)}
        onClick={onRemove}
        className="inline-flex size-11 items-center justify-center text-soft transition-colors hover:text-ink"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </li>
  );
}

/** Topics "found" in the ready files; they also feed the preview. */
export function DetectedTopics({ state }: { state: MaterialState }) {
  const { m } = useI18n();
  const copy = m.configure.material;
  const topics = readyTopics(state);
  return (
    <div className="flex flex-col gap-3 border border-ink bg-surface p-4 lg:col-span-4 lg:mt-[30px] lg:self-start">
      <h3 className="label-mono m-0 flex items-center justify-between gap-3 text-xs font-normal text-soft">
        {copy.detected}
        <span className="font-mono text-sm text-ink">{topics.length}</span>
      </h3>
      {topics.length ? (
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {topics.map((topic) => (
            <li
              key={topic}
              className="border border-ink bg-bg px-2.5 py-1.5 text-sm motion-safe:animate-fade-up"
            >
              {m.topics[topic]}
            </li>
          ))}
        </ul>
      ) : (
        <p className="m-0 text-sm text-soft">{copy.detectedEmpty}</p>
      )}
    </div>
  );
}
