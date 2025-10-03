import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navigation from "./components/Navigation";
import StreamList from "./components/StreamList";
import MoviesPage from "./pages/MoviesPage";
import CartPage from "./pages/CartPage";
import AboutPage from "./pages/AboutPage"; 

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
  );}

export default App;
