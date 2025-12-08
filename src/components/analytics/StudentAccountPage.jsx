import { useEffect, useState } from "react";
import { db } from "../../utils/firebase/firebase.utils";
import { collection, getDocs } from "firebase/firestore";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const PIE_COLORS = ["#1E3A8A", "#3B82F6"]; // Baruch blue

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
    return (
      <Box
        sx={{
          minHeight: "40vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <CircularProgress size={24} />
        <Typography sx={{ color: "#6b7280" }}>
          Loading Student Account stats...
        </Typography>
      </Box>
    );
  }

  const accountEvents = events.filter((ev) => Number(ev.topicId) === 1);

  const feedbackEvents = accountEvents.filter(
    (ev) => ev.action === "flow_exit_feedback"
  );
  const solvedCount = feedbackEvents.filter((ev) => ev.solved === true).length;
  const notSolvedCount = feedbackEvents.length - solvedCount;

  const solvedRate =
    feedbackEvents.length > 0 ? (solvedCount / feedbackEvents.length) * 100 : 0;

  const flowUsage = { claim: 0, reset: 0 };
  accountEvents.forEach((ev) => {
    if (ev.flowKey === "claim") flowUsage.claim += 1;
    if (ev.flowKey === "reset") flowUsage.reset += 1;
  });

  const pieData = [
    { name: "Start Account Setup", value: flowUsage.claim },
    { name: "Reset / Forgot Password", value: flowUsage.reset },
  ];

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", px: 2, mt: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
          Student Account Overview
        </Typography>
        <Typography variant="body2" sx={{ color: "#6b7280" }}>
          Usage and success metrics for the Student Account flows (lookup/claim
          and reset password).
        </Typography>
      </Box>

      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
          bgcolor: "#ffffff",
          p: 3,
          mb: 3,
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Exit Feedback – Solved Rate
        </Typography>
        <Typography
          variant="h3"
          sx={{ fontWeight: 600, mb: 0.5, color: "#1E3A8A" }}
        >
          {solvedRate.toFixed(1)}%
        </Typography>
        <Typography variant="body2" sx={{ color: "#6b7280" }}>
          Based on {feedbackEvents.length} feedback responses
        </Typography>
        <Typography variant="caption" sx={{ color: "#9ca3af" }}>
          {solvedCount} marked as solved, {notSolvedCount} still need help
        </Typography>
      </Paper>

      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
          bgcolor: "#ffffff",
          p: 3,
          mb: 3,
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Flow Distribution (Claim vs Reset)
        </Typography>
        <Typography variant="body2" sx={{ color: "#6b7280", mb: 2 }}>
          How often students use Start Account Setup vs Reset / Forgot Password
          from the kiosk.
        </Typography>

        <Box sx={{ width: "100%", height: 260 }}>
          {pieData[0].value === 0 && pieData[1].value === 0 ? (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#9ca3af",
              }}
            >
              <Typography variant="body2">
                No Student Account flow data yet.
              </Typography>
            </Box>
          ) : (
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
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default StudentAccountPage;
