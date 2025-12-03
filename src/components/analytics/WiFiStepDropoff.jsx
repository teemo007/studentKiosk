import { Box } from "@mui/material";
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
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: 2,
      }}
    >
      {WIFI_FLOWS.map((flow) => (
        <Box
          key={flow.flowKey}
          sx={{
            p: 1,
          }}
        >
          <StepDropoffChart
            topicId={2}
            flowKey={flow.flowKey}
            title={flow.title}
          />
        </Box>
      ))}
    </Box>
  );
};

export default WiFiStepDropoff;
