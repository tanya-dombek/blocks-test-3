import { editIcon, editPrimeIcon } from "../assets/imgs";
import type { BlockMode } from "../types";

type RightColProps = {
  mode: BlockMode;
  indicator: number;
  newBlock: number;
  indicatorRef: React.RefObject<HTMLDivElement | null>;
  onEditClick: () => void;
};

const RightCol: React.FC<RightColProps> = ({ mode, indicator, newBlock, indicatorRef, onEditClick }) => {
  return (
    <div className="right-col">
      <button className={`edit-btn ${mode === "top" ? "top" : ""}`} onClick={(e) => { e.stopPropagation(); onEditClick(); }}>
        <img src={mode === "top" ? editPrimeIcon : editIcon} alt="edit" />
      </button>
      {indicator > 0 && (
        <div ref={indicatorRef} className={`indicator ${newBlock > 0 ? "new-block" : ""} ${mode === "bottom" ? "bottom" : ""}`}>
          {newBlock > 0 ? `+${newBlock}` : indicator}
        </div>
      )}
    </div>
  );
};

export default RightCol;
