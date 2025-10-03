import { useState } from "react";

function StreamItem({ stream, onDelete, onEdit, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(stream.title);

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(editText);
      setIsEditing(false);
    }
  };

  return (
    <li className="stream-item">
      {isEditing ? (
        <>
          <input value={editText} onChange={(e) => setEditText(e.target.value)} />
          <button onClick={handleSave}>Save</button>
        </>
      ) : (
        <>
          <span className={stream.saved ? "saved" : ""}>{stream.title}</span>
          <div className="item-actions">
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={onDelete}>Delete</button>
            <button onClick={onSave}>Save</button>
          </div>
        </>
      )}
    </li>
  );
}

export default StreamItem;
