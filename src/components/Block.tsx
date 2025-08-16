import React, { useRef, useEffect, useState, memo } from "react";
import type { BlockProps, BlockMode } from "../types";
import { useBlockLayout } from "../hooks/useBlockLayout";
import RightCol from "./RightCol";
import ModeMenu from "./ModeMenu";
import EditMenu from "./EditMenu";
import BlockContent from "./BlockContent";

const Block: React.FC<BlockProps> = memo(({ id, text, mode, indicator, imageSrc, newBlock, saveEdit,
  isFocused, isSelected, isEditing, onMouseEnter, onClick, onEditClick, onSave, onCancel }) => {

  const textRef = useRef<HTMLSpanElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState<BlockMode>(mode);
  const [currentText, setCurrentText] = useState<string>(text);
  const { lineCount, indicatorBelow } = useBlockLayout(isEditing, textRef, textareaRef, indicatorRef, currentMode, indicator, newBlock);
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    setDisabled(currentText === "" || (currentText === text && currentMode === mode));
  }, [currentText, currentMode, text, mode]);

  const cancelEdit = () => {
    setMenuOpen(false);
    setCurrentText(text);
    setCurrentMode(mode);
    onCancel();
  }

  const saveChanges = () => {
    saveEdit(id, currentText, currentMode);
    setMenuOpen(false);
    onSave(currentText, currentMode);
  };

  return (
    <div className={`block ${(indicatorBelow && currentMode !== 'bottom') ? "indicator-below" : ""} ${isEditing ? "edit" : ""} 
      ${isFocused ? "focused" : ""} ${isSelected ? "selected" : ""}`} onMouseEnter={onMouseEnter} onClick={onClick}>

      {menuOpen && <ModeMenu setCurrentMode={setCurrentMode}/>}
      {isEditing && (
        <EditMenu currentMode={currentMode} cancelEdit={cancelEdit} setMenuOpen={setMenuOpen} saveChanges={saveChanges} disabled={disabled}/>
      )}
      <BlockContent
        isEditing={isEditing}
        currentText={currentText}
        text={text}
        setCurrentText={setCurrentText}
        currentMode={currentMode}
        textRef={textRef}
        textareaRef={textareaRef}
        imageSrc={imageSrc}
        lineCount={lineCount}
        indicatorBelow={indicatorBelow}
      />
      {!isEditing && (
        <RightCol mode={mode} indicator={indicator} newBlock={newBlock} indicatorRef={indicatorRef} onEditClick={onEditClick}/>
      )}
    </div>
  );
});

export default Block;
