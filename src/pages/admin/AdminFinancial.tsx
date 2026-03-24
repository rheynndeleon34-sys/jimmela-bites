import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { orderBy } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, TrendingDown } from "lucide-react";
import { subDays } from "date-fns";

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

interface FinancialData {
  date: string;
  revenue: number;
  estimatedCost: number;
  profit: number;
}

const AdminFinancial = () => {
  const { data: orders } = useFirestoreCollection<Order>("orders", [orderBy("date", "desc")], []);
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

  // Financial data over time (assume 40% cost margin)
  const financialData = useMemo(() => {
    const grouped: { [key: string]: { revenue: number } } = {};

    filteredOrders.forEach((order) => {
      const date = order.date;
      if (!grouped[date]) {
        grouped[date] = { revenue: 0 };
      }
      grouped[date].revenue += order.total;
    });

    return Object.entries(grouped)
      .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
      .map(([date, data]) => {
        const revenue = data.revenue;
        const estimatedCost = revenue * 0.4; // Assume 40% cost of revenue
        const profit = revenue - estimatedCost;

        return {
          date,
          revenue: parseInt(String(revenue)),
          estimatedCost: parseInt(String(estimatedCost)),
          profit: parseInt(String(profit)),
        };
      });
  }, [filteredOrders]);

  // Summary metrics
  const financialMetrics = useMemo(() => {
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const totalCost = totalRevenue * 0.4;
    const totalProfit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
    const avgOrderValue = filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0;

    // Calculate trend (compare first half to second half)
    const midpoint = Math.floor(filteredOrders.length / 2);
    const firstHalf = filteredOrders.slice(0, midpoint);
    const secondHalf = filteredOrders.slice(midpoint);

    const firstHalfRevenue = firstHalf.reduce((sum, o) => sum + o.total, 0);
    const secondHalfRevenue = secondHalf.reduce((sum, o) => sum + o.total, 0);

    const revenueTrend =
      firstHalfRevenue > 0
        ? ((secondHalfRevenue - firstHalfRevenue) / firstHalfRevenue) * 100
        : 0;

    return {
      totalRevenue,
      totalCost,
      totalProfit,
      profitMargin,
      avgOrderValue,
      revenueTrend,
    };
  }, [filteredOrders]);

  // Order breakdown by status
  const orderBreakdown = useMemo(() => {
    const grouped: { [key: string]: { count: number; revenue: number } } = {};

    filteredOrders.forEach((order) => {
      if (!grouped[order.status]) {
        grouped[order.status] = { count: 0, revenue: 0 };
      }
      grouped[order.status].count += 1;
      grouped[order.status].revenue += order.total;
    });

    return Object.entries(grouped).map(([status, data]) => ({
      status,
      count: data.count,
      revenue: data.revenue,
      avgValue: Math.round(data.revenue / data.count),
    }));
  }, [filteredOrders]);

  const handleExportReport = () => {
    const report = `
JIMMELA BITES - FINANCIAL REPORT
Generated: ${new Date().toLocaleDateString()}
Period: ${dateRange.toUpperCase()}

=== SUMMARY ===
Total Revenue: ₱${financialMetrics.totalRevenue.toLocaleString()}
Total Cost (Est. 40%): ₱${financialMetrics.totalCost.toLocaleString()}
Total Profit: ₱${financialMetrics.totalProfit.toLocaleString()}
Profit Margin: ${financialMetrics.profitMargin.toFixed(2)}%
Average Order Value: ₱${Math.round(financialMetrics.avgOrderValue).toLocaleString()}
Revenue Trend: ${financialMetrics.revenueTrend > 0 ? "+" : ""}${financialMetrics.revenueTrend.toFixed(2)}%

=== ORDER BREAKDOWN ===
${orderBreakdown
  .map(
    (item) =>
      `${item.status}: ${item.count} orders | ₱${item.revenue.toLocaleString()} | Avg: ₱${item.avgValue}`
  )
  .join("\n")}

=== DAILY BREAKDOWN ===
${financialData.map((item) => `${item.date} | Revenue: ₱${item.revenue} | Cost: ₱${item.estimatedCost} | Profit: ₱${item.profit}`).join("\n")}
    `;

    const blob = new Blob([report], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `financial-report-${new Date().getTime()}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Financial Reports</h2>
          <p className="text-muted-foreground">Revenue, costs, and profit analysis</p>
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
          <Button onClick={handleExportReport} variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground mb-2 uppercase font-semibold">Total Revenue</p>
          <p className="text-2xl font-bold text-foreground">₱{financialMetrics.totalRevenue.toLocaleString()}</p>
          {financialMetrics.revenueTrend > 0 && (
            <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +{financialMetrics.revenueTrend.toFixed(1)}% vs previous
            </p>
          )}
        </div>

        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground mb-2 uppercase font-semibold">Total Cost (Est.)</p>
          <p className="text-2xl font-bold text-red-600">₱{financialMetrics.totalCost.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-2">40% of revenue</p>
        </div>

        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4">
          <p className="text-xs text-emerald-700 mb-2 uppercase font-semibold">Total Profit</p>
          <p className="text-2xl font-bold text-emerald-600">₱{financialMetrics.totalProfit.toLocaleString()}</p>
          <p className="text-xs text-emerald-700 mt-2">{financialMetrics.profitMargin.toFixed(1)}% margin</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground mb-2 uppercase font-semibold">Avg Order Value</p>
          <p className="text-2xl font-bold text-foreground">₱{Math.round(financialMetrics.avgOrderValue).toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-2">{filteredOrders.length} orders</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground mb-2 uppercase font-semibold">Profit Margin</p>
          <p className="text-2xl font-bold text-blue-600">{financialMetrics.profitMargin.toFixed(1)}%</p>
          <p className="text-xs text-muted-foreground mt-2">of total revenue</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Cost */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">Revenue vs Cost vs Profit</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={financialData}>
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
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="estimatedCost" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Profit Distribution */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">Daily Profit</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={financialData}>
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
              <Bar dataKey="profit" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-4">Order Status Financial Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 text-muted-foreground font-semibold">Status</th>
                <th className="text-right p-3 text-muted-foreground font-semibold">Count</th>
                <th className="text-right p-3 text-muted-foreground font-semibold">Total Revenue</th>
                <th className="text-right p-3 text-muted-foreground font-semibold">Est. Cost (40%)</th>
                <th className="text-right p-3 text-muted-foreground font-semibold">Est. Profit</th>
                <th className="text-right p-3 text-muted-foreground font-semibold">Avg Value</th>
              </tr>
            </thead>
            <tbody>
              {orderBreakdown.map((item) => (
                <tr key={item.status} className="border-b hover:bg-muted/50">
                  <td className="p-3 font-medium">{item.status}</td>
                  <td className="p-3 text-right">{item.count}</td>
                  <td className="p-3 text-right">₱{item.revenue.toLocaleString()}</td>
                  <td className="p-3 text-right text-red-600">₱{Math.round(item.revenue * 0.4).toLocaleString()}</td>
                  <td className="p-3 text-right text-emerald-600 font-semibold">
                    ₱{Math.round(item.revenue * 0.6).toLocaleString()}
                  </td>
                  <td className="p-3 text-right">₱{item.avgValue.toLocaleString()}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-foreground/20 bg-muted/50">
                <td className="p-3 font-bold">TOTAL</td>
                <td className="p-3 text-right font-bold">{filteredOrders.length}</td>
                <td className="p-3 text-right font-bold">₱{financialMetrics.totalRevenue.toLocaleString()}</td>
                <td className="p-3 text-right font-bold text-red-600">
                  ₱{financialMetrics.totalCost.toLocaleString()}
                </td>
                <td className="p-3 text-right font-bold text-emerald-600">
                  ₱{financialMetrics.totalProfit.toLocaleString()}
                </td>
                <td className="p-3 text-right font-bold">
                  ₱{Math.round(financialMetrics.avgOrderValue).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <p className="font-semibold mb-2">Cost Estimation Note</p>
        <p>
          Current report assumes a 40% cost of revenue (standard for food/retail). Actual costs may vary.
          Update the multiplier in the code to match your business model.
        </p>
      </div>
    </div>
  );
};

export default AdminFinancial;
