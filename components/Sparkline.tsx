"use client";

import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import type { ChartPoint } from "@/lib/chart-data";

export function Sparkline({ data }: { data: ChartPoint[] }) {
  const labelByIndex = new Map(data.filter((d) => d.label).map((d) => [d.index, d.label]));
  const ticks = Array.from(labelByIndex.keys());

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="sparklineFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="index"
            type="number"
            domain={["dataMin", "dataMax"]}
            ticks={ticks}
            tickFormatter={(index: number) => labelByIndex.get(index) ?? ""}
            tick={{ fill: "#737373", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide domain={["dataMin - 2", "dataMax + 2"]} />
          <Tooltip
            contentStyle={{
              background: "#171717",
              border: "1px solid #404040",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: "#a3a3a3" }}
            formatter={(value: number) => [value.toFixed(1), "Index"]}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#34d399"
            strokeWidth={2}
            fill="url(#sparklineFill)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
