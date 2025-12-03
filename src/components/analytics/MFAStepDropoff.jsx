import { Box } from "@mui/material";
import StepDropoffChart from "./StepDropoffChart";

const MFAStepDropoff = () => {
  return (
    <Box sx={{ p: 1 }}>
      <StepDropoffChart
        topicId={4}
        flowKey="mfa_first_time"
        title="MFA – First-time Setup (Step Drop-off)"
      />
    </Box>
  );
};

export default MFAStepDropoff;
