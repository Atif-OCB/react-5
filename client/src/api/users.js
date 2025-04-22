const BASE_URL = import.meta.env.VITE_API_URL;

export const login = async () => {
  const response = await fetch(BASE_URL + "/login", {
    method: "POST",
    body: JSON.stringify({
      username: "demo1",
      password: "demo123"
    }),
    headers: {
      "Content-Type": "application/json"
    }
  });

  const data = await response.json();

  document.cookie = "token=" + data.token;
};