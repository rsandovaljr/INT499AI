import React from "react";

function MoviesPage({ results }) {
    const isPlaceholder = !results || results.length === 0;

    return (
        <div className="movies-page">
            <h2 className="page-title">{isPlaceholder ? "Movies Home" : "Search Results"}</h2>
            
            {isPlaceholder ? (
                <p>No movies found. Try searching!</p>
            ) : (
                <ul className="movie-results">
                    {results.map((movie) => (
                        <li key={movie.id} className="movie-card">
                            <h3 className="movie-title">{movie.title}</h3>
                            <p><strong>Release Date:</strong> {movie.release_date || "N/A"}</p>
                            <p><strong>Rating:</strong> {movie.vote_average ? `${movie.vote_average}/10` : "N/A"}</p>
                            <p className="movie-description">
                                {movie.overview || "No description available."}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default MoviesPage;