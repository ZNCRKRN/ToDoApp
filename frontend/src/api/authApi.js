const BASE_URL = "http://localhost:5214/api/auth";

async function handleResponse(response) {
  const contentType = response.headers.get("content-type");
  const data = contentType && contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const message = data?.message || `İstek başarısız oldu (${response.status})`;
    throw new Error(message);
  }

  return data;
}

export const authApi = {
  login: async (username, password) => {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    return handleResponse(res);
  },

  register: async (username, password) => {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    return handleResponse(res);
  },
};
