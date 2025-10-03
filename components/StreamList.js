import { useState, useEffect } from "react";

function StreamList() {
  const [streams, setStreams] = useState([]);
  const [newStream, setNewStream] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");

  // Persist to localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("streams")) || [];
    setStreams(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("streams", JSON.stringify(streams));
  }, [streams]);

  const addStream = () => {
    if (newStream.trim()) {
      setStreams([...streams, { title: newStream.trim(), saved: false }]);
      setNewStream("");
    }
  };

  const deleteStream = (index) => {
    setStreams(streams.filter((_, i) => i !== index));
  };

  const saveStream = (index) => {
    const updated = [...streams];
    updated[index].saved = true;
    setStreams(updated);
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditingText(streams[index].title);
  };

  const saveEdit = (index) => {
    const updated = [...streams];
    updated[index].title = editingText;
    setStreams(updated);
    setEditingIndex(null);
    setEditingText("");
  };

  return (
    <div className="stream-list">
      <h2>My Stream List</h2>
      <div className="add-form">
        <input
          type="text"
          className="add-input"
          placeholder="Add title..."
          value={newStream}
          onChange={(e) => setNewStream(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addStream()}
        />
        <button className="add-button" onClick={addStream}>
          Add Stream
        </button>
      </div>

      <ul className="stream-items">
        {streams.length === 0 ? (
          <li className="stream-item">No streams added yet.</li>
        ) : (
          streams.map((stream, index) => (
            <li key={index} className="stream-item">
              {editingIndex === index ? (
                <>
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                  />
                  <button onClick={() => saveEdit(index)}>Save</button>
                </>
              ) : (
                <>
                  <span className={stream.saved ? "saved" : ""}>
                    {stream.title}
                  </span>
                  <div className="item-actions">
                    <button onClick={() => startEditing(index)}>Edit</button>
                    <button onClick={() => deleteStream(index)}>Delete</button>
                    <button onClick={() => saveStream(index)}>Save</button>
                  </div>
                </>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default StreamList;
