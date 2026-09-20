import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useI18n } from '../hooks/useI18n';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { RobotIcon, ArrowRightIcon } from '../doodle/DoodleIcons';
import { LocalKeywordEngine, listSuggestedQuestions } from './answerEngine';
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
    placeholder: 'Escribe tu pregunta...',
    send: 'Enviar',
  },
  en: {
    title: 'Agent',
    subtitle: 'Ask us anything',
    greeting: "Hi! I'm the hostel assistant. Ask me about hours, prices, or services.",
    placeholder: 'Type your question...',
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
        <RobotIcon className="h-8 w-8 shrink-0" animate={animate} />
        <div>
          <h3 className="text-base font-bold text-[#5D4E37] font-sketch">{t.title}</h3>
          <p className="text-xs text-[#5D4E37]/60">{t.subtitle}</p>
        </div>
      </div>

      <div
        ref={listRef}
        className="mb-2 flex-1 space-y-2 overflow-y-auto rounded-lg bg-[#E8F5E9]/40 p-2"
      >
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`max-w-[85%] rounded-xl px-3 py-1.5 text-xs ${
              message.from === 'bot' ? 'bg-white text-[#5D4E37]' : 'ml-auto bg-[#00AB39] text-white'
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
              className="rounded-full border border-[#00AB39]/40 bg-white px-2 py-1 text-[10px] text-[#00AB39] hover:bg-[#E8F5E9]"
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
          className="w-full rounded-full border border-[#5D4E37]/25 bg-white px-3 py-1.5 text-xs text-[#5D4E37] focus:border-[#00AB39] focus:outline-none"
        />
        <button
          type="submit"
          aria-label={t.send}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00AB39] text-white hover:bg-[#006B26]"
        >
          <ArrowRightIcon className="h-4 w-4" animate={false} />
        </button>
      </form>
    </div>
  );
}
