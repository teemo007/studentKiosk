import { useContext, useState } from "react";
import ModalContent from "../ModalContent/modalContent.components";
import InactivityTimeout from "../timeout/timeout.component";
import "./modal-component.css";
import cross from "../../assets/images/cross.svg";
import goBack from "../../assets/images/go-back.svg";
import { DisplayContext } from "../../context/DisplayContext";
import { logEvent } from "../../services/loggings";
import { FLOW_CONFIG } from "../../config/flowConfig";

const Modal = ({ content }) => {
  const { setIsOpen, currentFlow, setCurrentFlow, currentSessionId,setCurrentSessionId } =
    useContext(DisplayContext);

  const [openedWindows, setOpenedWindows] = useState([]);
  const [links, setLinks] = useState("");
  const [labIds, setlabIds] = useState("");

  // Show or not “Did this solve your problem?”
  const [confirmExit, setConfirmExit] = useState(false);
  // After the user selects "No", a support message will be displayed.
  const [showSupportMessage, setShowSupportMessage] = useState(false);

  const openCenteredWindow = (url, windowName, width, height) => {
    const dualScreenLeft = window.screenLeft ?? window.screenX;
    const dualScreenTop = window.screenTop ?? window.screenY;

    const screenWidth =
      window.innerWidth ?? document.documentElement.clientWidth ?? screen.width;

    const screenHeight =
      window.innerHeight ??
      document.documentElement.clientHeight ??
      screen.height;

    const systemZoom = screenWidth / window.screen.availWidth;

    const left = (screenWidth - width) / 2 / systemZoom + dualScreenLeft;
    const top = (screenHeight - height) / 2 / systemZoom + dualScreenTop;

    const newWindow = window.open(
      url,
      windowName,
      `width=${width / systemZoom},height=${
        height / systemZoom
      },top=${top},left=${left},menubar=no`
    );
    newWindow?.focus();

    setOpenedWindows((prev) => [...prev, newWindow]);
    return newWindow;
  };

  const closeAllWindows = () => {
    openedWindows.forEach((win) => {
      if (win && !win.closed) win.close();
    });
    setOpenedWindows([]);
  };

  const closeModalCompletely = () => {
    setIsOpen((prev) => {
      const updated = { ...prev };
      if (content.id != null) delete updated[content.id];
      delete updated.QrunosOpen;
      return updated;
    });

    setCurrentFlow(null);
    setCurrentSessionId(null);
    setConfirmExit(false);
    setShowSupportMessage(false);
    closeAllWindows();
  };

  const handleOverlayClick = (e) => {
    if (e.target !== e.currentTarget) return;
    setConfirmExit(true);
  };

  const handleCancelConfirm = () => {
    setConfirmExit(false);
    setShowSupportMessage(false);
  };

  const handleAskSolved = () => {
    setConfirmExit(true);
    setShowSupportMessage(false);
  };

  const handleSolved = async (solved) => {
    await logEvent({
      action: "flow_exit_feedback",
      topicId: content.id,
      flowKey: currentFlow,
      solved, // true / false
      exitType: "user_exit_prompt", // for future uses.
      sessionId: currentSessionId,
    });

    if (solved) {
      closeModalCompletely();
    } else {
      setShowSupportMessage(true);
      setTimeout(() => closeModalCompletely(), 2400);
    }
  };

  const topicConfig = FLOW_CONFIG[content.id] || {};
  const activeFlowConfig =
    currentFlow && topicConfig[currentFlow] ? topicConfig[currentFlow] : null;

  let overrideUrl = null;
  if (activeFlowConfig && activeFlowConfig.url) {
    overrideUrl = activeFlowConfig.url;
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      {confirmExit && <div className="modal-exit-backdrop" />}
      <div
        className={`modal-content ${confirmExit ? "is-confirming-exit" : ""}`}
      >
        <InactivityTimeout closeAllWindows={closeAllWindows} />

        <span>
          <img className="close-button" src={cross} onClick={handleAskSolved} />
        </span>

        {links && (
          <span>
            <img
              className="goBackBtn"
              src={goBack}
              onClick={() => setLinks("")}
            />
          </span>
        )}

        <div className="iframeWrapper">
          <ModalContent
            content={content}
            openWindow={openCenteredWindow}
            links={links}
            setLinks={setLinks}
            labIds={labIds}
            setlabIds={setlabIds}
            goBackIcon={goBack}
            overrideUrl={overrideUrl}
            flowKey={currentFlow}
            onFlowDone={handleAskSolved}
          />
        </div>

        {/* Exit confirmation overlay */}
        {confirmExit ? (
          <div className="modal-exit-confirm">
            <button
              className="modal-exit-close"
              onClick={handleCancelConfirm}
              aria-label="Cancel exit"
            >
              x
            </button>
            {showSupportMessage ? (
              <>
                <p className="exit-text">
                  Please visit the 6th floor Help Desk for support.
                </p>
              </>
            ) : (
              <>
                <p className="exit-text">Did this solve your problem?</p>
                <div className="exit-btn-row">
                  <button
                    className="exit-yes"
                    onClick={() => handleSolved(true)}
                  >
                    Yes
                  </button>

                  <button
                    className="exit-no"
                    onClick={() => handleSolved(false)}
                  >
                    No, I still need help
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Modal;
