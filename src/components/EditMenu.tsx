import type { BlockMode } from "../types";
import { modeIcons, cancelIcon, postIcon } from "../assets/imgs";

type EditMenuProps = {
  currentMode: BlockMode;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  cancelEdit: () => void;
  saveChanges: () => void;
  disabled: boolean;
};

const EditMenu: React.FC<EditMenuProps> = ({currentMode, cancelEdit, setMenuOpen, saveChanges, disabled}) => {
  return (
    <div className="edit-menu">
      <div className="top-menu">
        <button className="cancel-btn" onClick={cancelEdit}>
          <img src={cancelIcon} alt="cancel button"/>
        </button>
        <button className="mode-btn" onClick={() => setMenuOpen(prev => !prev)}>
          <img src={modeIcons[currentMode]} alt="mode button"/>
        </button>
        <button className="post-btn" onClick={saveChanges} disabled={disabled}>
          <img src={postIcon} alt="post button"/>
        </button>
      </div>
    </div>
  );
};

export default EditMenu;
