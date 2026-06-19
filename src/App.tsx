import React, { useState, useEffect } from "react";
import { Complaint, EcoSensor, Employee, NewsItem, MunicipalServiceConfig } from "./types";
import {
  INITIAL_COMPLAINTS,
  INITIAL_SENSORS,
  INITIAL_EMPLOYEES,
  INITIAL_NEWS,
  INITIAL_SERVICES,
  TOKMOK_DISTRICTS,
} from "./data/mockData";
import { motion, AnimatePresence } from "motion/react";

// Language
import { LanguageProvider, useLanguage } from "./context/LanguageContext";

// Views
import InteractiveMap from "./components/InteractiveMap";
import CitizenView from "./components/CitizenView";
import MayorView from "./components/MayorView";
import ServicesView from "./components/ServicesView";
import EcoView from "./components/EcoView";
import EmployeeView from "./components/EmployeeView";
import BusinessView from "./components/BusinessView";
import DirectoryView from "./components/DirectoryView";
import ChatBot from "./components/ChatBot";

// Icons
import {
  Map,
  User,
  Building2,
  Wrench,
  Wind,
  ShieldCheck,
  Coins,
  Sparkles,
  Info,
  Calendar,
  AlertTriangle,
} from "lucide-react";

function AppContent() {
  const { lang, setLang, t } = useLanguage();

  // Global municipal state
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [sensors, setSensors] = useState<EcoSensor[]>(INITIAL_SENSORS);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);
  const [services] = useState<MunicipalServiceConfig[]>(INITIAL_SERVICES);

  // Tab switching
  const [activeTab, setActiveTab] = useState<
    "map" | "citizen" | "mayor" | "services" | "eco" | "employees" | "business" | "directory"
  >("map");

  // Selected Pin coordinates from map dragging/clicking
  const [currentPinCoords, setCurrentPinCoords] = useState<{
    lat: number;
    lng: number;
    district: string;
  } | null>(null);

  // Filter complaints on the main map tab
  const [mapCategoryFilter, setMapCategoryFilter] = useState<string>("all");

  // Check if API key is loaded
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/ai/config")
      .then((res) => res.json())
      .then((data) => {
        setHasApiKey(!!data.hasKey);
      })
      .catch((err) => {
        console.warn("Backend configuration endpoint unavailable: running offline.", err);
        setHasApiKey(false);
      });
  }, []);

  // Global callbacks for residents & crews activity
  const handleAddComplaint = (newComplaint: Complaint) => {
    setComplaints((prev) => [newComplaint, ...prev]);

    // Fast mock trigger: dispatch near employee to drive towards complaint coordinates
    if (newComplaint.landmark && newComplaint.landmark.includes("Точка на карте")) {
      // Find a matching service employee
      setEmployees((prev) =>
        prev.map((emp) => {
          if (emp.service === newComplaint.category) {
            // Pick coordinates up from landmark
            const matchLat = newComplaint.landmark?.match(/Y-(\d+)%/);
            const matchLng = newComplaint.landmark?.match(/X-(\d+)%/);
            if (matchLat && matchLng) {
              return {
                ...emp,
                status: "driving",
                targetLat: parseInt(matchLat[1]),
                targetLng: parseInt(matchLng[1]),
              };
            }
          }
          return emp;
        })
      );
    }
  };

  const handleUpdateComplaint = (id: string, updatedFields: Partial<Complaint>) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    );

    // If solved, mark employee as idle
    if (updatedFields.status === "resolved") {
      const solvedTicket = complaints.find((c) => c.id === id);
      if (solvedTicket) {
        setEmployees((prev) =>
          prev.map((emp) => {
            if (emp.service === solvedTicket.category) {
              return {
                ...emp,
                status: "idle",
                tasksCompleted: emp.tasksCompleted + 1,
                kpi: Math.min(emp.kpi + 2, 100),
              };
            }
            return emp;
          })
        );
      }
    }
  };

  const handleVote = (id: string) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          if (c.votedUsers.includes("current_citizen")) return c;
          return {
            ...c,
            votes: c.votes + 1,
            votedUsers: [...c.votedUsers, "current_citizen"],
          };
        }
        return c;
      })
    );
  };

  const handlePinDroppedOnMap = (lat: number, lng: number, districtName: string) => {
    setCurrentPinCoords({ lat, lng, district: districtName });
    // Switch immediately to Citizen Portal to complete report submitting
    setActiveTab("citizen");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      {/* 1. Header Navigation Shell */}
      <header className="bg-slate-900 border-b border-slate-800 shrink-0 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* National Crest Badge emulation */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-600 to-rose-700 flex items-center justify-center border-2 border-amber-400/60 shadow-lg text-white font-bold text-lg select-none">
              T
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold uppercase text-sm tracking-widest text-slate-100 font-sans">
                  {t("app.title")}
                </h1>
                <span className="text-[9px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full animate-pulse">
                  {t("app.subtitle")}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-none mt-1">{t("app.desc")}</p>
            </div>
          </div>

          {/* Language Selector + Time & District Telemetry Info */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 self-start md:self-center">
            {/* Dynamic bilingual language selection tabs */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setLang("ru")}
                className={`px-3 py-1 rounded-lg text-[10px] font-extrabold font-sans transition-all cursor-pointer ${
                  lang === "ru"
                    ? "bg-rose-600 text-white shadow-md shadow-rose-950/20 scale-100"
                    : "text-slate-450 hover:text-slate-200"
                }`}
              >
                РУССКИЙ
              </button>
              <button
                onClick={() => setLang("ky")}
                className={`px-3 py-1 rounded-lg text-[10px] font-extrabold font-sans transition-all cursor-pointer ${
                  lang === "ky"
                    ? "bg-rose-600 text-white shadow-md shadow-rose-950/20 scale-100"
                    : "text-slate-450 hover:text-slate-200"
                }`}
              >
                КЫРГЫЗЧА
              </button>
            </div>

            <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-slate-450" />
              <span className="font-mono text-slate-300">{t("app.date")}</span>
            </div>
            <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-[10px] text-slate-350">{t("app.status")}</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Global AI Secrets Status and Key Reminder Banner */}
      {!hasApiKey && (
        <div className="bg-gradient-to-r from-indigo-950/90 to-slate-900 border-b border-indigo-500/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-xs text-indigo-200">
              <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse shrink-0" />
              <span>{t("app.ai_warn")}</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Horizontal Navigation Tabs bar */}
      <nav className="bg-slate-900/60 border-b border-slate-850 shrink-0 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto">
          <div className="flex gap-1.5 py-2 whitespace-nowrap scrollbar-hide text-xs">
            <button
              onClick={() => setActiveTab("map")}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                activeTab === "map"
                  ? "bg-slate-800 text-white shadow-inner"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <Map className="w-4 h-4 text-rose-500" />
              {t("tab.map")}
            </button>

            <button
              onClick={() => setActiveTab("citizen")}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                activeTab === "citizen"
                  ? "bg-slate-800 text-white shadow-inner"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <User className="w-4 h-4 text-cyan-400" />
              {t("tab.citizen")}
            </button>

            <button
              onClick={() => setActiveTab("mayor")}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                activeTab === "mayor"
                  ? "bg-slate-800 text-white shadow-inner"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <Building2 className="w-4 h-4 text-amber-500" />
              {t("tab.mayor")}
            </button>

            <button
              onClick={() => setActiveTab("services")}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                activeTab === "services"
                  ? "bg-slate-800 text-white shadow-inner"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <Wrench className="w-4 h-4 text-indigo-400" />
              {t("tab.services")}
            </button>

            <button
              onClick={() => setActiveTab("eco")}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                activeTab === "eco"
                  ? "bg-slate-800 text-white shadow-inner"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <Wind className="w-4 h-4 text-teal-400" />
              {t("tab.eco")}
            </button>

            <button
              onClick={() => setActiveTab("employees")}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                activeTab === "employees"
                  ? "bg-slate-800 text-white shadow-inner"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              {t("tab.employees")}
            </button>

            <button
              onClick={() => setActiveTab("business")}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                activeTab === "business"
                  ? "bg-slate-800 text-white shadow-inner"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <Coins className="w-4 h-4 text-emerald-400" />
              {t("tab.business")}
            </button>

            <button
              onClick={() => setActiveTab("directory")}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                activeTab === "directory"
                  ? "bg-slate-800 text-white shadow-inner"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <Info className="w-4 h-4 text-rose-455" />
              {t("tab.directory")}
            </button>
          </div>
        </div>
      </nav>

      {/* 4. Main Body Content Display */}
      <main className="flex-1 overflow-y-auto max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {activeTab === "map" && (
              <div className="flex flex-col gap-6">
                {/* Intro welcome alert log */}
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center shrink-0">
                      <Map className="w-5 h-5 animate-pulse" />
                    </div>
                    <div className="text-xs">
                      <h2 className="font-bold text-white text-md">{t("map.twin")}</h2>
                      <p className="text-slate-400 mt-0.5 leading-relaxed">
                        {t("map.twin_desc")}
                      </p>
                    </div>
                  </div>

                  {/* Filter category overlay selector */}
                  <div className="flex items-center gap-2 shrink-0 text-xs">
                    <span className="text-slate-455 font-bold">{t("map.filter")}</span>
                    <select
                      value={mapCategoryFilter}
                      onChange={(e) => setMapCategoryFilter(e.target.value)}
                      className="bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-slate-350 focus:outline-none focus:border-rose-500 text-xs cursor-pointer"
                    >
                      <option value="all" className="bg-slate-950">{t("map.all")}</option>
                      <option value="водоканал" className="bg-slate-950">
                        {lang === "ky" ? "Сууканал" : "Водоканал"}
                      </option>
                      <option value="санитарная служба" className="bg-slate-950">
                        {lang === "ky" ? "Тазалык" : "Тазалык (Санитарная служба)"}
                      </option>
                      <option value="горсвет" className="bg-slate-950">
                        {lang === "ky" ? "Горсвет" : "Горсвет"}
                      </option>
                      <option value="дорожные службы" className="bg-slate-950">
                        {lang === "ky" ? "Жол кызматтары" : "Дорожные службы"}
                      </option>
                    </select>
                  </div>
                </div>

                {/* The Map Component */}
                <InteractiveMap
                  complaints={complaints}
                  sensors={sensors}
                  employees={employees}
                  selectedCategoryFilter={mapCategoryFilter}
                  onPinDropped={handlePinDroppedOnMap}
                  interactiveMode={true}
                />

                {/* Brief alert logs right underneath map for extreme high quality */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg text-xs">
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider font-semibold block mb-2.5">
                    {t("map.instruction_title")}
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 leading-relaxed text-slate-350">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                      <strong className="text-white block mb-1">{t("map.inst_1_title")}</strong>
                      {t("map.inst_1_desc")}
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                      <strong className="text-white block mb-1">{t("map.inst_2_title")}</strong>
                      {t("map.inst_2_desc")}
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                      <strong className="text-white block mb-1">{t("map.inst_3_title")}</strong>
                      {t("map.inst_3_desc")}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "citizen" && (
              <CitizenView
                complaints={complaints}
                news={news}
                currentPinCoords={currentPinCoords}
                onAddComplaint={handleAddComplaint}
                onVote={handleVote}
              />
            )}

            {activeTab === "mayor" && (
              <MayorView
                complaints={complaints}
                sensors={sensors}
                employees={employees}
                services={services}
                onUpdateComplaint={handleUpdateComplaint}
              />
            )}

            {activeTab === "services" && (
              <ServicesView
                complaints={complaints}
                services={services}
                onUpdateComplaint={handleUpdateComplaint}
              />
            )}

            {activeTab === "eco" && <EcoView sensors={sensors} />}

            {activeTab === "employees" && <EmployeeView employees={employees} />}

            {activeTab === "business" && <BusinessView />}

            {activeTab === "directory" && <DirectoryView />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 5. Footer branding credit indicators */}
      <footer className="bg-slate-900 border-t border-slate-850 shrink-0 text-center py-4 select-none">
        <p className="text-[10px] text-slate-500 font-mono tracking-wider leading-relaxed px-4">
          {t("app.footer")}
        </p>
      </footer>

      {/* Persistent Municipal AI Chatbot */}
      <ChatBot />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
