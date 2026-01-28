import React, { useState, useCallback } from "react";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [movies, setMovies] = useState([]);

  const addMovieHandler = useCallback((newMovie) => {
    console.log(newMovie); // ✅ REQUIRED OUTPUT
    setMovies((prevMovies) => [...prevMovies, newMovie]);
  }, []);

  function formsubmitHandler(e) {
    e.preventDefault();

    const newMovieObj = {
      title,
      description,
      date,
    };

    addMovieHandler(newMovieObj);

    // reset form
    setTitle("");
    setDescription("");
    setDate("");
  }

  return (
    <>
      <form onSubmit={formsubmitHandler}>
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Opening Text</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Release Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button type="submit">Add Movie</button>
      </form>

      <section>
        {movies.map((movie, index) => (
          <li key={index}>
            <h3>{movie.title}</h3>
            <p>{movie.description}</p>
            <span>{movie.date}</span>
          </li>
        ))}
      </section>

      <button onClick={() => console.log("Fetch Movies clicked")}>
        Fetch Movies
      </button>
    </>
  );
}

export default App;
