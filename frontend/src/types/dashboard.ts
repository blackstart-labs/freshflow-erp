export type BatchStatus = "AVAILABLE" | "FLASH_SALE" | "DEPLETED" | "SPOILED" | "EXPIRED";

export type ClientTier = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";

export interface DashboardMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  accent: "green" | "red" | "teal" | "slate";
  sparkline: number[];
  icon: string;
}

export interface TemperatureZone {
  id: string;
  name: string;
  targetRange: string;
  currentTemp: number;
  targetTemp: string;
  isCompliant: boolean;
  type: "freeze" | "chilled" | "ambient";
  sparkline: number[];
}

export interface CategoryDistribution {
  category: string;
  percentage: number;
  count: number;
  color: string;
}

export interface ExpiryDay {
  date: string;
  count: number;
  urgency: "safe" | "moderate" | "critical" | "warning";
}

export interface StockBatch {
  id: string;
  batchNumber: string;
  itemName: string;
  category: "Poultry" | "Dairy" | "Seafood" | "Beef" | "Vegetables";
  dateType: "Harvested" | "Packed" | "Caught";
  processDate: string;
  temperature: number;
  targetTemp: string;
  currentQuantity: number;
  unit: string;
  expiryDate: string;
  daysLeft: string;
  daysLeftUrgent: boolean;
  status: BatchStatus;
  location: string;
  image: string;
}

export interface RestaurantClient {
  rank: number;
  name: string;
  tier: ClientTier;
  revenue: number;
  change: string;
  isPositive: boolean;
  logo: string;
}
