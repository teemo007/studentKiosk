import { useEffect, useState } from "react";
import { db } from "../../utils/firebase/firebase.utils";
import { collection, getDocs } from "firebase/firestore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const StepDropoffChart = ({ topicId, flowKey }) => {
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
            ev.action === "step_completed" &&
            ev.stepIndex != null
        );

        if (!stepEvents.length) {
          setData([]);
          setLoading(false);
          return;
        }

        const sessionMap = new Map(); // sessionId -> Set(stepIndex)

        for (const ev of stepEvents) {
          const sessionId = ev.sessionId || ev.flowSessionId || ev.id;
          if (!sessionId) continue;

          const stepIdx = Number(ev.stepIndex) || 0;
          if (!sessionMap.has(sessionId)) {
            sessionMap.set(sessionId, new Set());
          }
          sessionMap.get(sessionId).add(stepIdx);
        }

        const allStepsSet = new Set();
        for (const steps of sessionMap.values()) {
          for (const s of steps) allStepsSet.add(s);
        }
        const sortedIndices = Array.from(allStepsSet).sort((a, b) => a - b);

        if (!sortedIndices.length) {
          setData([]);
          setLoading(false);
          return;
        }

        const baseStep = sortedIndices.includes(1) ? 1 : sortedIndices[0];

        const filteredSessions = Array.from(sessionMap.entries()).filter(
          ([, stepsSet]) => stepsSet.has(baseStep)
        );

        if (!filteredSessions.length) {
          setData([]);
          setLoading(false);
          return;
        }

        const stepCounts = {}; // stepIndex -> sessionCount

        for (const [, stepsSet] of filteredSessions) {
          for (const idx of stepsSet) {
            stepCounts[idx] = (stepCounts[idx] || 0) + 1;
          }
        }

        const baseCount = stepCounts[baseStep] || 0;

        const chartData = sortedIndices.map((idx) => {
          const sessionCount = stepCounts[idx] || 0;
          const retention =
            baseCount > 0 ? (sessionCount / baseCount) * 100 : 0;

          return {
            stepIndex: idx,
            label: `Step ${idx}`,
            sessions: sessionCount,
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
      <div style={{ color: "#9ca3af" }}>No step data yet for this flow.</div>
    );
  }

  // const chartWidth = Math.max(480, data.length * 80);

  return (
    <div style={{ width: "100%", marginTop: "0.75rem", overflowX: "auto" }}>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={data}
          margin={{ top: 16, right: 24, left: 0, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis unit="%" domain={[0, 100]} />
          <Tooltip
            formatter={(value, name) => {
              if (name === "retention") {
                return [`${Number(value).toFixed(1)}%`, "Retention"];
              }
              if (name === "sessions") {
                return [value, "Sessions"];
              }
              return [value, name];
            }}
          />
          <Bar
            dataKey="retention"
            name="Retention %"
            fill="#0065A4"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StepDropoffChart;
