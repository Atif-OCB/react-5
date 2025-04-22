import { useEffect, useState } from 'react';
import { createBook, readAllBooks } from './api/books';
import { login } from './api/users';

function App() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    readAllBooks().then((books) => setBooks(books));
  }, []);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState();

  const submitBook = async (event) => {
    event.preventDefault();
    const payload = {
      title: title,
      author: author,
      year: Number(year),
    };

    await createBook(payload);

    setTitle("");
    setAuthor("");
    setYear("");

    const newData = await readAllBooks();
    setBooks(newData);
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
      <button onClick={login}>Login</button>
      <h1>List of books</h1>
      {
        books.map((book) => (
          <div key={book.id}>{book.title}</div>
        ))
      }
      <form onSubmit={submitBook}>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="title"
          required
          value={title}
          onChange={(event) => {
            const value = event.target.value;
            setTitle(value);
          }}
        />
        <input
          id="author"
          name="author"
          type="text"
          placeholder="author"
          required
          value={author}
          onChange={(event) => {
            const value = event.target.value;
            setAuthor(value);
          }}
        />
        <input
          id="year"
          name="year"
          type="number"
          placeholder="year"
          required
          value={year}
          onChange={(event) => {
            const value = event.target.value;
            setYear(value);
          }}
        />
        <button type="submit">Create book</button>
      </form>
    </div>
  )
}

export default App
