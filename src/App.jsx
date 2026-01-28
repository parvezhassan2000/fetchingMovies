// import React, { useState, useCallback } from "react";
// import "./App.css";

// function App() {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [date, setDate] = useState("");
//   const [movies, setMovies] = useState([]);

//   const addMovieHandler = useCallback((newMovie) => {
//     console.log(newMovie); // ✅ REQUIRED OUTPUT
//     setMovies((prevMovies) => [...prevMovies, newMovie]);
//   }, []);

//   function formsubmitHandler(e) {
//     e.preventDefault();

//     const newMovieObj = {
//       title,
//       description,
//       date,
//     };

//     addMovieHandler(newMovieObj);

//     // reset form
//     setTitle("");
//     setDescription("");
//     setDate("");
//   }

//   return (
//     <>
//       <form onSubmit={formsubmitHandler}>
//         <label>Title</label>
//         <input
//           type="text"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />

//         <label>Opening Text</label>
//         <input
//           type="text"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//         />

//         <label>Release Date</label>
//         <input
//           type="date"
//           value={date}
//           onChange={(e) => setDate(e.target.value)}
//         />

//         <button type="submit">Add Movie</button>
//       </form>

//       <section>
//         {movies.map((movie, index) => (
//           <li key={index}>
//             <h3>{movie.title}</h3>
//             <p>{movie.description}</p>
//             <span>{movie.date}</span>
//           </li>
//         ))}
//       </section>

//       <button onClick={() => console.log("Fetch Movies clicked")}>
//         Fetch Movies
//       </button>
//     </>
//   );
// }

// export default App;

import React, { useState, useEffect, useCallback, memo } from "react";
import "./App.css";

/* =======================
   Movie List Component
   ======================= */
const MovieList = memo(({ movies, onDeleteMovie }) => {
  return (
    <>
      {movies.map((movie) => (
        <div key={movie.id}>
          <h3>{movie.title}</h3>
          <p>{movie.description}</p>
          <p>{movie.date}</p>

          <button onClick={() => onDeleteMovie(movie.id)}>
            Delete Movie
          </button>

          <hr />
        </div>
      ))}
    </>
  );
});

/* =======================
   Main App Component
   ======================= */
function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  /* =======================
     Fetch Movies (GET)
     ======================= */
  const fetchMoviesHandler = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://react-app-4ff50-default-rtdb.firebaseio.com/movies.json"
      );
      const data = await response.json();

      const loadedMovies = [];
      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          description: data[key].description,
          date: data[key].date,
        });
      }

      setMovies(loadedMovies);
    } catch (error) {
      console.log("Something went wrong");
    }
    setLoading(false);
  }, []);

  /* =======================
     Auto Fetch on Load
     ======================= */
  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  /* =======================
     Add Movie (POST)
     ======================= */
  const formSubmitHandler = async (e) => {
    e.preventDefault();

    const newMovie = {
      title,
      description,
      date,
    };

    console.log(newMovie); // ✅ REQUIRED OUTPUT

    await fetch(
      "https://react-app-4ff50-default-rtdb.firebaseio.com/movies.json",
      {
        method: "POST",
        body: JSON.stringify(newMovie),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    fetchMoviesHandler();

    setTitle("");
    setDescription("");
    setDate("");
  };

  /* =======================
     Delete Movie (DELETE)
     ======================= */
  const deleteMovieHandler = useCallback(async (movieId) => {
    await fetch(
      `https://react-app-4ff50-default-rtdb.firebaseio.com/movies/${movieId}.json`,
      {
        method: "DELETE",
      }
    );

    setMovies((prevMovies) =>
      prevMovies.filter((movie) => movie.id !== movieId)
    );
  }, []);

  return (
    <>
      {/* ===== Add Movie Form ===== */}
      <form onSubmit={formSubmitHandler}>
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

      {/* ===== Movie List ===== */}
      <section>
        {loading && <p>Loading...</p>}
        {!loading && (
          <MovieList movies={movies} onDeleteMovie={deleteMovieHandler} />
        )}
      </section>
    </>
  );
}

export default App;

