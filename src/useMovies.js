import { useEffect, useState } from "react";
const KEY = "f6d02359";

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(
    function () {
      callback?.();
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setLoading(true);
          setError("");

          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok)
            throw new Error("Something went wrong with fethcing movies!");
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found!");

          setMovies(data.Search);
        } catch (err) {
          if (err.name !== "AbortError") setError(err.message);
        } finally {
          setLoading(false);
          setError("");
        }
      }
      if (query.length < 3) {
        setError("");
        setMovies([]);
        return;
      }
      //   handleMovieClose();
      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return { movies, isLoading, error };
}
