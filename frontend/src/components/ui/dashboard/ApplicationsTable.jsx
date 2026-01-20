import { Trash2 } from "lucide-react";

const STATUS_OPTIONS = [
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
  "No Response",
];

function calculateDaysSince(dateApplied) {
  const appliedDate = new Date(dateApplied);
  const today = new Date();

  appliedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffMs = today - appliedDate;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ApplicationsTable({
  applications,
  onUpdateStatus,
  onDelete,
}) {
  if (!applications || applications.length === 0) {
    return (
      <div className="bg-zinc-800/60 border border-zinc-700 rounded-xl p-8 text-center text-zinc-400">
        No applications yet. Add your first application above to get started.
      </div>
    );
  }

  return (
    <div className="bg-zinc-800/60 border border-zinc-700 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-700 bg-zinc-900/40">
              <th className="text-left px-4 py-3 text-zinc-400">Company</th>
              <th className="text-left px-4 py-3 text-zinc-400">Role</th>
              <th className="text-left px-4 py-3 text-zinc-400">Date Applied</th>
              <th className="text-left px-4 py-3 text-zinc-500">Days Since</th>
              <th className="text-left px-4 py-3 text-zinc-400">Status</th>
              <th className="text-left px-4 py-3 text-zinc-400">Actions</th>
            </tr>
          </thead>

          <tbody>
            {applications.map((app) => {
              const daysSince = calculateDaysSince(app.date_applied);

              return (
                <tr
                  key={app.id}
                  className="border-b border-zinc-800 last:border-b-0 hover:bg-zinc-800/40"
                >
                  <td className="px-4 py-3 text-white">
                    {app.company}
                  </td>
                  <td className="px-4 py-3 text-white">
                    {app.role}
                  </td>
                  <td className="px-4 py-3 text-white">
                    {formatDate(app.date_applied)}
                  </td>
                  <td className="px-4 py-3 text-zinc-400 tabular-nums">
                    {daysSince} {daysSince === 1 ? "day" : "days"}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={app.status}
                      onChange={(e) =>
                        onUpdateStatus(app.id, e.target.value)
                      }
                      className="px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onDelete(app.id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-1"
                      aria-label="Delete application"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
