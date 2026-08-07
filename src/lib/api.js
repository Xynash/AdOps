const BASE_URL = "http://127.0.0.1:8000";

export async function createCampaign(data) {
  const res = await fetch(BASE_URL + "/campaigns", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create campaign");
  return res.json();
}

export async function listCampaigns() {
  const res = await fetch(BASE_URL + "/campaigns");
  if (!res.ok) throw new Error("Failed to fetch campaigns");
  return res.json();
}

export async function validateCampaign(id) {
  const res = await fetch(BASE_URL + "/campaigns/" + id + "/validate", {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to validate campaign");
  return res.json();
}

export async function createTicket(data) {
  const res = await fetch(BASE_URL + "/tickets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create ticket");
  return res.json();
}

export async function listTickets() {
  const res = await fetch(BASE_URL + "/tickets");
  if (!res.ok) throw new Error("Failed to fetch tickets");
  return res.json();
}

export async function resolveTicket(id) {
  const res = await fetch(BASE_URL + "/tickets/" + id + "/resolve", {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to resolve ticket");
  return res.json();
}

export async function createEscalation(data) {
  const res = await fetch(BASE_URL + "/escalations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create escalation");
  return res.json();
}

export async function listEscalations() {
  const res = await fetch(BASE_URL + "/escalations");
  if (!res.ok) throw new Error("Failed to fetch escalations");
  return res.json();
}

export async function advanceEscalation(id, data) {
  const res = await fetch(BASE_URL + "/escalations/" + id + "/advance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to advance escalation");
  return res.json();
}

export async function getOverview() {
  const res = await fetch(BASE_URL + "/overview");
  if (!res.ok) throw new Error("Failed to fetch overview");
  return res.json();
}
