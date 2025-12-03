import { useContext } from "react";
import { DisplayContext } from "../../context/DisplayContext";
import "./suggestedAction.styles.scss";
import { FLOW_CONFIG } from "../../config/flowConfig";
import { logEvent } from "../../services/loggings";

const SuggestedAction = () => {
  const { currentTopic, setIsOpen, setCurrentFlow } =
    useContext(DisplayContext);

  // General helper: This is used to open any sub-process of any topic in the modal.
  const openFlowModal = async (panelId, flowKey) => {
    setCurrentFlow(flowKey || null);
    setIsOpen((prev) => ({
      ...prev,
      [panelId]: true,
    }));

    try {
      await logEvent({
        action: "flow_started",
        topicId: panelId,
        flowKey,
      });
    } catch (e) {
      console.error("logEvent(flow_started) error:", e);
    }

  };

  // Nothing selected yet
  if (!currentTopic) {
    return (
      <button className="center-btn" disabled>
        <span className="center-btn-title">Tap a category</span>
        <span className="center-btn-sub">
          to see a recommended
          <br />
          next step
        </span>
      </button>
    );
  }

  const flowsForTopic = FLOW_CONFIG[currentTopic];

  if (!flowsForTopic) {
    return (
      <button className="center-btn" disabled>
        <span className="center-btn-title">Coming soon</span>
        <span className="center-btn-sub">
          This category doesn&apos;t have
          <br />
          guided steps yet.
        </span>
      </button>
    );
  }

  const flowEntries = Object.entries(flowsForTopic);
  const flowCount = flowEntries.length;

  const layoutClass = flowCount <= 2 ? "center-btn--stack" : "center-btn--grid";

  return (
    <div className="center-area">
      <div className={`center-btn ${layoutClass}`}>
        {flowEntries.map(([flowKey, cfg]) => {
          // Minor detail: The reset button for the Student Account uses the secondary style.
          const isSecondary = currentTopic === 1 && flowKey === "reset";

          return (
            <button
              key={flowKey}
              className={
                "center-inner-btn" +
                (isSecondary ? " center-inner-btn--secondary" : "")
              }
              onClick={() => openFlowModal(currentTopic, flowKey)}
            >
              {cfg.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default SuggestedAction;
