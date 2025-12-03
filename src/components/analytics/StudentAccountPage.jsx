// src/components/AnalyticsDashboard/StudentAccountPage.jsx
import { useEffect, useState } from "react";
import { db } from "../../utils/firebase/firebase.utils";
import { collection, getDocs } from "firebase/firestore";
import { Box, Card, CardContent, Typography, Paper } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#1E3A8A", "#3B82F6"]; // Baruch Blue tones

const StudentAccountPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const snap = await getDocs(collection(db, "events"));
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setEvents(data);
      } catch (e) {
        console.error("Error loading Student Account events:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return <Typography>Loading Student Account stats...</Typography>;
  }

  // Filter only topicId = 1 (Student Account)
  const accountEvents = events.filter((ev) => ev.topicId === 1);

  // Count solved feedback
  const feedbackEvents = accountEvents.filter(
    (ev) => ev.action === "flow_exit_feedback"
  );

  const solvedCount = feedbackEvents.filter((ev) => ev.solved === true).length;
  const notSolvedCount = feedbackEvents.length - solvedCount;

  const solvedRate =
    feedbackEvents.length > 0
      ? (solvedCount / feedbackEvents.length) * 100
      : 0;

  // Count reset / claim usage
  const flowUsage = {
    claim: 0,
    reset: 0,
  };

  accountEvents.forEach((ev) => {
    if (ev.flowKey === "claim") flowUsage.claim++;
    if (ev.flowKey === "reset") flowUsage.reset++;
  });

  const pieData = [
    { name: "Start Account Setup", value: flowUsage.claim },
    { name: "Reset / Forgot Password", value: flowUsage.reset }
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
        Student Account Overview
      </Typography>

      <Typography variant="body2" sx={{ color: "#6b7280", mb: 3 }}>
        Summary of usage and success metrics for Student Account flows.
      </Typography>

      {/* Overall solved rate */}
      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Exit Feedback — Solved Rate
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "1.8rem", fontWeight: 600 }}>
            {solvedRate.toFixed(1)}%
          </Typography>
          <Typography variant="body2" sx={{ color: "#6b7280" }}>
            Based on {feedbackEvents.length} feedback responses
          </Typography>
        </CardContent>
      </Card>

      {/* Pie chart for claim vs reset */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Flow Distribution
          </Typography>

          <Box sx={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StudentAccountPage;
