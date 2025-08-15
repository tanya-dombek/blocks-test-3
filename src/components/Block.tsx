import React, { useRef, useEffect, useState, memo ,useCallback } from "react";
import "./Block.scss";
import editIcon from '../assets/edit.svg'
import editPrimeIcon from '../assets/edit-pimary.svg'
import type { BlockData, BlockMode } from "../types";
import textIcon from "../assets/text.svg";
import topIcon from "../assets/top.svg";
import bottomIcon from "../assets/bottom.svg";
import leftIcon from "../assets/left.svg";
import postIcon from "../assets/post.svg";
import cancelIcon from "../assets/cancel.svg";

interface BlockProps extends BlockData {
  indicator: number;
  newBlock: number;
  saveEdit: (id: string, newText: string, newMode: BlockMode) => void;
}

const modeIcons = {
  text: textIcon,
  top: topIcon,
  bottom: bottomIcon,
  left: leftIcon
};

const Block: React.FC<BlockProps> = memo(({ id, text, mode, indicator, imageSrc, newBlock, saveEdit }) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [lineCount, setLineCount] = useState(1);
  const [indicatorBelow, setIndicatorBelow] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState(mode);
  const [currentText, setCurrentText] = useState(text);
  const [disabled, setDisabled] = useState(true);

  const calculateLayout = useCallback(() => {
    const element = isEditing ? textareaRef.current : textRef.current;    
    if (!element) return;

    const style = getComputedStyle(element);
    const lh = parseFloat(style.lineHeight);
    const lines = Math.round(element.offsetHeight / lh);    
    if (lineCount !== lines) setLineCount(lines);
    
    if (!indicator || !indicatorRef.current) {      
      if (indicatorBelow) setIndicatorBelow(false);
      return;
    }
        
    if (currentMode === 'left' && lines <= 2) {
      setIndicatorBelow(false);
      return;
    }

    const originalHeight = element.offsetHeight;    
    const spacer = document.createElement("span");
    spacer.innerHTML = "\u00A0";
    spacer.style.display = "inline-block";
    spacer.style.width = `${indicatorRef.current.offsetWidth}px`;
    spacer.style.height = "1px";
    element.appendChild(spacer);
    const newHeight = element.offsetHeight;    
    element.removeChild(spacer);

    const heightIncreased = newHeight > originalHeight;
    
    if (indicatorBelow !== heightIncreased) setIndicatorBelow(heightIncreased);
  }, [isEditing, indicator, imageSrc, lineCount, newBlock, indicatorBelow, currentMode]);

  useEffect(() => {
    calculateLayout();
    const observer = new ResizeObserver(calculateLayout);
    const element = isEditing ? textareaRef.current : textRef.current;
    if (element) observer.observe(element);
    return () => observer.disconnect();
  }, [calculateLayout, isEditing]);

  useEffect(() => {
    setDisabled(currentText === "" || (currentText === text && currentMode === mode));
  }, [currentText, currentMode, text, mode]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [isEditing, currentText, currentMode]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentText(e.target.value);
  }

  const cancelEdit = () => {
    setIsEditing(false);
    setMenuOpen(false);
    setCurrentText(text);
    setCurrentMode(mode);
  }

  const saveChanges = () => {
    saveEdit(id, currentText, currentMode);
    setIsEditing(false);
    setMenuOpen(false);
  };

  const effectiveLines = (lineCount === 1 && indicatorBelow && !(currentMode !== 'text' && lineCount <= 2)) ? 2 : lineCount;

  return (
    <div className={`block ${(indicatorBelow && currentMode !== 'bottom') ? "indicator-below" : ""} ${isEditing ? "edit" : ""}`} >
      {menuOpen && (
        <div className="mode-menu">
          {(["text", "bottom", "top", "left"] as BlockMode[]).map((mode) => (
              <button key={mode} onClick={() => setCurrentMode(mode)}>
                <img src={modeIcons[mode]} alt={`${mode} mode`} />
              </button>
            )
          )}
        </div>
      )}
      {isEditing && (
        <div className="edit-menu">
          <div className="top-menu">
            <button className="cancel-btn" onClick={cancelEdit}><img src={cancelIcon} alt="cancel button"/></button>
            <button className="mode-btn" onClick={() => setMenuOpen(prev => !prev)}><img src={modeIcons[currentMode]} alt="mode button"/></button>
            <button className="post-btn" onClick={saveChanges} disabled={disabled}><img src={postIcon} alt="post button"/></button>
          </div>
        </div>
      )}
      <div className={`content ${currentMode} ${currentMode !== 'text' && effectiveLines <= 2 ? "center-text" : ""} ${isEditing ? "edit-text" : ""}`}>
        {currentMode !== 'text' && (
          <div className={`image-wrapper ${currentMode}`}>
            <img src={imageSrc} alt="block image" />
          </div>
        )}
        <div className={`text ${effectiveLines === 1 ? "single-line" : "multi-line"} ${currentMode}`}>
          {isEditing ? (
            <textarea value={currentText} ref={textareaRef} rows={1}
              onChange={handleTextChange}
              placeholder="Write your idea!"/>
          ) : 
            (<span ref={textRef} className="text-content">{text}</span>)
          }
          
        </div>
      </div>
      {!isEditing && (
        <div className="right-col">
          <button className={`edit-btn ${mode === "top" ? "top" : ""}`} onClick={() => setIsEditing(true)}><img src={(mode === "top") ? editPrimeIcon : editIcon} alt="edit button"/></button>
          {indicator > 0 && <div ref={indicatorRef} className={`indicator ${newBlock > 0 ? "new-block" : ""} ${mode === "bottom" ? "bottom" : ""}`}>{newBlock > 0 ? `+${newBlock}` : indicator}</div>}
        </div>
      )}
    </div>
  );
});

export default Block;
