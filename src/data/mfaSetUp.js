import mfa1 from "../assets/images/mfas/mfa1.png";
import mfa2 from "../assets/images/mfas/mfa2.png";
import mfa3 from "../assets/images/mfas/mfa3.png";
import mfa4 from "../assets/images/mfas/mfa4.png";
import mfa5 from "../assets/images/mfas/mfa5.png";
import mfa6 from "../assets/images/mfas/mfa6.png";
import mfa7 from "../assets/images/mfas/mfa7.png";
import mfa8 from "../assets/images/mfas/mfa8.png";
import mfa9 from "../assets/images/mfas/mfa9.png";
import mfa10 from "../assets/images/mfas/mfa10.png";
import mfa11 from "../assets/images/mfas/mfa11.png";
import mfa12 from "../assets/images/mfas/mfa12.png";
import mfa13 from "../assets/images/mfas/mfa13.png";
import mfa14 from "../assets/images/mfas/mfa14.png";
import mfa15 from "../assets/images/mfas/mfa15.png";
import mfa16 from "../assets/images/mfas/mfa16.png";
import mfa17 from "../assets/images/mfas/mfa17.png";
import mfa18 from "../assets/images/mfas/mfa18.png";

export const mfaSteps = {
  firstTime: [
    {
      id: 1,
      phase: "Open CUNY MFA self-service & sign in",
      device: "computer",
      image: mfa1,
      title: "Go to the CUNY MFA page and log in",
      instruction:
        "On the computer, open https://ssologin.cuny.edu/oaa/rui and sign in with your CUNY Login username and password.",
    },
    {
      id: 2,
      phase: "Allow the MFA application to access your account",
      device: "computer",
      image: mfa2,
      title: "Click Allow to continue",
      instruction:
        "When the Oracle Identity Management page asks to grant access, click Allow.",
    },
    {
      id: 3,
      phase: "Confirm you are on the MFA settings home page",
      device: "computer",
      image: mfa3,
      title: "Check that you see “Hi, what are you managing today?”",
      instruction:
        "Make sure the page titled “Hi, what are you managing today?” is displayed.",
    },
    {
      id: 4,
      phase: "Open My Authentication Factors",
      device: "computer",
      image: mfa3,
      title: "Click Manage in the My Authentication Factors tile",
      instruction: "On the CUNY Login Advanced Authentication page, click Manage in the My Authentication Factors tile.",
    },
    {
      id: 5,
      phase: "Start adding a new authentication factor",
      device: "computer",
      image: mfa4,
      title: "Click Add Authentication Factor",
      instruction:
        "On the My Authentication Factors page, click Add Authentication Factor to see the list of methods.",
    },
    {
      id: 6,
      phase: "Choose the Mobile Authenticator method",
      device: "computer",
      image: mfa5,
      title: "Select “Mobile Authenticator – TOTP”",
      instruction:
        "From the list of authentication factors, choose Mobile Authenticator – TOTP (Time-based One-Time Password).",
    },
    {
      id: 7,
      phase: "Name this MFA method",
      device: "computer",
      image: mfa6,
      title: "Enter a friendly name for this MFA",
      instruction:
        "In the Friendly Name field, type a name such as “CUNY Login MFA” so you can recognize it in Microsoft Authenticator.",
    },
    {
      id: 8,
      phase: "Prepare to use the Microsoft Authenticator app",
      device: "computer",
      image: mfa7,
      title: "Open Microsoft Authenticator on your phone",
      instruction:
        "On your mobile phone, open the Microsoft Authenticator app so you are ready to add the new account.",
    },
    {
      id: 9,
      phase: "Navigate to add account in the app",
      device: "phone",
      image: mfa8,
      title: "Open the Verified IDs / add account screen",
      instruction:
        "In Microsoft Authenticator, tap Verified IDs at the bottom or the circular button to open the add account screen.",
    },
    {
      id: 10,
      phase: "Choose to scan a QR code",
      device: "phone",
      image: mfa9,
      title: "Tap “Scan a QR code”",
      instruction: "On the Microsoft Authenticator screen, tap Scan a QR code.",
    },
    {
      id: 11,
      phase: "Scan the QR code on the computer",
      device: "phone",
      image: mfa10,
      title: "Use your phone to scan the QR code",
      instruction:
        "Use the camera window on your phone to scan the QR code shown on the Setup Mobile Authenticator page on the computer. This adds a new MFA account with a 6-digit code that changes every 30 seconds.",
    },
    {
      id: 12,
      phase: "Go back to the computer to verify",
      device: "computer",
      image: mfa12,
      title: "Click Verify Now on the computer",
      instruction:
        "On the CUNY Login Advanced Authentication – Setup Mobile Authenticator page on the computer, click Verify Now.",
    },
    {
      id: 13,
      phase: "Enter the code from Microsoft Authenticator",
      device: "computer",
      image: mfa13,
      title: "Type the one-time password code",
      instruction:
        "In the Verification Code field, enter the 6-digit code from the Microsoft Authenticator app on your phone.",
    },
    {
      id: 14,
      phase: "Save and confirm your MFA setup",
      device: "computer",
      image: mfa14,
      title: "Click Verify and Save",
      instruction:
        "Click Verify and Save. You should now see the Mobile Authenticator – TOTP account listed on the My Authentication Factors page.",
    },
    {
      id: 15,
      phase: "Use MFA when signing in (TOTP)",
      device: "computer",
      image: mfa15,
      title: "Sign in and wait for the MFA prompt",
      instruction:
        "In the CUNY Login window, enter your CUNY Login username and password and click Log In. A window appears asking you to choose an MFA method.",
    },
    {
      id: 16,
      phase: "Choose the TOTP method for this login",
      device: "computer",
      image: mfa16,
      title: "Click “Enter OTP from the device”",
      instruction:
        "In the MFA options, click Enter OTP from the device for the MFA method name you set up for CUNY Login MFA.",
    },
    {
      id: 17,
      phase: "Get your one-time code from the app",
      device: "phone",
      image: mfa17,
      title: "Open Microsoft Authenticator to view the code",
      instruction:
        "On your mobile phone, open the Microsoft Authenticator app and look at the one-time password code for your CUNY Login MFA.",
    },
    {
      id: 18,
      phase: "Finish signing in with MFA",
      device: "computer",
      image: mfa18,
      title: "Enter the one-time password and click Verify",
      instruction:
        "On the computer, type the one-time password code into the Enter OTP field and click Verify to finish signing in.",
    },
  ],
};
