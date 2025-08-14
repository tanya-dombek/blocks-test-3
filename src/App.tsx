import React, { useState, useEffect, useCallback } from "react";
import Block from "./components/Block";
import "./App.scss";
import img from './assets/img.png';
import imgFull from './assets/img-full.jpg';
import type { BlockData, BlockMode } from "./types";

const LOCAL_STORAGE_KEY = "blocks";

const App: React.FC = () => {
  // state for testing
  const [indicator, setIndicator] = useState<number>(1);
  const [newBlock, setNewBlock] = useState<number>(0);

  const [blocks, setBlocks] = useState<BlockData[]>(() => {
    const saved = localStorage.getItem("blocks");
    return saved ? JSON.parse(saved) : [
      { id: "1", text: "Drinking water isn't just about quenching", mode: "text", imageSrc: imgFull },
      { id: "2", text: "Drinking water isn't", mode: "left", imageSrc: imgFull }
    ];
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(blocks));
  }, [blocks]);

  const updateBlock = useCallback((id: string, newText: string, newMode: BlockMode) => {
      setBlocks((prev) =>
        prev.map((block) =>
          block.id === id ? { ...block, text: newText, mode: newMode } : block
        )
      );
    }, []
  );

  return (
    <div className="app">
      <div className="blocks">
        {blocks.map((block) => (
          <Block
            key={block.id}
            {...block}
            indicator={indicator}
            newBlock={newBlock}
            saveEdit={updateBlock}
          />
        ))}
      </div>
      <div className="controls">
        <label>
          Значение индикатора:
          <input
            type="number"
            value={indicator}
            onChange={(e) => setIndicator(Number(e.target.value))}
          />
        </label>
        <label>
          Новые блоки:
          <input
            type="number"
            value={newBlock}
            onChange={(e) => setNewBlock(Number(e.target.value))}
          />
        </label>
      </div>
    </div>
  );
};

export default App;
