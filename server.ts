import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
app.use(express.json());

// Lazy-loaded safely to avoid cold crash if GEMINI_API_KEY is not defined yet.
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY is not configured in secrets.");
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// Check API status & configuration
app.get("/api/ai/config", (req, res) => {
  res.json({
    hasKey: !!process.env.GEMINI_API_KEY,
  });
});

// Endpoint 1: Auto-categorize citizens complaints
app.post("/api/ai/categorize", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Complaint text is empty" });
    }

    const ai = getGeminiClient();
    const systemPrompt = `Ты — ИИ-аналитик цифровой мэрии инновационного города Токмок (Кыргызстан). 
Твоя задача — классифицировать жалобы от жителей, определить ответственную службу, предложить уровень критичности и обоснование.
Доступные службы:
- "водоканал" (водопровод, канализация, прорывы труб)
- "теплосеть" (отопление, горячая вода)
- "газ" (газоснабжение, плиты, утечки)
- "санитарная служба" (вывоз мусора, загрязнение площадок)
- "школы" (здания школ, директора, питание, инвентарь)
- "больницы" (регистратуры, лекарства, скорая)
- "горсвет" (уличные фонари, лампочки, кабели)
- "дорожные службы" (ямы, асфальт, светофоры, знаки)
- "экстренные службы" (пожары, обвалы, аварии)

Ответ верни строго в формате JSON со следующими свойствами:
- category: одна из указанных выше служб (строго как написано в кавычках)
- urgency: "low" | "medium" | "high" | "critical"
- explanation: короткое пояснение на русском языке почему выбрана эта категория
- auto_reply: дружелюбный, вежливый и профессиональный первый автоответ гражданину на русском языке от имени Мэрии Токмок. Поблагодари за бдительность и укажи, что заявка направлена в соответствующую службу.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: text,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            urgency: { type: Type.STRING },
            explanation: { type: Type.STRING },
            auto_reply: { type: Type.STRING },
          },
          required: ["category", "urgency", "explanation", "auto_reply"],
        },
      },
    });

    const textOutput = response.text?.trim() || "{}";
    const parsed = JSON.parse(textOutput);
    res.json({ success: true, ...parsed });
  } catch (error: any) {
    console.error("Gemini AI Categorization Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint 2: Draft answers to residents
app.post("/api/ai/respond", async (req, res) => {
  try {
    const { complaint, serviceComment } = req.body;
    if (!complaint || !serviceComment) {
      return res.status(400).json({ error: "Missing complaint or serviceComment" });
    }

    const ai = getGeminiClient();
    const systemPrompt = `Ты — Руководитель пресс-службы Мэрии города Токмок.
Сформулируй официальный, вежливый ответ жителю о решении его проблемы на основе его жалобы и краткого комментария коммунальной службы.
Ориентируйся на создание доверительных отношений с горожанами. Выдавай теплое, грамотное письмо.
Верни ответ строго в формате JSON:
- textRu: ответ на русском языке (официальный, сердечный)
- textKy: ответ на кыргызском языке (с уважением, вежливый, например: "Урматтуу шаар тургуну...")`;

    const promptText = `Жалоба жителя: "${complaint}".
Отчет коммунальной службы о решении: "${serviceComment}".`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            textRu: { type: Type.STRING },
            textKy: { type: Type.STRING },
          },
          required: ["textRu", "textKy"],
        },
      },
    });

    const textOutput = response.text?.trim() || "{}";
    const parsed = JSON.parse(textOutput);
    res.json({ success: true, ...parsed });
  } catch (error: any) {
    console.error("Gemini AI Response Generation Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint 3: City Hall Analytics Summary (Mayor briefing)
app.post("/api/ai/summary", async (req, res) => {
  try {
    const { data } = req.body;
    const ai = getGeminiClient();
    const systemPrompt = `Ты — Советник мэра города Токмок по технологиям и Smart City.
Тебе предоставлен список недавних проблем и эко-показателей города в разных МТУ (Муниципальное территориальное управление №1, №2, №3, Слободка, Вокзал и т.д.).
Напиши аналитический отчет для Мэра. Выдели три блока в формате JSON:
- mainIssue: Главная текущая проблема дня в Токмоке
- prediction: ИИ-прогноз уязвимостей (напр., перегрузка электросетей в МТУ №2 или падение давления воды из-за поливного сезона в МТУ №1)
- recommendations: список из 3 конкретных, сильных поручений мэра службам Токмока. Упоминай конкретные реалистичные места Токмока (ул. Шамсинская, район Сахзавода, Вокзал, Кирпичный заводик и т.д.).`;

    const promptText = `Сводка происшествий и экологии: ${JSON.stringify(data)}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mainIssue: { type: Type.STRING },
            prediction: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["mainIssue", "prediction", "recommendations"],
        },
      },
    });

    const textOutput = response.text?.trim() || "{}";
    const parsed = JSON.parse(textOutput);
    res.json({ success: true, ...parsed });
  } catch (error: any) {
    console.error("Gemini AI Summary Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint 3.5: Generates formal Resolution for Mayor Maxat Nusuvaliev's Personal cabinet
app.post("/api/ai/mayor-resolution", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Text is required" });
    }

    const ai = getGeminiClient();
    const systemPrompt = `Ты — Личный ИИ-референт Мэра города Токмок Шакирова Кутпидина Абдырахмановича.
Твоя задача — составить строгую, но справедливую официальную Резолюцию (Поручение) Мэра для оперативного решения проблемы жителя Токмока.
Резолюция пишется требовательным, но профессиональным тоном главы города. Потребуй от ответственной службы оперативного исполнения.
Верни ответ строго в формате JSON:
- resolutionRu: Официальное поручение на русском языке (например: "Руководителю МП Тазалык Карабаеву Н. С. срочно направить спецтехнику и расчистить завал до конца текущего дня...")
- resolutionKy: Официальное поручение на кыргызском языке (например: "«Тазалык» МИ жетекчиси Карабаев Н. С. тезинен атайын техниканы жөнөтүп, бүгүнтөн калбай аталган аймакты таштандыдан тазаласын...")`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: text,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            resolutionRu: { type: Type.STRING },
            resolutionKy: { type: Type.STRING },
          },
          required: ["resolutionRu", "resolutionKy"],
        },
      },
    });

    const textOutput = response.text?.trim() || "{}";
    const parsed = JSON.parse(textOutput);
    res.json({ success: true, ...parsed });
  } catch (error: any) {
    console.error("Gemini AI Mayor Resolution Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint 4: Chatbot helper "Токмок Санарип Көмөкчүсү" (Digital Assistant of Tokmok)
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const ai = getGeminiClient();
    const systemPrompt = `Ты — виртуальный мэр Токмока и интерактивный ИИ-помощник "Токмок Санарип Көмөкчүсү" (Цифровой помощник Токмока). Твоя цель — в дружественной, профессиональной, лаконичной и уважительной манере помогать жителям города Токмок на двух языках: кыргызском (кыргызча) и русском. 
Отвечай строго на том языке, на котором к тебе обратился пользователь. Если пользователь поздоровался или спросил на кыргызском, твой ответ должен быть на кыргызском. Если на русском, то на русском.

Ты располагаешь следующими подтвержденными знаниями о городе Токмок и его службах:
1. Муниципальные службы Мэрии Токмока (Мэриянын караштуу мекемелер):
   - «Тазалык» МИ (муниципалдык ишканасы) — вывоз мусора (таштанды чыгаруу), уборка и очистка городских улиц (көчөлөрдү тазалоо).
   - «Водоканал» (Сууканал) — обеспечение чистой питьевой водой (таза суу менен камсыздоо) и канализационные сети (канализация).
   - «Токмок Жылуулук» (Теплокоммунэнерго) — отопление и горячая вода (жылуулук берүү, ысык суу).
   - Жашылдандыруу жана көрктөндүрүү кызматы — уход за парками, скверами, высадка деревьев и праздничное оформление (парктарды, гүлзарларды кароо, бак тигүү).
   - Көрүү-жарыктандыруу кызматы (Горсвет) — ремонт уличного освещения и светофоров (көчө чырактарын жана светофорлорду оңдоо).
   - Муниципалдык автотранспорттук ишкана (ПАТП) — координация автобусных рейсов и городских маршруток (коомдук транспорт, маршруттук каттамдар).
   - Ритуалдык кызмат муниципалдык ишканасы — обслуживание кладбищ.
   
2. Мэриянын түзүмдүк бөлүмдөрү (Аппарат):
   - Финансы-экономикалык бөлүм (Бюджет жана салык эмес кирешелер).
   - Мүлк жана жер маселелери боюнча бөлүм (УМС / Муниципалдык мүлктү башкаруу).
   - Коммуналдык чарба, транспорт и курулуш бөлүмү.
   - Социалдык блок жана уюштуруу бөлүмү (Билим берүү, спорт, маданият).
   - Укуктук камсыздоо жана кадрлар бөлүмү (Юристтер).

3. Территориальные управления (МТУ / МАУ):
   - В народе называются "Квартальные". Они делят город на участки (№1, №2, №3 и др.), выдают справки жителям и передают локальные проблемы в Мэрию.

4. Шаардагы мечиттердин тизмеси (Реестр мечетей Токмока):
   - Токмок Борбордук Мечити — расположен на улице Шамшинская возле центральной площади и здания Мэрии. Вместимость более 1500 человек. Проводятся жума намаз, имеется современный комплекс омовения.
   - «Рахман» мечити — Расположена в МТУ №3, микрорайонная зона по Чуйскому проспекту. Красивая купольная архитектура, вместимость 800+ человек.
   - «Ибрахим» мечити — Расположена в МТУ №2 по улице Жантаева (в районе ж/д вокзала). Вместимость 500 человек, проводятся образовательные курсы чтения Корана для детей.

5. Руководство: Мэра города Токмок зовут Шакиров Кутпидин Абдырахманович. Его решениями назначаются все руководители вышеуказанных муниципальных служб, а их работа финансируется из городского бюджета.

Если житель города благодарит тебя, напиши по-кыргызски: "Ар дайым кызматыңыздардабыз!" или по-русски: "Всегда рады служить вам!". Старайся давать конкретные ответы, без лишней воды, со структурированными пунктами. Используй эмодзи для разделов, чтобы текст выглядел красиво и гостеприимно.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: messages,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    const reply = response.text || "Кечиресиз, суроону түшүнө алган жокмун. / К сожалению, я не смог понять вопрос.";
    res.json({ success: true, reply });
  } catch (error: any) {
    console.error("Gemini AI Chat Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Boot logic
async function startServer() {
  if (process.env.NODE_ENV === "production") {
    // Mode structured for production/sandboxed run
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    // Lite developer server integration with Vite
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Smart Tokmok Server booted successfully on port ${PORT}`);
  });
}

startServer();
