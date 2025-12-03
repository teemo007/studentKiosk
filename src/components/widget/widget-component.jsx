import "./widget-component.scss";
import Modal from "../modal/modal-component";
import { useContext } from "react";
import { DisplayContext } from "../../context/DisplayContext";
import { db } from "../../utils/firebase/firebase.utils";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const Widget = ({ content }) => {
  // const { isOpen, setIsOpen } = useContext(DisplayContext);
  // const isWidgetOpen = isOpen[content.id];

  const { isOpen, setIsOpen, setCurrentTopic, setCurrentFlow } =
    useContext(DisplayContext);

  const isWidgetOpen = isOpen[content.id];

  const handleOpen = async () => {
    // 1. mark which topic is selected (1=Account, 2=WiFi...)
    setCurrentTopic(content.id);
    // 2. reset flow (we will choose claim/reset from the center card)
    setCurrentFlow(null);

    // try {
    //   await addDoc(collection(db, "events"), {
    //     action: "click_panel",
    //     topicId: content.id,
    //     topicTitle: content.title,
    //     timestamp: serverTimestamp(),
    //     kioskId: "NVC2F-KIOSK01",
    //   });
    // } catch (err) {
    //   console.error("Firebase logging error:", err);
    // }
  };
  return (
    <div
      className={`boxWrapper ${isWidgetOpen ? "no-hover" : ""}`}
      onClick={handleOpen}
      id={`widget-${content.id}`}
    >

      
        <h1 className="title">{content && content.title}</h1>
        {/* <img className="QrCode" src={content.qr} alt="qrCode" /> */}
        {isWidgetOpen && <Modal content={content} />}{" "}
      
    </div>
  );
};

export default Widget;
