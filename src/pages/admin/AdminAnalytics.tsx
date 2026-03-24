import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { orderBy, where } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Calendar, TrendingUp } from "lucide-react";
import { format, subDays, startOfDay } from "date-fns";

interface Order {
  id: string;
  customer: string;
  items: any[];
  total: number;
  status: string;
  date: string;
  createdAt?: any;
  updatedAt?: any;
}

interface StockItem {
  id: string;
  product: string;
  sku: string;
  stock: number;
  unit: string;
  status: string;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

const AdminAnalytics = () => {
  const { data: orders } = useFirestoreCollection<Order>("orders", [orderBy("date", "desc")], []);
  const { data: stockItems } = useFirestoreCollection<StockItem>("stock", [], []);

  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "all">("30d");

  // Filter orders by date range
  const filteredOrders = useMemo(() => {
    if (dateRange === "all") return orders;

    const days = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90;
    const cutoffDate = subDays(new Date(), days);

    return orders.filter((order) => {
      const orderDate = new Date(order.date);
      return orderDate >= cutoffDate;
    });
  }, [orders, dateRange]);

  // Revenue over time data
  const revenueData = useMemo(() => {
    const grouped: { [key: string]: number } = {};

    filteredOrders.forEach((order) => {
      const date = order.date;
      grouped[date] = (grouped[date] || 0) + order.total;
    });

    return Object.entries(grouped)
      .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
      .map(([date, revenue]) => ({
        date,
        revenue: parseInt(String(revenue)),
      }));
  }, [filteredOrders]);

  // Order status distribution
  const statusData = useMemo(() => {
    const grouped: { [key: string]: number } = {};

    filteredOrders.forEach((order) => {
      grouped[order.status] = (grouped[order.status] || 0) + 1;
    });

    return Object.entries(grouped).map(([status, count]) => ({
      name: status,
      value: count,
    }));
  }, [filteredOrders]);

  // Stock status distribution
  const stockStatusData = useMemo(() => {
    const grouped: { [key: string]: number } = {};

    stockItems.forEach((item) => {
      grouped[item.status] = (grouped[item.status] || 0) + 1;
    });

    return Object.entries(grouped).map(([status, count]) => ({
      name: status,
      value: count,
    }));
  }, [stockItems]);

  // Top products by orders
  const topProducts = useMemo(() => {
    const productCounts: { [key: string]: { count: number; revenue: number } } = {};

    filteredOrders.forEach((order) => {
      order.items?.forEach((item: any) => {
        if (!productCounts[item.productName]) {
          productCounts[item.productName] = { count: 0, revenue: 0 };
        }
        productCounts[item.productName].count += item.quantity;
        productCounts[item.productName].revenue += item.quantity * item.price;
      });
    });

    return Object.entries(productCounts)
      .map(([name, data]) => ({
        name,
        orders: data.count,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);
  }, [filteredOrders]);

  // Summary metrics
  const metrics = useMemo(() => {
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = filteredOrders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
    };
  }, [filteredOrders]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Order trends and inventory insights</p>
        </div>
        <div className="flex gap-2">
          {(["7d", "30d", "90d", "all"] as const).map((range) => (
            <Button
              key={range}
              variant={dateRange === range ? "default" : "outline"}
              onClick={() => setDateRange(range)}
              size="sm"
            >
              {range === "all" ? "All Time" : range.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-sm text-muted-foreground mb-2">Total Revenue</p>
          <p className="text-2xl font-bold text-foreground">₱{metrics.totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-emerald-600 mt-2">
            <TrendingUp className="w-3 h-3 inline mr-1" />
            From {filteredOrders.length} orders
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-sm text-muted-foreground mb-2">Total Orders</p>
          <p className="text-2xl font-bold text-foreground">{filteredOrders.length}</p>
          <p className="text-xs text-blue-600 mt-2">
            <Calendar className="w-3 h-3 inline mr-1" />
            in selected period
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-sm text-muted-foreground mb-2">Avg Order Value</p>
          <p className="text-2xl font-bold text-foreground">₱{Math.round(metrics.avgOrderValue).toLocaleString()}</p>
          <p className="text-xs text-amber-600 mt-2">Per order average</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" style={{ fontSize: "12px" }} />
              <YAxis style={{ fontSize: "12px" }} />
              <Tooltip
                formatter={(value: any) => `₱${value.toLocaleString()}`}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">Order Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">Top Products by Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} style={{ fontSize: "11px" }} />
              <YAxis style={{ fontSize: "12px" }} />
              <Tooltip formatter={(value: any) => `₱${value.toLocaleString()}`} />
              <Bar dataKey="revenue" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stock Status */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">Stock Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stockStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {stockStatusData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Products Table */}
      {topProducts.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">Product Performance Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-muted-foreground font-semibold">Product</th>
                  <th className="text-right p-3 text-muted-foreground font-semibold">Units Sold</th>
                  <th className="text-right p-3 text-muted-foreground font-semibold">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product) => (
                  <tr key={product.name} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{product.name}</td>
                    <td className="p-3 text-right">{product.orders}</td>
                    <td className="p-3 text-right font-semibold">₱{product.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;
