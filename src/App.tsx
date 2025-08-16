import React, { useState, useEffect, useCallback } from "react";
import Block from "./components/Block";
import "./styles/App.scss";
import { imgFull } from './assets/imgs';
import type { BlockData, BlockMode } from "./types";

const LOCAL_STORAGE_KEY = "blocks";

const defaultBlocks: BlockData[] = [
  { id: "1", text: "Drinking water isn't just about quenching", mode: "text", imageSrc: imgFull },
  { id: "2", text: "Drinking water isn't", mode: "left", imageSrc: imgFull },
  { id: "3", text: "Drinking water isn't", mode: "bottom", imageSrc: imgFull },
  { id: "4", text: "Drinking water isn't", mode: "top", imageSrc: imgFull },
  { id: "5", text: "Drinking water isn't", mode: "text", imageSrc: imgFull }
];

const App: React.FC = () => {
  // state for testing
  const [indicator, setIndicator] = useState<number>(1);
  const [newBlock, setNewBlock] = useState<number>(0);

  const [blocks, setBlocks] = useState<BlockData[]>(() => {
    const saved = localStorage.getItem("blocks");
    return saved ? JSON.parse(saved) : defaultBlocks;
  });
  const [focusedId, setFocusedId] = useState<string | null>("1");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(blocks));
  }, [blocks]);

  useEffect(() => {
    if (editingId !== null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!focusedId) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const idx = blocks.findIndex(b => b.id === focusedId);
        const nextIdx = (idx + 1) % blocks.length;
        setFocusedId(blocks[nextIdx].id);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const idx = blocks.findIndex(b => b.id === focusedId);
        const prevIdx = (idx - 1 + blocks.length) % blocks.length;
        setFocusedId(blocks[prevIdx].id);
      }
      if (e.key === " ") {
        e.preventDefault();
        setSelectedIds(prev => {
          const newSet = new Set(prev);
          if (newSet.has(focusedId)) newSet.delete(focusedId);
          else newSet.add(focusedId);
          return newSet;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [blocks, focusedId, editingId]);

  const updateBlock = useCallback((id: string, newText: string, newMode: BlockMode) => {
      setBlocks((prev) =>
        prev.map((block) =>
          block.id === id ? { ...block, text: newText, mode: newMode } : block
        )
      );
    }, []
  );

  const resetBlocks = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    window.location.reload();
  };

  const handleEditToggle = useCallback((id: string) => {
    setEditingId(prev => (prev === id ? null : id));
  }, []);

  const handleMouseEnter = useCallback((id: string) => {
    if (editingId === null) setFocusedId(id);
  }, [editingId]);

  const handleClick = useCallback((id: string) => {
    if (editingId !== null) return;
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  }, [editingId]);

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
            isFocused={focusedId === block.id && editingId === null}
            isSelected={selectedIds.has(block.id)}
            isEditing={editingId === block.id}
            onMouseEnter={() => handleMouseEnter(block.id)}
            onClick={() => handleClick(block.id)}
            onEditClick={() => handleEditToggle(block.id)}
            onSave={(newText, newMode) => {
              updateBlock(block.id, newText, newMode);
              setEditingId(null);
            }}
            onCancel={() => setEditingId(null)}
          />
        ))}
      </div>
      <div className="controls">
        <button onClick={resetBlocks}>Reset blocks</button>
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
