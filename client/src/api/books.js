const PATH = '/books';
const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = BASE_URL + PATH;

const getToken = () => {
  const cookieString = document.cookie;
  const cookies = cookieString.split("; ");
  const cookieParsed = cookies.map(cookie => {
    const currentCookie = cookie.split("=");
    return currentCookie;
  })

  return cookieParsed.find(cookie => cookie[0] === "token")[1];
}

/**
 * 
 * @returns {{
 *  id: number;
 *  title: string;
 *  author: string;
 *  year: number;
 * }}
 */
export const readAllBooks = async () => {
  const token = getToken();
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
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
  const token = getToken();
  const response = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  const data = await response.json();

  return data;
}