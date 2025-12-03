import { useState } from "react";
import "./stepWizard.css";
import { useContext } from "react";
import { DisplayContext } from "../../context/DisplayContext";
import { logEvent } from "../../services/loggings";

const StepWizard = ({ steps, topicId, onDone }) => {
  const { currentFlow } = useContext(DisplayContext);
  const [index, setIndex] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  if (!steps.length) {
    return null;
  }

  const step = steps[index];
  const isFirst = index === 0;
  const isLast = index === steps.length - 1;

  /** ===== Logging Helpers ===== */
  const logStepCompleted = (stepIndex) => {
    logEvent({
      action: "step_completed",
      topicId,
      flowKey: currentFlow,
      stepIndex: stepIndex + 1,
      stepId: steps[stepIndex].id,
    });
  };

  const logFlowCompleted = () => {
    logEvent({
      action: "flow_completed" || null,
      topicId,
      flowKey: currentFlow || null,
      totalSteps: steps.length,
    });
  };

  const logBack = (fromIndex) => {
    logEvent({
      action: "step_back",
      topicId,
      flowKey: currentFlow || null,
      stepIndex: fromIndex + 1,
      stepId: steps[fromIndex].id,
    });
  };

  const handleNext = () => {
    if (isLast) {
      if (hasCompleted) return;

      logStepCompleted(index);
      logFlowCompleted();
      setHasCompleted(true);

      if (onDone) {
        onDone();
      }
      return;
    }

    logStepCompleted(index);
    setIndex((prev) => prev + 1);
  };

  const handleBack = () => {
    if (!isFirst) {
      logBack(index);
      setIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="stepwizard">
      <header className="stepwizard-header">
        <div className="stepwizard-phase">{step.phase}</div>
        <div className="stepwizard-progress">
          Step {index + 1} of {steps.length}
        </div>
      </header>

      <main className="stepwizard-main">
        <div className="stepwizard-image">
          <img src={step.image} alt={step.title} />
        </div>
        <h3 className="stepwizard-title">{step.title}</h3>
        <p className="stepwizard-instruction">{step.instruction}</p>
      </main>

      <footer className="stepwizard-footer">
        <button
          className="stepwizard-btn stepwizard-btn-secondary"
          onClick={handleBack}
          disabled={isFirst}
        >
          Back
        </button>

        <button
          className="stepwizard-btn stepwizard-btn-primary"
          onClick={handleNext}
          disabled={isLast && hasCompleted}
        >
          {isLast ? "Done" : "Next"}
        </button>
      </footer>
    </div>
  );
};

export default StepWizard;
