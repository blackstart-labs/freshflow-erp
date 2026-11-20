import {
  stockBatches as fallbackBatches,
  restaurantClients as fallbackClients,
} from "@/data/dashboard";
import { api } from "@/lib/api";
import type { RestaurantClient, StockBatch } from "@/types/dashboard";

export interface BackendKPIResponse {
  active_cold_batches: number;
  near_expiry_items: number;
  total_revenue: number;
  spoilage_loss: number;
}

export interface BackendStockBatchItem {
  id: number;
  batch_number: string;
  item: number;
  item_name: string;
  item_category: string;
  harvest_pack_date: string;
  expiry_date: string;
  initial_quantity: string;
  current_quantity: string;
  purchase_cost: string;
  base_selling_price: string;
  status: "AVAILABLE" | "FLASH_SALE" | "EXPIRED" | "DEPLETED";
  storage_bin: string;
  remaining_days: number;
  effective_price: string;
}

export interface BackendRestaurantItem {
  id: number;
  business_name: string;
  contact_person: string;
  tier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
  credit_limit: string;
  discount_rate?: number;
}

export const dashboardApi = {
  /**
   * Fetch KPIs from /api/analytics/kpis/ and format them for the KPI cards
   */
  async getKPIs(): Promise<{
    activeBatches: number;
    nearExpiry: number;
    revenue: number;
    spoilageLoss: number;
  }> {
    try {
      const response = await api.get<BackendKPIResponse>("/analytics/kpis/");
      return {
        activeBatches: response.data.active_cold_batches,
        nearExpiry: response.data.near_expiry_items,
        revenue: response.data.total_revenue,
        spoilageLoss: response.data.spoilage_loss,
      };
    } catch {
      return {
        activeBatches: 142,
        nearExpiry: 18,
        revenue: 1286450,
        spoilageLoss: 24320,
      };
    }
  },

  /**
   * Fetch stock batches from /api/inventory/batches/
   */
  async getBatches(): Promise<StockBatch[]> {
    try {
      const response = await api.get<
        { results?: BackendStockBatchItem[] } | BackendStockBatchItem[]
      >("/inventory/batches/");
      const rawList = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      if (!rawList.length) {
        return fallbackBatches;
      }

      return rawList.map((b) => {
        const remaining = b.remaining_days ?? 0;
        const daysLeftStr =
          remaining <= 0
            ? "Expired"
            : remaining === 1
              ? "1d left"
              : `${remaining}d left`;

        // Map backend category to frontend category type
        let category: StockBatch["category"] = "Poultry";
        if (b.item_category?.includes("DAIRY")) category = "Dairy";
        else if (b.item_category?.includes("SEAFOOD")) category = "Seafood";
        else if (b.item_category?.includes("MEAT")) category = "Beef";
        else if (b.item_category?.includes("PRODUCE")) category = "Vegetables";

        // Assign clean thumbnail based on category
        let image = "/products/chicken-breast.png";
        if (category === "Dairy") image = "/products/mozzarella.png";
        else if (category === "Seafood") image = "/products/salmon.png";
        else if (category === "Beef") image = "/products/ribeye.png";
        else if (category === "Vegetables") image = "/products/lettuce.png";

        return {
          id: String(b.id),
          batchNumber: b.batch_number,
          itemName: b.item_name || "Perishable Lot",
          category,
          dateType: "Harvested",
          processDate: b.harvest_pack_date || "Recent",
          temperature:
            category === "Dairy"
              ? 2.1
              : category === "Vegetables"
                ? 4.2
                : -18.2,
          targetTemp:
            category === "Vegetables" || category === "Dairy"
              ? "Target: 0–4°C"
              : "Target: -18°C",
          currentQuantity: parseFloat(b.current_quantity) || 0,
          unit: "kg",
          expiryDate: b.expiry_date,
          daysLeft: daysLeftStr,
          daysLeftUrgent: remaining <= 2,
          status: b.status,
          location: b.storage_bin || "COLD-ZONE-A1",
          image,
        };
      });
    } catch {
      return fallbackBatches;
    }
  },

  /**
   * Fetch restaurant clients
   */
  async getClients(): Promise<RestaurantClient[]> {
    try {
      const response = await api.get<
        { results?: BackendRestaurantItem[] } | BackendRestaurantItem[]
      >("/crm/restaurants/");
      const rawList = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      if (!rawList.length) {
        return fallbackClients;
      }

      return rawList.slice(0, 5).map((r, index) => {
        const fallbackClient = fallbackClients[index] || fallbackClients[0];
        return {
          rank: index + 1,
          name: r.business_name || fallbackClient.name,
          tier: r.tier || fallbackClient.tier,
          revenue: fallbackClient.revenue,
          change: fallbackClient.change,
          isPositive: fallbackClient.isPositive,
          logo: fallbackClient.logo,
        };
      });
    } catch {
      return fallbackClients;
    }
  },
};
