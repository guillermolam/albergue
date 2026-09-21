import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useI18n } from '../hooks/useI18n';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { RobotIcon, ArrowRightIcon } from '../doodle/DoodleIcons';
import { LocalKeywordEngine, listSuggestedQuestions } from './answerEngine';
import { NEO_INPUT, NEO_INTERACTIVE } from './neo';
import type { HostelAggregate } from '../../src/lib/hostelTypes';

interface ChatMessage {
  id: string;
  from: 'bot' | 'user';
  text: string;
}

const COPY = {
  es: {
    title: 'Agente',
    subtitle: 'Pregunta lo que necesites',
    greeting:
      '¡Hola! Soy el asistente del albergue. Pregúntame sobre horarios, precios o servicios.',
    placeholder: 'Escribe tu pregunta…',
    send: 'Enviar',
  },
  en: {
    title: 'Agent',
    subtitle: 'Ask us anything',
    greeting: "Hi! I'm the hostel assistant. Ask me about hours, prices, or services.",
    placeholder: 'Type your question…',
    send: 'Send',
  },
};

let messageId = 0;
function nextId(): string {
  messageId += 1;
  return `msg-${messageId}`;
}

interface ChatAgentBlockProps {
  hostelInfo?: HostelAggregate | null;
}

export function ChatAgentBlock({ hostelInfo = null }: Readonly<ChatAgentBlockProps>) {
  const { locale } = useI18n();
  const isEs = locale !== 'en';
  const t = isEs ? COPY.es : COPY.en;
  const animate = !usePrefersReducedMotion();

  const engineRef = useRef(new LocalKeywordEngine(hostelInfo));
  const listRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: nextId(), from: 'bot', text: t.greeting },
  ]);
  const [input, setInput] = useState('');

  useEffect(() => {
    engineRef.current = new LocalKeywordEngine(hostelInfo);
  }, [hostelInfo]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(text: string) {
    const question = text.trim();
    if (!question) return;

    setMessages((prev) => [...prev, { id: nextId(), from: 'user', text: question }]);
    setInput('');

    const reply = await engineRef.current.answer(question, isEs ? 'es' : 'en');
    setMessages((prev) => [...prev, { id: nextId(), from: 'bot', text: reply }]);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center gap-2">
        <RobotIcon className="h-7 w-7 shrink-0" animate={animate} />
        <div>
          <h3 className="text-base font-black text-[#1A1A1A] font-sketch">{t.title}</h3>
          <p className="text-[11px] font-semibold text-[#1A1A1A]/55">{t.subtitle}</p>
        </div>
      </div>

      <div
        ref={listRef}
        className="mb-2 flex-1 space-y-2 overflow-y-auto rounded-lg border-2 border-[#1A1A1A] bg-[#F5F0E8] p-2"
      >
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={animate ? { opacity: 0, y: 6 } : false}
            animate={{ opacity: 1, y: 0 }}
            className={`max-w-[90%] rounded-md border-2 border-[#1A1A1A] px-2.5 py-1.5 text-xs font-semibold shadow-[2px_2px_0_0_#1A1A1A] ${
              message.from === 'bot' ? 'bg-white text-[#1A1A1A]' : 'ml-auto bg-[#00AB39] text-white'
            }`}
          >
            {message.text}
          </motion.div>
        ))}
      </div>

      <div className="mb-2 flex flex-wrap gap-1.5">
        {listSuggestedQuestions(isEs ? 'es' : 'en')
          .slice(0, 2)
          .map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => sendMessage(question)}
              className={`${NEO_INTERACTIVE} rounded-md bg-[#E8F5E9] px-2 py-1 text-[10px] font-black text-[#1A1A1A]`}
            >
              {question}
            </button>
          ))}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendMessage(input);
        }}
        data-no-swup
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={t.placeholder}
          aria-label={t.placeholder}
          className={`${NEO_INPUT} !rounded-md !py-1.5 !text-xs !shadow-[2px_2px_0_0_#1A1A1A]`}
        />
        <button
          type="submit"
          aria-label={t.send}
          className={`${NEO_INTERACTIVE} flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#00AB39] text-white`}
        >
          <ArrowRightIcon className="h-4 w-4" animate={false} />
        </button>
      </form>
    </div>
  );
}
