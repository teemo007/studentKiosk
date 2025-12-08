# Student Onboarding Kiosk – Code Structure

## 1. Project Overview

This repository contains the source code for my HCI 518 research prototype: an interactive student onboarding kiosk designed to simplify common technology setup tasks such as WiFi configuration, wireless printing, computer lab access, and MFA enrollment.

The kiosk is deployed as a **full-screen web application** and is
designed to reduce\
cognitive load, shorten helpdesk queue times, and provide measurable
analytics for evaluation.

---

##  Features Overview

###  **1. Touch-Optimized Guided Workflows**

-   Full-screen step-by-step UI
-   One instruction per screen (Fitts' Law / Hick's Law informed design)
-   Large imagery, kiosk-friendly UI
-   Back / Next flow navigation
-   Smart recommendation for each topic

###  **2. Support for Multiple IT Topics**

-   Student Account (Claim / Reset)
-   Wi-Fi Setup (Android / iOS)
-   Wireless Printing Setup
-   MFA (Multi-Factor Authentication) Setup --- 18 steps guided flow
-   Computer Lab Access Info

###  **3. User Interaction Logging (for HCI Evaluation)**

-   Every step interaction is logged with:
    -   topicId
    -   stepId
    -   timestamp
    -   solved/not solved
    -   final user decision
-   Logged to Firebase for later analysis

###  **4. Analytics Dashboard (Summative Evaluation)**

Includes: - Overall solve rate - Average completion time - Step drop-off
charts (WiFi Android / iOS / Printing / MFA) - Student Account stats -
Per-topic overview\
- Follows Nielsen's Heuristic Evaluation principles

---

##  Installation & Development

### **Prerequisites**

-   Node.js ≥ 18\
-   Yarn package manager

### **Install Dependencies**

``` bash
yarn
```

### **Start Development Server**

``` bash
yarn dev
```
------------------------------------------------------------------------

##  Project Structure Overview

    src/
    │
    ├── main.jsx                # App entry point
    ├── App.jsx                 # Main router + layout container
    │
    ├── context/
    │   └── DisplayContext.jsx  # Global state: topic, flow, modal, etc.
    │
    ├── config/
    │   └── flowConfig.js       # All step-by-step flows (WiFi, MFA, Printing)
    │
    ├── data/                   # Static QR code data, lab info, etc.
    │   ├── wifiSetUp.js
    │   ├── printingSetUp.js
    │   ├── mfaSetUp.js
    │   └── data.js
    │
    ├── utils/
    │   └── firebase/
    │       └── firebase.utils.js  # Firebase init + logEvent / logFinalEvent
    │
    ├── services/
    │   └── loggings.js         # Abstraction layer for analytics logging
    │
    │         
    │
    ├── components/
    │   ├── display/            # Home screen 4-panel layout 
    │   ├── widget/             # Category card UI (large touch buttons)
    │   ├── modal/              # Full-screen modal container
    │   ├── ModalContent/       # Inner step-by-step content (image + text)
    │   ├── timeout/            # Inactivity timeout overlay
    │   ├── gridItem/           # Grid-style small option items (e.g., claim/reset)
    │   ├── suggestedAction/    # Dynamic "Recommended next step" button
    │   └── stepWizard/         # Back/Next step navigation controller
    │
    ├── components/analytics/
    │   ├── AnalyticsDashboard.jsx      # Main evaluation dashboard UI
    │   ├── StepDropoffChart.jsx        # Reusable drop-off chart component (Recharts)
    │   ├── WiFiStepDropoff.jsx         # WiFi overall drop-off visualization
    │   ├── WiFiAndroidStepDropoff.jsx  # WiFi (Android) step-by-step drop-off
    │   ├── PrintingStepDropoff.jsx     # Wireless printing drop-off visualization
    │   ├── MFAStepDropoff.jsx          # MFA drop-off visualization
    │   └── StudentAccountPage.jsx     # Student Account analytics (claim/reset stats)
    │
    ├── baruchStyle/
    │
    └── assets/

------------------------------------------------------------------------
##  Architecture Explanation

### **Global State (DisplayContext)**

Controls: - currentTopic
- currentFlow
- modal open/close
- step index
- inactivity timeout

------------------------------------------------------------------------
##  Workflow System (Step Wizard)

Uses: - flowConfig.js
- stepWizard.components.jsx
- ModalContent components

Each page shows: - One instruction
- One image
- Back / Next buttons

------------------------------------------------------------------------
##  Modal System

Supports: - Full-screen modal
- Exit confirmation
- Support fallback message
- Inactivity timeout

------------------------------------------------------------------------

## Logging & Analytics

Logs: - topic selection
- device type
- step navigation
- solve/not solve

All sent to Firebase.

Dashboard visualizes: - Solve rate
- Step drop-off
- Topic comparisons
- Completion statistics

------------------------------------------------------------------------
##  UI Design Principles

This project applies:

### Gestalt Laws

-   Similarity
-   Proximity
-   Continuation
-   Focal Point

### Nielsen Heuristics

-   Visibility
-   Control & Freedom
-   Recognition over Recall
-   Minimalist Design

### Human Performance Models

-   Fitts' Law
-   Hick's Law
-   Steering Law

------------------------------------------------------------------------
## Build for Production

``` bash
yarn build
```

------------------------------------------------------------------------

## Author

Zijie Luo\
Stony Brook University\
CSE 518 --- Human-Computer Interaction
