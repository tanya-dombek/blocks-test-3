import type { BlockMode } from "../types";
import { modeIcons } from "../assets/imgs";

type ModeMenuProps = {
  setMenuOpen: (menuOpen: boolean) => void;
  setCurrentMode: (mode: BlockMode) => void;
}

const ModeMenu: React.FC<ModeMenuProps> = ({ setMenuOpen, setCurrentMode }) => (
  <div className="mode-menu">
    {(["text", "bottom", "top", "left"] as BlockMode[]).map((mode) => (
      <button key={mode} onClick={() => {setMenuOpen(false); setCurrentMode(mode)}}>
        <img src={modeIcons[mode]} alt={`${mode} mode`} />
      </button>
    ))}
  </div>
);

export default ModeMenu;