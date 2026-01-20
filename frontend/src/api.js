// API helper functions for comms with FastAPI backend
// Handles fetching and creating applications and retrieving summary stats

// Base URL of FastAPI backend
const API_BASE_URL = "http://localhost:8000";
//const API_BASE_URL = "http://192.168.1.228:5173/";

let authToken = null;

// Helper to attach Authorization header when logged in
function authHeaders(extraHeaders = {}) {
  return {
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...extraHeaders,
  };
}

// -------------------- APPLICATIONS --------------------

// Fetch all job applications from backend
export async function getApplications() {
    const response = await fetch(`${API_BASE_URL}/applications`, {
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch applications');
    }

    // Convert HTTP response body to JS object
    return response.json();
}
// Create NEW application (AUTH required)
// Send new application data to backend to be saved
export async function createApplication(data) {
    const response = await fetch(`${API_BASE_URL}/applications`, {
        method: 'POST',
        headers: authHeaders({
            "Content-Type": "application/json"
        }),
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to create application');
    }
    // Parse response from backend
    return response.json();
}

/**
 * Update application Status (AUTH REQUIRED)
 */
export async function updateApplicationStatus(id, status) {
    const res = await fetch(`${API_BASE_URL}/applications/${id}`, {
        method: 'PATCH',
        headers: authHeaders({
            "Content-Type": "application/json"
        }),
        body: JSON.stringify({ status }),
    });

    if (!res.ok) {
        throw new Error('Failed to update status');
    }

    return res.json();
}

// -------------------- ANALYTICS ---------------------

// Fetch aggregated application statistics (counts by status)
export async function getSummary() {
    const response = await fetch(`${API_BASE_URL}/analytics/summary`, {
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch summary');
    }

    return response.json();
}

// -------------------- AUTHENTICATION --------------------

/**
 * Login (NO auth required)
 * Returns { id, username, token }
 */
export async function login(username, password) {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error("Invalid credentials");
  }

  return res.json(); // { id, username, token }
}

/**
 * Store auth token after successful login
 */
export function setAuthToken(token) {
    authToken = token;
    localStorage.setItem("token", token);
}

export function loadAuthToken() {
    const token = localStorage.getItem("token");
    if (token) {
        authToken = token;
        return token;
    }
    return null;
}

export function logout() {
  localStorage.removeItem("token");
  authToken = null;
}

export async function signup(username, password) {
  const res = await fetch(`${API_BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error("Signup failed");
  }

  return res.json();
}

// Deleting application
export async function deleteApplication(id) {
    const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error("Failed to delete application");
    }
}