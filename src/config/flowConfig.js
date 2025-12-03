export const FLOW_CONFIG = {
  // 1 Student Account
  1: {
    claim: {
      label: "Start Account Setup",
      url: "https://bctc.baruch.cuny.edu/students/lookup-your-baruch-accounts/#skip-to",
    },
    reset: {
      label: "Reset / Forgot Password",
      url: "https://mypassword.baruch.cuny.edu/",
    },
  },

  // 2 WiFi —— wifiSetUp.html，
  // This section only configures the button label and flowKey (for easy generation of SuggestedAction).
  2: {
    "wifi-walkthrough-for-windows-users": {
      label: "Windows Laptop",
    },
    "wifi-walkthrough-for-chrome-users": {
      label: "MacBook / Chrome",
    },
    "wifi-walkthrough-for-iphone-users": {
      label: "iPhone / iPad",
    },
    "wifi-walkthrough-for-android-users": {
      label: "Android Phone / Tablet",
    },
  },

  // 3 Wireless Printing 
  3: {
    print_ios: {
      label: "iPhone / iPad Printing",
      
    },
    print_android: {
      label: "Android Phone Printing",
      
    },
  },

  // 4 MFA
  4: {
    mfa_first_time: {
      label: "First-time MFA Setup",
    //   url: "https://bctc.baruch.cuny.edu/wp-content/uploads/sites/26/2025/08/Setting-Up-CUNY-Login-MFA.pdf",
    },
    // mfa_manage_devices: {
    //   label: "Add or Change Device",
    //   url: "https://ssologin.cuny.edu/oaa/rui",
    // },
  },
};
