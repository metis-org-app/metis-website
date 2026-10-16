import { act, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LangSwitch } from '../../components/layout/LangSwitch';
import { THINK_MS } from '../../features/guide/useGuideTimers';
import { renderWithProviders } from '../../test/render';
import { ConfigureSection } from '../configure/ConfigureSection';
import { GuideSection } from './GuideSection';

beforeEach(() => {
  // Fake only timers: user-event relies on real promises/microtasks.
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
});
afterEach(() => {
  vi.useRealTimers();
});

function setup() {
  const user = userEvent.setup({ advanceTimers: (ms) => vi.advanceTimersByTime(ms) });
  renderWithProviders(
    <>
      <LangSwitch />
      <GuideSection />
      <ConfigureSection />
    </>,
    { demo: true },
  );
  return user;
}

/** Lets Metis think and finish typing. */
async function waitForReply() {
  await act(() => vi.advanceTimersByTimeAsync(THINK_MS));
  await act(() => vi.advanceTimersByTimeAsync(2000));
}

const log = () => screen.getByRole('log', { name: 'Conversation with Metis' });

describe('GuideSection', () => {
  it('answers a typed check with a hint, a rule tag and the highlighted price row', async () => {
    const user = setup();
    await user.type(screen.getByLabelText('Message Metis'), 'Is it $30?');
    await user.click(screen.getByRole('button', { name: 'Send →' }));

    expect(within(log()).getByText('Is it $30?')).toBeInTheDocument();
    expect(screen.getByText('Thinking about a hint…')).toBeInTheDocument();
    await waitForReply();

    expect(
      within(log()).getByText('SOCRATIC · HINT 2/3 · SOURCE P. 06 · ANSWER WITHHELD'),
    ).toBeInTheDocument();
    expect(within(log()).getAllByText(/At \$30, how many units are supplied/)).not.toHaveLength(0);
    const checked = screen
      .getAllByRole('rowheader')
      .filter((th) => th.textContent?.includes('(being checked)'));
    expect(checked.map((th) => th.textContent)).toEqual(['$30 (being checked)']);
    expect(screen.getByRole('img', { name: 'Hints used: 2 of 3' })).toBeInTheDocument();
    expect(screen.getByText('Listening for a question')).toBeInTheDocument();
  });

  it('holds back the answer once the hint limit is reached', async () => {
    const user = setup();
    const rules = screen.getAllByRole('group', { name: 'Max hints per item' })[0]!;
    await user.click(within(rules).getByRole('button', { name: '1' }));
    expect(within(log()).getByText('Rule updated: max hints 1')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Just tell me the answer.' }));
    await waitForReply();
    expect(within(log()).getByText('LIMIT REACHED · ANSWER WITHHELD')).toBeInTheDocument();
    expect(screen.getByText('Holding back the answer')).toBeInTheDocument();
  });

  it('follows rule changes in the next reply', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: /Worked example/ }));
    await user.click(screen.getByRole('switch', { name: 'Cite the course material' }));
    await user.click(screen.getByRole('button', { name: "I don't know where to start." }));
    await waitForReply();
    expect(within(log()).getByText('WORKED EXAMPLE · HINT 2/3 · ANSWER WITHHELD')).toBeInTheDocument();
  });

  it('turning Metis off in the configurator disables the chat', async () => {
    const user = setup();
    await user.click(screen.getByRole('switch', { name: 'Metis in the student link' }));
    expect(screen.getByText('AI guide is off for this assessment')).toBeInTheDocument();
    expect(screen.getByLabelText('Message Metis')).toBeDisabled();
    expect(screen.getByText('Off for this assessment')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Turn the guide on' }));
    expect(screen.getByLabelText('Message Metis')).toBeEnabled();
  });

  it('resets the conversation', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(within(log()).queryAllByRole('listitem')).toHaveLength(0);
  });

  it('plays the demo: three prompts in order', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: /Watch demo/ }));
    for (let i = 0; i < 3; i++) {
      await act(() => vi.advanceTimersByTimeAsync(1600));
      await waitForReply();
    }
    const student = within(log())
      .getAllByText(/^(Just tell me the answer\.|I don't know where to start\.|Is it \$40\?)$/)
      .map((el) => el.textContent);
    expect(student).toEqual(['Just tell me the answer.', "I don't know where to start.", 'Is it $40?']);
  });

  it('re-renders the existing conversation when the language changes', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'Español' }));
    expect(screen.getByRole('log', { name: 'Conversación con Metis' }).textContent).toContain(
      '¿Cuál es el precio de equilibrio? Solo dime el número.',
    );
  });
});
