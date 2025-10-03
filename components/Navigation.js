import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const TMDB_API_KEY = "cfb7b668550b872b201af0fa47854ca9";

function Navigation({ onSearch }) {
    const location = useLocation(); 
    const navigate = useNavigate();
    
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        try {
            const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            onSearch(data.results || []);
            navigate("/movies");
            setQuery("");
            
        } catch (error) {
            console.error("Error fetching movies:", error);
            alert("Failed to fetch movie data. Please try again.");
            onSearch([]);
        }
    };

    return (
        <nav className="navbar">
            <button
                className="menu-toggle"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                ☰
            </button>
            <ul className={`nav-list ${isOpen ? "open" : ""}`}>
                <li>
                    <Link
                        to="/"
                        className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
                    >
                        Stream List
                    </Link>
                </li>
                <li>
                    <Link
                        to="/movies"
                        className={`nav-link ${location.pathname === "/movies" ? "active" : ""}`}
                    >
                        Movies
                    </Link>
                </li>
                <li>
                    <Link
                        to="/cart"
                        className={`nav-link ${location.pathname === "/cart" ? "active" : ""}`}
                    >
                        Cart
                    </Link>
                </li>
                <li>
                    <Link
                        to="/about"
                        className={`nav-link ${location.pathname === "/about" ? "active" : ""}`}
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

export default Navigation;