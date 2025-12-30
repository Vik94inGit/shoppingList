import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export const ListDetailChart = ({ data }) => {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  // If only one section has a value, we should NOT have a padding angle
  // otherwise it looks like a 2% gap (your 98% issue)
  const isOnlyOneSection = data.some((d) => d.value === total && d.value > 0);
  return (
    <div style={{ width: "100%", height: "300px" }}>
      <ResponsiveContainer>
        <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={0} // Udělá z koláče "donut" (prstenec)
            outerRadius={120}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div
        style={{ textAlign: "center", marginTop: "-160px", fontWeight: "bold" }}
      >
        {/* Volitelný text uprostřed donutu */}
        {Math.round((data[0].value / (data[0].value + data[1].value)) * 100)}%
      </div>
    </div>
  );
};
