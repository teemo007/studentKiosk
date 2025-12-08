import { Box, Paper, Typography } from "@mui/material";
import StepDropoffChart from "./StepDropoffChart";

const MFAStepDropoff = () => {
  return (
    <Box
      sx={{
        maxWidth: 1100,
        mx: "auto",
        mt: 3,
        px: 2,
      }}
    >
      <Paper
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
          MFA – First-time Setup (Step Drop-off)
        </Typography>

        <Box sx={{ flex: 1, minHeight: 260 }}>
          <StepDropoffChart topicId={4} flowKey="mfa_first_time" />
        </Box>
      </Paper>
    </Box>
  );
};

export default MFAStepDropoff;
