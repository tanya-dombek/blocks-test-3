import type { BlockMode } from "../types";
import { modeIcons } from "../assets/imgs";

type ModeMenuProps = {
  setCurrentMode: (mode: BlockMode) => void;
}

const ModeMenu: React.FC<ModeMenuProps> = ({ setCurrentMode }) => (
  <div className="mode-menu">
    {(["text", "bottom", "top", "left"] as BlockMode[]).map((mode) => (
      <button key={mode} onClick={() => setCurrentMode(mode)}>
        <img src={modeIcons[mode]} alt={`${mode} mode`} />
      </button>
    ))}
  </div>
);

export default ModeMenu;