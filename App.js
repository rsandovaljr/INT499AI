import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';

//placeholders
function MoviesPage({ results }) {
  return (
    <div className="placeholder-page">
      <h2 className="page-title">Movie Search Results</h2>
      {results.length === 0 ? (
        <p className="placeholder-text">No results yet. Try searching!</p>
      ) : (
        <ul className="movie-results">
          {results.map((movie) => (
            <li key={movie.id} className="movie-card">
              <h3>{movie.title}</h3>
              <p><strong>Release Date:</strong> {movie.release_date || "N/A"}</p>
              <p><strong>Rating:</strong> {movie.vote_average || "N/A"}</p>
              <p>{movie.overview || "No description available."}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CartPage() {
  return (
    <div className="placeholder-page">
      <h2 className="placeholder-text">Cart Page - Coming Soon!</h2>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="placeholder-page">
      <h2 className="placeholder-text">About Page - Coming Soon!</h2>
    </div>
  );
}

//stream list
function StreamList() {
    const [ lists, setLists] = useState([]);
    const [newListTitle, setNewListTitle] = useState("");
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const fileInputRef = useRef(null);

//load local storage
  useEffect(() => {
    const saved = localStorage.getItem("streamLists");
    if (saved) {
      try {
        setLists(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading from localStorage:", error);
      
      }
    }
  }, []);
  useEffect(() => {
        return () => {
            if (hasUnsavedChanges) {
                localStorage.setItem("streamLists", JSON.stringify(lists));
            }
        };
    }, [hasUnsavedChanges, lists]);

//save local storage
    const handleManualSave = () => {
        try {
            localStorage.setItem("streamLists", JSON.stringify(lists));
            setHasUnsavedChanges(false);
            alert("Lists saved to browser storage successfully!");
        } catch (error) {
            console.error("Error saving to localStorage:", error);
            alert("Error saving data. Please try again.");
        }
    };

//export lists to JSON file
    const handleExport = () => {
        try {
            const dataStr = JSON.stringify(lists, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `stream-lists-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            alert("Lists exported successfully!");
        } catch (error) {
            console.error("Error exporting lists:", error);
            alert("Error exporting data. Please try again.");
        }
    };

//import lists from JSON file
    const handleImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                
                if (!Array.isArray(importedData)) {
                    throw new Error("Invalid file format");
                }
                
                const isValid = importedData.every(list => 
                    list && typeof list.title === 'string' && Array.isArray(list.streams)
                );
                
                if (!isValid) {
                    throw new Error("Invalid data structure in file");
                }
                
                if (window.confirm("Import will replace your current lists. Continue?")) {
                    setLists(importedData);
                    setHasUnsavedChanges(true);
                    alert("Lists imported successfully!");
                }
            } catch (error) {
                console.error("Error importing lists:", error);
                alert("Error importing file. Please make sure it's a valid JSON file.");
            }
        };
        
        reader.readAsText(file);
        event.target.value = '';
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

//reset to empty lists
    const handleReset = () => {
        if (window.confirm("Are you sure you want to reset all lists? This cannot be undone.")) {
            setLists([]);
            setHasUnsavedChanges(true);
        }
    };
//add new list
  const addList = () => {
    if (newListTitle.trim()) {
      setLists([
        ...lists,
        { title: newListTitle.trim(), streams: [], editing: false },
      ]);
          setNewListTitle("");
          setHasUnsavedChanges(true);
    }
  };

//delete stream
  const deleteList = (index) => {
    setLists(lists.filter((_, i) => i !== index));
    setHasUnsavedChanges(true);
  };

//rename list
  const renameList = (index, newTitle) => {
    const updated = [...lists];
    updated[index].title = newTitle;
    setLists(updated);
    setHasUnsavedChanges(true);
  };

//add stream to a list
  const addStream = (listIndex, newStream) => {
    if (!newStream.trim()) return;
    const updated = [...lists];
    updated[listIndex].streams.push(newStream.trim());
    setLists(updated);
    setHasUnsavedChanges(true);
  };

//edit stream
  const editStream = (listIndex, streamIndex, newText) => {
    const updated = [...lists];
    updated[listIndex].streams[streamIndex] = newText.trim();
    setLists(updated);
    setHasUnsavedChanges(true);
  };

//delete stream from list
  const deleteStream = (listIndex, streamIndex) => {
    const updated = [...lists];
    updated[listIndex].streams = updated[listIndex].streams.filter(
      (_, i) => i !== streamIndex
    );
    setLists(updated);
    setHasUnsavedChanges(true);
  };  

  return (
    <div className="stream-list">
      <div className="save-controls">
      <h2>My Stream list</h2>
      <button
          className={`save-button ${hasUnsavedChanges ? 'unsaved' : 'saved'}`}
          onClick={handleManualSave}
          disabled={!hasUnsavedChanges}
        >
          {hasUnsavedChanges ? 'Save Changes' : 'Saved'}
        </button>
                {hasUnsavedChanges && <span className="unsaved-indicator">Unsaved changes</span>}
            </div>
      <div className="utility-controls">
        <button className="export-button" onClick={handleExport}>
        Export Lists
        </button>

        <button className="import-button" onClick={triggerFileInput}>
        Import Lists
        </button>
        <input
          type="file"
          accept="application/json"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleImport}
        />

        <button className="reset-button" onClick={handleReset}>
        Reset All Lists
        </button>
      </div>
            <div className="add-form">
                <input
                    type="text"
                    className="add-input"
                    placeholder="Add title..."
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                />
                <button className="add-button" onClick={addList}>
                    Add List
                </button>
            </div>

            {lists.length === 0 && (
                <p>No lists yet. Add one above to get started!</p>
            )}

            {lists.map((list, listIndex) => (
                <div key={listIndex} className="list-container">
                    <div className="list-header">
                        <input
                            type="text"
                            value={list.title}
                            onChange={(e) => renameList(listIndex, e.target.value)}
                        />
                        <button onClick={() => deleteList(listIndex)}>Delete List</button>
                    </div>

                    <StreamAdder
                        onAdd={(stream) => addStream(listIndex, stream)}
                    />

                    <ul className="stream-items">
                        {list.streams.length === 0 && (
                            <li>No streams yet. Add one above!</li>
                        )}
                        {list.streams.map((stream, streamIndex) => (
                            <StreamItem
                                key={streamIndex}
                                text={stream}
                                onSave={(newText) =>
                                    editStream(listIndex, streamIndex, newText)
                                }
                                onDelete={() => deleteStream(listIndex, streamIndex)}
                            />
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

//adding new stream
function StreamAdder({ onAdd }) {
  const [text, setText] = useState("");

  const handleAdd = () => {
    if (text.trim()) {
      onAdd(text);
      setText("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <div className="add-form">
      <input
        type="text"
        className="add-input"
        placeholder="Add a stream..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <button className="add-button" onClick={handleAdd}>
        Add Stream
      </button>
    </div>
  );
}
//stream edit-delete
function StreamItem({ text, onSave, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);

  const handleSave = () => {
    if (editText.trim()) {
      onSave(editText);
      setIsEditing(false);
    }
  };

  return (
    <li className="stream-item">
      {isEditing ? (
        <>
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <div className="button-group">
          <button className="edit-button" onClick={handleSave}>
            Save
            </button>
            </div>
        </>
      ) : (
        <>
          <span>{text}</span>
          <div className="button-group">
          <button className="edit-button" onClick={() => setIsEditing(true)}>
            Edit
            </button>
          <button onClick={onDelete}>
            Delete
          </button>
          </div>
        </>
      )}
    </li>
  );
}

// navigation with search bar
function Navigation({ onSearch }) {
  const location = useLocation();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=cfb7b668550b872b201af0fa47854ca9&query=${encodeURIComponent(
          query
        )}`
      );
      const data = await response.json();
      onSearch(data.results || []);
      navigate("/movies"); // go to Movies Page
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li>
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Stream List
          </Link>
        </li>
        <li>
          <Link 
            to="/movies" 
            className={`nav-link ${location.pathname === '/movies' ? 'active' : ''}`}
          >
            Movies
          </Link>
        </li>
        <li>
          <Link 
            to="/cart" 
            className={`nav-link ${location.pathname === '/cart' ? 'active' : ''}`}
          >
            Cart
          </Link>
        </li>
        <li>
          <Link 
            to="/about" 
            className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
          >
            About
          </Link>
        </li>
      </ul>

      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          className="search-input"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="search-button">Search</button>
      </form>
    </nav>
  );
}

// main App
function App() {
  const [searchResults, setSearchResults] = useState([]);

  return (
    <div className="app">
      <Navigation onSearch={setSearchResults} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<StreamList />} />
          <Route path="/movies" element={<MoviesPage results={searchResults} />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
    </div>
  );
}


export default App;