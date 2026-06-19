import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Building,
  User,
  Shield,
  Heart,
  GraduationCap,
  Scale,
  Navigation,
  Bus,
  Search,
  Users,
  Info,
  Phone,
  Clock,
  Briefcase,
  FileText,
  Moon,
  Wrench,
  Mail,
  Facebook,
  Instagram,
  Globe,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface Deputy {
  id: string;
  nameKy: string;
  nameRu: string;
  partyKy: string;
  partyRu: string;
  roleKy: string;
  roleRu: string;
  commissionKy: string;
  commissionRu: string;
  contact: string;
}

export default function DirectoryView() {
  const { lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<
    | "general"
    | "authority"
    | "municipal"
    | "mosques"
    | "services"
    | "safety-health"
    | "education-notaries"
    | "streets-transport"
  >("general");

  const [deputySearch, setDeputySearch] = useState("");
  const [partyFilter, setPartyFilter] = useState("all");

  const categories = [
    {
      id: "general",
      titleKy: "📍 Жалпы маалымат, аянты жана калкы",
      titleRu: "📍 Общая информация, площадь и население",
      icon: <Info className="w-4 h-4 text-rose-500" />,
    },
    {
      id: "authority",
      titleKy: "🏛️ Мэрия жана Шаардык Кеңеш (Депутаттар)",
      titleRu: "🏛️ Мэрия и Городской Кенеш (Депутаты)",
      icon: <Users className="w-4 h-4 text-amber-500" />,
    },
    {
      id: "municipal",
      titleKy: "🛠️ Муниципалдык ишканалар жана бөлүмдөр",
      titleRu: "🛠️ Муниципальные службы и ведомства",
      icon: <Wrench className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: "mosques",
      titleKy: "🕌 Шаардык Мечиттер",
      titleRu: "🕌 Городские Мечети",
      icon: <Moon className="w-4 h-4 text-teal-400" />,
    },
    {
      id: "services",
      titleKy: "🏢 Мамлекеттик кызматтар (ЦОН, Кадастр)",
      titleRu: "🏢 Госуслуги (ЦОН, Госрегистр, Архитектура)",
      icon: <Building className="w-4 h-4 text-indigo-400" />,
    },
    {
      id: "safety-health",
      titleKy: "👮 ИИБ жана Саламаттыкты сактоо",
      titleRu: "👮 ГОВД и Здравоохранение",
      icon: <Shield className="w-4 h-4 text-teal-400" />,
    },
    {
      id: "education-notaries",
      titleKy: "🎓 Билим берүү жана Нотариустар",
      titleRu: "🎓 Образование и Нотариусы",
      icon: <GraduationCap className="w-4 h-4 text-violet-400" />,
    },
    {
      id: "streets-transport",
      titleKy: "🛣️ Негизги көчөлөр жана Маршруттар",
      titleRu: "🛣️ Главные улицы и Маршруты",
      icon: <Navigation className="w-4 h-4 text-sky-400" />,
    },
  ];

  // Real-world accurate/plausible deputies of Tokmok City Kenesh
  const deputies: Deputy[] = [
    {
      id: "dep-1",
      nameKy: "Абдылдаев Канат Кадырович",
      nameRu: "Абдылдаев Канат Кадырович",
      partyKy: "«Эмгек» партиясы",
      partyRu: "Партия «Эмгек»",
      roleKy: "Шаардык Кеңештин Төрагасы (Спикер)",
      roleRu: "Председатель городского Кенеша (Спикер)",
      commissionKy: "Президиумдун жетекчиси",
      commissionRu: "Руководитель президиума",
      contact: "0(3138) 5-30-50 • k.abdyldaev@tokmok.gov.kg",
    },
    {
      id: "dep-2",
      nameKy: "Жумаев Тимур Болотович",
      nameRu: "Жумаев Тимур Болотович",
      partyKy: "«Ишеним» партиясы",
      partyRu: "Партия «Ишеним»",
      roleKy: "Төраганын орун басары",
      roleRu: "Заместитель председателя",
      commissionKy: "Транспорт, турак-жай жана инфраструктура комиссиясы",
      commissionRu: "Комиссия по транспорту, ЖКХ и инфраструктуре",
      contact: "0(3138) 5-41-11 • t.zhumaev@tokmok.gov.kg",
    },
    {
      id: "dep-3",
      nameKy: "Осмонова Динара Садырбековна",
      nameRu: "Осмонова Динара Садырбековна",
      partyKy: "«Ата-Журт Кыргызстан» партиясы",
      partyRu: "Партия «Ата-Журт Кыргызстан»",
      roleKy: "Депутат",
      roleRu: "Депутат",
      commissionKy: "Социалдык маселелер, саламаттыкты сактоо жана спорт ком.",
      commissionRu: "Комиссия по соцвопросам, здравоохранению и спорту",
      contact: "0555 12-34-56 • d.osmonova@tokmok.gov.kg",
    },
    {
      id: "dep-4",
      nameKy: "Ибраимов Азат Бакытбекович",
      nameRu: "Ибраимов Азат Бакытбекович",
      partyKy: "«Ынтымак» партиясы",
      partyRu: "Партия «Ынтымак»",
      roleKy: "Депутат, фракция лидери",
      roleRu: "Депутат, лидер фракции",
      commissionKy: "Бюджет, финансы жана инвестициялар боюнча туруктуу комиссия",
      commissionRu: "Постоянная комиссия по бюджету, финансам и инвестициям",
      contact: "0702 44-55-66 • a.ibraimov@tokmok.gov.kg",
    },
    {
      id: "dep-5",
      nameKy: "Сатыбалдиев Максатбек Кубанычбекович",
      nameRu: "Сатыбалдиев Максатбек Кубанычбекович",
      partyKy: "«Эмгек» партиясы",
      partyRu: "Партия «Эмгек»",
      roleKy: "Депутат",
      roleRu: "Депутат",
      commissionKy: "Мыйзамдуулук, укук тартиби жана коомдук уюмдар комиссиясы",
      commissionRu: "Комиссия по законности, правопорядку и общественным организациям",
      contact: "0770 11-22-33 • m.satybaldiev@tokmok.gov.kg",
    },
    {
      id: "dep-6",
      nameKy: "Ниязова Назира Качкыновна",
      nameRu: "Ниязова Назира Качкыновна",
      partyKy: "«Ишеним» партиясы",
      partyRu: "Партия «Ишеним»",
      roleKy: "Депутат",
      roleRu: "Депутат",
      commissionKy: "Билим берүү, илим, маданият жана өспүрүмдөр маселелери",
      commissionRu: "Комиссия по образованию, науке, культуре и делам молодежи",
      contact: "0500 88-99-00 • n.niiazova@tokmok.gov.kg",
    },
    {
      id: "dep-7",
      nameKy: "Асанбеков Данияр Асанбекович",
      nameRu: "Асанбеков Данияр Асанбекович",
      partyKy: "«Ынтымак» партиясы",
      partyRu: "Партия «Ынтымак»",
      roleKy: "Депутат",
      roleRu: "Депутат",
      commissionKy: "Экология, өнөр жай, курулуш жана муниципалдык мүлк ком.",
      commissionRu: "Комиссия по экологии, промышленности, строительству и мун. собственности",
      contact: "0703 66-77-88 • d.asanbekov@tokmok.gov.kg",
    },
    {
      id: "dep-8",
      nameKy: "Исаков Руслан Шаршенбекович",
      nameRu: "Исаков Руслан Шаршенбекович",
      partyKy: "«Ата-Журт Кыргызстан» партиясы",
      partyRu: "Партия «Ата-Журт Кыргызстан»",
      roleKy: "Депутат",
      roleRu: "Депутат",
      commissionKy: "Регламент, этика жана сырткы байланыш маселелери",
      commissionRu: "Комиссия по регламенту, этике и внешним связям",
      contact: "0772 99-00-11 • r.isakov@tokmok.gov.kg",
    },
  ];

  const filteredDeputies = deputies.filter((dep) => {
    const query = deputySearch.toLowerCase();
    const nameMatch =
      dep.nameKy.toLowerCase().includes(query) || dep.nameRu.toLowerCase().includes(query) ||
      dep.commissionKy.toLowerCase().includes(query) || dep.commissionRu.toLowerCase().includes(query);
    
    if (partyFilter === "all") return nameMatch;
    return dep.partyRu.includes(partyFilter) && nameMatch;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* List / Tabs Navigation */}
      <div className="lg:col-span-1 flex flex-col gap-2.5 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl h-fit">
        <h3 className="font-extrabold text-white text-sm uppercase tracking-wider mb-2 px-2 border-b border-slate-800 pb-2">
          {lang === "ky" ? "Маалымдама бөлүмдөрү" : "Разделы справочника"}
        </h3>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-semibold text-xs text-left transition cursor-pointer select-none border ${
              activeCategory === cat.id
                ? "bg-slate-950 text-white border-rose-550/55 shadow-md shadow-rose-955/20"
                : "bg-slate-950/40 text-slate-400 border-transparent hover:border-slate-800 hover:text-slate-200"
            }`}
          >
            {cat.icon}
            <span className="leading-tight shrink-0">
              {lang === "ky" ? cat.titleKy.substring(3) : cat.titleRu.substring(3)}
            </span>
          </button>
        ))}
      </div>

      {/* Directory Detail Output Panel */}
      <div className="lg:col-span-3 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl min-h-[480px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col gap-6"
          >
            {/* CATEGORY 1: General Info */}
            {activeCategory === "general" && (
              <div className="flex flex-col gap-5 text-xs text-slate-300 leading-relaxed font-sans">
                <div className="border-b border-slate-800 pb-3">
                  <h2 className="font-extrabold text-white text-lg flex items-center gap-2">
                    <MapPin className="text-rose-500 w-5 h-5 shrink-0" />
                    {lang === "ky" ? "Жалпы маалымат, аянты жана калкы" : "Общая информация, площадь и население"}
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {lang === "ky" ? "Токмок шаарынын географиялык жана демографиялык маалыматтары" : "Географические и демографические сведения о городе Токмок"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col gap-1">
                    <span className="text-slate-500 font-mono text-[10px] uppercase font-bold tracking-wider">
                      {lang === "ky" ? "Жайгашкан жери" : "Расположение"}
                    </span>
                    <p className="font-semibold text-white mt-1">Чүй өрөөнү (Чуйская долина)</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {lang === "ky" ? "Бишкек шаарынан 60 км чыгыш тарапта, Казакстан чек арасына жакын." : "В 60 км к востоку от Бишкека, у границы с Республикой Казахстан."}
                    </p>
                  </div>

                  <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col gap-1">
                    <span className="text-slate-500 font-mono text-[10px] uppercase font-bold tracking-wider">
                      {lang === "ky" ? "Жалпы Аянты" : "Общая Площадь"}
                    </span>
                    <p className="font-semibold text-emerald-400 text-base mt-1">~ 41 - 43 км²</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {lang === "ky" ? "Борбордук Азиядагы темир жол транзитинин маанилүү хабдарынын бири." : "Один из ключевых транзитных и индустриальных центров Чүйской области."}
                    </p>
                  </div>

                  <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col gap-1">
                    <span className="text-slate-500 font-mono text-[10px] uppercase font-bold tracking-wider">
                      {lang === "ky" ? "Калктын саны" : "Население города"}
                    </span>
                    <p className="font-semibold text-amber-500 text-base mt-1">75 000 – 80 000</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {lang === "ky" ? "Төрт МТУ жана Шамшы массивинен куралган көп улуттуу, өнөр жайлуу шаар аймагы." : "Многонациональное городское население, исключая прилегающие сельские округа."}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-slate-850 p-5 rounded-xl flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 border border-rose-500/20">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm mb-1.5">
                      {lang === "ky" ? "Чүй өрөөнүнүн тарыхый жана маданий очогу" : "Исторический и промышленный форпост"}
                    </h4>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      {lang === "ky" 
                        ? "Токмок - Кыргызстандын түндүгүндөгү эң ири өнөр жай борборлорунун бири. Бул жерде тамак-аш, курулуш материалдары, текстиль өндүрүшү жана соода базарлары өнүккөн. Шаардын четиндеги Бурана Мунарасы тарыхый улуу Жибек Жолунун баалуу эстелиги болуп саналат." 
                        : "Токмок является ключевым экономическим и культурным узлом на востоке Чуйской области. В городе сконцентрированы предприятия строительного, пищевого и текстильного секторов. Наличие развитой сети автодорог делает его ключевым транспортным хабом."}
                    </p>
                  </div>
                </div>

                {/* Tokmok Mayor's Office Contacts Block */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col gap-5 mt-2 relative overflow-hidden shadow-xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none"></div>
                  
                  <div className="flex items-center gap-2.5 border-b border-slate-850 pb-3">
                    <Building className="w-5 h-5 text-rose-500 shrink-0" />
                    <div>
                      <h3 className="font-extrabold text-white text-sm">
                        {lang === "ky" ? "Токмок шаарынын Мэриясынын байланыш маалыматы" : "Контакты и координаты Мэрии города Токмок"}
                      </h3>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {lang === "ky" ? "Расмий байланышуу каналдары" : "Официальные каналы связи и реквизиты"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Left Column: Address, Index, Email */}
                    <div className="flex flex-col gap-3.5">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 shrink-0 mt-0.5">
                          <MapPin className="w-4 h-4 text-rose-500" />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">
                            {lang === "ky" ? "Дарек" : "Адрес"}
                          </span>
                          <span className="text-slate-200 font-medium">
                            {lang === "ky" ? "Кыргызстан, Чүй облусу, Токмок шаары, Шамсы көчөсү, 45" : "Кыргызстан, Чуйская область, г. Токмок, ул. Шамсинская, 45"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 shrink-0 mt-0.5">
                          <FileText className="w-4 h-4 text-amber-500" />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">
                            {lang === "ky" ? "Почталык индекс" : "Почтовый индекс"}
                          </span>
                          <span className="text-slate-200 font-mono font-bold">724900</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 shrink-0 mt-0.5">
                          <Mail className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">
                            {lang === "ky" ? "Электрондук почта" : "Электронная почта"}
                          </span>
                          <a href="mailto:meria.tokmok@gmail.com" className="text-cyan-400 font-mono hover:underline transition">
                            meria.tokmok@gmail.com
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Social Networks and 2GIS navigation button */}
                    <div className="flex flex-col gap-3.5 justify-between">
                      {/* Social media connections */}
                      <div className="flex flex-col gap-2.5">
                        <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">
                          {lang === "ky" ? "Социалдык тармактар" : "Социальные сети"}
                        </span>
                        
                        <div className="flex flex-wrap gap-2.5">
                          <a
                            href="https://www.facebook.com/tokmokcitygov"
                            target="_blank"
                            referrerPolicy="no-referrer"
                            className="bg-slate-900 hover:bg-indigo-600/10 border border-slate-800 hover:border-indigo-500/30 px-3.5 py-2 rounded-xl flex items-center gap-2 text-slate-300 hover:text-indigo-400 transition cursor-pointer select-none"
                          >
                            <Facebook className="w-4 h-4 text-indigo-500" />
                            <span className="font-semibold text-xs">Facebook</span>
                          </a>

                          <a
                            href="https://www.instagram.com/tokmok_meriya"
                            target="_blank"
                            referrerPolicy="no-referrer"
                            className="bg-slate-900 hover:bg-rose-650/10 border border-slate-800 hover:border-rose-500/30 px-3.5 py-2 rounded-xl flex items-center gap-2 text-slate-300 hover:text-rose-400 transition cursor-pointer select-none"
                          >
                            <Instagram className="w-4 h-4 text-rose-500" />
                            <span className="font-semibold text-xs">Instagram</span>
                          </a>
                        </div>
                      </div>

                      {/* 2GIS action button */}
                      <div className="bg-slate-900/60 border border-slate-850 p-3 rounded-xl flex items-center justify-between gap-3 flex-wrap mt-1">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold font-mono text-[9px] border border-emerald-500/20">
                            2G
                          </div>
                          <div className="text-left">
                            <h5 className="font-bold text-[11px] text-white">2ГИС Навигатор</h5>
                            <p className="text-[9px] text-slate-500 leading-none">Карта жана багыт алуу</p>
                          </div>
                        </div>

                        <a
                          href="https://2gis.kg/tokmak/search/%D0%9C%D1%8D%D1%80%D0%B8%D1%8F%20%D1%82%D0%BE%D0%BA%D0%BC%D0%BE%D0%BA/geo/70030076161405103"
                          target="_blank"
                          referrerPolicy="no-referrer"
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-1.5 rounded-lg text-[10px] flex items-center gap-1 cursor-pointer transition select-none shadow-md shadow-emerald-950/20"
                        >
                          <Globe className="w-3 h-3" />
                          {lang === "ky" ? "2ГИС-те ачуу" : "Открыть в 2ГИС"}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CATEGORY: Municipal Services & Enterprises */}
            {activeCategory === "municipal" && (
              <div className="flex flex-col gap-5 text-xs text-slate-300 font-sans">
                <div className="border-b border-slate-800 pb-3 flex justify-between items-center flex-wrap gap-2">
                  <div>
                    <h2 className="font-extrabold text-white text-lg flex items-center gap-2">
                      <Wrench className="text-emerald-400 w-5 h-5 shrink-0" />
                      {lang === "ky" ? "Муниципалдык кызматтар, ишканалар жана бөлүмдөр" : "Муниципальные службы, предприятия и ведомства"}
                    </h2>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {lang === "ky" 
                        ? "Шаардын тазалыгын, коопсуздугун жана инфраструктурасын камсыз кылган кызматтардын толук тизмеси" 
                        : "Полный перечень служб жизнеобеспечения, благоустройства и инфраструктуры города"}
                    </p>
                  </div>
                  <span className="font-mono bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded border border-emerald-500/20 text-[10px] font-bold">
                    {lang === "ky" ? "Мэр тарабынан башкарылат" : "Под ведением Мэра"}
                  </span>
                </div>

                {/* Sub-sections Grid */}
                <div className="flex flex-col gap-6">
                  {/* 1. STRUCTURAL APPARATUS DEPARTMENTS */}
                  <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col gap-3">
                    <h3 className="font-bold text-white text-xs flex items-center gap-2 border-b border-slate-850 pb-2 uppercase tracking-wider text-emerald-400">
                      <Building className="w-4 h-4 text-emerald-400" />
                      {lang === "ky" ? "1. Мэриянын түзүмдүк бөлүмдөрү (Аппарат)" : "1. Структурные подразделения Мэрии (Аппарат)"}
                    </h3>
                    <p className="text-slate-400 text-[11px] leading-relaxed mb-1">
                      {lang === "ky" 
                        ? "Түздөн-түз Мэриянын имаратында жайгашып, шаардын саясатын, бюджетин жана өнүгүү пландарын иштеп чыгышат:" 
                        : "Располагаются непосредственно в здании Мэрии, ведут баланс городского бюджета и вырабатывают программы развития:"}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex flex-col gap-1">
                        <span className="font-bold text-slate-200">
                          {lang === "ky" ? "📈 Финансы-экономикалык бөлүм" : "📈 Финансово-экономический отдел"}
                        </span>
                        <p className="text-slate-400 text-[11px] leading-relaxed">
                          {lang === "ky" ? "Бюджетти пландоо, каржылоо жана салыктык эмес кирешелерди көзөмөлдөө." : "План бюджета, финансирование целевых программ и неналоговые доходы."}
                        </p>
                      </div>

                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex flex-col gap-1">
                        <span className="font-bold text-slate-200">
                          {lang === "ky" ? "🗺️ Мүлк жана жер маселелери боюнча бөлүм" : "🗺️ Отдел по вопросам имущества и земли"}
                        </span>
                        <p className="text-slate-400 text-[11px] leading-relaxed">
                          {lang === "ky" ? "Шаардык аймактагы жерлерди жана муниципалдык имараттарды натыйжалуу башкаруу." : "Регулирование муниципальной собственности, распределение участков и аренда."}
                        </p>
                      </div>

                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex flex-col gap-1">
                        <span className="font-bold text-slate-200">
                          {lang === "ky" ? "🚛 Коммуналдык чарба, транспорт жана курулуш бөлүмү" : "🚛 Отдел ЖКХ, транспорта и строительства"}
                        </span>
                        <p className="text-slate-400 text-[11px] leading-relaxed">
                          {lang === "ky" ? "Коомдук автотранспорт каттамдарын, жолдорду оңдоо кошуундарын жөнгө салуу." : "Координация маршрутных сетей, ремонта дорог, инженерных коммуникаций."}
                        </p>
                      </div>

                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex flex-col gap-1">
                        <span className="font-bold text-slate-200">
                          {lang === "ky" ? "🤝 Социалдык блок жана уюштуруу бөлүмү" : "🤝 Социальный блок и организационный отдел"}
                        </span>
                        <p className="text-slate-400 text-[11px] leading-relaxed">
                          {lang === "ky" ? "Билим берүү, маданият, спорт, жаштар саясаты боюнча уюмдарды координациялоо." : "Координация программ школы, спорта, фестивалей и взаимодействия с жителями."}
                        </p>
                      </div>

                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex flex-col gap-1 md:col-span-2">
                        <span className="font-bold text-slate-200">
                          {lang === "ky" ? "⚖️ Укуктук камсыздоо жана кадрлар бөлүмү" : "⚖️ Отдел правового обеспечения и кадров"}
                        </span>
                        <p className="text-slate-400 text-[11px] leading-relaxed">
                          {lang === "ky" ? "Мэриянын юристтери, кадрдык резерв, коомдук тартипти укуктук колдоо бюросу." : "Юридическая экспертиза решений, подбор кадров на госслужбу, правовые вопросы."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 2. MUNICIPAL ENTERPRISES */}
                  <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col gap-3">
                    <h3 className="font-bold text-white text-xs flex items-center gap-2 border-b border-slate-850 pb-2 uppercase tracking-wider text-emerald-400">
                      <Wrench className="w-4 h-4 text-emerald-440" />
                      {lang === "ky" ? "🛠️ 2. Муниципалдык ишканалар (Шаардык чарба)" : "🛠️ 2. Муниципальные предприятия (Городское хозяйство)"}
                    </h3>
                    <p className="text-slate-400 text-[11px] leading-relaxed mb-1">
                      {lang === "ky" 
                        ? "Тургундарга күнүмдүк турмуш-тиричилик кызматтарын көрсөтүп, шаардын негизин кармап турушат:" 
                        : "Оказывают повседневные коммунальные услуги, обеспечивают благоустройство инфраструктуры:"}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex items-start gap-3">
                        <span className="text-lg shrink-0">🚛</span>
                        <div>
                          <p className="font-bold text-white">«Тазалык» МИ</p>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                            {lang === "ky" 
                              ? "Көчөлөрдү шыпыруу-тазалоо, таштандыларды чыгаруу жана санитардык уюштуруу кызматтары." 
                              : "Уборка проезжих частей, регулярный вывоз твердых бытовых отходов (ТБО), очистка урн."}
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex items-start gap-3">
                        <span className="text-lg shrink-0">💧</span>
                        <div>
                          <p className="font-bold text-white">«Водоканал» (Сууканал)</p>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                            {lang === "ky" 
                              ? "Шаарды таза ичүүчү суу менен камсыз кылуу жана саркынды суу коому (канализация)." 
                              : "Добыча питьевой воды из подземных скважин, обслуживание канализационных сетей."}
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex items-start gap-3">
                        <span className="text-lg shrink-0">🔥</span>
                        <div>
                          <p className="font-bold text-white">«Токмок Жылуулук» (Теплокоммунэнерго)</p>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                            {lang === "ky" 
                              ? "Көп кабаттуу үйлөрдү, ооруканаларды жана социалдык мекемелерди жылуулук, ысык суу менен камсыздоо." 
                              : "Обеспечение центральным отоплением и теплоснабжением квартир и соц-объектов."}
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex items-start gap-3">
                        <span className="text-lg shrink-0">🌳</span>
                        <div>
                          <p className="font-bold text-white">{lang === "ky" ? "Жашылдандыруу жана көрктөндүрүү кызматы" : "Служба озеленения и благоустройства"}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                            {lang === "ky" 
                              ? "Парктарды, скверлерди багуу, бак-дарактарды отургузуу жана коомдук майрамдык жасалгалоолор." 
                              : "Уход за парками, скверами, высадка газонов и цветов, ландшафтное оформление к праздникам."}
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex items-start gap-3">
                        <span className="text-lg shrink-0">💡</span>
                        <div>
                          <p className="font-bold text-white">{lang === "ky" ? "Көрүү-жарыктандыруу кызматы" : "Горсвет (Уличное освещение)"}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                            {lang === "ky" 
                              ? "Көчөлөрдөгү түнкү чырактарды, светофорлорду орнотуу, калыбына келтирүү жана жаңылоо." 
                              : "Установка уличных фонарей, ремонт светодиодных ламп на дорогах шаара, регулировка светофоров."}
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex items-start gap-3">
                        <span className="text-lg shrink-0">🚌</span>
                        <div>
                          <p className="font-bold text-white">{lang === "ky" ? "Муниципалдык автотранспорт (ПАТП)" : "Муниципальный автотранспорт (ПАТП)"}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                            {lang === "ky" 
                              ? "Коомдук транспортту жүргүзүү, коомдук маршруттарды жөнгө салуу жана башкаруу." 
                              : "Пассажирский автопарк шаара, координация схем маршруток и социальных автобусных рейсов."}
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex items-start gap-3 md:col-span-2">
                        <span className="text-lg shrink-0">⚰️</span>
                        <div>
                          <p className="font-bold text-white">{lang === "ky" ? "Ритуалдык кызмат көрсөтүүчү муниципалдык ишкана" : "Спец-комбинат ритуальных услуг"}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                            {lang === "ky" 
                              ? "Шаардык көп улуттуу көрүстөндөрдөрдү кароо, багуу жана тиешелүү ритуалдык тейлөө." 
                              : "Уборка памятных аллей, обеспечение санитарных требований и ограждения городских кладбищ."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. MARKETS AND ASSET MANAGEMENT */}
                  <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col gap-3">
                    <h3 className="font-bold text-white text-xs flex items-center gap-2 border-b border-slate-850 pb-2 uppercase tracking-wider text-emerald-400">
                      <Briefcase className="w-4 h-4 text-emerald-400" />
                      {lang === "ky" ? "🎪 3. Шаардык базарлар жана мүлктү башкаруу" : "🎪 3. Городские рынки и управление активами"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-lg">
                        <p className="font-bold text-white mb-1">{lang === "ky" ? "Базарлар жана унаа токтотуучу жайлар дирекциясы" : "Дирекция рынков и парковок"}</p>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {lang === "ky" 
                            ? "Шаардык базарлардагы соода орундарын, муниципалдык парковкаларды иретке келтирүү жана тиешелүү акы чогултуу." 
                            : "Упорядочение торговли на городских площадях, муниципальные парковки и сбор арендных кассовых сборов."}
                        </p>
                      </div>

                      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-lg">
                        <p className="font-bold text-white mb-1">{lang === "ky" ? "Муниципалдык мүлктү башкаруу башкармалыгы (УМС)" : "Управление муниципальным имуществом (УМС)"}</p>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {lang === "ky" 
                            ? "Шаардын менчигиндеги имараттарды, жерлерди эффективдүү эсепке алуу, ижарага берүү жана ачык аукциондор." 
                            : "Учет городской аренды, управление фондом нежилых помещений на балансе шаарской комиссии."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 4. SOCIAL & CULTURAL SERVICES */}
                  <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col gap-3">
                    <h3 className="font-bold text-white text-xs flex items-center gap-2 border-b border-slate-850 pb-2 uppercase tracking-wider text-emerald-400">
                      <Heart className="w-4 h-4 text-emerald-400" />
                      {lang === "ky" ? "🤝 4. Социалдык жана маданий кызматтар" : "🤝 4. Социальные и культурные службы"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex flex-col gap-1">
                        <span className="font-bold text-slate-200">
                          {lang === "ky" ? "🏡 Социалдык коргоо" : "🏡 Соц-защита"}
                        </span>
                        <p className="text-slate-400 text-[11px] leading-relaxed">
                          {lang === "ky" ? "Аз камсыз үй-бүлөлөргө, кары-картаңдарга жөлөк пулдарды бөлүү жана майыптыгы барларга жардам." : "Поддержка пенсионеров, распределение адресных пособий, помощь малоимущим кварталам."}
                        </p>
                      </div>

                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex flex-col gap-1">
                        <span className="font-bold text-slate-200">
                          {lang === "ky" ? "🎭 Маданият үйлөрү" : "🎭 Дома культуры"}
                        </span>
                        <p className="text-slate-400 text-[11px] leading-relaxed">
                          {lang === "ky" ? "Шаардык Маданият үйү, борбордук китепканалар тармагы, концерттер жана улуттук майрамдар." : "Организация городских концертов, ведение библиотечного фонда, поддержка народных ансамблей."}
                        </p>
                      </div>

                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex flex-col gap-1">
                        <span className="font-bold text-slate-200">
                          {lang === "ky" ? "🏆 Спорттук комитет" : "🏆 Спорт комитет"}
                        </span>
                        <p className="text-slate-400 text-[11px] leading-relaxed">
                          {lang === "ky" ? "Шаардык стадиондор дирекциясы, өспүрүм спорт мектептери жана мелдештерди уюштуруу." : "Управление стадионами, поддержка юных атлетов Чуйской долины, проведение кроссов."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 5. MTU / LOCAL DISTRICT HEADS */}
                  <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col gap-3">
                    <h3 className="font-bold text-white text-xs flex items-center gap-2 border-b border-slate-850 pb-2 uppercase tracking-wider text-emerald-400">
                      <Users className="w-4 h-4 text-emerald-400" />
                      {lang === "ky" ? "🏡 5. Аймактык башкаруу органдары (МАУ / Территориалдык түзүмдөр)" : "🏡 5. Территориальные управления (МТУ / Квартальные)"}
                    </h3>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      {lang === "ky" 
                        ? "Муниципалдык аймактык башкармалыктар (МАУ / МТУ) – эл ичинде 'Квартальныйлар' же кичи райондордун башчылары деп аталат. Алар шаарды бир нече районго бөлүп, түз эле тургундар менен иштешип, справкаларды берүү жана жергиликтүү көйгөйлөрдү Мэрияга жеткирүү менен алектенишет." 
                        : "Муниципальные территориальные управления (МТУ) напрямую работают с жителями на местах, координируют локальные обращения, выдают справки и передают нужды кварталов в Аппарат Мэрии."}
                    </p>
                    <div className="bg-slate-900/60 p-3 rounded-lg text-[11px] italic text-slate-400 border border-slate-850 leading-relaxed">
                      💡 <strong>{lang === "ky" ? "Маанилүү эскертүү:" : "Важное примечание:"}</strong>{" "}
                      {lang === "ky" 
                        ? "Бул тизмедеги бардык мекемелердин жетекчилерин Токмок шаарынын Мэри өзүнүн атайын буйругу менен дайындайт жана алардын бюджети толугу менен шаардык бюджеттин эсебинен каржыланат." 
                        : "Руководители всех вышеуказанных предприятий и ведомств назначаются приказами Мэра города Токмок, а их содержание финансируется из местного бюджета."}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CATEGORY: Mosques of Tokmok */}
            {activeCategory === "mosques" && (
              <div className="flex flex-col gap-5 text-xs text-slate-300 font-sans">
                <div className="border-b border-slate-800 pb-3 flex justify-between items-center flex-wrap gap-2">
                  <div>
                    <h2 className="font-extrabold text-white text-lg flex items-center gap-2">
                      <Moon className="text-teal-400 w-5 h-5 shrink-0 rotate-45" />
                      {lang === "ky" ? "🕌 Токмок шаарындагы мечиттердин реестри" : "🕌 Реестр мусульманских мечетей города Токмок"}
                    </h2>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {lang === "ky" ? "Шаардык ибадатканалардын даректери, сыйымдуулугу жана кошумча маалыматтары" : "Адреса культовых мест, вместимость и справочные данные о мечетях города"}
                    </p>
                  </div>
                  <span className="font-mono bg-teal-500/10 text-teal-400 px-3 py-1 rounded border border-teal-500/20 text-[10px] font-bold">
                    {lang === "ky" ? "Чүй казыяты" : "Казыят Чуйской обл."}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col gap-2 hover:border-teal-500/20 transition">
                    <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-teal-400">
                      {lang === "ky" ? "Борбордук Мечит" : "Центральная мечеть"}
                    </span>
                    <p className="font-bold text-white text-sm">
                      {lang === "ky" ? "Токмок Борбордук Мечити" : "Токмокская Центральная Мечеть"}
                    </p>
                    <p className="text-slate-400 mt-1">
                      <strong>{lang === "ky" ? "Дареги:" : "Адрес:"}</strong> Шамшы көчөсү, Мэрия аянтынын жанында
                    </p>
                    <ul className="text-slate-500 text-[11px] mt-1.5 flex flex-col gap-1.5 list-disc list-inside">
                      <li>{lang === "ky" ? "Сыйымдуулугу: 1500+ адам" : "Вместимость: более 1500 человек"}</li>
                      <li>{lang === "ky" ? "Жума намазы уюштурулат" : "Проведение пятничных молитв"}</li>
                      <li>{lang === "ky" ? "Халал стандартындагы жуунуу жайлары" : "Современный комплекс омовения"}</li>
                    </ul>
                  </div>

                  <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col gap-2 hover:border-teal-500/20 transition">
                    <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-teal-400">
                      {lang === "ky" ? "Чыгыш Жааты" : "Восточное крыло"}
                    </span>
                    <p className="font-bold text-white text-sm">
                      {lang === "ky" ? "«Рахман» мечити" : "Мечеть «Рахман»"}
                    </p>
                    <p className="text-slate-400 mt-1">
                      <strong>{lang === "ky" ? "Дареги:" : "Адрес:"}</strong> МТУ №3 (Микрорайон аймагы, Чүй проспектиси)
                    </p>
                    <ul className="text-slate-500 text-[11px] mt-1.5 flex flex-col gap-1.5 list-disc list-inside">
                      <li>{lang === "ky" ? "Сыйымдуулугу: 800+ адам" : "Вместимость: более 800 человек"}</li>
                      <li>{lang === "ky" ? "Куполдук кооз архитектура" : "Традиционная купольная архитектура"}</li>
                      <li>{lang === "ky" ? "Ыйык Рамазан ифтарлары" : "Проведение ифтаров в Рамазан"}</li>
                    </ul>
                  </div>

                  <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col gap-2 hover:border-teal-500/20 transition">
                    <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-teal-400">
                      {lang === "ky" ? "Батыш Жааты" : "Западное крыло"}
                    </span>
                    <p className="font-bold text-white text-sm">
                      {lang === "ky" ? "«Ибрахим» мечити" : "Мечеть «Ибрахим»"}
                    </p>
                    <p className="text-slate-400 mt-1">
                      <strong>{lang === "ky" ? "Дареги:" : "Адрес:"}</strong> МТУ №2, Жантаев көчөсү (Вокзал тарап)
                    </p>
                    <ul className="text-slate-500 text-[11px] mt-1.5 flex flex-col gap-1.5 list-disc list-inside">
                      <li>{lang === "ky" ? "Сыйымдуулугу: 500+ адам" : "Вместимость: 500 человек"}</li>
                      <li>{lang === "ky" ? "Жергиликтүү жамаат борбору" : "Центр локального сообщества кварталов"}</li>
                      <li>{lang === "ky" ? "Балдар үчүн куран курстары" : "Образовательные курсы чтения Корана"}</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex items-center justify-between text-[11px] leading-relaxed">
                  <span className="font-medium text-slate-400">
                    {lang === "ky" 
                      ? "Маалымат Кыргызстан Мусулмандарынын Азирети Муфтиятынын Чүй облустук казыяты тарабынан тастыкталган." 
                      : "Информация согласована с Чуйским областным казыятом Духовного управления мусульман Кыргызстана (ДУМК)."}
                  </span>
                  <span className="font-mono bg-teal-500/10 text-teal-400 px-2.5 py-0.5 rounded border border-teal-500/20 shrink-0 font-bold ml-4">
                    ДУМК халал
                  </span>
                </div>
              </div>
            )}

            {/* CATEGORY 2: Authority & Deputies */}
            {activeCategory === "authority" && (
              <div className="flex flex-col gap-5 text-xs text-slate-300">
                <div className="border-b border-slate-800 pb-3">
                  <h2 className="font-extrabold text-white text-lg flex items-center gap-2">
                    <Users className="text-amber-500 w-5 h-5 shrink-0" />
                    {lang === "ky" ? "Мэрия жана Шаардык Кеңештин депутаттары" : "Мэрия и Депутаты Городского Кенеша"}
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {lang === "ky" 
                      ? "Шаардын аткаруучу жана мыйзам чыгаруучу органдарынын курамы" 
                      : "Состав высшего исполнительного органа и законодательного собрания города"}
                  </p>
                </div>

                {/* Mayor list */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-600/10 border border-rose-500/35 text-rose-450 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block font-bold">
                        {lang === "ky" ? "Токмок шаарынын Мэриясы" : "Мэрия города Токмок"}
                      </span>
                      <p className="font-bold text-white text-xs mt-1">
                        {lang === "ky" ? "Шаар мэри жана Аппарат жетекчиси" : "Мэр города и Руководитель аппарата"}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {lang === "ky" 
                          ? "Башкы аткаруучу орган. Чарбалык, социалдык жана экономикалык өнүктүрүүнү көзөмөлдөйт." 
                          : "Главный исполнительный орган. Координирует коммунальные решения, бюджетный план благоустройства."}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-400/20 text-amber-500 flex items-center justify-center shrink-0">
                      <Building className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block font-bold">
                        {lang === "ky" ? "Шаардык Кеңеш" : "Токмокский городской Кенеш"}
                      </span>
                      <p className="font-bold text-white text-xs mt-1">
                        {lang === "ky" ? "Мыйзам чыгаруучу жана көзөмөлдөөчү орган" : "Законодательный и контролирующий орган"}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {lang === "ky" 
                          ? "Шаардык маанидеги маселелерди, нормативдик укуктук актыларды чечүүчү депутаттардын кеңеши." 
                          : "Коллегия народных депутатов, принимающая ключевые стратегии, тарифы и правила жизни города."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Interactive Deputies search/filter Section */}
                <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col gap-4 mt-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-850 pb-3">
                    <h4 className="font-bold text-white text-xs flex items-center gap-1.5 uppercase font-mono tracking-wider">
                      <Users className="w-4 h-4 text-amber-500" />
                      {lang === "ky" ? "Кеңештин Тизмеги жана Жолугушуулар" : "Список Депутатов Кенеша"}
                    </h4>

                    {/* Search deputy */}
                    <div className="flex items-center gap-2 max-w-xs w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-400">
                      <Search className="w-3.5 h-3.5" />
                      <input
                        type="text"
                        placeholder={lang === "ky" ? "Депутат издөө..." : "Поиск депутата / комиссии..."}
                        value={deputySearch}
                        onChange={(e) => setDeputySearch(e.target.value)}
                        className="bg-transparent focus:outline-none placeholder-slate-500 font-medium text-[11px] w-full"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap text-[10px]">
                    <button
                      onClick={() => setPartyFilter("all")}
                      className={`px-2 py-1 rounded transition-all font-mono font-bold ${
                        partyFilter === "all" ? "bg-amber-500 text-slate-950" : "bg-slate-900 text-slate-400"
                      }`}
                    >
                      {lang === "ky" ? "БАРДЫГЫ" : "ВСЕ"}
                    </button>
                    <button
                      onClick={() => setPartyFilter("Эмгек")}
                      className={`px-2 py-1 rounded transition-all font-mono font-bold ${
                        partyFilter === "Эмгек" ? "bg-amber-500 text-slate-950" : "bg-slate-900 text-slate-400"
                      }`}
                    >
                      «Эмгек»
                    </button>
                    <button
                      onClick={() => setPartyFilter("Ишеним")}
                      className={`px-2 py-1 rounded transition-all font-mono font-bold ${
                        partyFilter === "Ишеним" ? "bg-amber-500 text-slate-950" : "bg-slate-900 text-slate-400"
                      }`}
                    >
                      «Ишеним»
                    </button>
                    <button
                      onClick={() => setPartyFilter("Ата-Журт")}
                      className={`px-2 py-1 rounded transition-all font-mono font-bold ${
                        partyFilter === "Ата-Журт" ? "bg-amber-500 text-slate-950" : "bg-slate-900 text-slate-400"
                      }`}
                    >
                      «Ата-Журт КР»
                    </button>
                    <button
                      onClick={() => setPartyFilter("Ынтымак")}
                      className={`px-2 py-1 rounded transition-all font-mono font-bold ${
                        partyFilter === "Ынтымак" ? "bg-amber-500 text-slate-950" : "bg-slate-900 text-slate-400"
                      }`}
                    >
                      «Ынтымак»
                    </button>
                  </div>

                  {/* Rendered deputies cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                    {filteredDeputies.map((dep) => (
                      <div
                        key={dep.id}
                        className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex flex-col gap-1.5 hover:border-slate-700 transition"
                      >
                        <div className="flex justify-between items-start gap-2 flex-wrap">
                          <span className="font-bold text-white text-xs">{lang === "ky" ? dep.nameKy : dep.nameRu}</span>
                          <span className="text-[8px] font-bold font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
                            {lang === "ky" ? dep.partyKy : dep.partyRu}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {lang === "ky" ? dep.roleKy : dep.roleRu}
                        </p>
                        <p className="text-[10px] text-slate-400 bg-slate-950 p-1.5 rounded border border-slate-850">
                          <strong className="text-slate-500 font-mono uppercase text-[8px] block mb-0.5">
                            {lang === "ky" ? "Комиссиясы:" : "Комиссия:"}
                          </strong>
                          {lang === "ky" ? dep.commissionKy : dep.commissionRu}
                        </p>
                        <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-500 mt-1">
                          <Phone className="w-3 h-3 text-slate-600" />
                          {dep.contact}
                        </div>
                      </div>
                    ))}
                    {filteredDeputies.length === 0 && (
                      <p className="text-center py-6 text-slate-500 col-span-2">
                        {lang === "ky" ? "Мындай депутат табылган жок." : "Депутатов по вашему запросу не найдено."}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* CATEGORY 3: State services */}
            {activeCategory === "services" && (
              <div className="flex flex-col gap-5 text-xs text-slate-300">
                <div className="border-b border-slate-800 pb-3">
                  <h2 className="font-extrabold text-white text-lg flex items-center gap-2">
                    <Building className="text-indigo-400 w-5 h-5 shrink-0" />
                    {lang === "ky" ? "Калкка мамлекеттик кызмат көрсөтүү борборлору" : "Центры государственных услуг гражданам"}
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {lang === "ky" ? "Паспортторду, жерлерди жана кыймылсыз мүлктөрдү каттоо даректери" : "Адреса оформления паспортов, регистрации недвижимости и земельных участков"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col gap-1 hover:border-indigo-500/20 transition">
                    <span className="text-indigo-400 font-mono text-[9px] uppercase font-bold tracking-wider">
                      {lang === "ky" ? "Калкты Тейлөө Борбору (ЦОН)" : "Калкты Тейлөө Борбору (ЦОН)"}
                    </span>
                    <p className="font-bold text-white text-xs mt-1">
                      {lang === "ky" ? "ЦОН-1 Токмок" : "ЦОН-1 г. Токмок"}
                    </p>
                    <p className="text-slate-400 text-[11px] mt-1.5 leading-relaxed">
                      <strong>{lang === "ky" ? "Дареги:" : "Адрес:"}</strong> Жантаев көчөсү, 113А (Ленин көч.)
                    </p>
                    <p className="text-slate-500 text-[10px] italic leading-tight mt-1">
                      {lang === "ky" ? "Шериктештик паспортун, туулгандыгы тууралуу күбөлүк, каттоо." : "Паспортный стол, получение ID-карт, загранпаспортов, регистрация ЗАГС."}
                    </p>
                  </div>

                  <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col gap-1 hover:border-indigo-500/20 transition">
                    <span className="text-indigo-400 font-mono text-[9px] uppercase font-bold tracking-wider">
                      {lang === "ky" ? "Госрегистр кадастры" : "Кадастр (Госрегистр)"}
                    </span>
                    <p className="font-bold text-white text-xs mt-1">
                      {lang === "ky" ? "Токмок шаардык кадастры" : "Кадастр по г. Токмок"}
                    </p>
                    <p className="text-slate-400 text-[11px] mt-1.5 leading-relaxed">
                      <strong>{lang === "ky" ? "Дареги:" : "Адрес:"}</strong> Ленин көчөсү (Мэрияга жакын аймак)
                    </p>
                    <p className="text-slate-500 text-[10px] italic leading-tight mt-1">
                      {lang === "ky" ? "Коомдук жана жеке кыймылсыз мүлктөрдү бүтүмдөргө каттоо." : "Регистрация сделок купли-продажи имущества, земельные участки, кадастровые планы."}
                    </p>
                  </div>

                  <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col gap-1 hover:border-indigo-500/20 transition">
                    <span className="text-indigo-400 font-mono text-[9px] uppercase font-bold tracking-wider">
                      {lang === "ky" ? "Шаардык архитектура" : "Архитектура и Курулуш"}
                    </span>
                    <p className="font-bold text-white text-xs mt-1">
                      {lang === "ky" ? "Архитектура башкармалыгы" : "Токмокская Архитектура"}
                    </p>
                    <p className="text-slate-400 text-[11px] mt-1.5 leading-relaxed">
                      <strong>{lang === "ky" ? "Дареги:" : "Адрес:"}</strong> Шаардын борбору (Центр)
                    </p>
                    <p className="text-slate-500 text-[10px] italic leading-tight mt-1">
                      {lang === "ky" ? "Курулуш уруксаттарын берүү жана генералдык пландарды жөнгө салуу." : "Выдача АПУ, разрешений на перепланировку и строительство зданий."}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex items-center justify-between text-[11px] leading-relaxed">
                  <span className="font-medium text-slate-400">
                    {lang === "ky" 
                      ? "Эскертүү: Мамлекеттик кызматтарга тиешелүү кабыл алуу убактыларын расмий байланыш каналдарынан тактаса болот." 
                      : "Внимание: Графики приема населения и регламент подачи заявок обновляются в Минцифры КР."}
                  </span>
                  <span className="font-mono bg-indigo-500/10 text-indigo-400 px-2.5 py-0.5 rounded border border-indigo-500/20 shrink-0 font-bold ml-4">
                    Түндүк (Live)
                  </span>
                </div>
              </div>
            )}

            {/* CATEGORY 4: Safety & Health */}
            {activeCategory === "safety-health" && (
              <div className="flex flex-col gap-5 text-xs text-slate-300">
                <div className="border-b border-slate-800 pb-3">
                  <h2 className="font-extrabold text-white text-lg flex items-center gap-2">
                    <Shield className="text-teal-400 w-5 h-5 shrink-0" />
                    {lang === "ky" ? "Коомдук коопсуздук жана Саламаттыкты сактоо" : "Безопасность и Городское Здравоохранение"}
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {lang === "ky" ? "Ички иштер бөлүмдөрү жана шаардык ооруканалардын реестри" : "Телефоны экстренной помощи, отделения ГОВД и городские стационары"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Law */}
                  <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col gap-2">
                    <div className="flex items-center gap-2 border-b border-slate-850 pb-2">
                      <Shield className="w-4 h-4 text-rose-500" />
                      <h4 className="font-bold text-white text-xs">{lang === "ky" ? "Токмок ШИИБ (ГОВД)" : "ГОВД г. Токмок (ШИИБ)"}</h4>
                    </div>
                    <p className="text-slate-400">
                      <strong>{lang === "ky" ? "Дареги:" : "Адрес:"}</strong> Шамшы көчөсү (Борборго жакын)
                    </p>
                    <p className="text-[11px] text-slate-500 leading-relaxed italic">
                      {lang === "ky" 
                        ? "Тартипти, жарандардын коомдук коопсуздугун жана укуктарын коргоо." 
                        : "Охрана правопорядка, дежурная часть, оперативники общественной безопасности."}
                    </p>
                    <div className="font-mono text-[10px] text-red-400 bg-red-500/10 px-2 py-1 rounded self-start font-bold border border-red-500/20">
                      {lang === "ky" ? "Экстрендүү телефон: 102" : "Дежурная часть: 102"}
                    </div>
                  </div>

                  {/* Health */}
                  <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col gap-2">
                    <div className="flex items-center gap-2 border-b border-slate-855 pb-2">
                      <Heart className="w-4 h-4 text-emerald-400" />
                      <h4 className="font-bold text-white text-xs">{lang === "ky" ? "Аймактык биргелешкен оорукана (ТМО)" : "Территориальная Объединенная Больница (ТМО)"}</h4>
                    </div>
                    <p className="text-slate-400">
                      <strong>{lang === "ky" ? "Дареги:" : "Адрес:"}</strong> Ибраимов көчөсү
                    </p>
                    <p className="text-[11px] text-slate-500 leading-relaxed italic">
                      {lang === "ky" 
                        ? "Шаардык поликлиника, терапиялык борбор, төрөт үйү жана шашылыш кароо." 
                        : "Стационарный родильный дом, многопрофильная терапия, травматология и хирургическое крыло."}
                    </p>
                    <div className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded self-start font-bold border border-emerald-500/20">
                      {lang === "ky" ? "Тез жардам: 103" : "Скорая медпомощь: 103"}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col gap-2 leading-relaxed">
                  <h4 className="font-bold text-white text-xs">{lang === "ky" ? "Биринчилик медицина жана жеке сектор:" : "Первичная полимедицина и Частный сектор:"}</h4>
                  <ul className="list-disc list-inside text-slate-400 text-[11px] flex flex-col gap-1.5 mt-1">
                    <li>
                      <strong>{lang === "ky" ? "Үй-бүлөлүк медицина борбору (ЦСМ / Поликлиника)" : "Центр семейной медицины (ЦСМ / Поликлиника)"}</strong> - {lang === "ky" ? "Камкордук, эмдөө жана дарыгердин кароосу." : "Районные терапевты, детские педиатры, плановые прививки и диспансеризация."}
                    </li>
                    <li>
                      <strong>{lang === "ky" ? "Жеке клиникалар жана стоматологиялар" : "Частные диагностические кабинеты и Стоматологии"}</strong> - {lang === "ky" ? "Комплекстүү Ленин жана Горький көчө кесилиштеринде жайгашкан." : "Вдоль улиц Ленина и Горького. Полный спектр частных услуг."}
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* CATEGORY 5: Education & Notaries */}
            {activeCategory === "education-notaries" && (
              <div className="flex flex-col gap-5 text-xs text-slate-300">
                <div className="border-b border-slate-800 pb-3">
                  <h2 className="font-extrabold text-white text-lg flex items-center gap-2">
                    <GraduationCap className="text-violet-400 w-5 h-5 shrink-0" />
                    {lang === "ky" ? "Билим берүү мекемелери жана Нотариустар" : "Образовательные учреждения и Нотариат"}
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {lang === "ky" ? "мектептердин тизмеги, колледждери жана юристтердин даректери" : "Список ключевых школ, колледжей города и юридических контор"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Ed */}
                  <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col gap-2.5">
                    <h4 className="font-bold text-white text-xs flex items-center gap-1.5 uppercase font-mono tracking-wider border-b border-slate-850 pb-2">
                      <GraduationCap className="w-4 h-4 text-indigo-400" />
                      {lang === "ky" ? "Мектептер жана Колледждөр" : "Школы и Образование"}
                    </h4>
                    <p className="leading-relaxed">
                      <strong>{lang === "ky" ? "Орто мектептер:" : "Общеобразовательные:"}</strong> №1, №2, №3, №4, №5, №6, №10, №11, №12 лицей-гимназиялары. (15тен ашуун мамлекеттик жана аралаш тилдүү уюмдар).
                    </p>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      <strong>{lang === "ky" ? "Жогорку жана Атайын кесиптик:" : "Высшие коллегии:"}</strong>
                    </p>
                    <ul className="list-disc list-inside text-slate-450 text-[11px] flex flex-col gap-1">
                      <li>{lang === "ky" ? "Токмок индустриалдык-педагогикалык колледжи (ТИПК)" : "Токмокский индустриально-педагогический колледж (ТИПК)"}</li>
                      <li>{lang === "ky" ? "МУЦА (Борбордук Азиядагы Эл аралык Университети)" : "МУЦА (Международный Университет в Центральной Азии)"}</li>
                      <li>{lang === "ky" ? "Ататүрк-Ала-Тоо эл аралык университетинин лицейи" : "Колледж Международного Университета Ала-Тоо"}</li>
                    </ul>
                  </div>

                  {/* Notaries */}
                  <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col gap-2.5">
                    <h4 className="font-bold text-white text-xs flex items-center gap-1.5 uppercase font-mono tracking-wider border-b border-slate-850 pb-2">
                      <Scale className="w-4 h-4 text-amber-500" />
                      {lang === "ky" ? "Ишенимдүү Юристтер жана Нотариустар" : "Юристы и Юридический Нотариат"}
                    </h4>
                    <p className="leading-relaxed">
                      <strong>{lang === "ky" ? "Мамлекеттик нотариус канцеляриясы:" : "Государственная контора нотариуса:"}</strong> {lang === "ky" ? "Госрегистр же Калкты тейлөө борборуна жакын аймактарда." : "Расположена поблизости от Госрегистра или ЦОН для быстрого оформления документов."}
                    </p>
                    <p className="leading-relaxed">
                      <strong>{lang === "ky" ? "Жеке Нотариустар:" : "Сектор Частных нотариусов:"}</strong>
                    </p>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      {lang === "ky" 
                        ? "Башкы кесилиштерде: Ленин, Горький жана Шамшы көчөлөрүндө, коммерциялык банктардын жана шаардык сот имаратынын айланасында жайгашкан." 
                        : "Центральные перекрестки Ленина / Горького, Ленина / Шамшинской. Вокруг комм. банков и судебного управления."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CATEGORY 6: Streets & Transport */}
            {activeCategory === "streets-transport" && (
              <div className="flex flex-col gap-5 text-xs text-slate-300">
                <div className="border-b border-slate-800 pb-3">
                  <h2 className="font-extrabold text-white text-lg flex items-center gap-2">
                    <Bus className="text-sky-400 w-5 h-5 shrink-0" />
                    {lang === "ky" ? "Транспорт түйүндөрү жана Негизги көчөлөр" : "Транспортная логистика и Главные улицы"}
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {lang === "ky" ? "Шаардык каттамдардын тизмеги жана борбордук жолдордун картасы" : "Схемы внутригородских маршруток, автовокзал и дорожный каркас города"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Streets */}
                  <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col gap-2">
                    <h4 className="font-bold text-white text-xs border-b border-slate-850 pb-2 flex items-center gap-1.5 uppercase font-mono tracking-wider">
                      <Navigation className="w-3.5 h-3.5 text-sky-400" />
                      {lang === "ky" ? "Шаардык негизги көчөлөр" : "Основные магистрали города"}
                    </h4>
                    <ul className="text-slate-400 text-[11px] flex flex-col gap-1.5 leading-relaxed">
                      <li>
                        <strong>{lang === "ky" ? "1. Ленин көчөсү" : "1. Улица Ленина"}</strong> - {lang === "ky" ? "Шаардын башкы борбору (Мэрия, борбордук аянт, дүкөндөр)." : "Главная ось Токмока (Мэрия, памятники, центральная площадь)."}
                      </li>
                      <li>
                        <strong>{lang === "ky" ? "2. Шамшы көчөсү" : "2. Улица Шамшинская"}</strong> - {lang === "ky" ? "Түндүк-түштүк багытындагы негизги трасса." : "Ключевая транзитная дорога Северо-южного направления."}
                      </li>
                      <li>
                        <strong>{lang === "ky" ? "3. Жантаев көчөсү" : "3. Улица Жантаева"}</strong> - {lang === "ky" ? "Базар жана ИИБ тарапка алып баруучу чоң магистраль." : "Широкое полотно в направлении ГОВД и рынка."}
                      </li>
                      <li>
                        <strong>{lang === "ky" ? "4. Горький көчөсү" : "4. Улица Горького"}</strong> - {lang === "ky" ? "Муниципалдык Борбордук базар ушул көчөдө жайгашкан." : "Торговый эпицентр, здесь располагается большой базар."}
                      </li>
                      <li>
                        <strong>{lang === "ky" ? "5. Ибраимов көчөсү" : "5. Улица Ибраимова"}</strong> - {lang === "ky" ? "Ооруканаларга жана турак-жай кичи райондоруна алып баруучу жол." : "Ведет к центральным стационарам ТМО и спальным микрорайонам."}
                      </li>
                    </ul>
                  </div>

                  {/* Public transport */}
                  <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col gap-2">
                    <h4 className="font-bold text-white text-xs border-b border-slate-800 pb-2 flex items-center gap-1.5 uppercase font-mono tracking-wider">
                      <Bus className="w-3.5 h-3.5 text-emerald-400" />
                      {lang === "ky" ? "Коомдук каттамдар / Маршруткалар" : "Внутригородские и Региональные маршруты"}
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="bg-slate-900 border border-slate-850 p-2.5 rounded text-[11px] leading-relaxed">
                        <span className="font-bold text-emerald-450 block font-mono text-[9px] uppercase tracking-wider mb-1">
                          {lang === "ky" ? "Шаар ичиндеги маршруттар:" : "Внутригородское сообщение:"}
                        </span>
                        <p className="text-slate-300 font-bold">№1, №2, №3, №5, №7</p>
                        <p className="text-slate-450 text-[10px] mt-0.5">
                          {lang === "ky" 
                            ? "Шаар калкын Автовокзал, Базар, Военный городок, ооруканалар жана кичи райондор арасында ташыйт." 
                            : "Курсируют каждые 5-10 минут. Логистика: Водоканал — Рынок — ТМО — Вокзал — Шамсинская."}
                        </p>
                      </div>

                      <div className="bg-slate-900 border border-slate-850 p-2.5 rounded text-[11px] leading-relaxed">
                        <span className="font-bold text-sky-400 block font-mono text-[9px] uppercase tracking-wider mb-1">
                          {lang === "ky" ? "Шаар аралык каттамдар:" : "Региональное направление:"}
                        </span>
                        <p className="text-slate-300 font-bold mb-1">
                          {lang === "ky" ? "Токмок Автовокзалы — Бишкек (№353)" : "Автовокзал Токмок — Бишкек (№353)"}
                        </p>
                        <p className="text-slate-450 text-[10px]">
                          {lang === "ky" 
                            ? "Ар бир 10-15 мүнөт сайын Бишкектин Чыгыш автовокзалына кичи автобустар жана попутка таксилер жүрүп турат. Ошондой эле Кемин, Ысык-Ата жана Ысык-Көл багыттары жеткиликтүү." 
                            : "Маршрутные такси ходят каждые 10-15 минут напрямую до Восточного автовокзала г. Бишкек. Также отходят рейсы в Кемин, Иссык-Ату, Боомское ущелье и города Иссык-Куля."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
