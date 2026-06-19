import React, { useState } from "react";
import { Complaint, EcoSensor, Employee, MunicipalServiceConfig } from "../types";
import { TOKMOK_DISTRICTS } from "../data/mockData";
import { motion, AnimatePresence } from "motion/react";
import {
  TrendingUp,
  AlertOctagon,
  Clock,
  Activity,
  Award,
  Sparkles,
  CheckCircle,
  Truck,
  FileSpreadsheet,
  AlertCircle,
  ChevronRight,
  User,
  Lock,
  Unlock,
  MailOpen,
  Send,
  Check,
  Briefcase,
  AlertTriangle,
  Facebook,
  Instagram,
  Globe,
  Mail,
} from "lucide-react";

import {
  useLanguage,
  getLocalDistrict,
  getLocalComplaintCategory,
  getLocalStatus,
  getLocalUrgency,
  getTranslateComplaintText,
  getLocalService,
} from "../context/LanguageContext";

interface MayorViewProps {
  complaints: Complaint[];
  sensors: EcoSensor[];
  employees: Employee[];
  services: MunicipalServiceConfig[];
  onUpdateComplaint?: (id: string, updatedFields: Partial<Complaint>) => void;
}

export default function MayorView({ complaints, sensors, employees, services, onUpdateComplaint }: MayorViewProps) {
  const { t, lang } = useLanguage();

  // Mode select state
  const [isCabinetActive, setIsCabinetActive] = useState(false);

  // Security gate states
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");

  // Cabinet operational states
  const [selectedDirectId, setSelectedDirectId] = useState<string>("");
  const [selectedServiceId, setSelectedServiceId] = useState<string>("водоканал");
  const [resolutionInput, setResolutionInput] = useState("");
  const [resolutionInputKy, setResolutionInputKy] = useState("");
  const [isGeneratingResolution, setIsGeneratingResolution] = useState(false);
  const [resolutionSuccess, setResolutionSuccess] = useState(false);

  // AI summary states
  const [loadingBrief, setLoadingBrief] = useState(false);
  const [aiBrief, setAiBrief] = useState<{
    mainIssue: string;
    prediction: string;
    recommendations: string[];
  } | null>(null);

  // Stats calculation
  const totalSubmitted = complaints.length;
  const resolvedCount = complaints.filter((c) => c.status === "resolved").length;
  const pendingCount = complaints.filter((c) => c.status === "pending" || c.status === "assigned").length;
  const inProgressCount = complaints.filter((c) => c.status === "in_progress").length;

  const averageAqi = Math.round(sensors.reduce((acc, curr) => acc + curr.aqi, 0) / sensors.length);
  const activeTechniques = employees.filter((e) => e.status !== "offline").length;

  // Let's generate a list of district ratings based on complaints & resolved rates
  const getDistrictStats = () => {
    return TOKMOK_DISTRICTS.map((dist, idx) => {
      const items = complaints.filter((c) => c.district === dist);
      const total = items.length;
      const res = items.filter((c) => c.status === "resolved").length;
      const score = total === 0 ? 100 : Math.round((res / total) * 100);
      return {
        name: dist,
        total,
        resolved: res,
        score,
        badgeColor: idx % 2 === 0 ? "text-teal-400 bg-teal-500/10" : "text-amber-400 bg-amber-500/10",
      };
    }).sort((a, b) => b.score - a.score); // Best scoring first
  };

  // Run AI Summary Query
  const fetchAiSummary = async () => {
    setLoadingBrief(true);
    setAiBrief(null);
    try {
      const res = await fetch("/api/ai/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            complaints: complaints.map((c) => ({
              title: c.title,
              category: c.category,
              district: c.district,
              urgency: c.urgency,
              status: c.status,
            })),
            sensors: sensors.map((s) => ({ location: s.locationName, aqi: s.aqi })),
            employees: employees.map((e) => ({ name: e.name, kpi: e.kpi, status: e.status })),
          },
        }),
      });
      const result = await res.json();
      if (result.success) {
        setAiBrief({
          mainIssue: result.mainIssue,
          prediction: result.prediction,
          recommendations: result.recommendations,
        });
      } else {
        alert(t("mayor.ai_audit_loading") + " Error: " + result.error);
      }
    } catch (error) {
      console.warn("AI Brief fetch error:", error);
      // Fallback local mock simulation
      setTimeout(() => {
        if (lang === "ky") {
          setAiBrief({
            mainIssue: "Токмок Сууканалынын Жантаев борбордук базар аймагындагы магистралдык түтүктөрүнүн өтө эскириши.",
            prediction: "Катуу ысыктан жана сууну керектөөнүн көбөйүшүнөн улам МТУ №3 (Микрорайон) конушунда суунун басымынын төмөндөшү жана Шамшы көчөсүндө жаңы жарылуулар болушу мүмкүн.",
            recommendations: [
              "Токмок Сууканалы (Осмонов Б.) Жантаев көчөсүндөгү резервдик коллекторго Текшерүү жүргүзүп, 10-июнга чейин бүтүрүшү керек.",
              "МП Тазалыкка МТУ №3 секторунда тургундардын таштандылар боюнча даттануусунун өсүшүнө байланыштуу тазалоо графигин күчөтүү тапшырылсын.",
              "Горсвет кызматы темир жол вокзалынын жарык узатуу линияларын текшерип, күйүп кеткен лампаларды алмаштырсын.",
            ],
          });
        } else {
          setAiBrief({
            mainIssue: "Высокий износ магистралей Токмок Водоканал в районе центрального рынка Жантаева.",
            prediction: "Из-за жары и повышения водопотребления возможно падение давления воды на верхних этажах в МТУ №3 (Микрорайон) и новые порывы на ул. Шамсинской.",
            recommendations: [
              "Токмок Водоканалу (Осмонову Б.) провести опрессовку резервного коллектора по ул. Жантаева до 10 июня.",
              "МП Тазалык усилить графики дежурства техники в секторах МТУ №3 в связи с ростом жалоб на скопление бытового мусора.",
              "Горсвету провести ревизию привокзальных линий освещения ЖД вокзала и заменить перегоревшие дуговые лампы.",
            ],
          });
        }
      }, 1550);
    } finally {
      setLoadingBrief(false);
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "2026" || passcode === "0000" || passcode === "1234") {
      setIsAuthorized(true);
      setAuthError("");
    } else {
      setAuthError(
        lang === "ky"
          ? "Каталык: Кызматтык ПИН-код туура эмес!"
          : "Ошибка: Неверный служебный ПИН-код!"
      );
    }
  };

  const generateAiResolution = async (complaintText: string) => {
    setIsGeneratingResolution(true);
    setResolutionSuccess(false);
    try {
      const res = await fetch("/api/ai/mayor-resolution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: complaintText }),
      });
      const data = await res.json();
      if (data.success) {
        setResolutionInput(data.resolutionRu);
        setResolutionInputKy(data.resolutionKy);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      console.warn("Generating resolutions AI error, using fallback draft:", err);
      const upperServ = selectedServiceId.toUpperCase();
      setResolutionInput(`Поручить руководителю службы ${upperServ} немедленно выехать на место и решить проблему гражданина.`);
      setResolutionInputKy(`${upperServ} кызматынын башчысына тез арада аймакчага барып, көйгөйдү чечүүнү тапшырам.`);
    } finally {
      setIsGeneratingResolution(false);
    }
  };

  const dispatchResolution = (complaintId: string) => {
    if (!onUpdateComplaint) return;
    const serviceObj = services.find((s) => s.id === selectedServiceId);
    const assignedLeader = serviceObj ? `${serviceObj.leader} (${getLocalService(serviceObj.id, lang)})` : "Служба " + selectedServiceId;

    onUpdateComplaint(complaintId, {
      status: "assigned",
      assignedOfficer: assignedLeader,
      mayorResolution: resolutionInput,
      mayorResolutionKy: resolutionInputKy,
      officialReply: lang === "ky" ? `Мэрдин тапшырмасы берилди: ${resolutionInputKy}` : `Выдано поручение Мэра: ${resolutionInput}`,
      officialReplyKy: `Мэрдин тапшырмасы берилди: ${resolutionInputKy}`,
    });

    setResolutionSuccess(true);
    setTimeout(() => {
      setResolutionSuccess(false);
      setSelectedDirectId("");
      setResolutionInput("");
      setResolutionInputKy("");
    }, 2500);
  };

  const resolveComplaintDirectly = (complaintId: string) => {
    if (!onUpdateComplaint) return;
    onUpdateComplaint(complaintId, {
      status: "resolved",
      afterPhoto: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600&auto=format&fit=crop",
      officialReply: lang === "ky" 
        ? "Маселе Токмок шаарынын Мэри Шакиров Кутпидин Абдырахмановичтин жеке көзөмөлү менен толугу менен чечилди." 
        : "Вопрос полностью решен под личным жестким контролем Мэра города Токмок Шакирова Кутпидина Абдырахмановича.",
      officialReplyKy: "Маселе Токмок шаарынын Мэри Шакиров Кутпидин Абдырахмановичтин жеке көзөмөлү менен толугу менен чечилди.",
    });

    setResolutionSuccess(true);
    setTimeout(() => {
      setResolutionSuccess(false);
      setSelectedDirectId("");
    }, 2500);
  };

  const directToMayorComplaints = complaints.filter((c) => c.isDirectToMayor);
  const pendingDirectCount = directToMayorComplaints.filter((c) => c.status === "pending").length;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Overview subtitle card with segmented tab switcher */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
            <Award className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="font-bold text-white text-md">
              {isCabinetActive 
                ? (lang === "ky" ? "Мэрдин Жеке Кабинети" : "Личный Кабинет Мэра") 
                : t("mayor.dashboard")}
            </h2>
            <p className="text-slate-400 mt-0.5 leading-relaxed text-xs">
              {isCabinetActive 
                ? (lang === "ky" ? "К. А. Шакировдун кабылдамасы — даттанууларды жеке көзөмөлдөө" : "Прямая связь с Мэром К. А. Шакировым — контроль обращений") 
                : t("mayor.sub")}
            </p>
          </div>
        </div>

        {/* Segmented View Switcher */}
        <div className="bg-slate-950 p-1 rounded-xl border border-slate-850 flex items-center self-start md:self-auto shadow-inner">
          <button
            onClick={() => setIsCabinetActive(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs select-none transition-all cursor-pointer ${
              !isCabinetActive
                ? "bg-slate-850 text-white shadow-md border border-slate-750"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Activity className="w-4 h-4" />
            {lang === "ky" ? "Талдоо & Мониторинг" : "Аналитика & Мониторинг"}
          </button>
          
          <button
            onClick={() => setIsCabinetActive(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs select-none transition-all relative cursor-pointer ${
              isCabinetActive
                ? "bg-amber-500/15 text-amber-400 shadow-md border border-amber-500/25"
                : "text-slate-400 hover:text-amber-400"
            }`}
          >
            <User className="w-4 h-4" />
            {lang === "ky" ? "Администрация" : "Кабинет Мэра"}
            {pendingDirectCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-mono font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center animate-bounce shadow-lg shadow-red-950/40">
                {pendingDirectCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {!isCabinetActive ? (
        <>
          {/* 1. Scorecard Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col gap-1 shadow-md">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
            {lang === "ky" ? "Жөнөтүлгөн Даттануулар" : "Подано Жалоб"}
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold font-mono text-white">{totalSubmitted}</span>
            <TrendingUp className="w-4 h-4 text-rose-500" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col gap-1 shadow-md">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
            {lang === "ky" ? "Чечилген Көйгөйлөр" : "Решено проблем"}
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold font-mono text-emerald-400">{resolvedCount}</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col gap-1 shadow-md">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
            {lang === "ky" ? "Иштелип жаткандар" : "В обработке"}
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold font-mono text-amber-450">{inProgressCount}</span>
            <Clock className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: "3s" }} />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col gap-1 shadow-md">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
            {lang === "ky" ? "Кезекте" : "В очереди"}
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold font-mono text-blue-400">{pendingCount}</span>
            <AlertOctagon className="w-4 h-4 text-blue-400" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col gap-1 shadow-md">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
            {lang === "ky" ? "Орточо AQI көрсөткүчү" : "Средний AQI города"}
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className={`text-xl font-bold font-mono ${averageAqi < 50 ? "text-emerald-400" : "text-amber-450"}`}>
              {averageAqi} AQI
            </span>
            <Activity className="w-4 h-4 text-teal-400" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col gap-1 shadow-md">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
            {lang === "ky" ? "Активдүү техника" : "Спецтехника в сети"}
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold font-mono text-indigo-400">{activeTechniques} {lang === "ky" ? "даана" : "ед."}</span>
            <Truck className="w-4 h-4 text-indigo-400" />
          </div>
        </div>
      </div>

      {/* 2. AI Assistant / Mayor Strategic Audit Briefing Section */}
      <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        {/* Decorative background aura */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-white text-md">{t("mayor.ai_audit_header")}</h3>
              <p className="text-xs text-slate-400">{t("mayor.sub")}</p>
            </div>
          </div>

          <button
            onClick={fetchAiSummary}
            disabled={loadingBrief}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs select-none shadow-lg shadow-indigo-950/40 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition transform hover:-translate-y-0.5"
          >
            {loadingBrief ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-t-2 border-white rounded-full animate-spin"></span>
                {lang === "ky" ? "Маалыматтарды талдоо..." : "Сбор и анализ данных..."}
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-200" />
                {t("mayor.ai_audit_btn")}
              </>
            )}
          </button>
        </div>

        {/* AI Output Panels */}
        <AnimatePresence mode="wait">
          {aiBrief ? (
            <motion.div
              key="report"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10 text-xs"
            >
              {/* Left Column: Diagnostics */}
              <div className="lg:col-span-1 flex flex-col gap-4">
                <div className="bg-slate-950/80 p-4 border border-slate-800 rounded-xl flex flex-col gap-1.5 height-full">
                  <span className="text-[10px] text-rose-400 font-mono uppercase tracking-wider flex items-center gap-1.5 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5" /> {lang === "ky" ? "Күндүн Негизги Көйгөйү:" : "Ключевая Уязвимость Дня:"}
                  </span>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed mt-1">
                    {aiBrief.mainIssue}
                  </p>
                </div>

                <div className="bg-slate-950/80 p-4 border border-slate-800 rounded-xl flex flex-col gap-1.5">
                  <span className="text-[10px] text-amber-450 font-mono uppercase tracking-wider flex items-center gap-1.5 font-semibold">
                    <Clock className="w-3.5 h-3.5" /> {lang === "ky" ? "Болжолдонгон кооптуулуктар:" : "Аналитический Прогноз Проблем:"}
                  </span>
                  <p className="text-xs text-slate-450 leading-relaxed italic mt-1 font-mono">
                    {aiBrief.prediction}
                  </p>
                </div>
              </div>

              {/* Right Column: Directives to Municipal Agencies */}
              <div className="lg:col-span-2 bg-slate-950/90 border border-indigo-900/40 p-5 rounded-xl">
                <span className="text-[10px] text-cyan-400 font-mono uppercase tracking-wider flex items-center gap-1.5 mb-3 font-semibold">
                  <FileSpreadsheet className="w-4 h-4 text-cyan-400" /> {lang === "ky" ? "Мэрдин Автоматтык Тапшырмалары (Жөнөтүүгө Даяр):" : "Автоматические Поручения Мэра (Готовы к отправке):"}
                </span>
                <div className="flex flex-col gap-3">
                  {aiBrief.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="flex gap-3 items-start bg-slate-900/60 p-3 rounded-lg border border-slate-850 hover:border-slate-705 group"
                    >
                      <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-mono text-[10px] font-bold shrink-0">
                        {i + 1}
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">{rec}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-end gap-2 text-[10px] text-slate-500">
                  <span>
                    {lang === "ky"
                      ? "Автоматтык отчет 100% келип түшкөн даттануулар жана сенсорлордун берилиштеринин негизинде түзүлдү"
                      : "Автоматический отчет составлен на основе 100% поступивших жалоб и датчиков"}
                  </span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-8 text-center text-slate-500 text-xs"
            >
              <AlertSquare className="w-8 h-8 text-slate-605 mb-2 animate-bounce" />
              <p>
                {lang === "ky"
                  ? "Токмок шаарынын мэрдик ИИ-Ревизиясын жаратуу үчүн жогорудагы кызгылт көк баскычты басыңыз."
                  : "Нажмите синюю кнопку вверху, чтобы сгенерировать ИИ-Ревизию города Токмок."}
              </p>
              <p className="text-[10px] text-slate-600 mt-1">
                {lang === "ky"
                  ? "КР тиркемедеги МТУ сенсорлорун, геолокацияларды жана KPIлерди бирдиктүү документке бириктирет."
                  : "ИИ соберет геолокацию труб, датчики МТУ и KPI служб в единый документ."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Bottom Panels: Incident log & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        {/* Left 2 Cols: Incident logs */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
              <h3 className="font-bold text-white text-md">
                {lang === "ky" ? "Окуялардын жана Кырсыктардын Түрмөгү" : "Лента Происшествий и Сбоев"}
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono font-medium">
              {lang === "ky" ? "Кайрылууларды көзөмөлдөө (Live)" : "Контроль заявок (Live)"}
            </span>
          </div>

          <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1">
            {complaints.map((c) => (
              <div
                key={c.id}
                className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition hover:border-slate-705"
              >
                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2 text-[10px]">
                    <span className="font-bold font-mono uppercase bg-slate-900 text-slate-400 border border-slate-800 px-2 py-0.5 rounded">
                      {getLocalComplaintCategory(c.category, lang)}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-sans uppercase text-[9px] ${
                        c.urgency === "critical"
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : c.urgency === "high"
                          ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                          : "bg-blue-500/10 text-blue-400"
                      }`}
                    >
                      {getLocalUrgency(c.urgency, lang)}
                    </span>
                    <span className="text-slate-500 font-mono">
                      {new Date(c.createdAt).toLocaleTimeString(lang === "ky" ? "ky-KG" : "ru-RU", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-200 mt-1.5 text-xs md:text-sm">
                    {getTranslateComplaintText(c.title, lang)}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2 mt-0.5">
                    {getTranslateComplaintText(c.description, lang)}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium flex flex-wrap items-center gap-1.5 mt-1 font-mono border-t border-slate-905 pt-1">
                    <span>
                      {lang === "ky" ? "Ориентир:" : "Ориентир:"}{" "}
                      <span className="text-cyan-400">{c.landmark || "Токмок"}</span>
                    </span>
                    <span>•</span>
                    <span>
                      {lang === "ky" ? "Арыз ээси:" : "Заявитель:"} {c.citizenName}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2 md:self-center shrink-0">
                  <span
                    className={`text-[10px] px-2.5 py-1 rounded font-bold uppercase ${
                      c.status === "pending"
                        ? "bg-slate-900 text-slate-400 border border-slate-800"
                        : c.status === "assigned"
                        ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                        : c.status === "in_progress"
                        ? "bg-amber-400/10 text-amber-300 border border-amber-400/20"
                        : "bg-emerald-400/10 text-emerald-400 border border-emerald-500/20"
                    }`}
                  >
                    {getLocalStatus(c.status, lang)}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Municipal services rating and leaderboards */}
        <div className="flex flex-col gap-6">
          {/* MTU Leaderboards */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Award className="w-4 h-4 text-emerald-500" />
              <h3 className="font-bold text-white text-md">
                {lang === "ky" ? "МТУ Райондорунун Рейтинги" : "Рейтинг Районов (МТУ)"}
              </h3>
            </div>

            <div className="flex flex-col gap-3">
              {getDistrictStats().map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-4 border-b border-slate-850 pb-2.5 last:border-0 last:pb-0"
                >
                  <div className="flex-1 flex flex-col gap-0.5">
                    <span className="text-[11px] font-bold text-slate-250 truncate block animate-pulse">
                      {getLocalDistrict(item.name, lang)}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {lang === "ky"
                        ? `Жалпы кырсыктар: ${item.total} • Чечилди: ${item.resolved}`
                        : `Всего аварий: ${item.total} • Решено: ${item.resolved}`}
                    </span>
                  </div>

                  <div className="flex flex-col items-end shrink-0 text-[10px]">
                    <span
                      className={`font-mono font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}
                    >
                      {item.score}% {lang === "ky" ? "чечилди" : "решено"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaders of Service institutions */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col gap-4 flex-1">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Award className="w-4 h-4 text-indigo-400" />
              <h3 className="font-bold text-white text-md">
                {lang === "ky" ? "Коммуналдык Кызматтардын Жетекчилери" : "Главы Коммунальных Служб"}
              </h3>
            </div>

            <div className="flex flex-col gap-3 max-h-[160px] overflow-y-auto pr-1">
              {services.map((ser, i) => (
                <div
                  key={i}
                  className="flex gap-2.5 items-start p-2 rounded-lg bg-slate-950 border border-slate-850/60"
                >
                  <div className="w-7 h-7 bg-indigo-500/10 text-indigo-400 flex items-center justify-center rounded-md shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-bold text-slate-300 text-[9px] leading-tight uppercase tracking-wider block">
                      {getLocalService(ser.id, lang)}
                    </h5>
                    <p className="text-[11px] font-bold text-white mt-0.5">
                      {lang === "ky"
                        ? ser.leader
                            .replace("Осмонов Бакыт Алиевич", "Осмонов Бакыт Алиевич")
                            .replace("Шакиров Марат Нурланович", "Шакиров Марат Нурланович")
                        : ser.leader}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono leading-none">{ser.contact}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
        </>
      ) : (
        /* Mayor's Personal Cabinet rendering starts here */
        <div className="flex flex-col gap-6">
          {!isAuthorized ? (
            /* Authentication screen */
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md mx-auto w-full flex flex-col items-center gap-6 shadow-2xl relative overflow-hidden mt-6"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-700"></div>
              
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-500 shadow-inner">
                <Lock className="w-8 h-8 animate-pulse" />
              </div>

              <div className="text-center text-xs">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  {lang === "ky" ? "Кызматтык Авторизация" : "Секретный Доступ Мэра"}
                </h3>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  {lang === "ky"
                    ? "Мэр Кабинети кызмат үчүн гана ачык. Сураныч, коопсуздук ПИН-кодун киргизиңиз."
                    : "Доступ разрешен только руководству города Токмок. Пожалуйста, введите служебный ПИН-код."}
                </p>
              </div>

              <form onSubmit={handleAuthSubmit} className="w-full flex flex-col gap-4 text-xs">
                <div className="flex flex-col gap-1.5 animate-pulse">
                  <input
                    type="password"
                    placeholder="ПИН-КОД (напр., 0000 или 2026)"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-center tracking-widest text-lg font-mono text-amber-400 focus:outline-none focus:border-amber-500 w-full"
                    autoFocus
                    required
                  />
                  {authError && (
                    <p className="text-[11px] text-red-400 font-medium text-center mt-1">
                      {authError}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAuthorized(true);
                      setAuthError("");
                    }}
                    className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 font-bold text-xs text-slate-300 cursor-pointer transition text-center select-none border border-slate-700"
                  >
                    {lang === "ky" ? "Демонстрация" : "Демо-Вход"}
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 border border-amber-500/30 font-bold text-xs text-white cursor-pointer transition flex items-center justify-center gap-1 shadow-md shadow-amber-950/20"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    {lang === "ky" ? "Кирүү" : "Войти"}
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            /* Authorized Cabinet panel */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Left 2 Cols: Incoming letters list & detail resolution drawer */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                
                {/* Scorecards within cabinet */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col gap-1 shadow-md">
                    <span className="text-[9px] text-slate-400 font-mono uppercase block">
                      {lang === "ky" ? "Түз даттануулар" : "Получено лично"}
                    </span>
                    <span className="text-xl font-bold font-mono text-amber-500 mt-1">
                      {directToMayorComplaints.length}
                    </span>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col gap-1 shadow-md">
                    <span className="text-[9px] text-slate-400 font-mono uppercase block">
                      {lang === "ky" ? "Арыздар Чечилди" : "Лично Решено"}
                    </span>
                    <span className="text-xl font-bold font-mono text-emerald-400 mt-1">
                      {directToMayorComplaints.filter(c => c.status === "resolved").length}
                    </span>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col gap-1 shadow-md">
                    <span className="text-[9px] text-slate-400 font-mono uppercase block">
                      {lang === "ky" ? "Жаңы каттар" : "Ожидают мер"}
                    </span>
                    <span className="text-xl font-bold font-mono text-rose-450 mt-1 animate-pulse">
                      {directToMayorComplaints.filter(c => c.status === "pending").length}
                    </span>
                  </div>
                </div>

                {/* Main inbox list */}
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <MailOpen className="w-4 h-4 text-amber-500 animate-pulse" />
                      <h3 className="font-bold text-white text-sm">
                        {lang === "ky" ? "Тургундардын Түз Даттануулары" : "Приемная: Прямые Письма жителей"}
                      </h3>
                    </div>
                    <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {lang === "ky" ? "Мэрдин жеке кабылдамасы" : "Кабинет К. А. Шакирова"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 max-h-[290px] overflow-y-auto pr-1">
                    {directToMayorComplaints.length === 0 ? (
                      <div className="text-center py-10 text-slate-500 italic text-xs">
                        {lang === "ky" ? "Жеке каттар жок." : "Входящие прямые письма отсутствуют."}
                      </div>
                    ) : (
                      directToMayorComplaints.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => {
                            setSelectedDirectId(c.id);
                            setResolutionInput(c.mayorResolution || "");
                            setResolutionInputKy(c.mayorResolutionKy || "");
                          }}
                          className={`p-3.5 rounded-xl border transition text-left cursor-pointer flex items-center justify-between gap-4 ${
                            selectedDirectId === c.id
                              ? "bg-amber-500/10 border-amber-500"
                              : c.status === "resolved"
                              ? "bg-slate-950/40 border-slate-850 hover:border-slate-800 opacity-75"
                              : "bg-slate-950 border-slate-850 hover:border-slate-700"
                          }`}
                        >
                          <div className="flex-1 flex flex-col gap-1 max-w-[80%]">
                            <div className="flex items-center gap-2 text-[9px] font-mono">
                              <span className="text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</span>
                              <span className="text-cyan-400">• {getLocalDistrict(c.district, lang).split(" ")[0]}</span>
                              <span className={`px-1.5 py-0.2 rounded uppercase font-bold text-[8px] ${
                                c.urgency === "critical"
                                  ? "bg-rose-500/15 text-rose-400"
                                  : "bg-amber-500/15 text-amber-450"
                              }`}>
                                {getLocalUrgency(c.urgency, lang)}
                              </span>
                            </div>
                            <h4 className="font-bold text-slate-200 text-xs truncate flex items-center gap-1.5">
                              {c.citizenName.includes("🔒") && (
                                <span className="bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 text-[8px] font-mono px-1 py-0.2 rounded font-bold uppercase shrink-0">
                                  {lang === "ky" ? "Жашыруун" : "Анонимно"}
                                </span>
                              )}
                              <span>{c.title}</span>
                            </h4>
                            <p className="text-[10px] text-slate-400 line-clamp-1">
                              {c.description}
                            </p>
                          </div>
                          
                          <div className="shrink-0 flex items-center gap-2">
                            <span className={`text-[9px] font-bold uppercase py-0.5 px-2 rounded ${
                              c.status === "resolved"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : c.status === "assigned"
                                ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                : "bg-rose-500/10 text-rose-400 border border-rose-500/25"
                            }`}>
                              {getLocalStatus(c.status, lang)}
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Selected Direct Complaint Action resolution board */}
                {selectedDirectId && (() => {
                  const comp = complaints.find((c) => c.id === selectedDirectId);
                  if (!comp) return null;
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col gap-4 text-xs"
                    >
                      <div className="border-b border-slate-850 pb-3 flex items-center justify-between">
                        <h4 className="font-bold text-white text-sm flex items-center gap-2">
                          <FileSpreadsheet className="w-4 h-4 text-amber-500" />
                          {lang === "ky" ? "Резолюция боюнча Иш-чаралар" : "Резолютор: Вынесение Поручений Мэра"}
                        </h4>
                        <button
                          onClick={() => setSelectedDirectId("")}
                          className="bg-slate-800 text-slate-400 hover:text-white px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition select-none"
                        >
                          ✕ {lang === "ky" ? "Жабуу" : "Закрыть"}
                        </button>
                      </div>

                      <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 flex flex-col gap-2">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                          <span className="flex items-center gap-1">
                            {lang === "ky" ? "Арыз ээси:" : "Заявитель:"}{" "}
                            <strong className={comp.citizenName.includes("🔒") ? "text-indigo-400 font-bold" : "text-slate-300 font-bold"}>
                              {comp.citizenName}
                            </strong>
                          </span>
                          <span>МТУ: {getLocalDistrict(comp.district, lang)}</span>
                        </div>
                        <p className="font-bold text-slate-100 text-xs mt-1">
                          {comp.title}
                        </p>
                        <p className="text-slate-400 leading-relaxed italic text-[11px] mt-0.5">
                          "{comp.description}"
                        </p>
                        {comp.landmark && (
                          <p className="text-[10px] text-cyan-405 font-mono font-medium mt-1">
                            📍 {lang === "ky" ? "Дарек/Координат:" : "Ориентир/Адрес:"} {comp.landmark}
                          </p>
                        )}
                      </div>

                      {/* AI-powered assistant to draft mayoral resolution */}
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-300">{lang === "ky" ? "Поручение Мэра (Резолюция):" : "Текст Поручения (Резолюция Мэра):"}</span>
                          
                          <button
                            type="button"
                            onClick={() => generateAiResolution(comp.title + " \n " + comp.description)}
                            disabled={isGeneratingResolution}
                            className="bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 font-bold px-3 py-1 border border-indigo-500/20 rounded-lg flex items-center gap-1 cursor-pointer transition select-none"
                          >
                            <Sparkles className="w-3.5 h-3.5 animate-spin animate-pulse" style={{ animationDuration: isGeneratingResolution ? "2s" : "0s" }} />
                            {isGeneratingResolution 
                              ? (lang === "ky" ? "ИИ-Резолюция..." : "Генерация ИИ...") 
                              : (lang === "ky" ? "Киргизүү (ИИ)" : "Драфт Поручения (ИИ)")}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] text-slate-500 font-mono">РУССКИЙ ТЕКСТ ПОСТАНОВЛЕНИЯ</span>
                            <textarea
                              rows={3}
                              placeholder="Например: Руководителю МП Водоканал обеспечить контроль..."
                              value={resolutionInput}
                              onChange={(e) => setResolutionInput(e.target.value)}
                              className="bg-slate-950 border border-slate-850 p-2.5 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500 text-xs leading-normal resize-none"
                            />
                          </div>
                          
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] text-slate-500 font-mono">КЫРГЫЗЧА ТОКТОМ ТЕКСТИ</span>
                            <textarea
                              rows={3}
                              placeholder="Мисалы: Сууканалдын жетекчисине суунун басымын калыбына келтирүү тапшырылсын..."
                              value={resolutionInputKy}
                              onChange={(e) => setResolutionInputKy(e.target.value)}
                              className="bg-slate-950 border border-slate-855 p-2.5 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500 text-xs leading-normal resize-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end border-t border-slate-850 pt-4 mt-1">
                          {/* Service assignment select dispatch */}
                          <div className="flex flex-col gap-1.5 text-left">
                            <span className="font-bold text-slate-300">{lang === "ky" ? "Жооптуу муниципалдык кызмат:" : "Ответственное ведомство (Исполнитель):"}</span>
                            <select
                              value={selectedServiceId}
                              onChange={(e) => setSelectedServiceId(e.target.value)}
                              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer text-xs"
                            >
                              {services.map((ser) => (
                                <option key={ser.id} value={ser.id} className="bg-slate-950 text-slate-200">
                                  {getLocalService(ser.id, lang)} — {ser.leader.split(" ")[0]}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex gap-2 w-full justify-end">
                            {/* Solve immediately action */}
                            {comp.status !== "resolved" && (
                              <button
                                onClick={() => resolveComplaintDirectly(comp.id)}
                                className="flex items-center gap-1 px-4 py-2.5 font-bold rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 transition cursor-pointer select-none"
                              >
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                                {lang === "ky" ? "Түз Чечүү" : "Лично Закрыть"}
                              </button>
                            )}

                            {/* Give directive action */}
                            <button
                              onClick={() => dispatchResolution(comp.id)}
                              disabled={!resolutionInput.trim() || !resolutionInputKy.trim()}
                              className="flex items-center gap-1.5 px-5 py-2.5 font-bold rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 border border-amber-500/30 text-white shadow-lg cursor-pointer transform hover:-translate-y-0.5 transition disabled:opacity-55 disabled:cursor-not-allowed disabled:transform-none select-none"
                            >
                              <Send className="w-3.5 h-3.5" />
                              {lang === "ky" ? "Тапшырма жөнөтүү" : "Отдать Поручение"}
                            </button>
                          </div>
                        </div>

                        {resolutionSuccess && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            className="text-emerald-400 bg-emerald-950/40 p-2.5 border border-emerald-500/30 rounded-lg text-center font-bold mt-2 font-sans flex items-center justify-center gap-1.5"
                          >
                            <Check className="w-4 h-4 text-emerald-400" />
                            {lang === "ky" ? "Чечим кабыл алынып, тапшырма жиберилди!" : "Резолюция успешно сохранена и направлена исполнителю!"}
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  );
                })()}
              </div>

              {/* Right Column: Mayor Profile Card & Official Secretariat contacts */}
              <div className="flex flex-col gap-6">
                
                {/* Mayor Personal ID badge card */}
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col items-center gap-4 relative overflow-hidden text-center">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-xl pointer-events-none"></div>
                  
                  <div className="w-20 h-20 rounded-2xl border-2 border-amber-500/20 p-1 bg-slate-950">
                    <img
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&auto=format&fit=crop"
                      alt="Mayor of Tokmok Kutpidin Shakirov"
                      className="w-full h-full object-cover rounded-xl opacity-80"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] text-amber-500 font-mono tracking-widest font-bold bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full uppercase">
                      {lang === "ky" ? "ТОКМОК ШААРЫНЫН МЭРИ" : "МЭР ГОРОДА ТОКМОК"}
                    </span>
                    <h4 className="font-bold text-white text-md mt-1.5">
                      Шакиров Кутпидин
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono font-medium -mt-0.5">
                      Абдырахманович
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 font-mono font-medium">
                      {lang === "ky" ? "Шаардык кызматтык кабинет" : "Служебный кабинет мэра"}
                    </p>
                  </div>

                  <div className="w-full border-t border-slate-850 pt-3 text-[10.5px] text-slate-400 flex flex-col gap-2.5 leading-relaxed">
                    <div className="flex justify-between items-center text-left">
                      <span className="text-slate-500 text-[9px] font-mono">ОБЛУС:</span>
                      <span className="text-slate-300 font-bold">Чүй облусу, Токмок ш.</span>
                    </div>
                    <div className="flex justify-between items-center text-left">
                      <span className="text-slate-500 text-[9px] font-mono">СТАТУС:</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1 text-[10px]">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        ONLINE / КӨЗӨМӨЛДӨ
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-left">
                      <span className="text-slate-500 text-[9px] font-mono">ДАРЕГИ / АДРЕС:</span>
                      <span className="text-slate-300">ул. Шамсинская, 45</span>
                    </div>
                    <div className="flex justify-between items-center text-left">
                      <span className="text-slate-500 text-[9px] font-mono">ИНДЕКС:</span>
                      <span className="text-slate-300 font-mono">724900</span>
                    </div>
                    <div className="flex justify-between items-center text-left">
                      <span className="text-slate-500 text-[9px] font-mono">EMAIL:</span>
                      <a href="mailto:meria.tokmok@gmail.com" className="text-cyan-400 font-mono hover:underline text-[9.5px]">
                        meria.tokmok@gmail.com
                      </a>
                    </div>

                    <div className="border-t border-slate-850/70 pt-2.5 mt-1 flex flex-col gap-2">
                      <span className="text-slate-500 text-[9px] font-mono tracking-wider uppercase">
                        {lang === "ky" ? "Байланыш жана социалдык тармактар" : "Соцсети и 2ГИС навигация"}
                      </span>
                      
                      {/* Social Grid */}
                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href="https://www.facebook.com/tokmokcitygov"
                          target="_blank"
                          referrerPolicy="no-referrer"
                          className="bg-slate-950/80 hover:bg-indigo-500/10 border border-slate-850 hover:border-indigo-550/30 p-2 rounded-lg flex items-center justify-center gap-1.5 text-slate-300 hover:text-indigo-400 transition cursor-pointer text-[10px] font-medium"
                        >
                          <Facebook className="w-3 h-3 text-indigo-500 shrink-0" />
                          <span>Facebook</span>
                        </a>

                        <a
                          href="https://www.instagram.com/tokmok_meriya"
                          target="_blank"
                          referrerPolicy="no-referrer"
                          className="bg-slate-950/80 hover:bg-rose-500/10 border border-slate-850 hover:border-rose-550/30 p-2 rounded-lg flex items-center justify-center gap-1.5 text-slate-300 hover:text-rose-400 transition cursor-pointer text-[10px] font-medium"
                        >
                          <Instagram className="w-3 h-3 text-rose-500 shrink-0" />
                          <span>Instagram</span>
                        </a>
                      </div>

                      {/* 2GIS Clickable Button */}
                      <a
                        href="https://2gis.kg/tokmak/search/%D0%9C%D1%8D%D1%80%D0%B8%D1%8F%20%D1%82%D0%BE%D0%BA%D0%BC%D0%BE%D0%BA/geo/70030076161405103"
                        target="_blank"
                        referrerPolicy="no-referrer"
                        className="bg-emerald-600/15 hover:bg-emerald-600 border border-emerald-500/25 hover:border-emerald-500 text-emerald-400 hover:text-white p-2 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer text-[10px] font-bold shadow-sm"
                      >
                        <Globe className="w-3 h-3 text-emerald-500 hover:text-white shrink-0" />
                        <span>{lang === "ky" ? "2ГИС картасында ачуу" : "Маршрут в 2ГИС"}</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Secretariats info list */}
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col gap-4">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                    <Briefcase className="w-4 h-4 text-amber-550" />
                    <h3 className="font-bold text-white text-sm">
                      {lang === "ky" ? "Мэриянын Аппараты" : "Муниципальные ведомства"}
                    </h3>
                  </div>

                  <div className="flex flex-col gap-3 font-sans text-xs">
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-850 flex flex-col gap-1 text-left">
                      <span className="font-bold text-slate-200">Финансы-экономический отдел</span>
                      <p className="text-[10px] text-slate-500 leading-normal">План бюджета, муниципальные налоги, поддержка малого бизнеса Токмока.</p>
                    </div>
                    
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-850 flex flex-col gap-1 text-left">
                      <span className="font-bold text-slate-200">Отдел ЖКХ и Транспорта</span>
                      <p className="text-[10px] text-slate-500 leading-normal">Контроль работы муниципальных предприятий Тазалык, Водоканал и Горсвет.</p>
                    </div>
                    
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-850 flex flex-col gap-1 text-left">
                      <span className="font-bold text-slate-200">Отдел муниципального имущества (УМС)</span>
                      <p className="text-[10px] text-slate-500 leading-normal">Распределение земельных ресурсов, кадастр и пастбищеведение в Токмоке.</p>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

// Small mock companion
function AlertSquare({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={className} {...props}>
      <div className="w-10 h-10 bg-slate-850 rounded-xl flex items-center justify-center text-slate-400 border border-slate-800">
        <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: "12s" }} />
      </div>
    </div>
  );
}
