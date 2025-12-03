import "./girdItem-component.scss";
import Widget from "../widget/widget-component";
import { useContext } from "react";
import { DisplayContext } from "../../context/DisplayContext";

const GridItem = ({ content }) => {
  const { isOpen } = useContext(DisplayContext);

  return (
    <div className={`grid-item ${isOpen[content?.id] ? "no-hover" : ""}`}>
      <Widget content={content} />
    </div>
  );
};

export default GridItem;
