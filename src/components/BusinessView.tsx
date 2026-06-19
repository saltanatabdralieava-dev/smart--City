import React from "react";
import {
  Coins,
  Building2,
  TrendingUp,
  Cpu,
  Handshake,
} from "lucide-react";

import { useLanguage } from "../context/LanguageContext";

export default function BusinessView() {
  const { t, lang } = useLanguage();

  const models = [
    {
      title: t("biz.model_1_title"),
      desc: t("biz.model_1_desc"),
      icon: <Building2 className="w-5 h-5 text-rose-500" />,
      margin: lang === "ky" ? "$1,500 / айына баштап" : "от $1,500 / месяц",
    },
    {
      title: t("biz.model_2_title"),
      desc: t("biz.model_2_desc"),
      icon: <Cpu className="w-5 h-5 text-indigo-400" />,
      margin: lang === "ky" ? "компаниядан $350 / айына чейин" : "до $350 / мес с компании",
    },
    {
      title: t("biz.model_3_title"),
      desc: t("biz.model_3_desc"),
      icon: <TrendingUp className="w-5 h-5 text-teal-400" />,
      margin: lang === "ky" ? "+30% негизги тарифке" : "+30% к основному тарифу",
    },
  ];

  const milestones = [
    {
      step: lang === "ky" ? "1-кадам: Продуктунун MVPси" : "Шаг 1: MVP Продукта",
      status: lang === "ky" ? "Аткарылды (Реактивдүү)" : "Выполнено (Реактив)",
      date: lang === "ky" ? "Июнь 2026" : "Июнь 2026",
    },
    {
      step: lang === "ky" ? "2-кадам: Токмоктогу пилоттук ишке киргизүү" : "Шаг 2: Пилотный запуск Tokmok",
      status: lang === "ky" ? "Киргизүү" : "Внедрение",
      date: lang === "ky" ? "Август 2026" : "Август 2026",
    },
    {
      step: lang === "ky" ? "3-кадам: Чүй облусу боюнча масштабдоо (Кант, Кара-Балта)" : "Шаг 3: Масштабирование по Чуйской области (Кант, Кара-Балта)",
      status: lang === "ky" ? "Пландоо" : "Планирование",
      date: lang === "ky" ? "Пландан тышкары" : "Вне плана",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Monetization blocks */}
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col gap-6 text-xs">
        <div>
          <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <Coins className="w-5.5 h-5.5 text-rose-500 animate-bounce" /> {t("biz.title")}
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            {t("biz.desc")}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {models.map((mod, i) => (
            <div
              key={i}
              className="bg-slate-950 border border-slate-850 hover:border-slate-750 p-4 rounded-xl flex items-start gap-4 transition"
            >
              <div className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center shrink-0">
                {mod.icon}
              </div>
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <h4 className="font-bold text-white text-sm">{mod.title}</h4>
                  <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-[10px]">
                    {mod.margin}
                  </span>
                </div>
                <p className="text-slate-400 leading-relaxed mt-2">{mod.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Startup roadmap details */}
      <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col gap-6 text-xs">
        <div>
          <h3 className="font-bold text-white text-md">{t("biz.roadmap_title")}</h3>
          <p className="text-xs text-slate-400 mt-1">{t("biz.roadmap_sub")}</p>
        </div>

        <div className="flex flex-col gap-4 relative">
          {/* Vertical dash line */}
          <span className="absolute left-[13px] top-4 bottom-4 w-[1px] border-l border-dashed border-slate-800 pointer-events-none"></span>

          {milestones.map((mil, idx) => (
            <div key={idx} className="flex gap-3 items-start relative z-10 text-xs text-xs">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 border ${
                idx === 0
                  ? "bg-rose-500/10 text-rose-450 border-rose-500/30"
                  : idx === 1
                  ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                  : "bg-slate-950 text-slate-500 border-slate-850"
              }`}>
                0{idx + 1}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                  <h4 className="font-bold text-slate-200">{mil.step}</h4>
                  <span className="text-[9px] font-mono font-bold text-slate-400 underline">
                    {mil.date}
                  </span>
                </div>
                <p className="text-slate-450 text-[11px] mt-0.5">{mil.status}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic call out */}
        <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col gap-3 mt-auto">
          <div className="flex items-center gap-1.5 text-xs text-white font-bold uppercase tracking-wider">
            <Handshake className="w-4 h-4 text-rose-500" /> {t("biz.goal_title")}
          </div>
          <p className="text-[11px] leading-relaxed text-slate-450">
            {t("biz.goal_desc")}
          </p>
        </div>
      </div>
    </div>
  );
}
