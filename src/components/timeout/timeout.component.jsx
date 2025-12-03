import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // For routing
import "./timeout.component.css";
import Triangle from "../../assets/images/triangle-exclamation.svg?react";
import { DisplayContext } from "../../context/DisplayContext";

const InactivityTimeout = ({
  timeout = 100000,
  countdown = 10000,
  redirectUrl = "/",
  closeAllWindows,
}) => {
  const navigate = useNavigate();

  const { setIsOpen } = useContext(DisplayContext);

  const [showWarning, setShowWarning] = useState(false);

  const [countdownTime, setCountdownTime] = useState(countdown);

  let timeoutId, warningTimeoutId;

  useEffect(() => {
    const resetTimeout = () => {
      clearTimeout(timeoutId);
      clearTimeout(warningTimeoutId);
      setShowWarning(false);
      setCountdownTime(countdown);

      timeoutId = setTimeout(() => {
        setShowWarning(true);

        // Countdown before redirect
        warningTimeoutId = setInterval(() => {
          setCountdownTime((prevTime) => {
            if (prevTime <= 1000) {
              clearInterval(warningTimeoutId);
              redirectToHome();
              return 0;
            }
            return prevTime - 1000;
          });
        }, 1000);
      }, timeout); // Time before showing warning
    };

    const redirectToHome = () => {
      setIsOpen({});
      closeAllWindows();
    };

    // Set up event listeners for user activity
    const events = ["click", "mousemove", "keypress", "scroll"];
    events.forEach((event) => window.addEventListener(event, resetTimeout));

    // Initialize the timeout
    resetTimeout();

    // Clean up event listeners and timeouts on component unmount
    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, resetTimeout)
      );
      clearTimeout(timeoutId);
      clearInterval(warningTimeoutId);
    };
  }, [
    navigate,
    timeout,
    countdown,
    redirectUrl,
    closeAllWindows,
  ]);

  const handleContinue = () => {
    setShowWarning(false);
    setCountdownTime(countdown);
  };

  return (
    <>
      {showWarning && (
        <div className="warning-modal">
          <div className="contentWrapper">
            <div className="headerWrapper">
              <Triangle className="triIcon" />
              <div className="textWrapper">
                <h1>
                  Your Session is about to timeout in{" "}
                  {Math.ceil(countdownTime / 1000)} seconds due to Inactivite.
                </h1>
                <h2>Click ok to continue your session.</h2>
              </div>
            </div>
            <button onClick={handleContinue}>OK</button>
          </div>
        </div>
      )}
    </>
  );
};
export default InactivityTimeout;
