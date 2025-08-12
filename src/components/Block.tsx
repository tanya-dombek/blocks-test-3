import React, { useRef, useEffect, useState } from "react";
import "./Block.scss";
import edit from '../assets/edit.svg'

interface BlockProps {
  text: string;
  indicator: number;
  imageSrc?: string;
  newBlock: number;
}

const Block: React.FC<BlockProps> = ({ text, indicator, imageSrc, newBlock }) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const [lineCount, setLineCount] = useState(1);
  const [indicatorBelow, setIndicatorBelow] = useState(false);

  useEffect(() => {
    if (!textRef.current || !indicatorRef.current) return;

    const textElement = textRef.current;
    const indicatorElement = indicatorRef.current;

    const calculate = () => {
      const style = getComputedStyle(textElement);
      const lineHeight = parseFloat(style.lineHeight);
      const lines = Math.round(textElement.offsetHeight / lineHeight);

      if (lineCount !== lines) setLineCount(lines);

      if (imageSrc && lines <= 2) {
        if (indicatorBelow) setIndicatorBelow(false);
        return;
      }

      const originalHeight = textElement.offsetHeight;
      const testSpan = document.createElement("span");
      testSpan.innerHTML = "\u00A0";
      testSpan.style.display = "inline-block";
      testSpan.style.width = indicatorElement.offsetWidth + "px";
      testSpan.style.height = "1px";

      textElement.appendChild(testSpan);
      const newHeight = textElement.offsetHeight;
      textElement.removeChild(testSpan);

      const heightIncreased = newHeight > originalHeight;
      if (indicatorBelow !== heightIncreased) setIndicatorBelow(heightIncreased);
    };
    calculate();

    const resizeObserver = new ResizeObserver(() => {
      calculate();
    });
    resizeObserver.observe(textElement);

    return () => {
      resizeObserver.disconnect();
    };

  }, [text, indicator, newBlock, imageSrc, lineCount, indicatorBelow]);

  const effectiveLines = (lineCount === 1 && indicatorBelow && !(imageSrc && lineCount <= 2)) ? 2 : lineCount;

  return (
    <div className={`block ${imageSrc ? "with-image" : "no-image"} ${imageSrc && effectiveLines <= 2 ? "center-text" : ""} ${indicatorBelow ? "indicator-below" : ""}`} >
      {imageSrc && (
        <div className="image-wrapper">
          <img src={imageSrc} alt="block" />
        </div>
      )}
      <div className={`text ${effectiveLines === 1 ? "single-line" : "multi-line"}`}>
        <span ref={textRef} className="text-content">{text}</span>
      </div>
      <div className="right-col">
        <img src={edit} alt="edit button" className="menu-btn"/>
        {indicator > 0 && <div ref={indicatorRef} className={`indicator ${newBlock > 0 ? "new-block" : ""}`}>{newBlock > 0 ? `+${newBlock}` : indicator}</div>}
      </div>
    </div>
  );
};

export default Block;
