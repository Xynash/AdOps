import { useState, useEffect } from "react";
import { Plus, Loader2, ArrowRight, CheckCircle2, GitBranch, Clock } from "lucide-react";
import { createEscalation, listEscalations, advanceEscalation } from "../lib/api";

const STAGE_ORDER = ["reported", "in_progress", "fixed"];

function formatTimestamp(raw) {
  if (!raw) return "";
  const d = new Date(raw.replace(" ", "T") + "Z");
  if (isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function TrailStep({ label, isActive, isPast, isLast }) {
  return (
    <div className="flex items-center">
      <div
        className={
          "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors " +
          (isActive
            ? "bg-ink text-paper border-ink"
            : isPast
            ? "bg-campaign-mint/10 text-campaign-mint border-campaign-mint/30"
            : "bg-white border-ink/10 text-slate")
        }
      >
        {label}
      </div>
      {!isLast && <ArrowRight size={13} className="text-ink/20 mx-2 shrink-0" />}
    </div>
  );
}

export default function EscalationsPanel({ tickets }) {
  const [escalations, setEscalations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [advancingId, setAdvancingId] = useState(null);

  const [form, setForm] = useState({
    ticket_id: "",
    reason: "",
    owner_team: "",
  });

  async function refresh() {
    try {
      setLoading(true);
      const data = await listEscalations();
      setEscalations(data);
      setError("");
    } catch (e) {
      setError("Could not reach the backend. Is it running on port 8000?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.ticket_id) {
      setError("Pick a ticket to escalate.");
      return;
    }
    try {
      await createEscalation({
        ticket_id: Number(form.ticket_id),
        reason: form.reason,
        owner_team: form.owner_team,
      });
      setForm({ ticket_id: "", reason: "", owner_team: "" });
      setShowForm(false);
      refresh();
    } catch (e) {
      setError("Failed to create escalation.");
    }
  }

  async function handleAdvance(id, nextStage) {
    try {
      setAdvancingId(id);
      await advanceEscalation(id, { stage: nextStage });
      refresh();
    } catch (e) {
      setError("Failed to update escalation.");
    } finally {
      setAdvancingId(null);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-semibold">Escalation log</h1>
          <p className="text-slate text-sm mt-1">
            Handoffs between teams, timestamped and reasoned — a trail, not a memory.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          disabled={tickets.length === 0}
          className="flex items-center gap-2 bg-ink text-paper px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1a2129] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          title={tickets.length === 0 ? "Open a ticket first" : ""}
        >
          <Plus size={15} />
          New escalation
        </button>
      </div>

      {error && (
        <div className="bg-campaign-red/10 text-campaign-red text-sm rounded-lg px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-ink/10 rounded-xl p-6 mb-8 space-y-3">
          <select
            required
            value={form.ticket_id}
            onChange={(e) => setForm({ ...form, ticket_id: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-ink/15 text-sm focus:outline-none focus:border-ink/40 bg-white"
          >
            <option value="">Escalate which ticket?</option>
            {tickets.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} — {t.campaign_name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Reason for escalating (e.g. Needs creative team to re-cut banner)"
            required
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-ink/15 text-sm focus:outline-none focus:border-ink/40"
          />
          <input
            type="text"
            placeholder="Routing to which team? (e.g. Ad Tech, Creative, Media Buying)"
            required
            value={form.owner_team}
            onChange={(e) => setForm({ ...form, owner_team: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-ink/15 text-sm focus:outline-none focus:border-ink/40"
          />
          <button
            type="submit"
            className="bg-ink text-paper px-5 py-2.5 rounded-md text-sm font-medium hover:bg-[#1a2129] transition-colors"
          >
            Open escalation
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-slate text-sm">
          <Loader2 size={16} className="animate-spin" />
          Loading escalations...
        </div>
      ) : escalations.length === 0 ? (
        <div className="flex flex-col items-center text-center border border-dashed border-ink/15 rounded-xl py-14 px-6">
          <div className="w-10 h-10 rounded-full bg-ink/5 flex items-center justify-center mb-3">
            <GitBranch size={18} className="text-slate" />
          </div>
          <p className="text-sm font-medium mb-1">No escalations yet</p>
          <p className="text-slate text-xs">Open one above when a ticket needs another team's help.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {escalations.map((esc) => {
            const isAdvancing = advancingId === esc.id;
            const isFixed = esc.current_stage === "fixed";
            const stageLabels = {
              reported: "Reported",
              in_progress: esc.owner_team,
              fixed: "Fixed",
            };
            const currentIndex = STAGE_ORDER.indexOf(esc.current_stage);

            return (
              <div key={esc.id} className="bg-white border border-ink/10 rounded-xl p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="min-w-0">
                    <div className="font-display font-semibold text-sm mb-0.5">{esc.reason}</div>
                    <div className="text-slate text-xs">
                      {esc.ticket_title} · {esc.campaign_name}
                    </div>
                  </div>
                  {!isFixed && (
                    <button
                      onClick={() =>
                        handleAdvance(esc.id, esc.current_stage === "reported" ? "in_progress" : "fixed")
                      }
                      disabled={isAdvancing}
                      className="flex items-center gap-1.5 text-xs font-medium bg-ink text-paper px-3 py-1.5 rounded-md hover:bg-[#1a2129] transition-colors disabled:opacity-50 shrink-0 ml-4"
                    >
                      {isAdvancing && <Loader2 size={12} className="animate-spin" />}
                      {esc.current_stage === "reported"
                        ? `Route to ${esc.owner_team}`
                        : "Mark fixed"}
                    </button>
                  )}
                  {isFixed && (
                    <span className="flex items-center gap-1.5 text-campaign-mint text-xs font-mono shrink-0 ml-4">
                      <CheckCircle2 size={13} />
                      Fixed
                    </span>
                  )}
                </div>

                <div className="flex items-center flex-wrap mb-4">
                  {STAGE_ORDER.map((stage, i) => (
                    <TrailStep
                      key={stage}
                      label={stageLabels[stage]}
                      isActive={i === currentIndex}
                      isPast={i < currentIndex}
                      isLast={i === STAGE_ORDER.length - 1}
                    />
                  ))}
                </div>

                <div className="space-y-1.5 border-t border-ink/5 pt-3">
                  {esc.log.map((entry, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate">
                      <Clock size={11} className="shrink-0" />
                      <span className="font-mono text-[10px]">{formatTimestamp(entry.created_at)}</span>
                      <span>—</span>
                      <span>{entry.note || stageLabels[entry.stage]}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
