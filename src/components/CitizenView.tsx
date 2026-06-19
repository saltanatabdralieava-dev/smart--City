import React, { useState } from "react";
import { Complaint, ComplaintCategory, NewsItem } from "../types";
import { TOKMOK_DISTRICTS } from "../data/mockData";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  Send,
  AlertTriangle,
  MapPin,
  Flame,
  Droplet,
  Trash2,
  Lightbulb,
  ShieldAlert,
  Wrench,
  ThumbsUp,
  Image as ImageIcon,
  Sparkles,
  Info,
  User,
  CheckCircle,
  EyeOff,
} from "lucide-react";

import {
  useLanguage,
  getLocalDistrict,
  getLocalComplaintCategory,
  getLocalStatus,
  getLocalUrgency,
  getTranslateComplaintText,
} from "../context/LanguageContext";

interface CitizenViewProps {
  complaints: Complaint[];
  news: NewsItem[];
  currentPinCoords: { lat: number; lng: number; district: string } | null;
  onAddComplaint: (newComplaint: Complaint) => void;
  onVote: (complaintId: string) => void;
}

export default function CitizenView({
  complaints,
  news,
  currentPinCoords,
  onAddComplaint,
  onVote,
}: CitizenViewProps) {
  const { t, lang } = useLanguage();

  // Form states
  const [citizenName, setCitizenName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ComplaintCategory>("водоканал");
  const [urgency, setUrgency] = useState<"low" | "medium" | "high" | "critical">("medium");
  const [landmark, setLandmark] = useState("");
  const [district, setDistrict] = useState(TOKMOK_DISTRICTS[0]);
  const [isMayorDirect, setIsMayorDirect] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  // AI-Assistor specific states before submission
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{
    category?: ComplaintCategory;
    urgency?: string;
    explanation?: string;
    autoReply?: string;
  } | null>(null);

  // Success indicator
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Predefined gorgeous mockup imagery
  const sampleIncidentPics = [
    {
      name: lang === "ky" ? "Суу агуу / Көлчүк" : "Прорыв воды / Лужа",
      url: "https://images.unsplash.com/photo-1542044896530-05d85be9b11a?q=80&w=300&auto=format&fit=crop",
    },
    {
      name: lang === "ky" ? "Таштандылар үймөгү" : "Стихийная свалка / Мусор",
      url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=300&auto=format&fit=crop",
    },
    {
      name: lang === "ky" ? "Фонарь күйбөйт / Караңгылык" : "Перегорел фонарь / Темнота",
      url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=300&auto=format&fit=crop",
    },
    {
      name: lang === "ky" ? "Жарылган дарак / Кулоо" : "Ветхое дерево / Обвал",
      url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=300&auto=format&fit=crop",
    },
  ];
  const [selectedPhoto, setSelectedPhoto] = useState<string>("");

  // Sync coords if user clicked on InteractiveMap
  React.useEffect(() => {
    if (currentPinCoords) {
      setDistrict(currentPinCoords.district);
      setLandmark(
        lang === "ky"
          ? `Картадагы чекит: X-${currentPinCoords.lng}%, Y-${currentPinCoords.lat}%`
          : `Точка на карте: X-${currentPinCoords.lng}%, Y-${currentPinCoords.lat}%`
      );
    }
  }, [currentPinCoords, lang]);

  // Server-side AI categorization trigger
  const runAiAnalysis = async () => {
    if (!description.trim()) {
      alert(
        lang === "ky"
          ? "Өтүнүч, КР талдоо жүргүзүүсү үчүн адегенде көйгөйдү жазыңыз."
          : "Пожалуйста, сначала опишите проблему, чтобы ИИ мог её проанализировать."
      );
      return;
    }
    setIsAnalyzing(true);
    setAiSuggestions(null);

    try {
      const res = await fetch("/api/ai/categorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: description }),
      });
      const result = await res.json();
      if (result.success) {
        setAiSuggestions({
          category: result.category,
          urgency: result.urgency,
          explanation: result.explanation,
          autoReply: result.auto_reply,
        });
        // Auto-apply suggested category and urgency
        if (result.category) setCategory(result.category);
        if (result.urgency) setUrgency(result.urgency);
      } else {
        alert(
          (lang === "ky" ? "КР убактылуу жеткиликсиз: " : "ИИ временно недоступен: ") +
            (result.error || "Error")
        );
      }
    } catch (err: any) {
      console.warn("API request failed:", err);
      // Fallback local logic for demo integrity if api-key absent
      const textLower = description.toLowerCase();
      let fakeCategory: ComplaintCategory = "водоканал";
      let fakeUrgency: "low" | "medium" | "high" | "critical" = "medium";
      let fakeExpl =
        lang === "ky"
          ? "Талдоо сыноо режиминде аяктады."
          : "Анализ завершен в тестовом режиме.";

      if (textLower.includes("свет") || textLower.includes("фонар") || textLower.includes("темно") || textLower.includes("жарык")) {
        fakeCategory = "горсвет";
        fakeUrgency = "high";
        fakeExpl =
          lang === "ky"
            ? "'Жарык/фонарь' ачкыч сөздөрү табылды. Горсветке багытталды."
            : "Выявлены ключевые слова 'свет/фонарь'. Направлено в Горсвет.";
      } else if (textLower.includes("мусор") || textLower.includes("свалка") || textLower.includes("пакет") || textLower.includes("таштанды")) {
        fakeCategory = "санитарная служба";
        fakeUrgency = "medium";
        fakeExpl =
          lang === "ky"
            ? "Санитардык тартип катасы табылды. Тазалыкка багытталды."
            : "Выявлена проблема санитарного порядка. Направлено в Тазалык.";
      } else if (textLower.includes("газ") || textLower.includes("плита")) {
        fakeCategory = "газ";
        fakeUrgency = "critical";
        fakeExpl =
          lang === "ky"
            ? "Газ боюнча коопсуздукка жогорку коркунуч. Тез арада чара көрүү сунушталат."
            : "Высокая угроза безопасности из-за газа. Рекомендован экстренный приоритет.";
      }

      setAiSuggestions({
        category: fakeCategory,
        urgency: fakeUrgency,
        explanation: fakeExpl,
        autoReply:
          lang === "ky"
            ? `Саламатсызбы! Сиздин даттанууңуз кабыл алынып, Токмок шаарынын мэриясынын КР-жардамчысы тарабынан автоматтык түрдө иштелди. Кайрылуу тиешелүү кызматка өткөрүлүп берилди. Катышканыңыз үчүн рахмат!`
            : `Здравствуйте! Ваша жалоба принята и автоматически обработана ИИ-ассистентом мэрии Токмок. Мы передали обращение в службу ответственности. Благодарим Вас за активное участие в улучшении города!`,
      });
      setCategory(fakeCategory);
      setUrgency(fakeUrgency);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !citizenName.trim()) {
      alert(
        lang === "ky"
          ? "Өтүнүч, бардык негизги талааларды толтуруңуз: ФИО, Тема жана Сыпаттама."
          : "Пожалуйста, заполните все ключевые поля: Имя, Тема и Содержимое жалобы."
      );
      return;
    }

    const actualCitizenName = (isMayorDirect && isAnonymous)
      ? (lang === "ky" ? "Жашыруун жаран 🔒" : "Анонимный гражданин 🔒")
      : citizenName;

    const newComplaint: Complaint = {
      id: "citizen-" + Date.now(),
      title,
      description,
      category,
      urgency,
      citizenName: actualCitizenName,
      district,
      status: "pending",
      createdAt: new Date().toISOString(),
      landmark: landmark || (lang === "ky" ? "Көрсөтүлгөн эмес" : "Не указан"),
      beforePhoto: selectedPhoto || undefined,
      votes: 1,
      votedUsers: ["current_citizen"],
      officialReply: aiSuggestions?.autoReply || undefined,
      isDirectToMayor: isMayorDirect,
    };

    onAddComplaint(newComplaint);
    setHasSubmitted(true);

    // Reset form parameters
    setTitle("");
    setDescription("");
    setLandmark("");
    setSelectedPhoto("");
    setAiSuggestions(null);
    setIsMayorDirect(false);
    setIsAnonymous(false);

    // Clear victory banner after few seconds
    setTimeout(() => {
      setHasSubmitted(false);
    }, 4000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Left 2 columns - Complaints Submission and Tracking */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {/* Victory Submitted Toast banner */}
        <AnimatePresence>
          {hasSubmitted && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-emerald-950/80 border border-emerald-500 rounded-2xl p-4 flex gap-3 items-start backdrop-blur-md"
            >
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 animate-bounce" />
              <div>
                <p className="text-emerald-300 font-bold text-sm">{t("cit.success_title")}</p>
                <p className="text-xs text-slate-350 mt-1 leading-relaxed">
                  {t("cit.success_desc")}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Complaints Form card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-white text-md">{t("cit.form_title")}</h2>
                <p className="text-xs text-slate-400">{t("cit.form_desc")}</p>
              </div>
            </div>
            <div className="bg-slate-800 text-[10px] text-slate-300 font-mono px-3 py-1 rounded-full border border-slate-700">
              {t("cit.portal")}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Resident Fullname */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-300 font-medium text-xs flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" /> {t("cit.fio")}
                </label>
                <input
                  type="text"
                  placeholder={t("cit.fio_placeholder")}
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
                  required
                />
              </div>

              {/* District Select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-300 font-medium text-xs flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {t("cit.district")}
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-rose-500 transition-colors cursor-pointer"
                >
                  {TOKMOK_DISTRICTS.map((d, i) => (
                    <option key={i} value={d} className="bg-slate-950">
                      {getLocalDistrict(d, lang)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Complaint Header */}
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-300 font-medium text-xs">{t("cit.topic")}</label>
              <input
                type="text"
                placeholder={t("cit.topic_placeholder")}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
                required
              />
            </div>

            {/* Complaint Description Details */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-slate-300 font-medium text-xs">{t("cit.description")}</label>
                <button
                  type="button"
                  onClick={runAiAnalysis}
                  disabled={isAnalyzing || !description.trim()}
                  className="flex items-center gap-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 hover:bg-indigo-500/20 px-2.5 py-1 rounded-lg border border-indigo-500/20 disabled:opacity-55 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 border-t-2 border-indigo-400 rounded-full animate-spin"></span>
                      {t("cit.ai_btn_loading")}
                    </span>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                      {t("cit.ai_btn")}
                    </>
                  )}
                </button>
              </div>
              <textarea
                rows={4}
                placeholder={t("cit.description_placeholder")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors resize-none leading-relaxed"
                required
              />
            </div>

            {/* Landmark coordinates */}
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-300 font-medium text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span>{t("cit.landmark")}</span>
                <span className="text-[10px] text-cyan-400 normal-case font-normal font-sans">
                  {t("cit.landmark_help")}
                </span>
              </label>
              <input
                type="text"
                placeholder={t("cit.landmark_placeholder")}
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-cyan-400 font-semibold placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors text-xs"
              />
            </div>

            {/* AI Assistant Instant evaluation report box */}
            <AnimatePresence>
              {aiSuggestions && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-indigo-950/70 border border-indigo-500/40 p-4 rounded-xl flex flex-col gap-2 backdrop-blur-sm shadow-inner"
                >
                  <div className="flex items-center gap-1.5 text-indigo-300 font-bold text-xs">
                    <Sparkles className="w-4 h-4 animate-spin text-indigo-400" />
                    {t("cit.ai_result_title")}
                  </div>
                  <p className="text-[11px] text-slate-350 leading-relaxed">
                    {t("cit.ai_result_service")}{" "}
                    <strong className="text-white uppercase px-1.5 py-0.5 rounded bg-indigo-900/45">
                      {getLocalComplaintCategory(aiSuggestions.category || "", lang)}
                    </strong>{" "}
                    • {t("cit.ai_result_urgency")}{" "}
                    <strong className="text-white uppercase px-1.5 py-0.5 rounded bg-indigo-900/45">
                      {getLocalUrgency(aiSuggestions.urgency || "", lang)}
                    </strong>
                  </p>
                  <p className="text-[11px] text-slate-400 leading-relaxed bg-indigo-950/80 p-2.5 rounded-lg border border-indigo-900/40 italic">
                    {t("cit.ai_result_reason")} {aiSuggestions.explanation}
                  </p>
                  <div className="text-[10px] text-xs leading-relaxed text-indigo-200">
                    <strong className="block text-white not-italic text-[11px] mb-0.5">
                      {t("cit.ai_result_reply")}
                    </strong>
                    "{aiSuggestions.autoReply}"
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Photo Selection and Mock upload field */}
            <div className="flex flex-col gap-2">
              <label className="text-slate-300 font-medium text-xs flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-slate-400" /> {t("cit.photo_label")}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {sampleIncidentPics.map((pic, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedPhoto(pic.url)}
                    className={`relative cursor-pointer h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedPhoto === pic.url
                        ? "border-rose-500 scale-95 shadow-md shadow-rose-950/20"
                        : "border-slate-800 hover:border-slate-700 opacity-70"
                    }`}
                  >
                    <img src={pic.url} alt={pic.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-slate-900/80 px-1.5 py-0.5 text-[8px] truncate font-sans text-center text-slate-300">
                      {pic.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Appeal to Mayor's Secretariat toggle */}
            <div className="bg-slate-950/60 p-4 border border-amber-500/20 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-500/10 text-amber-400 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">
                    {lang === "ky" ? "Мэрдин Жеке Кабинетине түз жөнөтүү" : "Направить лично Мэру в кабинет"}
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    {lang === "ky" 
                      ? "Бул маселе Мэрдин жеке көзөмөлүнө алынып, тапшырма түздөн-түз берилет." 
                      : "Жалоба поступит лично Мэру Токмока в личный кабинет для жесткого контроля."}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
                <input
                  type="checkbox"
                  checked={isMayorDirect}
                  onChange={(e) => {
                    setIsMayorDirect(e.target.checked);
                    if (!e.target.checked) setIsAnonymous(false);
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-600 after:border-slate-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {/* Anonymous message toggle under Mayor Direct */}
            <AnimatePresence>
              {isMayorDirect && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-slate-950/40 p-4 border border-slate-800 rounded-xl flex items-center justify-between gap-4 overflow-hidden"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-indigo-500/10 text-indigo-400 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <EyeOff className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">
                        {lang === "ky" ? "Жашыруун кылуу (Анонимдүү кат)" : "Отправить анонимно"}
                      </h4>
                      <p className="text-[10px] text-slate-400 leading-normal">
                        {lang === "ky" 
                          ? "Сиздин аты-жөнүңүз жашырылып, катты жалгыз Мэр гана окуй алат." 
                          : "Ваше имя будет полностью скрыто от всех. Письмо сможет прочитать только Мэр."}
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-600 after:border-slate-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                  </label>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Category / Target Selector details and submit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800 pt-4 mt-2">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-slate-400 block mb-1">{t("cit.final_service")}</span>
                <span className="font-mono text-xs uppercase px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 self-start">
                  {getLocalComplaintCategory(category, lang)}
                </span>
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 font-bold px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 border border-rose-500/30 text-white shadow-lg cursor-pointer transform hover:-translate-y-0.5 transition"
              >
                <Send className="w-4 h-4" />
                {t("cit.submit_btn")}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 2. Right Column - Live Complaints Stream & News block */}
      <div className="flex flex-col gap-6">
        {/* News from Mayor */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <h3 className="font-bold text-white text-sm">{t("cit.news_title")}</h3>
          </div>
          <div className="flex flex-col gap-4 max-h-[160px] overflow-y-auto pr-1">
            {news.map((item) => (
              <div
                key={item.id}
                className="text-xs flex flex-col gap-1 border-b border-slate-800 pb-3 last:border-0 last:pb-0"
              >
                <div className="flex items-center justify-between gap-2.5">
                  <span
                    className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                      item.category === "emergency"
                        ? "bg-rose-500/10 text-rose-450 border border-rose-500/20"
                        : item.category === "repairs"
                        ? "bg-amber-400/10 text-amber-300 border border-amber-400/20"
                        : "bg-blue-500/10 text-blue-400 border border-blue-500/10"
                    }`}
                  >
                    {item.category === "emergency"
                      ? t("cit.news_emergency")
                      : item.category === "repairs"
                      ? t("cit.news_repairs")
                      : t("cit.news_important")}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(item.date).toLocaleDateString(lang === "ky" ? "ky-KG" : "ru-RU")}
                  </span>
                </div>
                <h4 className="font-bold text-slate-200 mt-1">
                  {lang === "ky"
                    ? item.title
                        .replace("Внимание: Плановые работы на водозаборе", "Көңүл буруңуз: Суу алуучу жайдагы пландуу жумуштар")
                        .replace("Экстренное предупреждение МЧС по Чуйской области", "Чүй облусу боюнча ӨКМдин чукул эскертүүсү")
                    : item.title}
                </h4>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  {lang === "ky"
                    ? item.content
                        .replace(
                          "В связи с профилактикой 10 июня с 9:00 до 18:00 будет временно прекращена подача питьевой воды в южной части города Токмок.",
                          "Алдын алуу иштерине байланыштуу 10-июнда саат 9:00дөн 18:00го чейин Токмок шаарынын түштүк тарабында ичүүчү суу берүү убактылуу токтотулат."
                        )
                        .replace(
                          "Ожидаются кратковременные ливневые дожди с усилением ветра до 15-20 м/с. Просим жителей быть бдительными и парковать авто в безопасных местах.",
                          "Кыска мөөнөттүү нөшөрлөгөн жаан-чачын жана шамалдын 15-20 м/с чейин күчөшү күтүлүүдө. Тургундарды сак болууга чакырабыз."
                        )
                    : item.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Complaints rating / Vote section */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col gap-4 flex-1">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-white text-sm">{t("cit.actual_issues")}</h3>
            </div>
            <span className="text-[10px] text-slate-400">{t("cit.complaints_rating")}</span>
          </div>

          <div className="flex flex-col gap-3 overflow-y-auto max-h-[380px] pr-1">
            {complaints
              .filter((c) => c.status !== "resolved" && !c.isDirectToMayor)
              .sort((a, b) => b.votes - a.votes)
              .map((c) => (
                <div
                  key={c.id}
                  className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-start gap-2.5 transition hover:border-slate-700 shadow-inner"
                >
                  <div className="flex flex-col items-center shrink-0">
                    <button
                      onClick={() => onVote(c.id)}
                      className={`p-1.5 rounded-lg border transition ${
                        c.votedUsers.includes("current_citizen")
                          ? "bg-rose-500/20 border-rose-500 text-rose-450 cursor-default"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-white cursor-pointer"
                      }`}
                      disabled={c.votedUsers.includes("current_citizen")}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] font-mono mt-1 font-bold text-slate-300">
                      {c.votes}
                    </span>
                  </div>
                  <div className="flex-1 text-[11px]">
                    <div className="flex items-center justify-between gap-1.5 animate-pulse">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                          {getLocalComplaintCategory(c.category, lang)}
                        </span>
                        {c.isDirectToMayor && (
                          <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-505/30 font-bold flex items-center gap-1 select-none">
                            <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse"></span>
                            {lang === "ky" ? "МЭРГЕ ТҮЗ" : "МЭРУ"}
                          </span>
                        )}
                      </div>
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[8.5px] font-bold ${
                          c.status === "in_progress"
                            ? "bg-amber-400/10 text-amber-400 border border-amber-400/20"
                            : "bg-sky-450/10 text-sky-400 border border-sky-455/20"
                        }`}
                      >
                        {getLocalStatus(c.status, lang)}
                      </span>
                    </div>
                    <p className="font-bold text-slate-200 mt-1.5 leading-snug line-clamp-2">
                      {getTranslateComplaintText(c.title, lang)}
                    </p>
                    <p className="text-slate-400 line-clamp-3 leading-relaxed mt-1">
                      {getTranslateComplaintText(c.description, lang)}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-550 mt-2 font-mono border-t border-slate-900 pt-1.5">
                      <span>{getLocalDistrict(c.district, lang).split(" ")[0]}</span>
                      <span>
                        {new Date(c.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="bg-slate-950 text-slate-400 text-[10px] rounded p-2.5 border border-slate-800/60 leading-relaxed flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <span>{t("cit.vote_help")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
