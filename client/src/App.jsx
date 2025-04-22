import { useEffect } from 'react';
import { createBook, readAllBooks } from './api/books';

function App() {
  useEffect(() => {
    readAllBooks();
  }, []);

  const submitBook = async () => {
    await createBook({
      title: "Harry Potter",
      author: "JK Rowling",
      year: 1964
    });
  }

  return (
    <>
      API: {import.meta.env.VITE_API_URL}
      <button onClick={submitBook}>Create book</button>
    </>
  )
}

export default App
