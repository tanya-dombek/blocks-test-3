import React, { useState } from "react";
import Block from "./components/Block";
import "./App.scss";
import img from './assets/img.png';

const App: React.FC = () => {
  const [text, setText] = useState<string>("Drinking water isn't just about quenching");
  const [indicator, setIndicator] = useState<number>(1);
  const [newBlock, setNewBlock] = useState<number>(0);

  return (
    <div className="app">
      <div className="blocks">
        <Block text={text} indicator={indicator} newBlock={newBlock} />
        <Block
          text={text}
          indicator={indicator}
          imageSrc={img}
          newBlock={newBlock}
        />
      </div>
      <div className="controls">
        <label>
          Текст блока:
          <textarea
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </label>
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
