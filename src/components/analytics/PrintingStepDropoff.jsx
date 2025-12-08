import { Box, Paper, Typography } from "@mui/material";
import StepDropoffChart from "./StepDropoffChart";

const PRINTING_FLOWS = [
  {
    flowKey: "print_ios",
    title: "Wireless Printing – iPhone / iPad",
  },
  {
    flowKey: "print_android",
    title: "Wireless Printing – Android Phone",
  },
];

const PrintingStepDropoff = () => {
  const chartCount = PRINTING_FLOWS.length;
  const columns =
    chartCount <= 2 ? "1fr" : "repeat(auto-fit, minmax(420px, 1fr))";

  return (
    <Box
      sx={{
        maxWidth: 1100,
        mx: "auto",
        mt: 3,
        px: 2,
        display: "grid",
        gridTemplateColumns: columns,
        gap: 3,
      }}
    >
      {PRINTING_FLOWS.map((flow) => (
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
            <StepDropoffChart topicId={3} flowKey={flow.flowKey} />
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default PrintingStepDropoff;
