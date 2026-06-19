import React, { useState } from "react";
import { EcoSensor } from "../types";
import { motion } from "motion/react";
import {
  Sparkles,
  TreePine,
  Wind,
  Heart,
  Info,
} from "lucide-react";

import {
  useLanguage,
  getLocalDistrict,
} from "../context/LanguageContext";

interface EcoViewProps {
  sensors: EcoSensor[];
}

export default function EcoView({ sensors }: EcoViewProps) {
  const { t, lang } = useLanguage();
  const [selectedSensorId, setSelectedSensorId] = useState<string>(sensors[0]?.id || "");

  const activeSensor = sensors.find((s) => s.id === selectedSensorId) || sensors[0];

  // Micro statistics for eco dashboard
  const treeCensusCount = 14382; // Seeded count for Tokmok botanical census
  const healthBonusRate = 94.6; // % of healthy trees monitored

  const getAqiDetails = (val: number) => {
    if (val <= 50) {
      return {
        label: lang === "ky" ? "Мыкты коопсуз аба (Good)" : "Хорошее состояние (Good)",
        color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
        ringColor: "bg-emerald-500",
        advice: lang === "ky" 
          ? "Абанын сапаты идеалдуу. Шаардыктардын ден соолугуна эч кандай коркунуч жок." 
          : "Качество воздуха идеальное. Отсутствуют любые угрозы здоровью жителей.",
      };
    } else if (val <= 100) {
      return {
        label: lang === "ky" ? "Канааттандырарлык (Moderate)" : "Удовлетворительное (Moderate)",
        color: "text-amber-450 border-amber-500/20 bg-amber-500/10",
        ringColor: "bg-amber-400",
        advice: lang === "ky" 
          ? "Абанын сапаты алгылыктуу, бирок сезимтал жарандарга көчөдө физикалык активдүүлүктү азайтуу сунушталат." 
          : "Качество воздуха приемлемо, однако чувствительным людям рекомендуется снизить физическую активность на улице.",
      };
    } else {
      return {
        label: lang === "ky" ? "Зыяндуу / Кооптуу (Unhealthy)" : "Вредное / Опасное (Unhealthy)",
        color: "text-rose-455 border-rose-500/20 bg-rose-500/10",
        ringColor: "bg-rose-500",
        advice: lang === "ky" 
          ? "Балдардын жана кары-картаңдардын сыртта көпкө туруусун чектеңиз. Өнөр жай аймагы активдүү." 
          : "Ограничьте длительное пребывание детей и пожилых граждан на открытом воздухе. Промзона активна.",
      };
    }
  };

  const aqiInfo = activeSensor ? getAqiDetails(activeSensor.aqi) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Left column - sensor list and health details */}
      <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col gap-4">
        <div className="border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Wind className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-white text-md">{t("eco.title")}</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{t("eco.sub")}</p>
        </div>

        {/* Dynamic selector click nodes */}
        <div className="flex flex-col gap-2">
          {sensors.map((s) => (
            <div
              key={s.id}
              onClick={() => setSelectedSensorId(s.id)}
              className={`p-3.5 rounded-xl border transition cursor-pointer select-none flex items-center justify-between ${
                selectedSensorId === s.id
                  ? "bg-slate-950 border-teal-500"
                  : "bg-slate-950/60 border-slate-850 hover:border-slate-800"
              }`}
            >
              <div className="flex flex-col gap-0.5 max-w-[70%]">
                <span className="font-bold text-white text-xs truncate">{s.locationName}</span>
                <span className="text-[10px] text-slate-500 truncate">{getLocalDistrict(s.district, lang)}</span>
              </div>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                s.status === "good"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  : s.status === "moderate"
                  ? "bg-amber-400/10 text-amber-300 border border-amber-400/20"
                  : "bg-rose-500/10 text-rose-455 border border-rose-500/20"
              }`}>
                {s.aqi} AQI
              </span>
            </div>
          ))}
        </div>

        {/* Small tips */}
        <div className="bg-slate-950 border border-slate-850/60 p-3 rounded-xl flex items-start gap-2 text-[10px] text-slate-400 leading-relaxed mt-2">
          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
          <p>{t("eco.help_text")}</p>
        </div>
      </div>

      {/* 2. Middle column - Selected Sensor detailed analytics */}
      <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col gap-4">
        {activeSensor && aqiInfo ? (
          <>
            <div className="border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-md">{t("eco.metrics_label")} {activeSensor.locationName}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{t("eco.metrics_sub")}</p>
            </div>

            {/* Big center AQI display circular gauge */}
            <div className="flex flex-col items-center py-4 bg-slate-950 border border-slate-855 rounded-xl">
              <div className="relative w-28 h-28 flex items-center justify-center rounded-full border-4 border-slate-850">
                {/* Simulated ring */}
                <span className={`absolute inset-1 rounded-full opacity-10 ${aqiInfo.ringColor}`}></span>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-mono font-bold text-white leading-none">{activeSensor.aqi}</span>
                  <span className="text-[10px] text-slate-500 font-mono tracking-wider mt-1">{t("eco.aqi_index")}</span>
                </div>
              </div>
              <span className={`mt-4 px-3 py-1 rounded text-xs font-bold border ${aqiInfo.color}`}>
                {aqiInfo.label}
              </span>
            </div>

            {/* Grid metrics detailing pollutants */}
            <div className="grid grid-cols-2 gap-3 text-xs leading-relaxed mt-1">
              <div className="bg-slate-950/70 p-3 border border-slate-850 rounded-lg text-xs">
                <span className="text-slate-400 font-medium block">{t("eco.pm25_label")}</span>
                <span className="text-sm font-bold font-mono text-white mt-1 block">
                  {activeSensor.pm25} µg/m³
                </span>
                <span className="text-[9px] text-slate-550 block mt-0.5 leading-tight">{t("eco.pm25_desc")}</span>
              </div>

              <div className="bg-slate-950/70 p-3 border border-slate-850 rounded-lg text-xs">
                <span className="text-slate-400 font-medium block">{t("eco.co2_label")}</span>
                <span className="text-sm font-bold font-mono text-white mt-1 block">
                  {activeSensor.co2} ppm
                </span>
                <span className="text-[9px] text-slate-550 block mt-0.5 leading-tight">{t("eco.co2_desc")}</span>
              </div>
            </div>

            <div className="bg-slate-950/40 border border-slate-850 p-3 rounded-lg flex gap-2.5 items-start text-[11px] leading-relaxed text-slate-350">
              <Heart className="w-4 h-4 text-rose-500 shrink-0 mt-0.5 animate-pulse" />
              <p>
                <strong>{t("eco.rec_label")}</strong> {aqiInfo.advice}
              </p>
            </div>
          </>
        ) : (
          <div className="py-24 text-center text-slate-500 text-xs">No eco data available.</div>
        )}
      </div>

      {/* 3. Right Column: Green Foresting / Botanics Census block */}
      <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col gap-4">
        <div className="border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <TreePine className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-md">{t("eco.green_registry")}</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{t("eco.green_desc")}</p>
        </div>

        {/* Big statistics layout */}
        <div className="flex flex-col gap-4 bg-slate-950 border border-slate-850 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">{t("eco.inventoried")}</span>
            <span className="font-mono font-bold text-emerald-400 text-lg">
              {treeCensusCount.toLocaleString("ru-RU")}
            </span>
          </div>

          {/* Bar health slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
              <span>{t("eco.health_index")}</span>
              <span className="text-emerald-400 font-bold">{healthBonusRate}%</span>
            </div>
            <div className="w-full bg-slate-850 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${healthBonusRate}%` }}></div>
            </div>
          </div>
        </div>

        {/* List of urban forest zones */}
        <div className="flex flex-col gap-2.5 mt-1 text-xs">
          <span className="text-[10px] font-mono uppercase text-slate-450 block mb-1">{t("eco.major_parks")}</span>

          <div className="flex items-center justify-between border-b border-slate-850 pb-2 last:border-0 last:pb-0">
            <div className="flex flex-col">
              <span className="font-bold text-slate-350">{t("eco.park_1")}</span>
              <span className="text-[10px] text-slate-500 mt-0.5">{t("eco.park_1_desc")}</span>
            </div>
            <span className="text-emerald-400 font-bold font-mono">98% {t("eco.healthy_text")}</span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-850 pb-2 last:border-0 last:pb-0">
            <div className="flex flex-col">
              <span className="font-bold text-slate-350">{t("eco.park_2")}</span>
              <span className="text-[10px] text-slate-500 mt-0.5">{t("eco.park_2_desc")}</span>
            </div>
            <span className="text-emerald-400 font-bold font-mono">92% {t("eco.healthy_text")}</span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-850 pb-2 last:border-0 last:pb-0">
            <div className="flex flex-col">
              <span className="font-bold text-slate-350">{t("eco.park_3")}</span>
              <span className="text-[10px] text-slate-500 mt-0.5">{t("eco.park_3_desc")}</span>
            </div>
            <span className="text-emerald-400 font-bold font-mono text-amber-300">85% {t("eco.healthy_text")}</span>
          </div>
        </div>

        {/* Eco advisory banner */}
        <div className="bg-emerald-950/30 border border-emerald-500/20 p-3 rounded-xl text-[10.5px] leading-relaxed text-slate-350 flex gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 animate-bounce" />
          <p>{t("eco.advisory")}</p>
        </div>
      </div>
    </div>
  );
}
