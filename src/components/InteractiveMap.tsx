import React, { useState } from "react";
import { Complaint, EcoSensor, Employee } from "../types";
import { TOKMOK_DISTRICTS } from "../data/mockData";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Flame,
  Droplet,
  Trash2,
  Lightbulb,
  ShieldAlert,
  Wrench,
  Activity,
  Heart,
  GraduationCap,
  Navigation,
  Info,
  Moon,
} from "lucide-react";

import {
  useLanguage,
  getLocalDistrict,
  getLocalComplaintCategory,
  getLocalStatus,
  getLocalUrgency,
  getTranslateComplaintText,
} from "../context/LanguageContext";

interface InteractiveMapProps {
  complaints: Complaint[];
  sensors: EcoSensor[];
  employees: Employee[];
  selectedCategoryFilter: string;
  onPinDropped?: (lat: number, lng: number, districtName: string) => void;
  interactiveMode?: boolean; // If citizen can click to drop a reporting pin
}

export default function InteractiveMap({
  complaints,
  sensors,
  employees,
  selectedCategoryFilter,
  onPinDropped,
  interactiveMode = false,
}: InteractiveMapProps) {
  const { t, lang } = useLanguage();
  const [clickedPin, setClickedPin] = useState<{ lat: number; lng: number; district: string } | null>(null);
  const [hoveredItem, setHoveredItem] = useState<{
    type: "complaint" | "sensor" | "employee" | "mosque";
    name: string;
    details: string;
    status?: string;
  } | null>(null);

  // Localized landmark mosques of Tokmok
  const mosques = [
    {
      id: "mosque-central",
      nameKy: "Токмок Борбордук Мечити",
      nameRu: "Центральная Мечеть г. Токмок",
      addressKy: "Шамшы көчөсү (Мэрия жана Борбордук аянттын жанында)",
      addressRu: "ул. Шамшинская (около Мэрии и Центральной площади)",
      x: 52,
      y: 45,
    },
    {
      id: "mosque-east",
      nameKy: "«Рахман» мечити",
      nameRu: "Мечеть «Рахман»",
      addressKy: "МТУ №3 (Микрорайон тарабы, Чүй проспектисине жакын)",
      addressRu: "МТУ №3 (в сторону микрорайонов, близ Чуйского проспекта)",
      x: 74,
      y: 55,
    },
    {
      id: "mosque-west",
      nameKy: "«Ибрахим» мечити",
      nameRu: "Мечеть «Ибрахим»",
      addressKy: "МТУ №2, Жантаев көчөсү (Темир жол бекети тарап)",
      addressRu: "МТУ №2, ул. Жантаева (район вокзала)",
      x: 32,
      y: 41,
    }
  ];

  // Approximate center of districts for styling/labeling
  const districtCenters = [
    { name: TOKMOK_DISTRICTS[0], x: 50, y: 48, color: "from-blue-550/10 to-teal-500/10" },
    { name: TOKMOK_DISTRICTS[1], x: 30, y: 32, color: "from-purple-550/10 to-indigo-500/10" },
    { name: TOKMOK_DISTRICTS[2], x: 74, y: 62, color: "from-orange-550/10 to-red-500/10" },
    { name: TOKMOK_DISTRICTS[3], x: 26, y: 78, color: "from-amber-550/10 to-yellow-500/10" },
    { name: TOKMOK_DISTRICTS[4], x: 76, y: 22, color: "from-pink-550/10 to-rose-500/10" },
  ];

  // Helper to determine district name based on simple coordinate boundaries
  const getDistrictFromCoords = (x: number, y: number): string => {
    if (x > 55 && y < 40) return TOKMOK_DISTRICTS[4]; // Западный массив (Шамсинский)
    if (x > 55 && y >= 40) return TOKMOK_DISTRICTS[2]; // МТУ №3 (Микрорайон / Промзона)
    if (x <= 55 && y > 60) return TOKMOK_DISTRICTS[3]; // МТУ №4 (Слободка / Сахзавод)
    if (x <= 45 && y <= 60) return TOKMOK_DISTRICTS[1]; // МТУ №2 (Железнодорожный)
    return TOKMOK_DISTRICTS[0]; // МТУ №1 (Центральный) Default
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactiveMode || !onPinDropped) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    const districtName = getDistrictFromCoords(x, y);
    setClickedPin({ lat: y, lng: x, district: districtName });
    onPinDropped(y, x, districtName);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "водоканал":
        return <Droplet className="w-4 h-4 text-blue-500" />;
      case "теплосеть":
        return <Flame className="w-4 h-4 text-orange-500" />;
      case "газ":
        return <Flame className="w-4 h-4 text-yellow-600" />;
      case "санитарная служба":
        return <Trash2 className="w-4 h-4 text-emerald-500" />;
      case "школы":
        return <GraduationCap className="w-4 h-4 text-purple-500" />;
      case "больницы":
        return <Heart className="w-4 h-4 text-red-500" />;
      case "горсвет":
        return <Lightbulb className="w-4 h-4 text-amber-500" />;
      case "дорожные службы":
        return <Wrench className="w-4 h-4 text-slate-550" />;
      case "экстренные службы":
        return <ShieldAlert className="w-4 h-4 text-red-600" />;
      default:
        return <MapPin className="w-4 h-4 text-cyan-500" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "bg-red-500 shadow-red-500/50 scale-110 border border-white animate-pulse";
      case "high":
        return "bg-orange-500 shadow-orange-500/50 scale-105 border border-white";
      case "medium":
        return "bg-amber-500 shadow-amber-500/50";
      default:
        return "bg-blue-500 shadow-blue-500/50";
    }
  };

  const filteredComplaints = complaints.filter(
    (c) =>
      c.status !== "resolved" &&
      c.status !== "rejected" &&
      !c.isDirectToMayor &&
      (selectedCategoryFilter === "all" || c.category === selectedCategoryFilter)
  );

  return (
    <div className="relative w-full h-[500px] bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl select-none">
      {/* Background Stylized Grid Vector */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-40"></div>

      {/* Styled vector river 'Chu' cutting through northern Tokmok */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M 0 45 Q 250 80 500 50 T 1000 75"
          fill="none"
          stroke="#0284c7"
          strokeWidth="10"
          strokeLinecap="round"
          className="animate-pulse"
        />
        <path
          d="M 0 45 Q 250 80 500 50 T 1000 75"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2"
          strokeDasharray="8 6"
        />
        {/* Bypass road (Chuy Prospect / Bypass Tokmok) */}
        <path
          d="M 0 140 Q 300 130 600 150 T 1020 120"
          fill="none"
          stroke="#475569"
          strokeWidth="6"
        />
        {/* Railway line */}
        <path
          d="M 0 350 L 1020 350"
          fill="none"
          stroke="#334155"
          strokeWidth="3"
          strokeDasharray="12 8"
        />
      </svg>

      {/* Grid Districting overlays */}
      <div className="absolute inset-0 pointer-events-none grid grid-cols-2 grid-rows-2 opacity-5">
        <div className="border-r border-b border-dashed border-cyan-500"></div>
        <div className="border-b border-dashed border-cyan-500"></div>
        <div className="border-r border-dashed border-cyan-500"></div>
        <div></div>
      </div>

      {/* Render District Overlay Cards */}
      {districtCenters.map((dist, i) => {
        const localizedName = getLocalDistrict(dist.name, lang);
        // Extract main name suffix safely
        const displayLabel = localizedName.includes("(")
          ? localizedName.substring(localizedName.indexOf("(") + 1, localizedName.length - 1)
          : localizedName;

        return (
          <div
            key={i}
            className="absolute pointer-events-none scale-90"
            style={{ left: `${dist.x}%`, top: `${dist.y}%` }}
          >
            <div className="relative -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <span className="text-[10px] font-mono tracking-wider text-slate-500 font-semibold bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800/80 backdrop-blur-sm shadow-sm uppercase">
                {displayLabel}
              </span>
            </div>
          </div>
        );
      })}

      {/* Map Interactive Canvas Container */}
      <div
        className={`absolute inset-0 ${interactiveMode ? "cursor-crosshair" : "cursor-default"}`}
        onClick={handleMapClick}
      >
        {/* Real-time active complaints pins */}
        {filteredComplaints.map((c) => {
          // Approximate mapping standard coords based on mock setup:
          let x = 50;
          let y = 48;
          if (c.id === "tokmok-1") {
            x = 48;
            y = 46;
          } else if (c.id === "tokmok-2") {
            x = 33;
            y = 35;
          } else if (c.id === "tokmok-3") {
            x = 71;
            y = 57;
          } else {
            // Assign dynamic percentage based on string hash to randomize naturally
            const h = c.title.charCodeAt(0) + c.title.charCodeAt(c.title.length - 1);
            x = 35 + (h % 40);
            y = 25 + ((h * 7) % 50);
          }

          return (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              key={c.id}
              className="absolute z-10 cursor-pointer"
              style={{ left: `${x}%`, top: `${y}%` }}
              onMouseEnter={() =>
                setHoveredItem({
                  type: "complaint",
                  name: getTranslateComplaintText(c.title, lang),
                  details: `${c.citizenName} • ${getLocalDistrict(c.district, lang)}`,
                  status: getLocalStatus(c.status, lang),
                })
              }
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="relative -translate-x-1/2 -translate-y-1/2 select-none group">
                {/* Ping rings */}
                <span className="absolute inline-flex h-4 w-4 rounded-full bg-cyan-400 opacity-75 animate-ping -left-1.5 -top-1.5"></span>
                <div
                  className={`flex items-center justify-center w-7 h-7 rounded-full shadow-lg ${getUrgencyColor(
                    c.urgency
                  )} transition-transform hover:scale-125`}
                >
                  {getCategoryIcon(c.category)}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Eco sensors nodes */}
        {sensors.map((s) => (
          <div
            key={s.id}
            className="absolute z-20 cursor-pointer"
            style={{ left: `${s.lng}%`, top: `${s.lat}%` }}
            onMouseEnter={() =>
              setHoveredItem({
                type: "sensor",
                name: `${lang === "ky" ? "Жигердүү эко-датчик" : "Живой эко-датчик"}: ${s.locationName}`,
                details: `AQI: ${s.aqi} (PM2.5: ${s.pm25} µg/m³)`,
                status: s.status === "good" ? (lang === "ky" ? "жакшы" : "отлично") : lang === "ky" ? "орточо" : "умеренно",
              })
            }
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className="relative -translate-x-1/2 -translate-y-1/2">
              <div
                className={`flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-bold border border-slate-900 shadow-md ${
                  s.status === "good"
                    ? "bg-emerald-500/90 text-white"
                    : s.status === "moderate"
                    ? "bg-amber-500/90 text-slate-950"
                    : "bg-rose-500/90 text-white"
                }`}
              >
                <Activity className="w-2.5 h-2.5 mr-1 animate-pulse" />
                {s.aqi}
              </div>
            </div>
          </div>
        ))}

        {/* Mosques Points */}
        {mosques.map((m) => (
          <div
            key={m.id}
            className="absolute z-20 cursor-pointer"
            style={{ left: `${m.x}%`, top: `${m.y}%` }}
            onMouseEnter={() =>
              setHoveredItem({
                type: "mosque",
                name: lang === "ky" ? m.nameKy : m.nameRu,
                details: lang === "ky" ? m.addressKy : m.addressRu,
                status: lang === "ky" ? "ачык (намаз убактылары)" : "открыто (время молитв)",
              })
            }
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className="relative -translate-x-1/2 -translate-y-1/2 group">
              <span className="absolute inline-flex h-4 w-4 rounded-full bg-emerald-500 opacity-60 animate-ping -left-1 -top-1"></span>
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-bold hover:scale-125 transition-transform shadow-lg shadow-emerald-950">
                <Moon className="w-3 h-3 text-emerald-400 rotate-45" />
              </div>
            </div>
          </div>
        ))}

        {/* Live Tracking GPS Municipal Employees */}
        {employees
          .filter((e) => e.status !== "offline")
          .map((e) => (
            <motion.div
              key={e.id}
              className="absolute z-30 cursor-pointer"
              animate={{
                left: e.status === "driving" && e.targetLng ? [`${e.lng}%`, `${e.targetLng}%`] : `${e.lng}%`,
                top: e.status === "driving" && e.targetLat ? [`${e.lat}%`, `${e.targetLat}%`] : `${e.lat}%`,
              }}
              transition={{
                repeat: e.status === "driving" ? Infinity : 0,
                repeatType: "reverse",
                duration: 8,
                ease: "easeInOut",
              }}
              onMouseEnter={() =>
                setHoveredItem({
                  type: "employee",
                  name: `${e.name} (${e.vehicleNo})`,
                  details: `${e.role} • ${e.vehicle} (${e.status})`,
                  status: e.status === "working" ? "active" : "idle",
                })
              }
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="relative -translate-x-1/2 -translate-y-1/2">
                <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-650 text-white shadow-md border border-indigo-400">
                  <Navigation className="w-3.5 h-3.5 transform rotate-45 animate-pulse text-cyan-200" />
                </div>
                {/* Minimized label */}
                <div className="absolute top-7 left-1/2 -translate-x-1/2 bg-slate-900/90 text-[8px] font-medium text-slate-300 px-1 rounded whitespace-nowrap shadow-sm border border-slate-800">
                  {e.name.split(" ")[0]}
                </div>
              </div>
            </motion.div>
          ))}

        {/* Placing report coordinates targeting pin */}
        {clickedPin && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute z-40"
            style={{ left: `${clickedPin.lng}%`, top: `${clickedPin.lat}%` }}
          >
            <div className="relative -translate-x-1/2 -translate-y-full flex flex-col items-center text-xs">
              <MapPin className="w-8 h-8 text-rose-500 fill-rose-500/30 filter drop-shadow-lg" />
              <div className="absolute -top-7 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap">
                {lang === "ky" ? "Чекитти бул жерден тандоо" : "Выбрать точку здесь"}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Floating Info / Instructions and Mode Badges */}
      <div className="absolute top-4 left-4 z-40 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="text-[11px] font-mono font-medium text-slate-300">
          {lang === "ky" ? "Токмок: Санариптик Кош Канат (Live)" : "Токмок: Цифровой Двойник (Live)"}
        </span>
      </div>

      {/* Help tooltip for interactive pin dropping */}
      {interactiveMode && (
        <div className="absolute bottom-4 left-4 z-40 bg-slate-900/95 border border-slate-800 px-4 py-2.5 rounded-xl max-w-xs shadow-xl backdrop-blur-md flex gap-2 text-xs">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed text-slate-400">
            <strong className="text-white block mb-0.5">
              {lang === "ky" ? "Кырсык болгон жерди көрсөтүү" : "Указать точку аварии"}
            </strong>
            {lang === "ky"
              ? "Так координаттарды тиркөө жана МТУну аныктоо үчүн интерактивдүү картаны басыңыз."
              : "Кликните по интерактивной карте, чтобы автоматически прикрепить точные координаты и выявить МТУ."}
          </p>
        </div>
      )}

      {/* Detailed Pin Hover Tooltip Card */}
      <AnimatePresence>
        {hoveredItem && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 right-4 z-50 bg-slate-900/95 border border-slate-800 p-3 rounded-xl max-w-sm shadow-xl backdrop-blur-md flex flex-col gap-1 text-[11px]"
          >
            <div className="flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  hoveredItem.type === "complaint"
                    ? "bg-rose-500"
                    : hoveredItem.type === "sensor"
                    ? "bg-teal-400"
                    : hoveredItem.type === "employee"
                    ? "bg-indigo-500"
                    : "bg-emerald-500"
                }`}
              ></span>
              <span className="font-semibold text-white uppercase text-[9px] tracking-wider">
                {hoveredItem.type === "complaint"
                  ? lang === "ky"
                    ? "Жарандын даттануусу"
                    : "Жалоба Гражданина"
                  : hoveredItem.type === "sensor"
                  ? lang === "ky"
                    ? "Абанын экологиясы"
                    : "Экология воздуха"
                  : hoveredItem.type === "employee"
                  ? lang === "ky"
                    ? "Техника / Кызмат"
                    : "Техника / Служба"
                  : lang === "ky"
                  ? "Мечит (Ыйык жай)"
                  : "Мечеть (Религиозный объект)"}
              </span>
            </div>
            <p className="font-bold text-slate-200 mt-0.5 text-xs">{hoveredItem.name}</p>
            <p className="text-slate-400 font-medium">{hoveredItem.details}</p>
            {hoveredItem.status && (
              <span className="mt-1 font-mono text-[9px] uppercase px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded self-start border border-slate-700">
                {lang === "ky" ? "Мүнөздөмөсү" : "Статус"}: {hoveredItem.status}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
