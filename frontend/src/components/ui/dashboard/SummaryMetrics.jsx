export default function SummaryMetrics({ applications }) {
  const total = applications.length;

  const applied = applications.filter(
    (app) => app.status === "Applied"
  ).length;

  const interview = applications.filter(
    (app) => app.status === "Interview"
  ).length;

  const offer = applications.filter(
    (app) => app.status === "Offer"
  ).length;

  const rejected = applications.filter(
    (app) => app.status === "Rejected"
  ).length;

  const noResponse = applications.filter(
    (app) => app.status === "No Response"
  ).length;

  return (
    <div className="bg-zinc-800/60 border border-zinc-700 rounded-xl p-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
        <Metric label="Total" value={total} />
        <Metric label="Applied" value={applied} />
        <Metric label="Interview" value={interview} />
        <Metric label="Offer" value={offer} />
        <Metric label="Rejected" value={rejected} />
        <Metric label="No Response" value={noResponse} />
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div>
      <div className="text-sm text-zinc-400">{label}</div>
      <div className="text-2xl font-medium tabular-nums text-white">
        {value}
      </div>
    </div>
  );
}
