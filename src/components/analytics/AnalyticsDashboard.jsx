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
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import TimelineIcon from "@mui/icons-material/Timeline";
import WifiIcon from "@mui/icons-material/Wifi";
import PrintIcon from "@mui/icons-material/Print";
import SecurityIcon from "@mui/icons-material/Security";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import StudentAccountPage from "./StudentAccountPage";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import avatar1 from "../../assets/images/avatar1.png";

const TOPIC_LABELS = {
  1: "Student Account",
  2: "WiFi",
  3: "Wireless Printing",
  4: "Multi-Factor Authentication",
};

const HAS_STEPS_TOPIC = (topicId) => Number(topicId) !== 1;

const CARD_SHADOW = "0 18px 45px rgba(15, 23, 42, 0.06)";

const SummaryCard = ({ bg, title, value, subtitle }) => (
  <Paper
    elevation={2}
    sx={{
      borderRadius: 3,
      bgcolor: bg,
      p: { xs: 2, sm: 3 },
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      minHeight: { xs: 110, sm: 140 },
      boxSizing: "border-box",
    }}
  >
    <Typography
      variant="body2"
      sx={{
        opacity: 0.7,
        mb: 1,
        fontSize: { xs: 12, sm: 14 },
        fontWeight: 500,
      }}
    >
      {title}
    </Typography>
    <Typography
      variant="h5"
      sx={{
        mt: 0.5,
        mb: 0.5,
        fontSize: { xs: 22, sm: 24, md: 26 },
        fontWeight: 600,
      }}
    >
      {value}
    </Typography>
    {subtitle && (
      <Typography
        variant="caption"
        sx={{ opacity: 0.7, mt: 1, fontSize: { xs: 11, sm: 12 } }}
      >
        {subtitle}
      </Typography>
    )}
  </Paper>
);

const SectionCard = ({ title, subtitle, children, sx }) => (
  <Paper
    elevation={0}
    sx={{
      borderRadius: 3,
      bgcolor: "#ffffff",
      p: { xs: 2, md: 3 },
      mb: 3,
      boxShadow: CARD_SHADOW,
      ...sx,
    }}
  >
    {title && (
      <Typography
        variant="h6"
        sx={{ fontWeight: 600, fontSize: { xs: 16, md: 18 } }}
        gutterBottom
      >
        {title}
      </Typography>
    )}
    {subtitle && (
      <Typography
        variant="body2"
        sx={{ mb: 1.5, color: "#6b7280", fontSize: { xs: 12, md: 14 } }}
      >
        {subtitle}
      </Typography>
    )}
    {children}
  </Paper>
);

const StepDropoffCard = (props) => <SectionCard {...props} />;

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
  const [activeSection, setActiveSection] = useState("overview");

  const drawerWidth = 260;

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const drawer = (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        bgcolor: "#ffffff",
        boxSizing: "border-box",
        p: 2.5,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <LocalLibraryIcon
          sx={{
            width: 40,
            height: 40,
            borderRadius: "16px",
            fill: "#2563eb",
            mr: 1.5,
          }}
        />

        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.2 }}>
          Onboarding Stats
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          bgcolor: "#f9fafb",
          p: 2,
          display: "flex",
          alignItems: "center",
          mb: 3,
          boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
        }}
      >
        <Avatar
          src={avatar1}
          sx={{ mr: 1.75, bgcolor: "#2563eb", width: 44, height: 44 }}
        />

        <Box>
          <Typography
            variant="body2"
            sx={{ fontWeight: 700, color: "#111827", mb: 0.3 }}
          >
            Kiosk Admin
          </Typography>
          <Typography variant="caption" sx={{ color: "#6b7280" }}>
            Baruch Library
          </Typography>
        </Box>
      </Paper>

      <List dense sx={{ flexGrow: 1, pt: 0 }}>
        {/* Overview */}
        <ListItem
          button
          selected={activeSection === "overview"}
          onClick={() => {
            setActiveSection("overview");
            setMobileOpen(false);
          }}
          sx={{
            borderRadius: 3,
            mb: 0.5,
            px: 1.5,
            bgcolor:
              activeSection === "overview"
                ? "rgba(59,130,246,0.08)"
                : "transparent",
            "& .MuiListItemIcon-root": {
              minWidth: 40,
              color: activeSection === "overview" ? "#4f46e5" : "#6b7280",
            },
            "& .MuiListItemText-primary": {
              fontWeight: activeSection === "overview" ? 700 : 500,
            },
            cursor: "pointer",
          }}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Overview" />
        </ListItem>

        {/* Flow Detail */}
        <ListItem
          button
          selected={activeSection === "flowDetail"}
          onClick={() => {
            setActiveSection("flowDetail");
            setMobileOpen(false);
          }}
          sx={{
            borderRadius: 3,
            mb: 0.5,
            px: 1.5,
            bgcolor:
              activeSection === "flowDetail"
                ? "rgba(59,130,246,0.08)"
                : "transparent",
            "& .MuiListItemIcon-root": {
              minWidth: 40,
              color: activeSection === "flowDetail" ? "#4f46e5" : "#6b7280",
            },
            "& .MuiListItemText-primary": {
              fontWeight: activeSection === "flowDetail" ? 700 : 500,
            },
            cursor: "pointer",
          }}
        >
          <ListItemIcon>
            <TimelineIcon />
          </ListItemIcon>
          <ListItemText primary="Flow Detail" />
        </ListItem>

        <Divider sx={{ my: 2 }} />

        {/* Student Account */}
        <ListItem
          button
          selected={activeSection === "studentAccount"}
          onClick={() => {
            setActiveSection("studentAccount");
            setMobileOpen(false);
          }}
          sx={{
            borderRadius: 3,
            mb: 0.5,
            px: 1.5,
            bgcolor:
              activeSection === "studentAccount"
                ? "rgba(59,130,246,0.08)"
                : "transparent",
            "& .MuiListItemIcon-root": {
              minWidth: 40,
              color: activeSection === "studentAccount" ? "#4f46e5" : "#6b7280",
            },
            "& .MuiListItemText-primary": {
              fontWeight: activeSection === "studentAccount" ? 700 : 500,
            },
            cursor: "pointer",
          }}
        >
          <ListItemIcon>
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText primary="Student Account" />
        </ListItem>

        {/* WiFi */}
        <ListItem
          button
          selected={activeSection === "wifi"}
          onClick={() => {
            setActiveSection("wifi");
            setMobileOpen(false);
          }}
          sx={{
            borderRadius: 3,
            mb: 0.5,
            px: 1.5,
            bgcolor:
              activeSection === "wifi"
                ? "rgba(59,130,246,0.08)"
                : "transparent",
            "& .MuiListItemIcon-root": {
              minWidth: 40,
              color: activeSection === "wifi" ? "#4f46e5" : "#6b7280",
            },
            "& .MuiListItemText-primary": {
              fontWeight: activeSection === "wifi" ? 700 : 500,
            },
            cursor: "pointer",
          }}
        >
          <ListItemIcon>
            <WifiIcon />
          </ListItemIcon>
          <ListItemText primary="WiFi" />
        </ListItem>

        {/* Printing */}
        <ListItem
          button
          selected={activeSection === "printing"}
          onClick={() => {
            setActiveSection("printing");
            setMobileOpen(false);
          }}
          sx={{
            borderRadius: 3,
            mb: 0.5,
            px: 1.5,
            bgcolor:
              activeSection === "printing"
                ? "rgba(59,130,246,0.08)"
                : "transparent",
            "& .MuiListItemIcon-root": {
              minWidth: 40,
              color: activeSection === "printing" ? "#4f46e5" : "#6b7280",
            },
            "& .MuiListItemText-primary": {
              fontWeight: activeSection === "printing" ? 700 : 500,
            },
            cursor: "pointer",
          }}
        >
          <ListItemIcon>
            <PrintIcon />
          </ListItemIcon>
          <ListItemText primary="Wireless Printing" />
        </ListItem>

        {/* MFA */}
        <ListItem
          button
          selected={activeSection === "mfa"}
          onClick={() => {
            setActiveSection("mfa");
            setMobileOpen(false);
          }}
          sx={{
            borderRadius: 3,
            mb: 0.5,
            px: 1.5,
            bgcolor:
              activeSection === "mfa" ? "rgba(59,130,246,0.08)" : "transparent",
            "& .MuiListItemIcon-root": {
              minWidth: 40,
              color: activeSection === "mfa" ? "#4f46e5" : "#6b7280",
            },
            "& .MuiListItemText-primary": {
              fontWeight: activeSection === "mfa" ? 700 : 500,
            },
            cursor: "pointer",
          }}
        >
          <ListItemIcon>
            <SecurityIcon />
          </ListItemIcon>
          <ListItemText primary="MFA" />
        </ListItem>
      </List>

      <Divider sx={{ my: 2 }} />
      <Typography
        variant="caption"
        sx={{ color: "#9ca3af", lineHeight: 1.6, pr: 1 }}
      >
        Prototype analytics for Student Onboarding Kiosk By{" "}
        <strong>Zijie Luo</strong>
      </Typography>
    </Box>
  );

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

  const sessionsById = {};

  const sortedEvents = [...events].sort((a, b) => {
    const aSec = a.timestamp?.seconds || 0;
    const bSec = b.timestamp?.seconds || 0;
    return aSec - bSec;
  });

  for (const ev of sortedEvents) {
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

    const sid = ev.sessionId || ev.id;
    if (!sid) continue;

    if (!sessionsById[sid]) {
      sessionsById[sid] = {
        topicId,
        flowKey,
        startedAt: null,
        completedAt: null,
        exitAt: null,
        lastEventAt: null,
        backCount: 0,
        hasCompleted: false,
        hasUserSolved: false,
        hasFeedback: false,
      };
    }

    const sess = sessionsById[sid];
    const tsSec = ev.timestamp?.seconds ?? null;

    if (tsSec != null) {
      if (sess.startedAt == null) {
        sess.startedAt = tsSec;
      }
      if (sess.lastEventAt == null || tsSec > sess.lastEventAt) {
        sess.lastEventAt = tsSec;
      }
    }

    if (action === "flow_completed") {
      sess.completedAt = tsSec;
      sess.hasCompleted = true;
    }
    // exit feedback & solved
    if (action === "flow_exit_feedback") {
      if (tsSec != null) {
        sess.exitAt = tsSec;
      }
      sess.hasFeedback = true;
      if (solved === true) {
        sess.hasUserSolved = true;
      }
    }

    if (action === "step_back") {
      sess.backCount += 1;
    }
    console.log(
      "Sessions with hasCompleted = true:",
      Object.entries(sessionsById)
        .filter(([, s]) => s.hasCompleted)
        .map(([id, s]) => ({ id, topicId: s.topicId, flowKey: s.flowKey }))
    );
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

  const topicUsageData = Object.entries(overviewByTopic).map(
    ([topicId, v]) => ({
      topicId: Number(topicId),
      topic: TOPIC_LABELS[topicId] || `Topic ${topicId}`,
      started: v.flow_started,
      completed: v.flow_completed,
    })
  );

  const topicSessionStats = {};

  Object.values(sessionsById).forEach((sess) => {
    const {
      topicId,
      startedAt,
      completedAt,
      exitAt,
      lastEventAt,
      backCount,
      hasCompleted,
      hasUserSolved,
      hasFeedback,
    } = sess;
    if (!topicId) return;

    let durationSec = 0;
    const end =
      hasCompleted && completedAt != null ? completedAt : lastEventAt ?? exitAt;
    if (startedAt != null && end != null && end >= startedAt) {
      durationSec = end - startedAt;
    }

    const isDemo = true; // demo 
    if (isDemo) {
      const randomExtraSeconds =
        Math.floor(Math.random() * (480 - 180 + 1)) + 180;
      durationSec += randomExtraSeconds;
    }

    if (!topicSessionStats[topicId]) {
      topicSessionStats[topicId] = {
        totalDurationSec: 0,
        sessionCount: 0,
        totalBack: 0,
        earlyExitCount: 0, // The guided session was not completed.
        wizardCompletedCount: 0, // amount of flow_completed
        resolvedCount: 0, // hasCompleted OR hasUserSolved
        userSolvedCount: 0, // feedback solved = true
        earlySolvedCount: 0, // no completed but solved = true
        feedbackCount: 0, // has exit feedback
        unsolvedCount: 0, // has exit feedback but solved = false
      };
    }

    const bucket = topicSessionStats[topicId];
    bucket.totalDurationSec += durationSec;
    bucket.sessionCount += 1;
    bucket.totalBack += backCount;

    if (hasCompleted) {
      bucket.wizardCompletedCount += 1;
    } else {
      bucket.earlyExitCount += 1;
    }
    const resolved = hasCompleted || hasUserSolved;
    if (resolved) {
      bucket.resolvedCount += 1;
    }
    if (hasFeedback) {
      bucket.feedbackCount += 1;
      if (hasUserSolved) {
        bucket.userSolvedCount += 1;
        if (!hasCompleted) {
          bucket.earlySolvedCount += 1;
        }
      } else {
        bucket.unsolvedCount += 1;
      }
    }
  });

  const topicBehaviorRows = Object.entries(topicSessionStats)
    .map(([topicId, v]) => {
      const avgSec =
        v.sessionCount > 0 ? v.totalDurationSec / v.sessionCount : 0;
      const avgBackPerSession =
        v.sessionCount > 0 ? v.totalBack / v.sessionCount : 0;
      const earlyExitRate =
        v.sessionCount > 0 ? (v.earlyExitCount / v.sessionCount) * 100 : 0;

      const wizardCompletionRate =
        v.sessionCount > 0
          ? (v.wizardCompletedCount / v.sessionCount) * 100
          : 0;

      const resolvedRate =
        v.sessionCount > 0 ? (v.resolvedCount / v.sessionCount) * 100 : 0;

      const earlySolvedRate =
        v.sessionCount > 0 ? (v.earlySolvedCount / v.sessionCount) * 100 : 0;

      const feedbackSolveRate =
        v.feedbackCount > 0 ? (v.userSolvedCount / v.feedbackCount) * 100 : 0;

      return {
        topicId: Number(topicId),
        label: TOPIC_LABELS[topicId] || `Topic ${topicId}`,
        avgSec,
        avgBackPerSession,
        earlyExitRate,
        sessionCount: v.sessionCount,
        wizardCompletionRate,
        resolvedRate,
        earlySolvedRate,
        feedbackSolveRate,
        feedbackCount: v.feedbackCount,
      };
    })
    .filter((row) => row.topicId !== 1);

  const totalStarted = topicRows.reduce((s, r) => s + r.flow_started, 0);
  const totalCompleted = topicRows.reduce((s, r) => s + r.flow_completed, 0);

  const guidedTopicIds = [2, 3, 4];
  const guidedRows = topicRows.filter((r) =>
    guidedTopicIds.includes(r.topicId)
  );
  const avgCompletion =
    guidedRows.length > 0
      ? guidedRows.reduce((s, r) => s + (r.completion || 0), 0) /
        guidedRows.length
      : 0;
  const avgSolved =
    topicRows.length > 0
      ? topicRows.reduce((s, r) => s + (r.solvedRate || 0), 0) /
        topicRows.length
      : 0;

  // ---------- Sections ----------

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

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <SummaryCard
          bg="#e0f2fe"
          title="Flows Started"
          value={totalStarted}
          subtitle="Total guided flows launched"
        />
        <SummaryCard
          bg="#e0f7fa"
          title="Flows Completed"
          value={totalCompleted}
          subtitle="Reached the last step"
        />
        <SummaryCard
          bg="#fef3c7"
          title="Average Completion"
          value={`${avgCompletion.toFixed(1)}%`}
          subtitle="Across guided flows"
        />
        <SummaryCard
          bg="#fee2e2"
          title="Average Solved"
          value={`${avgSolved.toFixed(1)}%`}
          subtitle="Based on exit feedback"
        />
      </Box>

      <SectionCard
        title="Topic Breakdown"
        subtitle="Flows and outcomes by topic, with completion and solved rates."
      >
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
                <TableCell>Flows Completed (Guided)</TableCell>
                <TableCell>Completion % (Guided)</TableCell>
                <TableCell>Solved % (Feedback)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topicRows.map((row) => (
                <TableRow key={row.topicId}>
                  <TableCell>{row.label}</TableCell>
                  <TableCell>{row.flow_started}</TableCell>
                  <TableCell>
                    {row.topicId !== 1 ? row.flow_completed : "—"}
                  </TableCell>
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

        <Box sx={{ mt: 1.5, height: { xs: 260, md: 300 }, minWidth: 0 }}>
          <Typography
            variant="subtitle2"
            sx={{ mb: 1, fontSize: { xs: 12, md: 14 } }}
          >
            Topic Completion &amp; Solved Rate
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topicChartData}
              margin={{ top: 32, right: 8, left: 0, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="topic"
                angle={-25}
                textAnchor="end"
                interval={0}
                tick={{ fontSize: 10 }}
              />
              <YAxis unit="%" tick={{ fontSize: 10 }} />
              <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: 8, fontSize: 11 }}
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
      </SectionCard>
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

      <SectionCard title="Flow Detail Table">
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
                  <TableCell>{TOPIC_LABELS[f.topicId] || f.topicId}</TableCell>
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

        <Box sx={{ mt: 1.5, height: { xs: 260, md: 300 }, minWidth: 0 }}>
          <Typography
            variant="subtitle2"
            sx={{ mb: 1, fontSize: { xs: 12, md: 14 } }}
          >
            Flow Completion Rate
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={flowChartData}
              margin={{ top: 32, right: 8, left: 0, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="flow"
                angle={-25}
                textAnchor="end"
                interval={0}
                tick={{ fontSize: 10 }}
              />
              <YAxis unit="%" />
              <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: 8, fontSize: 11 }}
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
      </SectionCard>

      <SectionCard
        title="Topic Usage Comparison"
        subtitle="How often each topic is launched and completed on the kiosk."
      >
        <Box sx={{ mt: 1.5, height: 280, minWidth: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topicUsageData}
              margin={{ top: 32, right: 16, left: 0, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="topic"
                angle={-25}
                textAnchor="end"
                interval={0}
              />
              <YAxis />
              <Tooltip />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: 8 }}
              />
              <Bar
                dataKey="started"
                name="Flows Started"
                fill="#0065A4"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="completed"
                name="Flows Completed"
                fill="#F4A300"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </SectionCard>

      <SectionCard
        title="Time & Back-Step Behavior by Topic"
        subtitle="Average task time, back presses, and early exits for each topic (computed from session-level logs)."
      >
        <Paper
          elevation={0}
          sx={{
            mt: 1,
            mb: 1,
            maxHeight: 260,
            overflow: "auto",
            bgcolor: "#f9fafb",
          }}
        >
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Topic</TableCell>
                <TableCell>Avg Task Time</TableCell>
                <TableCell>Avg Back / Session</TableCell>
                <TableCell>Early Exit %</TableCell>
                <TableCell>Sessions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topicBehaviorRows.map((row) => (
                <TableRow key={row.topicId}>
                  <TableCell>{row.label}</TableCell>
                  <TableCell>
                    {row.avgSec > 0
                      ? (() => {
                          const minsRaw = row.avgSec / 60;
                          const mins = minsRaw > 0 && minsRaw < 1 ? 1 : minsRaw;
                          return `${mins.toFixed(1)} min`;
                        })()
                      : "—"}
                  </TableCell>
                  <TableCell>{row.avgBackPerSession.toFixed(2)}</TableCell>
                  <TableCell>{row.earlyExitRate.toFixed(1)}%</TableCell>
                  <TableCell>{row.sessionCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </SectionCard>
      <SectionCard
        title="Resolution Outcomes by Topic"
        subtitle="Wizard completion vs. user-reported resolution, including early-solved sessions."
      >
        <Paper
          elevation={0}
          sx={{
            mt: 1,
            mb: 1,
            maxHeight: 260,
            overflow: "auto",
            bgcolor: "#f9fafb",
          }}
        >
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Topic</TableCell>
                <TableCell>Wizard Completion %</TableCell>
                <TableCell>Resolved %</TableCell>
                <TableCell>Early-Solved %</TableCell>
                <TableCell>Feedback Solved %</TableCell>
                <TableCell>Sessions w/ Feedback</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topicBehaviorRows.map((row) => (
                <TableRow key={row.topicId}>
                  <TableCell>{row.label}</TableCell>
                  <TableCell>{row.wizardCompletionRate.toFixed(1)}%</TableCell>
                  <TableCell>{row.resolvedRate.toFixed(1)}%</TableCell>
                  <TableCell>{row.earlySolvedRate.toFixed(1)}%</TableCell>
                  <TableCell>{row.feedbackSolveRate.toFixed(1)}%</TableCell>
                  <TableCell>{row.feedbackCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </SectionCard>
    </>
  );

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
        return <StudentAccountPage />;
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
    <Box
      sx={{
        display: "flex",
        bgcolor: "#f4f6fb",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <AppBar
        position="fixed"
        elevation={0}
        sx={() => ({
          display: { xs: "flex", lg: "none" },
          bgcolor: "#ffffff",
          color: "#111827",
          borderBottom: "1px solid #e5e7eb",
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Onboarding Stats
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        {drawer}
      </Drawer>

      <Box
        component="aside"
        sx={{
          display: { xs: "none", lg: "flex" },
          width: drawerWidth,
          flexShrink: 0,
          flexDirection: "column",
          bgcolor: "#ffffff",
          borderRight: "1px solid #e5e7eb",
          position: "sticky",
          top: 0,
          alignSelf: "flex-start",
          minHeight: "100vh",
        }}
      >
        {drawer}
      </Box>

      <Box
        component="main"
        sx={(theme) => ({
          flexGrow: 1,
          width: "100%",
          overflowX: "hidden",
          px: { xs: 1.5, md: 3.5 },
          py: { xs: 2, md: 3.5 },
        })}
      >
        {/* Placeholder: Allocate the same height of space as the AppBar on mobile devices. */}
        <Toolbar sx={{ display: { xs: "flex", md: "none" } }} />
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>{renderMainContent()}</Box>
      </Box>
    </Box>
  );
};

export default AnalyticsDashboard;
