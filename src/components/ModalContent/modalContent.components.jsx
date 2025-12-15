import "./modalContent.components.css";
import "../../baruchStyle/baruchlibstyles.scss";
import { useEffect, useRef, useState } from "react";
import parse from "html-react-parser";
import goUp from "../../assets/images/go-up.svg";
import StepWizard from "../stepWizard/stepWizard.components";
import { wifiSteps } from "../../data/wifiSetUp";
import { printingSteps } from "../../data/printingSetUp";
import { mfaSteps } from "../../data/mfaSetUp";

const wifiContentRegex = /^.*#content$/;
const wifiWalkthroughRegex =
  /wifi-walkthrough-for-(chrome|windows|iphone|android)-users/;
const computerLabRegex = /^accordion-(1|2)-t\d/;

// Allowlist: URLs allowed inside iframe
const iframeAllowList = [
  "https://library.baruch.cuny.edu/about/hours/#content",
  "https://www.baruch.cuny.edu/new-student-programs/new-student-onboarding-guide/",
];
const isIframeAllowed = (href) =>
  !!href && iframeAllowList.some((allowed) => href.startsWith(allowed));

const IFRAME_BLOCKLIST = ["https://baruch.logonbox.com/app/portal/"];
const isIframeBlocked = (href) =>
  !!href && IFRAME_BLOCKLIST.some((p) => href.startsWith(p));

const RESET_URL = "https://mypassword.baruch.cuny.edu/";

const ModalContent = ({
  content,
  openWindow,
  links,
  setLinks,
  labIds,
  overrideUrl,
  flowKey,
  onFlowDone,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [internalUrl, setInternalUrl] = useState(
    overrideUrl || content?.url || null
  );

  const topRef = useRef(null);
  const { url } = content;

  // If content changes and no overrideUrl, reset to content.url
  useEffect(() => {
    if (overrideUrl) return;
    setInternalUrl(content?.url || null);
    setIsLoading(true);
  }, [content, overrideUrl]);

  useEffect(() => {
    const onDocClick = (event) => {
      const target = event.target;

      // Accordion behavior for computer lab sections
      const clickedId = target?.id;
      if (clickedId && computerLabRegex.test(clickedId)) {
        const panel = target.nextElementSibling;
        const isClosed = panel?.style?.display === "none";
        if (panel) panel.style.display = isClosed ? "block" : "none";
        target.classList.toggle("open", isClosed);
        return;
      }

      // Link behavior
      const linkEl = target.closest?.("a");
      if (!linkEl) return;

      const href = linkEl.href;
      event.preventDefault();

      // Blocked-by-iframe sites: open in new window only
      if (isIframeBlocked(href)) {
        openWindow(href, "baruch_external", 1080, 720);
        setInternalUrl(null);
        setIsLoading(false);
        return;
      }

      // Wifi walkthrough pages: handled locally
      if (wifiWalkthroughRegex.test(href)) {
        setLinks(href.split("#")[0]);
        return;
      }

      // "#content" links: open external window (unless allowed in iframe)
      if (wifiContentRegex.test(href) && !isIframeAllowed(href)) {
        openWindow(href, "baruch", 1080, 540);
        return;
      }

      // Allowed links open in iframe
      if (isIframeAllowed(href)) {
        setIsLoading(true);
        setInternalUrl(href);
        return;
      }

      // Otherwise disable
      linkEl.style.pointerEvents = "none";
      linkEl.style.color = "gray";
    };

    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [openWindow, setLinks]);

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const effectiveUrl = internalUrl || url;
  const key = links || labIds || flowKey || "";

  const renderResetGuide = () => (
    <div
      className="iContent"
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: 520,
          width: "100%",
          textAlign: "center",
          padding: "36px 40px",
          borderRadius: 16,
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: 12 }}>
          Reset / Forgot Password
        </h2>

        <p
          style={{
            lineHeight: 1.6,
            marginBottom: 28,
            color: "#4b5563",
            fontSize: 16,
          }}
        >
          This action opens Baruch’s official password reset portal in a
          separate window.
        </p>

        <button
          className="exit-yes"
          style={{
            padding: "12px 22px",
            fontSize: 16,
            borderRadius: 999,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
          }}
          onClick={() =>
            openWindow(RESET_URL, "baruch_password_reset", 1080, 720)
          }
        >
          Open Password Reset Page
          {/* External-link icon (inline SVG, no dependency) */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M14 3h7v7" />
            <path d="M10 14L21 3" />
            <path d="M21 14v7h-7" />
            <path d="M3 10v11h11" />
          </svg>
        </button>

        <p
          style={{
            marginTop: 14,
            fontSize: 14,
            color: "#6b7280",
          }}
        >
          ⏳ This kiosk window will remain open.
        </p>
      </div>
    </div>
  );

  const renderDefaultContent = () => (
    <div className="iContent">
      {isLoading && effectiveUrl ? (
        <div className="loader" style={{ position: "absolute" }} />
      ) : null}

      {effectiveUrl && (
        <iframe
          className={isLoading ? "test" : "iframeElement"}
          id="external-page"
          src={effectiveUrl}
          onLoad={() => setIsLoading(false)}
        />
      )}

      {!effectiveUrl && parse(content?.htmlContent)}

      {!isLoading && (
        <span className="goUpBtn" onClick={scrollToTop}>
          <img src={goUp} alt="Go up" />
        </span>
      )}
    </div>
  );

  let generalContent = renderDefaultContent();

  if (content.id === 1 && flowKey === "reset") {
    generalContent = renderResetGuide();
  } else if (content.id === 2) {
    let deviceKey = null;
    if (key.includes("wifi-walkthrough-for-windows-users"))
      deviceKey = "windows";
    else if (key.includes("wifi-walkthrough-for-chrome-users"))
      deviceKey = "chrome";
    else if (key.includes("wifi-walkthrough-for-iphone-users"))
      deviceKey = "iphone";
    else if (key.includes("wifi-walkthrough-for-android-users"))
      deviceKey = "android";

    if (deviceKey && wifiSteps[deviceKey]) {
      generalContent = (
        <div className="iContent">
          <StepWizard
            steps={wifiSteps[deviceKey]}
            topicId={content.id}
            flowKey={flowKey}
            onDone={onFlowDone}
          />
        </div>
      );
    }
  } else if (content.id === 3) {
    let pKey = null;
    if (key.includes("print_ios")) pKey = "ios";
    else if (key.includes("print_android")) pKey = "android";

    if (pKey && printingSteps[pKey]) {
      generalContent = (
        <div className="iContent">
          <StepWizard
            steps={printingSteps[pKey]}
            topicId={content.id}
            flowKey={flowKey}
            onDone={onFlowDone}
          />
        </div>
      );
    }
  } else if (content.id === 4 && flowKey === "mfa_first_time") {
    generalContent = (
      <div className="iContent">
        <StepWizard
          steps={mfaSteps.firstTime}
          topicId={content.id}
          flowKey={flowKey}
          onDone={onFlowDone}
        />
      </div>
    );
  }

  return (
    <div
      ref={topRef}
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      {generalContent}
    </div>
  );
};

export default ModalContent;
