const BASE_URL = "http://localhost:5214/api/tasks";

function authHeaders() {
  let token = null;
  try {
    token = localStorage.getItem("todo-token");
  } catch {
    // localStorage kullanılamıyorsa token olmadan devam et
  }
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(response) {
  if (response.status === 401) {
    window.dispatchEvent(new Event("todo-unauthorized"));
    throw new Error("Oturumunuz sona ermiş, lütfen tekrar giriş yapın.");
  }

  if (response.status === 204) {
    return null;
  }

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

function buildQuery(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.append(key, value);
    }
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export const taskApi = {
  getAll: async (filters = {}) => {
    const res = await fetch(`${BASE_URL}${buildQuery(filters)}`, {
      headers: authHeaders(),
    });
    return handleResponse(res);
  },

  getById: async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`, { headers: authHeaders() });
    return handleResponse(res);
  },

  getStats: async () => {
    const res = await fetch(`${BASE_URL}/stats`, { headers: authHeaders() });
    return handleResponse(res);
  },

  getCategories: async () => {
    const res = await fetch(`${BASE_URL}/categories`, { headers: authHeaders() });
    return handleResponse(res);
  },

  create: async (task) => {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(task),
    });
    return handleResponse(res);
  },

  update: async (id, task) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(task),
    });
    return handleResponse(res);
  },

  toggleCompleted: async (id) => {
    const res = await fetch(`${BASE_URL}/${id}/toggle`, {
      method: "PATCH",
      headers: authHeaders(),
    });
    return handleResponse(res);
  },

  delete: async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    return handleResponse(res);
  },
};
