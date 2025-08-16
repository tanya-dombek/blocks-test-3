export type BlockMode = "text" | "left" | "top" | "bottom";

export interface BlockData {
  id: string;
  text: string;
  mode: BlockMode;
  imageSrc?: string;
}

export interface BlockProps extends BlockData {
  indicator: number;
  newBlock: number;
  saveEdit: (id: string, text: string, mode: BlockMode) => void;
  isFocused: boolean;
  isSelected: boolean;
  isEditing: boolean;
  onMouseEnter: () => void;
  onClick: () => void;
  onEditClick: () => void;
  onSave: (text: string, mode: BlockMode) => void;
  onCancel: () => void;
}