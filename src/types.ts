export type ComplaintStatus = "pending" | "assigned" | "in_progress" | "resolved" | "rejected";

export type ComplaintCategory =
  | "водоканал"
  | "теплосеть"
  | "газ"
  | "санитарная служба"
  | "школы"
  | "больницы"
  | "горсвет"
  | "дорожные службы"
  | "экстренные службы";

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  urgency: "low" | "medium" | "high" | "critical";
  citizenName: string;
  district: string; // e.g. "МТУ №1 (Центр)", "МТУ №2 (ЖД Вокзал)", "МТУ №3 (Прогресс)", "МТУ №4 (Слободка)", "Западный массив"
  status: ComplaintStatus;
  createdAt: string;
  landmark?: string;
  beforePhoto?: string; // base64 string or template avatar SVG
  afterPhoto?: string;
  officialReply?: string;
  officialReplyKy?: string;
  assignedOfficer?: string;
  votes: number;
  votedUsers: string[]; // Mock list of user emails / devices
  isDirectToMayor?: boolean; // Flagged as a direct appeal for Mayor's personal cabinet
  mayorResolution?: string; // Mayor's resolution response
  mayorResolutionKy?: string; // Mayor's resolution response in Kyrgyz
}

export interface EcoSensor {
  id: string;
  locationName: string;
  district: string;
  lat: number; // 0-100 scale on our interactive vector coordinates
  lng: number; // 0-100 scale
  aqi: number; // Air quality index (0 - 300)
  pm25: number; // micrometers/m3
  co2: number; // ppm
  temperature: number; // Celsius
  status: "good" | "moderate" | "poor";
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  service: ComplaintCategory;
  status: "idle" | "driving" | "working" | "offline";
  vehicle: string;
  vehicleNo: string;
  lat: number; // 0 - 100 on vector map
  lng: number; // 0 - 100 on vector map
  targetLat?: number;
  targetLng?: number;
  tasksCompleted: number;
  kpi: number; // out of 100 score
  phone: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  category: "all" | "emergency" | "announcement" | "repairs";
}

export interface MunicipalServiceConfig {
  id: ComplaintCategory;
  name: string;
  leader: string;
  contact: string;
  activeStaff: number;
  pendingTasks: number;
  resolvedTasks: number;
}
