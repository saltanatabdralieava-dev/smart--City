import React from "react";
import { Employee } from "../types";
import {
  TrendingUp,
  Truck,
  Star,
  UserCheck,
  AlertCircle,
} from "lucide-react";

import {
  useLanguage,
  getLocalService,
} from "../context/LanguageContext";

interface EmployeeViewProps {
  employees: Employee[];
}

export default function EmployeeView({ employees }: EmployeeViewProps) {
  const { t, lang } = useLanguage();

  // Sort by KPI for leaderboard
  const sortedEmployees = [...employees].sort((a, b) => b.kpi - a.kpi);

  const getStatusBadge = (status: Employee["status"]) => {
    switch (status) {
      case "working":
        return {
          label: t("emp.badge_working"),
          color: "bg-amber-400/10 text-amber-300 border border-amber-400/20 animate-pulse",
        };
      case "driving":
        return {
          label: t("emp.badge_driving"),
          color: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
        };
      case "idle":
        return {
          label: t("emp.badge_idle"),
          color: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        };
      default:
        return {
          label: t("emp.badge_offline"),
          color: "bg-slate-900 text-slate-500 border border-slate-800",
        };
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Left 2 columns - Live Fleet Tracking Control Room list */}
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col gap-4 text-xs">
        <div className="border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-md font-sans">{t("emp.title")}</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{t("emp.sub")}</p>
        </div>

        {/* Live crews list */}
        <div className="flex flex-col gap-3.5 max-h-[440px] overflow-y-auto pr-1">
          {employees.map((emp) => {
            const badge = getStatusBadge(emp.status);
            return (
              <div
                key={emp.id}
                className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col md:flex-row gap-4 justify-between md:items-center hover:border-slate-755 transition text-xs"
              >
                {/* Operator info and icon */}
                <div className="flex items-start gap-3 flex-1 text-xs">
                  <div className="w-9 h-9 bg-indigo-500/10 text-indigo-400 rounded-lg flex items-center justify-center shrink-0 border border-indigo-500/15">
                    <UserCheck className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-sm">{emp.name}</span>
                      <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>
                    <span className="text-slate-400 font-medium leading-relaxed">
                      {lang === "ky"
                        ? emp.role
                            .replace("Бригадир службы", "Кызмат бригадири")
                            .replace("Старший мастер", "Улуу мастер")
                            .replace("Техник аварийщиков", "Экстрендик техника адамы")
                            .replace("Главный дежурный", "Башкы кезекчи")
                        : emp.role}{" "}
                      •{" "}
                      <strong className="text-slate-350 font-normal uppercase leading-none">
                        {getLocalService(emp.service || "водоканал", lang)}
                      </strong>
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1 font-mono flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-slate-500" />
                      {lang === "ky" ? "Транспорт:" : "Транспорт:"}{" "}
                      {lang === "ky"
                        ? emp.vehicle
                            .replace("Аварийная Газель", "Өзгөчө кырдаал Газели")
                            .replace("Илосос КАМАЗ", "КАМАЗ тазалоочу")
                            .replace("Логистический Минивэн", "Минивэн унаасы")
                            .replace("Автовышка ЗИЛ", "ЗИЛ унаасы")
                        : emp.vehicle}{" "}
                      ({emp.vehicleNo})
                    </span>
                  </div>
                </div>

                {/* KPI slider block */}
                <div className="flex flex-col gap-1 text-xs shrink-0 md:min-w-[125px]">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                    <span>{t("emp.kpi_label")}</span>
                    <span className="text-indigo-450 font-bold">{emp.kpi}%</span>
                  </div>
                  <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-550 h-full rounded-full" style={{ width: `${emp.kpi}%` }}></div>
                  </div>
                  <div className="flex justify-between items-center text-[9px] text-slate-500 mt-1 font-mono">
                    <span>
                      {t("emp.resolved_count")} <strong>{emp.tasksCompleted}</strong>
                    </span>
                    <span className="text-indigo-400 font-bold">{emp.phone}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Right Column - KPI Leadership Board */}
      <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col gap-4 text-xs">
        <div className="border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-white text-md">{t("emp.leaderboard_title")}</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{t("emp.leaderboard_sub")}</p>
        </div>

        {/* Leaderboard blocks */}
        <div className="flex flex-col gap-3">
          {sortedEmployees.map((emp, index) => (
            <div
              key={emp.id}
              className="bg-slate-950 border border-slate-850 p-3 rounded-xl flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2.5">
                {/* Placement circle */}
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  index === 0
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : index === 1
                    ? "bg-slate-400/10 text-slate-300 border border-slate-400/20"
                    : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                }`}>
                  #{index + 1}
                </span>

                <div className="flex flex-col text-xs">
                  <span className="font-bold text-slate-200">{emp.name}</span>
                  <span className="text-[10px] text-slate-500 truncate max-w-[130px]">
                    {lang === "ky"
                      ? emp.role
                          .replace("Бригадир службы", "Кызмат бригадири")
                          .replace("Старший мастер", "Улуу мастер")
                          .replace("Техник аварийщиков", "Экстрендик техника адамы")
                          .replace("Главный дежурный", "Башкы кезекчи")
                      : emp.role}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end text-xs shrink-0">
                <span className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  {emp.kpi}%
                </span>
                <span className="text-[9px] text-slate-500 mt-0.5">{t("emp.kpi_coeff")}</span>
              </div>
            </div>
          ))}
        </div>

        {/* KPI Calculation details */}
        <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl text-[10px] text-slate-450 leading-relaxed flex items-start gap-1.5 mt-auto">
          <AlertCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
          <p>{t("emp.formula_desc")}</p>
        </div>
      </div>
    </div>
  );
}
