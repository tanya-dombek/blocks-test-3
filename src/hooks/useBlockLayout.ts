import { useState, useEffect, useCallback } from "react";
import type { BlockMode } from "../types";

export function useBlockLayout(
  isEditing: boolean,
  textRef: React.RefObject<HTMLSpanElement | null>,
  textareaRef: React.RefObject<HTMLTextAreaElement | null>,
  indicatorRef: React.RefObject<HTMLDivElement | null>,
  currentMode: BlockMode,
  indicator: number,
  newBlock: number
) {
  const [lineCount, setLineCount] = useState(1);
  const [indicatorBelow, setIndicatorBelow] = useState(false);

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

    if (currentMode === "left" && lines <= 2) {
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
  }, [isEditing, lineCount, indicatorBelow, currentMode, indicator, newBlock]);

  useEffect(() => {
    calculateLayout();
    const observer = new ResizeObserver(calculateLayout);
    const element = isEditing ? textareaRef.current : textRef.current;
    if (element) observer.observe(element);
    return () => observer.disconnect();
  }, [calculateLayout, isEditing]);

  return { lineCount, indicatorBelow };
}
