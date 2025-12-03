import { Box } from "@mui/material";
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
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: 2,
      }}
    >
      {PRINTING_FLOWS.map((flow) => (
        <Box key={flow.flowKey} sx={{ p: 1 }}>
          <StepDropoffChart
            topicId={3}
            flowKey={flow.flowKey}
            title={flow.title}
          />
        </Box>
      ))}
    </Box>
  );
};

export default PrintingStepDropoff;
