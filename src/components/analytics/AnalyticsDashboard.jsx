
import "./AnalyticsDashboard.scss";
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
  Legend,
  ResponsiveContainer,
  Pie,
  PieChart,
  Cell,
} from "recharts";
import WiFiStepDropoff from "./WiFiStepDropoff";
import PrintingStepDropoff from "./PrintingStepDropoff";
import MFAStepDropoff from "./MFAStepDropoff";

// MUI
import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import InsightsIcon from "@mui/icons-material/Insights";
import TimelineIcon from "@mui/icons-material/Timeline";
import WifiIcon from "@mui/icons-material/Wifi";
import PrintIcon from "@mui/icons-material/Print";
import SecurityIcon from "@mui/icons-material/Security";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const TOPIC_LABELS = {
  1: "Student Account",
  2: "WiFi",
  3: "Wireless Printing",
  4: "Multi-Factor Authentication",
};


const HAS_STEPS_TOPIC = (topicId) => Number(topicId) !== 1;


const SummaryCard = ({ bg, title, value, subtitle }) => (
  <Paper
    elevation={0}
    sx={{
      height: "100%",
      borderRadius: 3,
      bgcolor: bg,
      p: 2.5,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}
  >
    <Typography variant="body2" sx={{ opacity: 0.7 }}>
      {title}
    </Typography>
    <Typography variant="h5" sx={{ mt: 0.5, mb: 0.5 }}>
      {value}
    </Typography>
    {subtitle && (
      <Typography variant="caption" sx={{ opacity: 0.7 }}>
        {subtitle}
      </Typography>
    )}
  </Paper>
);

// 通用的 Step Drop-off 容器（Printing / MFA 先用占位）
const StepDropoffCard = ({ title, subtitle, children }) => (
  <Card
    elevation={0}
    sx={{ borderRadius: 3, bgcolor: "#ffffff", height: "100%" }}
  >
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" sx={{ mb: 1.5, color: "#6b7280" }}>
          {subtitle}
        </Typography>
      )}
      {children}
    </CardContent>
  </Card>
);

const FLOW_LABELS = {
  // Student Account
  claim: "Account / Claim",
  reset: "Account / Reset",

  // WiFi walkthroughs
  "wifi-walkthrough-for-windows-users": "WiFi / Windows",
  "wifi-walkthrough-for-chrome-users": "WiFi / Mac/Chrome",
  "wifi-walkthrough-for-iphone-users": "WiFi / iPhone",
  "wifi-walkthrough-for-android-users": "WiFi / Android",

  // Wireless printing
  print_ios: "Printing / iOS",
  print_android: "Printing / Android",

  // MFA
  mfa_first_time: "MFA / First-time",
};

const AnalyticsDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview"); // "overview" | "flowDetail" | "wifi" | "printing" | "mfa"

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const snap = await getDocs(collection(db, "events"));
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setEvents(data);
      } catch (e) {
        console.error("Error loading events:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // ---------- Loading ----------
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f4f6fb",
          color: "#1f2933",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body1">Loading analytics...</Typography>
      </Box>
    );
  }


  const overviewByTopic = {};
  const flowsByKey = {};

  for (const ev of events) {
    const { action, topicId, flowKey, solved } = ev;
    if (!topicId) continue;

    if (!overviewByTopic[topicId]) {
      overviewByTopic[topicId] = {
        flow_started: 0,
        flow_completed: 0,
        solved: 0,
        feedbackCount: 0,
      };
    }
    const topicBucket = overviewByTopic[topicId];

    if (action === "flow_started") {
      topicBucket.flow_started += 1;
    } else if (action === "flow_completed") {
      topicBucket.flow_completed += 1;
    } else if (action === "flow_exit_feedback") {
      topicBucket.feedbackCount += 1;
      if (solved === true) topicBucket.solved += 1;
    }

    if (flowKey) {
      const flowId = `${topicId}::${flowKey}`;
      if (!flowsByKey[flowId]) {
        flowsByKey[flowId] = {
          topicId,
          flowKey,
          started: 0,
          completed: 0,
          backCount: 0,
        };
      }
      const flowBucket = flowsByKey[flowId];

      if (action === "flow_started") {
        flowBucket.started += 1;
      } else if (action === "flow_completed") {
        flowBucket.completed += 1;
      } else if (action === "step_back") {
        flowBucket.backCount += 1;
      }
    }
  }

  const topicRows = Object.entries(overviewByTopic).map(([topicId, v]) => {
    const numericId = Number(topicId);

    const completion =
      HAS_STEPS_TOPIC(numericId) && v.flow_started > 0
        ? (v.flow_completed / v.flow_started) * 100
        : null;

    const solvedRate =
      v.feedbackCount > 0 ? (v.solved / v.feedbackCount) * 100 : null;

    return {
      topicId: numericId,
      label: TOPIC_LABELS[topicId] || `Topic ${topicId}`,
      ...v,
      completion,
      solvedRate,
    };
  });

  const topicChartData = topicRows.map((row) => ({
    topic: row.label,
    completion: row.completion != null ? row.completion : 0,
    solvedRate: row.solvedRate != null ? row.solvedRate : 0,
  }));

  const flowRows = Object.values(flowsByKey)
    .filter((f) => HAS_STEPS_TOPIC(f.topicId))
    .map((f) => {
      const completion = f.started > 0 ? (f.completed / f.started) * 100 : null;
      const avgBack = f.started > 0 ? f.backCount / f.started : 0;

      return {
        ...f,
        completion,
        avgBack,
      };
    });

  const flowChartData = flowRows.map((f) => ({
    flow: FLOW_LABELS[f.flowKey] || f.flowKey,
    completion: f.completion ?? 0,
  }));

  // 一些汇总数字用于顶部四个卡片
  const totalStarted = topicRows.reduce((s, r) => s + r.flow_started, 0);
  const totalCompleted = topicRows.reduce((s, r) => s + r.flow_completed, 0);
  const avgCompletion =
    topicRows.length > 0
      ? topicRows.reduce((s, r) => s + (r.completion || 0), 0) /
        topicRows.length
      : 0;
  const avgSolved =
    topicRows.length > 0
      ? topicRows.reduce((s, r) => s + (r.solvedRate || 0), 0) /
        topicRows.length
      : 0;



  const renderOverviewSection = () => (
    <>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
          Overview by Topic
        </Typography>
        <Typography variant="body2" sx={{ color: "#6b7280" }}>
          Quick snapshot of how each topic is performing on the kiosk.
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            bg="#e0f2fe"
            title="Flows Started"
            value={totalStarted}
            subtitle="Total guided flows launched"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            bg="#e0f7fa"
            title="Flows Completed"
            value={totalCompleted}
            subtitle="Reached the last step"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            bg="#fef3c7"
            title="Average Completion"
            value={`${avgCompletion.toFixed(1)}%`}
            subtitle="Across guided flows"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            bg="#fee2e2"
            title="Average Solved"
            value={`${avgSolved.toFixed(1)}%`}
            subtitle="Based on exit feedback"
          />
        </Grid>
      </Grid>


      <Card elevation={0} sx={{ borderRadius: 3, bgcolor: "#ffffff", mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Overview by Topic
          </Typography>

          <Paper
            elevation={0}
            sx={{
              mt: 1,
              mb: 2,
              bgcolor: "#f9fafb",
              overflowX: "auto",
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Topic</TableCell>
                  <TableCell>Flows Started</TableCell>
                  <TableCell>Flows Completed</TableCell>
                  <TableCell>Completion % (Guided)</TableCell>
                  <TableCell>Solved % (Feedback)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topicRows.map((row) => (
                  <TableRow key={row.topicId}>
                    <TableCell>{row.label}</TableCell>
                    <TableCell>{row.flow_started}</TableCell>
                    <TableCell>{row.flow_completed}</TableCell>
                    <TableCell>
                      {row.completion != null ? row.completion.toFixed(1) : "—"}
                    </TableCell>
                    <TableCell>
                      {row.solvedRate != null ? row.solvedRate.toFixed(1) : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          <Box sx={{ mt: 1.5, height: 300, minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Topic Completion &amp; Solved Rate
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topicChartData}
                margin={{ top: 40, right: 16, left: 0, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="topic"
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis unit="%" />
                <Tooltip
                  formatter={(value) => `${Number(value).toFixed(1)}%`}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: 8 }}
                />
                <Bar
                  dataKey="completion"
                  name="Completion %"
                  fill="#0065A4"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="solvedRate"
                  name="Solved %"
                  fill="#F4A300"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </>
  );

  const renderFlowDetailSection = () => (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
          Flow Detail
        </Typography>
        <Typography variant="body2" sx={{ color: "#6b7280" }}>
          Detailed statistics for each guided flow (claim, WiFi setup, printing,
          MFA, etc.).
        </Typography>
      </Box>

      <Card elevation={0} sx={{ borderRadius: 3, bgcolor: "#ffffff", mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Flow Detail Table
          </Typography>

          <Paper
            elevation={0}
            sx={{
              mt: 1,
              mb: 2,
              maxHeight: 260,
              overflow: "auto",
              bgcolor: "#f9fafb",
            }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Topic</TableCell>
                  <TableCell>Flow Key</TableCell>
                  <TableCell>Started</TableCell>
                  <TableCell>Completed</TableCell>
                  <TableCell>Completion %</TableCell>
                  <TableCell>Avg Back / Flow</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {flowRows.map((f) => (
                  <TableRow key={`${f.topicId}::${f.flowKey}`}>
                    <TableCell >
                      {TOPIC_LABELS[f.topicId] || f.topicId}
                    </TableCell>
                    <TableCell>{f.flowKey}</TableCell>
                    <TableCell>{f.started}</TableCell>
                    <TableCell>{f.completed}</TableCell>
                    <TableCell>
                      {f.completion != null ? f.completion.toFixed(1) : "—"}
                    </TableCell>
                    <TableCell>{f.avgBack.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          <Box sx={{ mt: 1.5, height: 300, minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Flow Completion Rate
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={flowChartData}
                margin={{ top: 40, right: 16, left: 0, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="flow"
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis unit="%" />
                <Tooltip
                  formatter={(value) => `${Number(value).toFixed(1)}%`}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: 8 }}
                />
                <Bar
                  dataKey="completion"
                  name="Completion %"
                  fill="#0065A4"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </>
  );
  const renderStudentAccSection = () => {
    // Only events for Student Account (topicId = 1)
    const accountEvents = events.filter((ev) => ev.topicId === 1);

    // Exit feedback events (solve / not solved)
    const feedbackEvents = accountEvents.filter(
      (ev) => ev.action === "flow_exit_feedback"
    );

    const solvedCount = feedbackEvents.filter(
      (ev) => ev.solved === true
    ).length;
    const notSolvedCount = feedbackEvents.length - solvedCount;

    const solvedRate =
      feedbackEvents.length > 0
        ? (solvedCount / feedbackEvents.length) * 100
        : 0;

    // Flow usage: claim vs reset
    const flowUsage = {
      claim: 0,
      reset: 0,
    };

    accountEvents.forEach((ev) => {
      if (ev.flowKey === "claim") flowUsage.claim += 1;
      if (ev.flowKey === "reset") flowUsage.reset += 1;
    });

    const pieData = [
      { name: "Start Account Setup", value: flowUsage.claim },
      { name: "Reset / Forgot Password", value: flowUsage.reset },
    ];

    const PIE_COLORS = ["#1E3A8A", "#3B82F6"]; // Baruch-ish blues

    return (
      <>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
            Student Account Overview
          </Typography>
          <Typography variant="body2" sx={{ color: "#6b7280" }}>
            Usage and success metrics for the Student Account flows
            (lookup/claim and reset password).
          </Typography>
        </Box>

        {/* Solved rate card */}
        <Card sx={{ borderRadius: 3, bgcolor: "#ffffff", mb: 3 }} elevation={0}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
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
          </CardContent>
        </Card>

        {/* Flow distribution pie chart */}
        <Card sx={{ borderRadius: 3, bgcolor: "#ffffff" }} elevation={0}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Flow Distribution (Claim vs Reset)
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280", mb: 2 }}>
              How often students use Start Account Setup vs Reset / Forgot
              Password from the kiosk.
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
          </CardContent>
        </Card>
      </>
    );
  };

  const renderWiFiSection = () => (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
          WiFi – Step Drop-off
        </Typography>
        <Typography variant="body2" sx={{ color: "#6b7280" }}>
          Funnel view for all WiFi walkthroughs (Windows, Mac/Chrome, iPhone /
          iPad, Android). See where students most often stop in each flow.
        </Typography>
      </Box>

      <StepDropoffCard
        title="WiFi Guided Walkthroughs"
        subtitle="Each chart shows step retention for one WiFi device flow."
      >
        <WiFiStepDropoff />
      </StepDropoffCard>
    </>
  );

  const renderPrintingSection = () => (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
          Wireless Printing – Step Drop-off
        </Typography>
        <Typography variant="body2" sx={{ color: "#6b7280" }}>
          Funnel view for the iOS and Android wireless printing walkthroughs.
        </Typography>
      </Box>

      <StepDropoffCard
        title="Step Drop-off – Wireless Printing"
        subtitle="Each chart shows how many sessions reach each step in the printing wizard."
      >
        <PrintingStepDropoff />
      </StepDropoffCard>
    </>
  );

  const renderMfaSection = () => (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
          MFA – Step Drop-off
        </Typography>
        <Typography variant="body2" sx={{ color: "#6b7280" }}>
          Funnel for the 18-step first-time MFA setup flow, from starting on the
          CUNY MFA self-service page to successfully completing TOTP login.
        </Typography>
      </Box>

      <StepDropoffCard
        title="Step Drop-off – MFA First-time Setup"
        subtitle="Shows how many sessions reach each step in the 18-step MFA wizard."
      >
        <MFAStepDropoff />
      </StepDropoffCard>
    </>
  );

  const renderMainContent = () => {
    switch (activeSection) {
      case "overview":
        return renderOverviewSection();
      case "flowDetail":
        return renderFlowDetailSection();
      case "studentAccount":
        return renderStudentAccSection();
      case "wifi":
        return renderWiFiSection();
      case "printing":
        return renderPrintingSection();
      case "mfa":
        return renderMfaSection();
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f4f6fb" }}>
      {/* 左侧 Sidebar */}
      <Box
        component="aside"
        sx={{
          width: 260,
          bgcolor: "#ffffff",
          borderRight: "1px solid #e5e7eb",
          display: "flex",
          flexDirection: "column",
          p: 2.5,
          userSelect: "none",
        }}
      >

        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "12px",
              bgcolor: "#2563eb",
              mr: 1.5,
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Onboarding Stats
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            bgcolor: "#f9fafb",
            p: 2,
            display: "flex",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Avatar sx={{ mr: 1.5, bgcolor: "#2563eb" }}>K</Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Kiosk Admin
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              Baruch Library 6F
            </Typography>
          </Box>
        </Paper>


        <List dense sx={{ flex: 1 }}>
          <ListItem
            button
            selected={activeSection === "overview"}
            onClick={() => setActiveSection("overview")}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              bgcolor: activeSection === "overview" ? "#eef2ff" : "transparent",
              cursor: "pointer",
            }}
          >
            <ListItemIcon>
              <DashboardIcon
                sx={{
                  color: activeSection === "overview" ? "#4f46e5" : "inherit",
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary="Overview by Topic"
              primaryTypographyProps={{ fontWeight: 600 }}
            />
          </ListItem>

          <ListItem
            button
            selected={activeSection === "flowDetail"}
            onClick={() => setActiveSection("flowDetail")}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              bgcolor:
                activeSection === "flowDetail" ? "#eef2ff" : "transparent",
              cursor: "pointer",
            }}
          >
            <ListItemIcon>
              <TimelineIcon
                sx={{
                  color: activeSection === "flowDetail" ? "#4f46e5" : "inherit",
                }}
              />
            </ListItemIcon>
            <ListItemText primary="Flow Detail" />
          </ListItem>

          <Divider sx={{ my: 1.5 }} />
          <ListItem
            button
            selected={activeSection === "studentAccount"}
            onClick={() => setActiveSection("studentAccount")}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              bgcolor:
                activeSection === "studentAccount" ? "#eef2ff" : "transparent",
              cursor: "pointer",
            }}
          >
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Student Account" />
          </ListItem>

          <ListItem
            button
            selected={activeSection === "wifi"}
            onClick={() => setActiveSection("wifi")}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              bgcolor: activeSection === "wifi" ? "#eef2ff" : "transparent",
              cursor: "pointer",
            }}
          >
            <ListItemIcon>
              <WifiIcon
                sx={{
                  color: activeSection === "wifi" ? "#4f46e5" : "inherit",
                }}
              />
            </ListItemIcon>
            <ListItemText primary="WiFi" />
          </ListItem>

          <ListItem
            button
            selected={activeSection === "printing"}
            onClick={() => setActiveSection("printing")}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              bgcolor: activeSection === "printing" ? "#eef2ff" : "transparent",
              cursor: "pointer",
            }}
          >
            <ListItemIcon>
              <PrintIcon
                sx={{
                  color: activeSection === "printing" ? "#4f46e5" : "inherit",
                }}
              />
            </ListItemIcon>
            <ListItemText primary="Wireless Printing" />
          </ListItem>

          <ListItem
            button
            selected={activeSection === "mfa"}
            onClick={() => setActiveSection("mfa")}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              bgcolor: activeSection === "mfa" ? "#eef2ff" : "transparent",
              cursor: "pointer",
            }}
          >
            <ListItemIcon>
              <SecurityIcon
                sx={{
                  color: activeSection === "mfa" ? "#4f46e5" : "inherit",
                }}
              />
            </ListItemIcon>
            <ListItemText primary="MFA" />
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />
        <Typography variant="caption" sx={{ color: "#9ca3af" }}>
          Prototype analytics for Student Onboarding Kiosk By <strong>Zijie Luo</strong>
        </Typography>
      </Box>

      {/* 右侧主内容：根据 activeSection 渲染 */}
      <Box component="main" sx={{ flex: 1, p: 3.5 }}>
        {renderMainContent()}
      </Box>
    </Box>
  );
};

export default AnalyticsDashboard;
