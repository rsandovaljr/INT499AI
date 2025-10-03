import { useState } from "react";

function StreamAdder({ onAdd }) {
  const [text, setText] = useState("");

  const handleAdd = () => {
    if (text.trim()) {
      onAdd(text.trim());
      setText("");
    }
  };

  return (
    <div className="add-form">
      <input
        type="text"
        className="add-input"
        placeholder="Add a stream..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
      />
      <button className="add-button" onClick={handleAdd}>
        Add Stream
      </button>
    </div>
  );
}

export default StreamAdder;
