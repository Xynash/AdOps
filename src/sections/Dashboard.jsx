import { useState, useEffect } from "react";
import {
  LogOut, Plus, Loader2, Link2, Tag, Sparkles, CheckCircle2, XCircle,
  Inbox, Clock, AlertTriangle, Ticket as TicketIcon,
} from "lucide-react";
import {
  createCampaign, listCampaigns, validateCampaign,
  createTicket, listTickets, resolveTicket,
} from "../lib/api";
import { COMPANY_NAME } from "../lib/constants";
import Button from "../components/Button";
import EscalationsPanel from "../components/EscalationsPanel";
import OverviewPanel from "../components/OverviewPanel";
import OnboardingTour from "../components/OnboardingTour";
import DemoCampaignPicker from "../components/DemoCampaignPicker";
import FirstTimeHint from "../components/FirstTimeHint";

const DAILY_PASS_LIMIT = 4;
const ADMIN_EMAILS = ["ash162005@gmail.com"];
const PASS_STORAGE_KEY = "adsquadops_demo_passes";

const CHECK_META = {
  url_reachable: { label: "Destination URL", icon: Link2 },
  tracking_tag: { label: "Tracking tag", icon: Tag },
  ai_copy_check: { label: "Ad copy alignment", icon: Sparkles },
};

const STATUS_META = {
  qa_passed: { label: "Passed QA", dot: "bg-campaign-mint", text: "text-campaign-mint", bg: "bg-campaign-mint/10" },
  qa_failed: { label: "Flagged", dot: "bg-campaign-red", text: "text-campaign-red", bg: "bg-campaign-red/10" },
  draft: { label: "Draft", dot: "bg-slate", text: "text-slate", bg: "bg-ink/5" },
};

const TABS = [
  { key: "campaigns", label: "Campaigns" },
  { key: "tickets", label: "SLA Tickets" },
  { key: "escalations", label: "Escalations" },
  { key: "overview", label: "Overview" },
];

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getPassState() {
  try {
    const raw = localStorage.getItem(PASS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed || parsed.date !== todayKey()) {
      return { date: todayKey(), used: 0 };
    }
    return parsed;
  } catch {
    return { date: todayKey(), used: 0 };
  }
}

function savePassState(state) {
  localStorage.setItem(PASS_STORAGE_KEY, JSON.stringify(state));
}

function parseSqliteTimestamp(raw) {
  if (!raw) return null;
  const d = new Date(raw.replace(" ", "T") + "Z");
  return isNaN(d.getTime()) ? null : d;
}

function formatTimestamp(raw) {
  const d = parseSqliteTimestamp(raw);
  if (!d) return "";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatCountdown(createdAt, slaHours, now) {
  const created = parseSqliteTimestamp(createdAt);
  if (!created) return { text: "—", overdue: false };

  const deadline = new Date(created.getTime() + slaHours * 60 * 60 * 1000);
  const diffMs = deadline.getTime() - now.getTime();

  if (diffMs <= 0) {
    const overdueMs = Math.abs(diffMs);
    const h = Math.floor(overdueMs / 3600000);
    const m = Math.floor((overdueMs % 3600000) / 60000);
    return { text: `Overdue by ${h}h ${m}m`, overdue: true };
  }

  const h = Math.floor(diffMs / 3600000);
  const m = Math.floor((diffMs % 3600000) / 60000);
  const s = Math.floor((diffMs % 60000) / 1000);

  if (h > 0) return { text: `${h}h ${m}m left`, overdue: false };
  if (m > 0) return { text: `${m}m ${s}s left`, overdue: false };
  return { text: `${s}s left`, overdue: false };
}

export default function Dashboard({ onExit, persona, user }) {
  const [activeTab, setActiveTab] = useState("campaigns");
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem("adsquadops_onboarding_seen"));

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [validatingId, setValidatingId] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [error, setError] = useState("");
  const [passState, setPassState] = useState(getPassState);

  const [form, setForm] = useState({
    name: "",
    destination_url: "",
    tracking_tag: "",
    ad_copy: "",
  });

  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketError, setTicketError] = useState("");
  const [resolvingId, setResolvingId] = useState(null);
  const [now, setNow] = useState(new Date());

  const [ticketForm, setTicketForm] = useState({
    campaign_id: "",
    title: "",
    priority: "standard",
  });

  const isAdmin = user && ADMIN_EMAILS.includes(user.email);
  const remainingPasses = isAdmin ? Infinity : DAILY_PASS_LIMIT - passState.used;

  async function refreshCampaigns() {
    try {
      setLoading(true);
      const data = await listCampaigns();
      setCampaigns(data);
      setError("");
    } catch (e) {
      setError("Could not reach the backend. Is it running on port 8000?");
    } finally {
      setLoading(false);
    }
  }

  async function refreshTickets() {
    try {
      setTicketsLoading(true);
      const data = await listTickets();
      setTickets(data);
      setTicketError("");
    } catch (e) {
      setTicketError("Could not reach the backend. Is it running on port 8000?");
    } finally {
      setTicketsLoading(false);
    }
  }

  useEffect(() => {
    refreshCampaigns();
    refreshTickets();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  async function handleCreate(e) {
    e.preventDefault();

    const current = getPassState();
    if (!isAdmin && current.used >= DAILY_PASS_LIMIT) {
      setError("You've used all 4 demo passes for today — come back tomorrow!");
      return;
    }

    try {
      await createCampaign(form);
      const updated = { date: current.date, used: current.used + 1 };
      savePassState(updated);
      setPassState(updated);
      setForm({ name: "", destination_url: "", tracking_tag: "", ad_copy: "" });
      setShowForm(false);
      refreshCampaigns();
    } catch (e) {
      setError("Failed to create campaign.");
    }
  }

  async function handleLoadDemo(demo) {
    const currentPass = getPassState();
    if (!isAdmin && currentPass.used >= DAILY_PASS_LIMIT) {
      setError("You've used all 4 demo passes for today, come back tomorrow!");
      return;
    }
    try {
      await createCampaign(demo);
      const updated = { date: currentPass.date, used: currentPass.used + 1 };
      savePassState(updated);
      setPassState(updated);
      refreshCampaigns();
    } catch (e) {
      setError("Failed to load demo campaign.");
    }
  }

  async function handleValidate(id) {
    try {
      setValidatingId(id);
      setLastResult(null);
      const result = await validateCampaign(id);
      setLastResult(result);
      refreshCampaigns();
    } catch (e) {
      setError("Validation failed.");
    } finally {
      setValidatingId(null);
    }
  }

  async function handleCreateTicket(e) {
    e.preventDefault();
    if (!ticketForm.campaign_id) {
      setTicketError("Pick a campaign for this ticket.");
      return;
    }
    try {
      await createTicket({
        campaign_id: Number(ticketForm.campaign_id),
        title: ticketForm.title,
        priority: ticketForm.priority,
      });
      setTicketForm({ campaign_id: "", title: "", priority: "standard" });
      setShowTicketForm(false);
      refreshTickets();
    } catch (e) {
      setTicketError("Failed to create ticket.");
    }
  }

  async function handleResolve(id) {
    try {
      setResolvingId(id);
      await resolveTicket(id);
      refreshTickets();
    } catch (e) {
      setTicketError("Failed to resolve ticket.");
    } finally {
      setResolvingId(null);
    }
  }

  const openTickets = tickets.filter((t) => t.status !== "resolved");
  const resolvedTickets = tickets.filter((t) => t.status === "resolved");

  return (
    <div className="min-h-screen bg-paper text-ink font-body">
      {showOnboarding && (
        <OnboardingTour
          onFinish={() => {
            setShowOnboarding(false);
            localStorage.setItem("adsquadops_onboarding_seen", "true");
          }}
        />
      )}
      <nav className="bg-ink px-6 md:px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-display font-semibold text-paper text-lg">{COMPANY_NAME}</span>
          {persona && (
            <span className="font-mono text-[10px] uppercase tracking-wide text-white/40 bg-white/5 px-2 py-1 rounded">
              {persona === "team" ? "Team mode" : "Individual mode"}
            </span>
          )}
        </div>
        <button
          onClick={onExit}
          className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
        >
          <LogOut size={15} />
          Back to site
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-6 md:px-10 py-12">
        <div className="flex gap-2 mb-8 border-b border-ink/10">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={
                "px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors " +
                (activeTab === tab.key
                  ? "border-ink text-ink"
                  : "border-transparent text-slate hover:text-ink")
              }
            >
              {tab.label}
              {tab.key === "tickets" && openTickets.length > 0 && (
                <span className="ml-2 text-xs bg-campaign-red/15 text-campaign-red px-1.5 py-0.5 rounded-full">
                  {openTickets.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === "campaigns" && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-display text-2xl font-semibold">Campaign queue</h1>
                <p className="text-slate text-sm mt-1">Real campaigns, validated by your FastAPI backend.</p>
                <p className="font-mono text-xs text-slate mt-1">
                  {remainingPasses > 0
                    ? `${remainingPasses} of ${DAILY_PASS_LIMIT} demo passes left today`
                    : "No demo passes left today"}
                </p>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                disabled={remainingPasses <= 0 && !showForm}
                className="flex items-center gap-2 bg-ink text-paper px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1a2129] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus size={15} />
                New campaign
              </button>
            </div>

            <FirstTimeHint
              hintKey="campaigns"
              message="Create a campaign and we'll run it through real QA checks — URL reachability, tracking tag format, and an AI check on your ad copy."
            />

            {error && (
              <div className="bg-campaign-red/10 text-campaign-red text-sm rounded-lg px-4 py-3 mb-6">
                {error}
              </div>
            )}

            {showForm && (
              <form onSubmit={handleCreate} className="bg-white border border-ink/10 rounded-xl p-6 mb-8 space-y-3">
                <input
                  type="text"
                  placeholder="Campaign name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-ink/15 text-sm focus:outline-none focus:border-ink/40"
                />
                <input
                  type="text"
                  placeholder="Destination URL (e.g. https://example.com)"
                  required
                  value={form.destination_url}
                  onChange={(e) => setForm({ ...form, destination_url: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-ink/15 text-sm focus:outline-none focus:border-ink/40"
                />
                <input
                  type="text"
                  placeholder="Tracking tag (e.g. utm_source=google&utm_medium=cpc)"
                  required
                  value={form.tracking_tag}
                  onChange={(e) => setForm({ ...form, tracking_tag: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-ink/15 text-sm focus:outline-none focus:border-ink/40"
                />
                <textarea
                  placeholder="Ad copy (optional, used for AI alignment check)"
                  value={form.ad_copy}
                  onChange={(e) => setForm({ ...form, ad_copy: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-lg border border-ink/15 text-sm focus:outline-none focus:border-ink/40"
                />
                <Button variant="dark" type="submit">Create campaign</Button>
              </form>
            )}

            {lastResult && (
              <div className="bg-ink rounded-xl p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="font-mono text-xs text-white/40 tracking-wide">
                    VALIDATION RESULT — CAMPAIGN #{lastResult.campaign_id}
                  </div>
                  <div
                    className={
                      "font-mono text-xs px-2.5 py-1 rounded " +
                      (lastResult.status === "qa_passed"
                        ? "bg-campaign-mint/15 text-campaign-mint"
                        : "bg-campaign-red/15 text-campaign-red")
                    }
                  >
                    {lastResult.status === "qa_passed" ? "All checks passed" : "Needs attention"}
                  </div>
                </div>

                <div className="space-y-2">
                  {lastResult.results.map((r) => {
                    const meta = CHECK_META[r.check_type] || { label: r.check_type, icon: CheckCircle2 };
                    const Icon = meta.icon;
                    const StatusIcon = r.passed ? CheckCircle2 : XCircle;
                    return (
                      <div key={r.check_type} className="flex items-start gap-3 bg-white/5 rounded-lg px-4 py-3">
                        <Icon size={16} className="text-white/40 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm text-white font-medium">{meta.label}</span>
                            <StatusIcon
                              size={13}
                              className={r.passed ? "text-campaign-mint" : "text-campaign-red"}
                            />
                          </div>
                          <p
                            className={
                              "text-xs leading-relaxed break-words " +
                              (r.passed ? "text-white/50" : "text-campaign-red")
                            }
                          >
                            {r.detail}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex items-center gap-2 text-slate text-sm">
                <Loader2 size={16} className="animate-spin" />
                Loading campaigns...
              </div>
            ) : campaigns.length === 0 ? (
              <>
                <DemoCampaignPicker onLoad={handleLoadDemo} disabled={remainingPasses <= 0} />
                <div className="flex flex-col items-center text-center border border-dashed border-ink/15 rounded-xl py-14 px-6">
                  <div className="w-10 h-10 rounded-full bg-ink/5 flex items-center justify-center mb-3">
                    <Inbox size={18} className="text-slate" />
                  </div>
                  <p className="text-sm font-medium mb-1">No campaigns yet</p>
                  <p className="text-slate text-xs">Create your first one above to see it validated here.</p>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                {campaigns.map((c) => {
                  const status = STATUS_META[c.status] || STATUS_META.draft;
                  const isValidating = validatingId === c.id;
                  return (
                    <div
                      key={c.id}
                      className="flex items-center justify-between bg-white border border-ink/10 rounded-xl px-5 py-4 hover:border-ink/20 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={"w-1.5 h-1.5 rounded-full shrink-0 " + status.dot} />
                          <span className="font-display font-semibold text-sm truncate">{c.name}</span>
                        </div>
                        <div className="text-slate text-xs truncate">{c.destination_url}</div>
                        {c.created_at && (
                          <div className="font-mono text-[10px] text-slate/70 mt-1">
                            Created {formatTimestamp(c.created_at)}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 shrink-0 ml-4">
                        <span className={"font-mono text-xs px-2.5 py-1 rounded " + status.bg + " " + status.text}>
                          {status.label}
                        </span>
                        <button
                          onClick={() => handleValidate(c.id)}
                          disabled={isValidating}
                          className="flex items-center gap-1.5 text-xs font-medium bg-ink text-paper px-3 py-1.5 rounded-md hover:bg-[#1a2129] transition-colors disabled:opacity-50"
                        >
                          {isValidating && <Loader2 size={12} className="animate-spin" />}
                          {isValidating ? "Validating..." : "Validate"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {activeTab === "tickets" && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-display text-2xl font-semibold">SLA tickets</h1>
                <p className="text-slate text-sm mt-1">
                  Support requests linked to a campaign, with a visible SLA clock.
                </p>
              </div>
              <button
                onClick={() => setShowTicketForm(!showTicketForm)}
                disabled={campaigns.length === 0}
                className="flex items-center gap-2 bg-ink text-paper px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1a2129] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title={campaigns.length === 0 ? "Create a campaign first" : ""}
              >
                <Plus size={15} />
                New ticket
              </button>
            </div>

            <FirstTimeHint
              hintKey="tickets"
              message="Open a ticket when a campaign needs a fix. Each one gets a live SLA countdown based on priority."
            />

            {ticketError && (
              <div className="bg-campaign-red/10 text-campaign-red text-sm rounded-lg px-4 py-3 mb-6">
                {ticketError}
              </div>
            )}

            {showTicketForm && (
              <form onSubmit={handleCreateTicket} className="bg-white border border-ink/10 rounded-xl p-6 mb-8 space-y-3">
                <select
                  required
                  value={ticketForm.campaign_id}
                  onChange={(e) => setTicketForm({ ...ticketForm, campaign_id: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-ink/15 text-sm focus:outline-none focus:border-ink/40 bg-white"
                >
                  <option value="">Link to campaign...</option>
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="What's the issue? (e.g. Checkout URL 404)"
                  required
                  value={ticketForm.title}
                  onChange={(e) => setTicketForm({ ...ticketForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-ink/15 text-sm focus:outline-none focus:border-ink/40"
                />
                <div className="flex gap-2">
                  {["standard", "high"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setTicketForm({ ...ticketForm, priority: p })}
                      className={
                        "flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors " +
                        (ticketForm.priority === p
                          ? "bg-ink text-paper border-ink"
                          : "border-ink/15 text-slate hover:border-ink/30")
                      }
                    >
                      {p === "high" ? "High priority (2h SLA)" : "Standard (4h SLA)"}
                    </button>
                  ))}
                </div>
                <Button variant="dark" type="submit">Create ticket</Button>
              </form>
            )}

            {ticketsLoading ? (
              <div className="flex items-center gap-2 text-slate text-sm">
                <Loader2 size={16} className="animate-spin" />
                Loading tickets...
              </div>
            ) : tickets.length === 0 ? (
              <div className="flex flex-col items-center text-center border border-dashed border-ink/15 rounded-xl py-14 px-6">
                <div className="w-10 h-10 rounded-full bg-ink/5 flex items-center justify-center mb-3">
                  <TicketIcon size={18} className="text-slate" />
                </div>
                <p className="text-sm font-medium mb-1">No tickets yet</p>
                <p className="text-slate text-xs">Open one above when a campaign needs a fix.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {openTickets.map((t) => {
                  const countdown = formatCountdown(t.created_at, t.sla_hours, now);
                  const isResolving = resolvingId === t.id;
                  return (
                    <div
                      key={t.id}
                      className="flex items-center justify-between bg-white border border-ink/10 rounded-xl px-5 py-4"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span
                            className={
                              "text-[10px] font-mono px-1.5 py-0.5 rounded uppercase " +
                              (t.priority === "high"
                                ? "bg-campaign-red/15 text-campaign-red"
                                : "bg-ink/5 text-slate")
                            }
                          >
                            {t.priority}
                          </span>
                          <span className="font-display font-semibold text-sm truncate">{t.title}</span>
                        </div>
                        <div className="text-slate text-xs truncate">{t.campaign_name}</div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 ml-4">
                        <span
                          className={
                            "flex items-center gap-1.5 font-mono text-xs px-2.5 py-1 rounded " +
                            (countdown.overdue
                              ? "bg-campaign-red/15 text-campaign-red"
                              : "bg-campaign-yellow/15 text-[#8a6d1a]")
                          }
                        >
                          {countdown.overdue ? <AlertTriangle size={12} /> : <Clock size={12} />}
                          {countdown.text}
                        </span>
                        <button
                          onClick={() => handleResolve(t.id)}
                          disabled={isResolving}
                          className="flex items-center gap-1.5 text-xs font-medium bg-ink text-paper px-3 py-1.5 rounded-md hover:bg-[#1a2129] transition-colors disabled:opacity-50"
                        >
                          {isResolving && <Loader2 size={12} className="animate-spin" />}
                          {isResolving ? "Resolving..." : "Resolve"}
                        </button>
                      </div>
                    </div>
                  );
                })}

                {resolvedTickets.length > 0 && (
                  <div className="pt-4">
                    <p className="font-mono text-xs text-slate tracking-wide mb-3">RESOLVED</p>
                    <div className="space-y-2">
                      {resolvedTickets.map((t) => (
                        <div
                          key={t.id}
                          className="flex items-center justify-between bg-ink/[0.03] rounded-xl px-5 py-3 opacity-70"
                        >
                          <div className="min-w-0 flex-1">
                            <span className="text-sm truncate">{t.title}</span>
                            <span className="text-slate text-xs ml-2">— {t.campaign_name}</span>
                          </div>
                          <span className="flex items-center gap-1.5 text-campaign-mint text-xs font-mono">
                            <CheckCircle2 size={12} />
                            Resolved
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {activeTab === "escalations" && <EscalationsPanel tickets={tickets} />}
        {activeTab === "overview" && <OverviewPanel />}
      </div>
    </div>
  );
}

