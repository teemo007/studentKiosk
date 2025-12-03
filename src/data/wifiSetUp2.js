export const wifiSteps = {
  windows: [
    {
      id: 1,
      phase: "Connect to Baruch WiFi",
      device: "computer",
      image:
        "https://bctc.baruch.cuny.edu/wp-content/uploads/sites/26/2022/01/Windows-Walkthrough-WIFi-Online_Step1a.gif",
      title: "Open Wi-Fi settings",
      instruction:
        'On the Windows taskbar, click the Wi-Fi icon to open the network list. Navigate to Wi-Fi Settings and select "Baruch". ',
    },
    {
      id: 2,
      phase: "Connect to Baruch WiFi",
      device: "computer",
      image:
        "https://bctc.baruch.cuny.edu/wp-content/uploads/sites/26/2022/01/Windows-Walkthrough-WIFi-Online-1b.gif",
      title: 'Choose the "Baruch" network',
      instruction:
        'From the list, click the network named "Baruch" (or "Baruch-Secure") and click "Connect".',
    },
    {
      id: 3,
      phase: "Sign in with your Baruch account",
      device: "computer",
      image:
        "https://bctc.baruch.cuny.edu/wp-content/uploads/sites/26/2022/01/Windows-Walkthrough-WIFi-Online-1c.gif",
      title: "Enter your Baruch username and password",
      instruction:
        "You will then be prompted to fill in you Baruch Credentials.   ",
    },
    {
      id: 4,
      phase: "Sign in with your Baruch account",
      device: "computer",
      image:
        "https://bctc.baruch.cuny.edu/wp-content/uploads/sites/26/2022/01/Windows-Walkthrough-WIFi-Online-Step-3.gif",
      title: "Accept the security / certificate prompt",
      instruction:
        "Sign into User name with your Baruch credentials Students: [first initial] + [.] + [lastname]",
    },
    {
      id: 5,
      phase: "Finish",
      device: "computer",
      image:
        "https://bctc.baruch.cuny.edu/wp-content/uploads/sites/26/2022/01/Windows-Walkthrough-WIFi-Online-Step-3.gif",
      title: "Make sure you are connected",
      instruction:
        'Check the Wi-Fi icon: it should show you are connected to "Baruch".',
    },
  ],

  chrome: [
    {
      id: 1,
      phase: "Connect to Baruch WiFi",
      device: "computer",
      image:
        "https://bctc.baruch.cuny.edu/wp-content/uploads/sites/26/2022/02/Chromebook-WiFi-Illustrations-01.jpg",
      title: "Open Wi-Fi menu",
      instruction: "Navigate to Wi-Fi Settings and select “Baruch” ",
    },
    {
      id: 2,
      phase: "Sign in with your Baruch account",
      device: "computer",
      image:
        "https://bctc.baruch.cuny.edu/wp-content/uploads/sites/26/2022/02/Chromebook-WiFi-Illustrations-02.jpg",
      title: 'Select "Baruch" from the list',
      instruction:
        "Under EAP method select “PEAP”. Under EAP Phase 2 authentication select “MSCHAPV2”.Under CA certificate select “Do not check”.",
    },
    {
      id: 3,
      phase: "Sign in with your Baruch account",
      device: "computer",
      image:
        "https://bctc.baruch.cuny.edu/wp-content/uploads/sites/26/2022/02/Chromebook-WiFi-Illustrations-03.jpg",
      title: "Enter your Baruch username and password",
      instruction:
        "Sign into Identity with your Baruch credentials. Students: [first initial] + [.] + [lastname] and select “Connect” ",
    },
  ],

  iphone: [
    {
      id: 1,
      phase: "Connect to Baruch WiFi",
      device: "phone",
      image:
        "https://bctc.baruch.cuny.edu/wp-content/uploads/sites/26/2022/01/iPhone-WIFI-Walkthrough-Images_Large-Step-1.png",
      title: "Open Settings → Wi-Fi",
      instruction:
        'On your iPhone, open Settings and tap Wi-Fi. Under Networks, tap the one named "Baruch" (or "Baruch-Secure"),and select “Baruch”',
    },
    {
      id: 2,
      phase: "Part A: Sign in with your Baruch account",
      device: "phone",
      image:
        "https://bctc.baruch.cuny.edu/wp-content/uploads/sites/26/2022/01/iPhone-WIFI-Walkthrough-Images_Large-Step-2a.png",
      title: "Enter your Baruch username and password",
      instruction: "Type your Baruch username and password",
    },
    {
      id: 3,
      phase: "Part B: Sign in with your Baruch account",
      device: "phone",
      image:
        "https://bctc.baruch.cuny.edu/wp-content/uploads/sites/26/2022/01/iPhone-WIFI-Walkthrough-Images_Large-Step-2b.png",
      title: "Enter your Baruch username and password",
      instruction:
        "Students: [first initial] + [.] + [lastname] Staff & Faculty: [first initial] + [lastname] and select “Join”",
    },
    {
      id: 4,
      phase: "Finish",
      device: "phone",
      image:
        "https://bctc.baruch.cuny.edu/wp-content/uploads/sites/26/2022/01/iPhone-WIFI-Walkthrough-Images_Large-Step-3.png",
      title: "Tap Trust if you see a certificate screen",
      instruction: 'If a certificate message appears, tap "Trust" to continue.',
    },
  ],

  android: [
    {
      id: 1,
      phase: "Connect to Baruch WiFi",
      device: "phone",
      image:
        "https://bctc.baruch.cuny.edu/wp-content/uploads/sites/26/2022/01/Android_-Tutorial-Images_Large-Step-1.png",
      title: "Open Wi-Fi settings",
      instruction:
        "On your Android phone / tablet, open Settings and tap Wi-Fi or Network & Internet, and and select “Baruch”",
    },
    {
      id: 2,
      phase: "Part A: EAP method",
      device: "phone",
      image:
        "https://bctc.baruch.cuny.edu/wp-content/uploads/sites/26/2022/01/Android_-Tutorial-Images_Large-Step-2a.png",
      title: "Under the EAP Method",
      instruction: "Make sure the EAP method is “PEAP”",
    },
    {
      id: 3,
      phase: 'Part B: phase: "EAP method',
      device: "phone",
      image:
        "https://bctc.baruch.cuny.edu/wp-content/uploads/sites/26/2022/01/Android_-Tutorial-Images_Large-Step-2b.png",
      title: "Under the EAP Method",
      instruction:
        "Select the down arrow in order to change to the correct method",
    },
    {
      id: 4,
      phase: "Select Certificate",
      device: "phone",
      image:
        "https://bctc.baruch.cuny.edu/wp-content/uploads/sites/26/2022/01/Android_-Tutorial-Images_Large-Step-3b.png",
      title: 'Under CA certificate select “Don\'t validate”',
      instruction:
        'Domain: bc.baruch.cuny.edu',
    },
    {
      id: 5,
      phase: "Sign in with your Baruch account",
      device: "phone",
      image:
        "https://bctc.baruch.cuny.edu/wp-content/uploads/sites/26/2022/01/Android_-Tutorial-Images_Large-Step-4-Student.png",
      title: "Enter your Baruch username and password",
      instruction:
        'Sign into Identity with your Baruch credentials Students: [first initial] + [.] + [lastname] and select “Connect” Student Default Password YYMmmDD + Last 4 SSN and select “Connect”',
    },
  ],
};
