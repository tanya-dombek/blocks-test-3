import React, { useEffect, useMemo } from "react";
import type { BlockMode } from "../types";

type BlockContentProps = {
  isEditing: boolean;
  currentText: string;
  text: string;
  setCurrentText: (text: string) => void;
  currentMode: BlockMode;
  textRef: React.RefObject<HTMLSpanElement | null>;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  imageSrc: string | undefined;
  lineCount: number;
  indicatorBelow: boolean;
};

const BlockContent: React.FC<BlockContentProps> = ({isEditing, currentText, text, setCurrentText, currentMode, textRef, textareaRef, imageSrc, lineCount, indicatorBelow}) => {
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [isEditing, currentText, currentMode]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentText(e.target.value);
  }

  const effectiveLines = useMemo(() => {
    return (lineCount === 1 && indicatorBelow && !(currentMode !== 'text' && lineCount <= 2)) ? 2 : lineCount;
  }, [lineCount, indicatorBelow, currentMode]);

  return (
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
  );
};

export default BlockContent;
