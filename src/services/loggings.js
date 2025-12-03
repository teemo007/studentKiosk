// src/services/loggings.js
import { db } from "../utils/firebase/firebase.utils";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";


/**
 * General event log
 *
 * action: "topic_selected" | "flow_started" | "step_viewed" | "step_next" |
 *         "flow_completed" | "flow_exit_feedback" | "complete_task" ...
 */
export async function logEvent(data) {
  try {
    await addDoc(collection(db, "events"), {
      ...data,
      kioskId: "BARUCH_2F_KIOSK_01", //
      timestamp: serverTimestamp(),
    });
  } catch (e) {
    console.error("Error logging final task:", e);
  }
}

