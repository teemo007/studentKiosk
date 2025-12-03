import { useEffect, useState } from "react";
import { db } from "../../utils/firebase/firebase.utils";
import { collection, getDocs } from "firebase/firestore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const StepDropoffChart = ({ topicId, flowKey, title }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStepData = async () => {
      try {
        const snap = await getDocs(collection(db, "events"));
        const events = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        const stepEvents = events.filter(
          (ev) =>
            Number(ev.topicId) === Number(topicId) &&
            ev.flowKey === flowKey &&
            ev.action === "step_completed"
        );

        const counts = {};
        for (const ev of stepEvents) {
          const idx = ev.stepIndex ?? 0;
          if (!counts[idx]) counts[idx] = 0;
          counts[idx] += 1;
        }

        const sortedIndices = Object.keys(counts)
          .map(Number)
          .sort((a, b) => a - b);

        if (!sortedIndices.length) {
          setData([]);
          setLoading(false);
          return;
        }

        const baseCount = counts[sortedIndices[0]];

        const chartData = sortedIndices.map((idx) => {
          const completedCount = counts[idx];
          const retention =
            baseCount > 0 ? (completedCount / baseCount) * 100 : 0;
          return {
            stepIndex: idx,
            label: `Step ${idx}`,
            completedCount,
            retention,
          };
        });

        setData(chartData);
      } catch (e) {
        console.error("Error loading step data:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchStepData();
  }, [topicId, flowKey]);

  if (loading) {
    return <div style={{ color: "#6b7280" }}>Loading step data...</div>;
  }

  if (!data.length) {
    return (
      <div style={{ color: "#9ca3af" }}>
        No step data yet for this flow.
      </div>
    );
  }

  const chartWidth = Math.max(480, data.length * 80);

  return (
    <div style={{ width: "100%", marginTop: "0.75rem", overflowX: "auto" }}>
      {title && (
        <h3 style={{ margin: 0, marginBottom: "0.5rem" }}>{title}</h3>
      )}

      <BarChart
        width={chartWidth}
        height={260}
        data={data}
        margin={{ top: 16, right: 16, left: 0, bottom: 40 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis unit="%" domain={[0, 100]} />
        <Tooltip
          formatter={(value, name) => {
            if (name === "retention") {
              return [`${Number(value).toFixed(1)}%`, "Retention"];
            }
            if (name === "completedCount") {
              return [value, "Completed"];
            }
            return [value, name];
          }}
        />
        <Bar dataKey="retention" name="Retention %" fill="#0065A4" radius={[6, 6, 0, 0]}/>
      </BarChart>
    </div>
  );
};

export default StepDropoffChart;
