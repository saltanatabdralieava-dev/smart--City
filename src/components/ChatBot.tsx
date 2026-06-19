import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../context/LanguageContext";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  Minimize2,
  CornerDownLeft,
  Calendar,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

interface Message {
  role: "user" | "model";
  text: string;
  time: string;
}

export default function ChatBot() {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize with welcome message based on language Choice
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeKy =
        "Саламатсызбы! Мен Токмок шаардык мэриясынын санариптик көмөкчүсүмүн (ИИ). Токмок шаарынын кызматтары, мечиттер, МТУлар жана башка муниципалдык маселелер боюнча сизге жардам бере алам. Кандай сурооңуз бар?";
      const welcomeRu =
        "Здравствуйте! Я цифровой ИИ-помощник мэрии города Токмок. Помогу вам узнать адреса муниципальных служб, информацию о мечетях, МТУ или подаче обращений. Какой у вас вопрос?";

      setMessages([
        {
          role: "model",
          text: lang === "ky" ? welcomeKy : welcomeRu,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  }, [lang, messages.length]);

  // Handle auto scroll
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  // Suggested bilingual topics
  const suggestedTopics =
    lang === "ky"
      ? [
          { text: "Шаардын мэри ким?", query: "Токмок шаарынын мэри ким?" },
          { text: "Борбордук мечит кайда?", query: "Токмок Борбордук мечити кайда жайгашкан жана анын сыйымдуулугу кандай?" },
          { text: "«Тазалык» МИ милдети?", query: "«Тазалык» муниципалдык ишканасынын негизги функциясы жана милдеттери кандай?" },
          { text: "МТУ деген эмне?", query: "МТУ (Муниципалдык аянттык башкармалык) деген эмне жана алар эмне кызмат кылат?" },
        ]
      : [
          { text: "Кто мэр города?", query: "Кто является мэром города Токмок?" },
          { text: "Где Центральная мечеть?", query: "Где находится Центральная мечеть Токмока и какая у неё вместимость?" },
          { text: "Чем занят «Тазалык»?", query: "Каковы основные функции и обязанности муниципального предприятия «Тазалык»?" },
          { text: "Что такое МТУ?", query: "Что такое МТУ (Муниципальные территориальные управления) и зачем они нужны?" },
        ];

  const handleSendMessage = async (rawText: string) => {
    const text = rawText.trim();
    if (!text || isLoading) return;

    setInput("");
    const userTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMessages = [...messages, { role: "user" as const, text, time: userTime }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Map frontend conversation history to @google/genai Server format
      const serverPayload = newMessages.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.text }],
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: serverPayload }),
      });

      const data = await res.json();
      const botTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      if (data.success && data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "model", text: data.reply, time: botTime },
        ]);
      } else {
        const errorMsg =
          lang === "ky"
            ? "Кечиресиз, сурооңузга жооп алууда ката кетти. КР ачкычы туура эмес же байланыш үзүлдү."
            : "Извините, не удалось получить ответ от ИИ. Проверьте подключение или наличие секретного ключа Gemini.";
        setMessages((prev) => [
          ...prev,
          { role: "model", text: errorMsg, time: botTime },
        ]);
      }
    } catch (err) {
      console.error("Chatbot submit logic failed:", err);
      const botTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const errorMsg =
        lang === "ky"
          ? "Борбордук сервер менен байланыш үзүлдү. Кийинчерээк дагы бир жолу аракет кылып көрүңүз."
          : "Связь с сервером потеряна. Пожалуйста, попробуйте отправить запрос позднее.";
      setMessages((prev) => [
        ...prev,
        { role: "model", text: errorMsg, time: botTime },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasNewMessage(false);
    }
  };

  return (
    <>
      {/* Floating launcher trigger circle button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 pointer-events-auto">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900 border border-slate-800 text-[10px] text-emerald-400 font-bold px-3 py-1.5 rounded-xl shadow-2xl flex items-center gap-1.5 backdrop-blur-md"
            >
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
              {lang === "ky" ? "ИИ Жарандык Сырдашуу" : "ИИ-Помощник Мэрии"}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          id="btn-municip-chatbot"
          onClick={toggleChat}
          className={`w-14 h-14 rounded-full bg-gradient-to-tr from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 shadow-2xl border border-rose-500/20 active:scale-95 flex items-center justify-center text-white cursor-pointer relative transition-transform ${
            isOpen ? "rotate-90" : "animate-bounce"
          }`}
          style={{ animationDuration: "3s" }}
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}

          {/* Unread message state notification dot */}
          {hasNewMessage && !isOpen && (
            <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-950 rounded-full"></span>
          )}
        </button>
      </div>

      {/* Main Chatbot Overlay window container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-[360px] sm:w-[400px] h-[520px] max-h-[80vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden pointer-events-auto"
          >
            {/* 1. Header Area with City Badge */}
            <div className="bg-slate-950 px-4 py-3.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center font-bold text-white text-xs border border-rose-500/30">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-xs text-white uppercase tracking-wider">
                      {lang === "ky" ? "Токмок ИИ Көмөкчүсү" : "ИИ Помощник Токмока"}
                    </h3>
                    <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
                  </div>
                  <p className="text-[10px] text-emerald-450 flex items-center gap-1 leading-none mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
                    {lang === "ky" ? "Кеңеш алуу кызматтары онлайн" : "Консультант онлайн"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition cursor-pointer"
                  title={lang === "ky" ? "Жабуу" : "Свернуть"}
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2. Scrollable Messages Body Container */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 bg-slate-900/60 custom-scrollbar">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col max-w-[85%] ${
                    msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed font-sans ${
                      msg.role === "user"
                        ? "bg-rose-600/90 text-white rounded-tr-none shadow-md shadow-rose-950/20"
                        : "bg-slate-950 text-slate-200 border border-slate-850 rounded-tl-none"
                    }`}
                  >
                    {/* Preserve linebreaks and highlight tags */}
                    <div className="whitespace-pre-wrap break-words">{msg.text}</div>
                  </div>
                  <span className="text-[8.5px] font-mono text-slate-500 mt-1 px-1">{msg.time}</span>
                </div>
              ))}

              {/* Thinking loader animation */}
              {isLoading && (
                <div className="flex flex-col items-start mr-auto max-w-[85%]">
                  <div className="p-3 bg-slate-950 border border-slate-850 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs">
                    <span className="font-mono text-[10px] text-slate-450 italic">
                      {lang === "ky" ? "Мэриянын ИИ ойлонууда" : "ИИ Мэрии анализирует"}
                    </span>
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce duration-300" style={{ animationDelay: "0ms" }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce duration-300" style={{ animationDelay: "150ms" }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce duration-300" style={{ animationDelay: "300ms" }}></span>
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* 3. Quick Suggested Topics Horizontal Row */}
            <div className="bg-slate-950/80 px-4 py-2 border-t border-slate-850 overflow-x-auto whitespace-nowrap flex gap-2 scrollbar-none shrink-0">
              {suggestedTopics.map((topic, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(topic.query)}
                  disabled={isLoading}
                  className="bg-slate-900 border border-slate-800 text-[10.5px] text-slate-300 px-2.5 py-1 rounded-full hover:border-emerald-500/40 hover:bg-slate-950 hover:text-white transition cursor-pointer shrink-0 disabled:opacity-50"
                >
                  {topic.text}
                </button>
              ))}
            </div>

            {/* 4. Text Input Form Action section */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className="bg-slate-950 p-3 border-t border-slate-850 flex gap-2 items-center shrink-0"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  lang === "ky"
                    ? "Сурооңузду жазыңыз..."
                    : "Введите ваш вопрос о Токмоке..."
                }
                disabled={isLoading}
                className="flex-1 bg-slate-900 border border-slate-800 text-xs px-3.5 py-2.5 rounded-xl text-white outline-none focus:border-rose-500/50 disabled:opacity-50 font-sans"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-9 h-9 rounded-xl bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="bg-slate-950 pb-1.5 text-center shrink-0">
              <span className="text-[8px] font-mono text-slate-650 tracking-wider">
                ⚡ POWERED BY GOOGLE GEMINI 3.5 FLASH • SMART TOKMOK
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
