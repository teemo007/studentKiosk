import "./modalContent.components.css";
import "../../baruchStyle/baruchlibstyles.scss";
import { useEffect, useRef, useState } from "react";
import parse from "html-react-parser";
import goUp from "../../assets/images/go-up.svg";
import StepWizard from "../stepWizard/stepWizard.components";
import { wifiSteps } from "../../data/wifiSetUp";
import { printingSteps } from "../../data/printingSetUp";
import { mfaSteps } from "../../data/mfaSetUp";

// Regex for external wifi content links (open in a new window)
const wifiContentRegex = /^.*#content$/;

// Regex for wifi walkthrough pages (handled locally via setUp.* content)
const wifiWalkthroughRegex =
  /wifi-walkthrough-for-(chrome|windows|iphone|android)-users/;

// Regex to detect accordion headers for computer lab info
const computerLabRegex = /^accordion-(1|2)-t\d/;

// Whitelist of URLs that are allowed to open inside the modal iframe
const iframeAllowList = [
  "https://mypassword.baruch.cuny.edu/",
  "https://library.baruch.cuny.edu/about/hours/#content",
  "https://www.baruch.cuny.edu/new-student-programs/new-student-onboarding-guide/",
];

// Helper: check if a given href is allowed to open inside iframe
const isIframeAllowed = (href) =>
  !!href && iframeAllowList.some((allowed) => href.startsWith(allowed));

const ModalContent = ({
  content,
  openWindow,
  links,
  setLinks,
  labIds,
  goBackIcon,
  overrideUrl,
  flowKey,
  onFlowDone,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  // Tracks the current URL being shown inside the iframe.
  // Defaults to the URL passed in via props (content.url).
  const [internalUrl, setInternalUrl] = useState(
    overrideUrl || content?.url || null
  );

  const topRef = useRef(null);

  const { url } = content;

  // 1) When overrideUrl changes (e.g., Start Account Setup / Reset clicked),
  //    use it as the iframe source.
  useEffect(() => {
    if (overrideUrl) {
      setInternalUrl(overrideUrl);
      setIsLoading(true);
    }
  }, [overrideUrl]);

  // 2) When content changes, but there is NO overrideUrl, reset to content.url
  useEffect(() => {
    if (overrideUrl) return; // don't override claim/reset flow
    setInternalUrl(content?.url || null);
    setIsLoading(true);
  }, [content, overrideUrl]);

  useEffect(() => {
    const handleClick2 = (event) => {
      const target = event.target;
      const onlineLabIds = target.id;

      // 1) Accordion behavior for computer lab sections
      if (onlineLabIds && computerLabRegex.test(onlineLabIds)) {
        if (target.nextElementSibling.style.display === "none") {
          target.nextElementSibling.style.display = "block";
          target.classList.add("open");
        } else {
          target.nextElementSibling.style.display = "none";
          target.classList.remove("open");
        }
      }

      // 2) Hyperlink behavior
      // Find closest <a> ancestor (covers clicking on <strong>, <p>, <img>, etc)
      const linkEl = target.closest("a");
      if (linkEl) {
        const href = linkEl.href;
        // console.log(href);
        // Prevent default browser navigation for all links
        event.preventDefault();

        // 1. Wifi walkthrough pages: update "links" to trigger switch() below
        if (wifiWalkthroughRegex.test(href)) {
          const baseHref = href.split("#")[0]; // Drop any hash parts
          setLinks(baseHref); // key：here must be setLinks
          return;
        }

        // 2. "#content" links: open in a separate window via openWindow
        if (wifiContentRegex.test(href) && !isIframeAllowed(href)) {
          openWindow(href, "baruch", 1080, 540);
          return;
        }

        // 3. Whitelisted links (e.g. "Claim now", reset password):
        //    open inside the current modal iframe
        if (isIframeAllowed(href)) {
          setIsLoading(true);
          setInternalUrl(href); // overide iframe content
          return;
        }

        // 4. All other links: disable them (no navigation allowed)
        linkEl.style.pointerEvents = "none";
        linkEl.style.color = "gray";
        return;
      }
    };

    document.addEventListener("click", handleClick2);
    return () => {
      document.removeEventListener("click", handleClick2);
    };
  }, [openWindow, setLinks]);

  // Scroll the modal content to top
  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Back button: restore the iframe to the original content.url
  const handleBack = () => {
    setIsLoading(true);
    setInternalUrl(url || null); // If content.url does not exist initially, return to htmlContent.
  };

  // Actual URL used by the iframe. If internalUrl is set, prefer it;
  // otherwise, fall back to the original url from content.
  const effectiveUrl = internalUrl || url;

  let generalContent;

  // links / labIds are used to detect which wifi walkthrough content to show
  const key = links || labIds || flowKey || "";

  const renderDefaultContent = () => (
    <div className="iContent">
      {/* Back button: only show when we have navigated away from the original URL */}
      {!isLoading && internalUrl && internalUrl !== url && (
        <span>
          {/*   <img
            className="goBackBtn"
            src={goBackIcon}
            onClick={handleBack}
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              zIndex: 10,
            }}
            alt="Go back"
          /> */}
        </span>
      )}

      {isLoading && effectiveUrl ? (
        <div
          className="loader"
          style={{
            position: "absolute",
          }}
        ></div>
      ) : null}

      {/* Main iframe: shows either the original content.url or the internalUrl override */}
      {effectiveUrl && (
        <iframe
          className={`${isLoading ? "test" : "iframeElement"}`}
          id="external-page"
          src={effectiveUrl}
          onLoad={() => setIsLoading(false)}
        />
      )}

      {/* If there is no URL at all, render raw HTML content instead */}
      {!effectiveUrl && parse(content?.htmlContent)}

      {!isLoading && (
        <span className="goUpBtn" onClick={scrollToTop}>
          <img src={goUp} alt="Go up" />
        </span>
      )}
    </div>
  );

  if (content.id === 2) {
    // ---- WiFi walkthroughs with StepWizard ----
    let deviceKey = null;

    if (key.includes("wifi-walkthrough-for-windows-users")) {
      deviceKey = "windows";
    } else if (key.includes("wifi-walkthrough-for-chrome-users")) {
      deviceKey = "chrome";
    } else if (key.includes("wifi-walkthrough-for-iphone-users")) {
      deviceKey = "iphone";
    } else if (key.includes("wifi-walkthrough-for-android-users")) {
      deviceKey = "android";
    }

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
    } else {
      generalContent = renderDefaultContent();
    }

  } else if (content.id === 3) {
    // ---- Wireless Printing walkthroughs ----
    let pKey = null;

    if (key.includes("print_ios")) {
      pKey = "ios";
    } else if (key.includes("print_android")) {
      pKey = "android";
    }
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
    } else {
      generalContent = renderDefaultContent();
    }
  } else if (content.id === 4) {
    // ---- MFA ----
    if (flowKey === "mfa_first_time") {
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
    } else {
      generalContent = renderDefaultContent();
    }

  } else {
    generalContent = renderDefaultContent();
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
