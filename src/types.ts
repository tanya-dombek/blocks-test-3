export type BlockMode = "text" | "left" | "top" | "bottom";

export interface BlockData {
  id: string;
  text: string;
  mode: BlockMode;
  imageSrc?: string;
}