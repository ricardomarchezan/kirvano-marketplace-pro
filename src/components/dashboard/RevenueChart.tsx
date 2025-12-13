import { useState, useMemo } from "react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { DateRange } from "react-day-picker";
import { subDays, format, parseISO, startOfDay, eachDayOfInterval } from "date-fns";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useData } from "@/contexts/DataContext";
import { Loader2, TrendingUp } from "lucide-react";

export function RevenueChart() {
  const { sales, loading } = useData();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const chartData = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return [];

    const days = eachDayOfInterval({
      start: dateRange.from,
      end: dateRange.to,
    });

    return days.map(day => {
      const dayStr = format(day, "yyyy-MM-dd");
      const dayRevenue = sales
        .filter(sale => {
          const saleDate = format(parseISO(sale.created_at), "yyyy-MM-dd");
          return saleDate === dayStr && sale.status === "completed";
        })
        .reduce((sum, sale) => sum + Number(sale.amount), 0);

      return {
        day: format(day, "dd"),
        date: dayStr,
        revenue: dayRevenue,
      };
    });
  }, [sales, dateRange]);

  const hasData = chartData.some(d => d.revenue > 0);

  return (
    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Receita Mensal (MRR)</h2>
          <p className="text-sm text-muted-foreground">Período selecionado</p>
        </div>
        <DateRangePicker
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </div>

      <div className="h-[280px]">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : !hasData ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <TrendingUp className="w-12 h-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Nenhuma venda no período</p>
            <p className="text-xs text-muted-foreground mt-1">
              Suas vendas aparecerão aqui
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                className="text-muted-foreground text-xs"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                className="text-muted-foreground text-xs"
                tickFormatter={(value) => `R$${value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))",
                }}
                formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR")}`, "Receita"]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                className="stroke-primary"
                strokeWidth={2}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
