import { Box, Paper, Typography } from "@mui/material";
import StepDropoffChart from "./StepDropoffChart";

const WIFI_FLOWS = [
  {
    flowKey: "wifi-walkthrough-for-windows-users",
    title: "WiFi – Windows Laptop",
  },
  {
    flowKey: "wifi-walkthrough-for-chrome-users",
    title: "WiFi – MacBook / Chrome",
  },
  {
    flowKey: "wifi-walkthrough-for-iphone-users",
    title: "WiFi – iPhone / iPad",
  },
  {
    flowKey: "wifi-walkthrough-for-android-users",
    title: "WiFi – Android Phone / Tablet",
  },
];

const WiFiStepDropoff = () => {
  return (
    <Box
      sx={{
        maxWidth: 1100,
        mx: "auto",
        mt: 3,
        px: 2,
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, 
        gap: 3,
      }}
    >
      {WIFI_FLOWS.map((flow) => (
        <Paper
          key={flow.flowKey}
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 3,
            minHeight: 380,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            {flow.title}
          </Typography>

          <Box sx={{ flex: 1, minHeight: 260 }}>
            <StepDropoffChart topicId={2} flowKey={flow.flowKey} />
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default WiFiStepDropoff;
