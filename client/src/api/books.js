const PATH = '/books';
const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = BASE_URL + PATH;

export const readAllBooks = async () => {
  // console.log(API_URL);
  const response = await fetch(API_URL, {
    method: "GET",
  });

  const data = await response.json();

  return data;
}

// (string) title
// (string) author
// (number) year
/**
 * 
 * @param {{
 *  title: string;
 *  author: string;
 *  year: number;
 * }} payload 
 * @returns 
 */
export const createBook = async (payload) => {
  const response = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json"
    }
  });

  const data = await response.json();

  return data;
}