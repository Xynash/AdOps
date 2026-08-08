import { useState, useEffect } from "react";
import { ShieldCheck, Clock, AlertTriangle, Inbox, Loader2, Megaphone } from "lucide-react";
import { getOverview } from "../lib/api";

function StatCard({ icon: Icon, iconColor, label, value, sublabel }) {
  return (
    <div className="bg-white border border-ink/10 rounded-xl p-5">
      <div className="flex items-center gap-2 text-slate text-xs mb-3 uppercase tracking-wide font-mono">
        <Icon size={14} className={iconColor} />
        {label}
      </div>
      <div className="font-display text-3xl font-semibold">{value}</div>
      {sublabel && <p className="text-slate text-xs mt-1">{sublabel}</p>}
    </div>
  );
}

export default function OverviewPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getOverview()
      .then(setData)
      .catch(() => setError("Could not reach the backend. Is it running on port 8000?"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate text-sm">
        <Loader2 size={16} className="animate-spin" />
        Loading overview...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-campaign-red/10 text-campaign-red text-sm rounded-lg px-4 py-3">
        {error}
      </div>
    );
  }

  const hasQaData = data.qa_pass_rate !== null && data.qa_pass_rate !== undefined;
  const hasSlaData = data.avg_sla_response_hours !== null && data.avg_sla_response_hours !== undefined;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold">Desk overview</h1>
        <p className="text-slate text-sm mt-1">
          QA health, SLA response, and escalation status across the whole desk.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <StatCard
          icon={Megaphone}
          iconColor="text-campaign-blue"
          label="Campaigns"
          value={data.total_campaigns}
          sublabel={data.validated_campaigns + " validated so far"}
        />
        <StatCard
          icon={ShieldCheck}
          iconColor="text-campaign-mint"
          label="QA pass rate"
          value={hasQaData ? data.qa_pass_rate + "%" : "—"}
          sublabel={hasQaData ? undefined : "No campaigns validated yet"}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <StatCard
          icon={Clock}
          iconColor="text-campaign-yellow"
          label="Avg SLA response"
          value={hasSlaData ? data.avg_sla_response_hours + "h" : "—"}
          sublabel={hasSlaData ? undefined : "No resolved tickets yet"}
        />
        <StatCard
          icon={Inbox}
          iconColor="text-campaign-pink"
          label="Open tickets"
          value={data.open_tickets}
          sublabel={data.high_priority_open + " high priority"}
        />
        <StatCard
          icon={AlertTriangle}
          iconColor="text-campaign-red"
          label="Open escalations"
          value={data.open_escalations}
        />
      </div>
    </div>
  );
}
