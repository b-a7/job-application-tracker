import { useEffect, useState } from "react";
import Login from "./Login";

// import DashboardLayout from "./components/layout/DashboardLayout";
import SummaryMetrics from "./components/ui/dashboard/SummaryMetrics";
import AddApplicationForm from "./components/ui/dashboard/AddApplicationForm";
import ApplicationsTable from "./components/ui/dashboard/ApplicationsTable";

import {
  getApplications,
  getSummary,
  createApplication,
  updateApplicationStatus,
  deleteApplication,
  setAuthToken,
  loadAuthToken,
  logout,
} from "./api";

function App() {
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ---- Restore login on page load ----
  useEffect(() => {
    const token = loadAuthToken();
    if (token) {
      setAuthToken(token);
      setUser({ token });
    }
  }, []);

  // ---- Load data after login ----
  useEffect(() => {
    if (!user) return;

    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        const apps = await getApplications();
        const stats = await getSummary();
        setApplications(apps);
        setSummary(stats);
      } catch (err) {
        console.error(err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  // ---- Handlers passed to UI components ----
  async function handleAddApplication(formData) {
    await createApplication(formData);
    setApplications(await getApplications());
    setSummary(await getSummary());
  }

  async function handleUpdateStatus(id, status) {
    await updateApplicationStatus(id, status);
    setApplications(await getApplications());
    setSummary(await getSummary());
  }

  async function handleDelete(id) {
    await deleteApplication(id);
    setApplications(await getApplications());
    setSummary(await getSummary());
  }

  function handleLogin(userData) {
    setAuthToken(userData.token);
    setUser(userData);
  }

  function handleLogout() {
    logout();
    setUser(null);
    setApplications([]);
    setSummary(null);
  }

  // ---- Login gate ----
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // ---- Main dashboard ----
return (
  <div className="min-h-screen bg-zinc-900 text-zinc-100">
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          Job Application Tracker
        </h1>
        <button
          onClick={handleLogout}
          className="text-sm text-zinc-400 hover:text-white"
        >
          Logout
        </button>
      </div>

      {loading && (
        <p className="text-zinc-400 text-sm">Loading…</p>
      )}

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      <SummaryMetrics applications={applications} />

      <AddApplicationForm onAdd={handleAddApplication} />

      <ApplicationsTable
        applications={applications}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDelete}
      />
    </div>
  </div>
);
}

export default App;
