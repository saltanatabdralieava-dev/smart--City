import React, { useState } from "react";
import { Complaint, ComplaintCategory, MunicipalServiceConfig } from "../types";
import { motion, AnimatePresence } from "motion/react";
import {
  Wrench,
  CheckCircle,
  Clock,
  Sparkles,
  Phone,
  Layers,
  CheckSquare,
  FileImage,
  Globe,
} from "lucide-react";

import {
  useLanguage,
  getLocalService,
  getLocalComplaintCategory,
  getLocalStatus,
  getLocalUrgency,
  getTranslateComplaintText,
} from "../context/LanguageContext";

interface ServicesViewProps {
  complaints: Complaint[];
  services: MunicipalServiceConfig[];
  onUpdateComplaint: (id: string, updatedFields: Partial<Complaint>) => void;
}

export default function ServicesView({ complaints, services, onUpdateComplaint }: ServicesViewProps) {
  const { t, lang } = useLanguage();

  // Currently logged-in active municipal service account
  const [activeServiceId, setActiveServiceId] = useState<ComplaintCategory>("водоканал");

  // Selected ticket being handled in detail box
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);

  // Operator input details for resolution
  const [operatorComment, setOperatorComment] = useState("");
  const [isDraftingAnswer, setIsDraftingAnswer] = useState(false);
  const [aiResponseText, setAiResponseText] = useState<{
    textRu: string;
    textKy: string;
  } | null>(null);

  // Pre-seeded beautiful Unsplash aftermath simulation photos (Repaired streets, new pipes)
  const afterSamplePics = [
    {
      title: lang === "ky" ? "Ширетилген жапжаңы түтүк" : "Заваренная чистая труба",
      url: "https://images.unsplash.com/photo-1581094288338-2314dddb7eed?q=80&w=300&auto=format&fit=crop",
    },
    {
      title: lang === "ky" ? "Жаңы тегиз асфальт" : "Новый ровный асфальт",
      url: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=300&auto=format&fit=crop",
    },
    {
      title: lang === "ky" ? "Тазаланган жаңы таштанды челектер" : "Убранные новые мусорные баки",
      url: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=300&auto=format&fit=crop",
    },
    {
      title: lang === "ky" ? "Жаңы көчө фонары" : "Горящий отремонтированный уличный фонарь",
      url: "https://images.unsplash.com/photo-1542640244-7e672d6cef21?q=80&w=300&auto=format&fit=crop",
    },
  ];
  const [selectedAfterPhoto, setSelectedAfterPhoto] = useState(afterSamplePics[0].url);

  const activeServiceDetails = services.find((s) => s.id === activeServiceId);

  // Tickets matching category
  const activeServiceComplaints = complaints.filter((c) => c.category === activeServiceId);

  // Server-side Gemini auto-composing formal letter
  const draftAiOfficialResponse = async (complaintText: string) => {
    if (!operatorComment.trim()) {
      alert(
        lang === "ky"
          ? "Өтүнүч, адегенде аткарылган жумуштун техникалык мүнөздөмөсүн жазыңыз."
          : "Сначала кратко введите технический лог проведенных работ."
      );
      return;
    }
    setIsDraftingAnswer(true);
    setAiResponseText(null);

    try {
      const res = await fetch("/api/ai/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          complaint: complaintText,
          serviceComment: operatorComment,
        }),
      });
      const result = await res.json();
      if (result.success) {
        setAiResponseText({
          textRu: result.textRu,
          textKy: result.textKy,
        });
      } else {
        alert(t("svc.ai_gen_loading") + " Error: " + result.error);
      }
    } catch (err: any) {
      console.warn("Drafter endpoint err:", err);
      // Fallback response composer
      setTimeout(() => {
        setAiResponseText({
          textRu: `Уважаемый житель! Силами ГУП '${activeServiceDetails?.name}' по Вашему обращению были проведены оперативно-восстановительные работы. Специалисты оперативно выехали на место и завершили устранение неполадок: ${operatorComment}. Благодарим Вас за сигнал!`,
          textKy: `Урматтуу шаар тургуну! Сиздин кайрылууңуз боюнча '${activeServiceDetails?.name}' кызматкерлери тарабынан тиешелүү жумуштар жүргүзүлдү. Кабарлаган маселе толугу менен чечилди: ${operatorComment}. Коопсуздук чаралары калыбына келтирилди. Жарандык жигердүүлүгүңүз үчүн рахмат!`,
        });
      }, 1000);
    } finally {
      setIsDraftingAnswer(false);
    }
  };

  const handleClaimTicket = (complaintId: string) => {
    onUpdateComplaint(complaintId, {
      status: "in_progress",
      assignedOfficer: `Бригада ${activeServiceDetails?.name}`,
    });
  };

  const handleResolveAndSubmit = (complaintId: string) => {
    onUpdateComplaint(complaintId, {
      status: "resolved",
      afterPhoto: selectedAfterPhoto,
      officialReply: aiResponseText?.textRu || `Работы по обращению завершены: ${operatorComment}`,
      officialReplyKy: aiResponseText?.textKy || `Кайрылуу боюнча тиешелүү жумуштар аткарылды: ${operatorComment}`,
    });
    setSelectedComplaintId(null);
    setOperatorComment("");
    setAiResponseText(null);
  };

  const selectedComplaint = complaints.find((c) => c.id === selectedComplaintId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* 1. Left service accounts switcher sidebar */}
      <div className="lg:col-span-1 flex flex-col gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl flex flex-col gap-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-450 font-semibold mb-2 block">
            {t("svc.title")}
          </span>

          <div className="flex flex-col gap-1.5 max-h-[450px] overflow-y-auto pr-1">
            {services.map((ser, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveServiceId(ser.id);
                  setSelectedComplaintId(null);
                  setOperatorComment("");
                  setAiResponseText(null);
                }}
                className={`w-full text-left p-3 rounded-xl border flex flex-col gap-1 transition ${
                  activeServiceId === ser.id
                    ? "bg-indigo-650 border-indigo-500 text-white shadow-md shadow-indigo-950/20"
                    : "bg-slate-950 border-slate-850 hover:border-slate-800 text-slate-400 hover:bg-slate-900 cursor-pointer"
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="text-[11px] font-bold uppercase truncate max-w-[85%]">
                    {getLocalService(ser.id, lang).replace("Токмок ", "")}
                  </span>
                  <span className="text-[8px] font-mono tracking-wider bg-slate-900 px-1.5 py-0.5 rounded text-slate-300">
                    {complaints.filter((c) => c.category === ser.id && c.status !== "resolved").length}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] mt-0.5 opacity-80">
                  <span className="truncate">{ser.leader.split(" ")[0]} ...</span>
                  <span className="font-mono">KPI: 92%</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Middle column: active tickets list for the selected service */}
      <div className="lg:col-span-1.5 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col gap-4">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="font-bold text-white text-md">{t("svc.task_registry")}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{getLocalService(activeServiceId, lang)}</p>
        </div>

        {/* Contact info element */}
        {activeServiceDetails && (
          <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl flex items-center justify-between text-[11px]">
            <div className="flex flex-col">
              <span className="text-slate-455 font-bold block">{t("svc.contact_person")}</span>
              <span className="text-white mt-0.5">{activeServiceDetails.leader}</span>
            </div>
            <div className="flex items-center gap-1.5 text-indigo-400 font-mono font-bold bg-indigo-500/10 px-2 py-1 rounded">
              <Phone className="w-3.5 h-3.5" />
              {activeServiceDetails.contact.split(" ")[2] || "6-12-03"}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 overflow-y-auto max-h-[380px] pr-1">
          {activeServiceComplaints.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs flex flex-col items-center justify-center gap-2">
              <CheckSquare className="w-8 h-8 text-slate-750" />
              <p>{t("svc.empty_tasks")}</p>
              <p className="text-[10px] text-slate-650">{t("svc.empty_desc")}</p>
            </div>
          ) : (
            activeServiceComplaints.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  setSelectedComplaintId(c.id);
                  setOperatorComment("");
                  setAiResponseText(null);
                }}
                className={`p-3 rounded-xl border transition cursor-pointer select-none flex flex-col gap-1.5 ${
                  selectedComplaintId === c.id
                    ? "bg-slate-950 border-indigo-500 shadow-md shadow-slate-950/40"
                    : c.status === "resolved"
                    ? "bg-slate-950/40 border-slate-850 opacity-60 hover:opacity-100"
                    : "bg-slate-950 border-slate-855 hover:border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between gap-2.5">
                  <span
                    className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                      c.urgency === "critical"
                        ? "bg-red-500/15 text-red-400 border border-red-500/20"
                        : "bg-slate-900 border border-slate-800 text-slate-400"
                    }`}
                  >
                    {getLocalUrgency(c.urgency, lang)}
                  </span>
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      c.status === "pending"
                        ? "bg-slate-600"
                        : c.status === "assigned"
                        ? "bg-sky-505"
                        : c.status === "in_progress"
                        ? "bg-amber-400 animate-pulse"
                        : "bg-emerald-555"
                    }`}
                    title={c.status}
                  ></span>
                </div>
                <h4 className="font-bold text-slate-200 text-xs leading-snug line-clamp-2">
                  {getTranslateComplaintText(c.title, lang)}
                </h4>
                <p className="text-slate-400 text-[10px] truncate">{c.landmark}</p>
                <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 mt-2">
                  <span>{c.citizenName.split(" ")[0]}</span>
                  <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 3. Right column: selected ticket details handling execution and AI composition */}
      <div className="lg:col-span-1.5 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col gap-4">
        <div className="border-b border-slate-800 pb-3 mb-1">
          <h3 className="font-bold text-white text-md">{t("svc.operator")}</h3>
          <p className="text-xs text-slate-400">{t("svc.operator_sub")}</p>
        </div>

        <AnimatePresence mode="wait">
          {selectedComplaint ? (
            <motion.div
              key={selectedComplaint.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col gap-4 text-xs"
            >
              <div className="bg-slate-950 p-3.5 border border-slate-850 rounded-xl flex flex-col gap-2 leading-relaxed">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-405">
                    {selectedComplaint.id}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(selectedComplaint.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="font-bold text-white text-xs">
                  {getTranslateComplaintText(selectedComplaint.title, lang)}
                </h4>
                <p className="text-slate-300 italic">"{getTranslateComplaintText(selectedComplaint.description, lang)}"</p>
                <div className="text-[10px] text-slate-400 border-t border-slate-850 pt-2 mt-1 font-mono">
                  {lang === "ky" ? "Район" : "Район"}: {selectedComplaint.district} • Ориентир: {selectedComplaint.landmark}
                </div>
              </div>

              {/* Action buttons based on current state */}
              {selectedComplaint.status === "pending" || selectedComplaint.status === "assigned" ? (
                <button
                  onClick={() => handleClaimTicket(selectedComplaint.id)}
                  className="w-full flex items-center justify-center gap-1.5 p-3 rounded-xl bg-indigo-600 hover:bg-indigo-505 font-bold font-sans text-white text-xs shadow-md shadow-indigo-950/20 cursor-pointer transform hover:-translate-y-0.5 transition-all text-xs"
                >
                  <Clock className="w-4 h-4 animate-spin" style={{ animationDuration: "3s" }} />
                  {t("svc.claim_btn")}
                </button>
              ) : selectedComplaint.status === "in_progress" ? (
                <div className="flex flex-col gap-4">
                  {/* Resolution Input field logs */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-350 font-medium text-[11px] flex items-center justify-between">
                      <span>{t("svc.tech_desc")}</span>
                      <span className="text-[9px] text-slate-500">{t("svc.tech_desc_help")}</span>
                    </label>
                    <input
                      type="text"
                      placeholder={t("svc.tech_placeholder")}
                      value={operatorComment}
                      onChange={(e) => setOperatorComment(e.target.value)}
                      className="bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-550 transition-colors text-xs"
                      required
                    />
                  </div>

                  {/* Photo after simulation */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-300 font-medium text-[11px] flex items-center gap-1">
                      <FileImage className="w-3.5 h-3.5 text-slate-450" /> {t("svc.photo_after")}
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {afterSamplePics.map((pic, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedAfterPhoto(pic.url)}
                          className={`relative cursor-pointer h-12 rounded-lg overflow-hidden border-2 transition-all ${
                            selectedAfterPhoto === pic.url
                              ? "border-emerald-500 scale-95 shadow-md shadow-emerald-950/30"
                              : "border-slate-850 hover:border-slate-800 opacity-60"
                          }`}
                        >
                          <img src={pic.url} alt={pic.title} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Composition button trigger */}
                  <div className="flex flex-col gap-3 border-t border-slate-850 pt-3 mt-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-400 font-mono uppercase font-semibold">
                        {t("svc.response_label")}
                      </span>
                      <button
                        type="button"
                        onClick={() => draftAiOfficialResponse(selectedComplaint.description)}
                        disabled={isDraftingAnswer || !operatorComment.trim()}
                        className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 hover:text-indigo-350 transition-colors bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 disabled:opacity-50"
                      >
                        {isDraftingAnswer ? (
                          t("svc.ai_gen_loading")
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3 text-cyan-200" />
                            {t("svc.ai_gen_btn")}
                          </>
                        )}
                      </button>
                    </div>

                    {/* AI Output responses text */}
                    <AnimatePresence>
                      {aiResponseText && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="bg-slate-950 p-3 rounded-lg border border-indigo-950 flex flex-col gap-2.5 max-h-[160px] overflow-y-auto pr-1"
                        >
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-300 border-b border-indigo-950/45 pb-1">
                            <Globe className="w-3.5 h-3.5 text-cyan-400" /> {t("svc.ai_dual_lang")}
                          </div>
                          <div>
                            <span className="text-[8px] font-mono text-slate-500 block">НА РУССКОМ:</span>
                            <p className="text-[10px] leading-relaxed text-slate-350 mt-0.5">{aiResponseText.textRu}</p>
                          </div>
                          <div className="border-t border-slate-900/60 pt-1.5">
                            <span className="text-[8px] font-mono text-slate-500 block">КЫРГЫЗ ТИЛИНДЕ:</span>
                            <p className="text-[10px] leading-relaxed text-slate-350 mt-0.5 font-sans">{aiResponseText.textKy}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Final Submission confirmation */}
                    <button
                      onClick={() => handleResolveAndSubmit(selectedComplaint.id)}
                      className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950/20 cursor-pointer transform hover:-translate-y-0.5 transition-all text-xs"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-100" />
                      {t("svc.submit_resolve")}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-950/40 p-4 border border-emerald-500/20 rounded-xl flex flex-col gap-2 text-emerald-400">
                  <div className="flex items-center gap-1.5 font-bold font-mono uppercase text-[9px] tracking-wider text-emerald-350">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> {t("svc.resolved_success")}
                  </div>
                  <p className="text-[10px] leading-relaxed text-slate-400">{t("svc.resolved_desc")}</p>
                  {selectedComplaint.afterPhoto && (
                    <div className="h-16 rounded-lg overflow-hidden border border-emerald-900 mt-1">
                      <img src={selectedComplaint.afterPhoto} alt="Done" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ) : (
            <div className="py-24 text-center text-slate-550 text-xs flex flex-col items-center justify-center gap-2">
              <Layers className="w-8 h-8 text-slate-800" />
              <p>{t("svc.empty_handler")}</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
