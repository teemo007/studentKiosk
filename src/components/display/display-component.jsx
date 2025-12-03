import { useContext } from "react";
import { DisplayContext } from "../../context/DisplayContext";
import { boxContent } from "../../data/data";
import GridItem from "../gridItem/girdItem-component";
import Modal from "../modal/modal-component";
import SuggestedAction from "../suggestedAction/SuggestedAction-component";
import "./display-component.scss";

const Display = () => {
  const { isOpen } = useContext(DisplayContext);

  return (
    <div className="wrapperDisplay">
      {/* Middle area: Displays dynamic intelligent recommendations */}
      <div className="qIcon">
        <SuggestedAction />
      </div>

      {/* 4 panels */}
      <div className="widgetWrapper">
        {boxContent.map((content) => (
          <GridItem key={content.id} content={content} />
        ))}
      </div>

      {/* Render the corresponding modal based on isOpen.*/}
      {boxContent.map((content) =>
        isOpen[content.id] ? <Modal key={content.id} content={content} /> : null
      )}
    </div>
  );
};

export default Display;
