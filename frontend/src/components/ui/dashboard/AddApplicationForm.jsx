import { useState } from "react";
import { Plus } from "lucide-react";

const STATUS_OPTIONS = [
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
  "No Response",
];

export default function AddApplicationForm({ onAdd }) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [dateApplied, setDateApplied] = useState("");
  const [status, setStatus] = useState("Applied");

  function handleSubmit(e) {
    e.preventDefault();

    if (!company.trim() || !role.trim() || !dateApplied) return;

    onAdd({
      company: company.trim(),
      role: role.trim(),
      date_applied: dateApplied, // matches backend field name
      status,
    });

    // Reset form
    setCompany("");
    setRole("");
    setDateApplied("");
    setStatus("Applied");
  }

  return (
    <div className="bg-zinc-800/60 border border-zinc-700 rounded-xl p-6">
      <h2 className="text-lg font-medium mb-4 text-white">
        Add Application
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
      >
        {/* Company */}
        <div>
          <label className="block text-sm mb-1 text-zinc-400">
            Company
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company name"
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
            required
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm mb-1 text-zinc-400">
            Role
          </label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Role title"
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
            required
          />
        </div>

        {/* Date Applied */}
        <div>
          <label className="block text-sm mb-1 text-zinc-400">
            Date Applied
          </label>
          <input
            type="date"
            value={dateApplied}
            onChange={(e) => setDateApplied(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white/20"
            required
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm mb-1 text-zinc-400">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-white text-black rounded-md hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
