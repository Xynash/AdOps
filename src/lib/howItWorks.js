export const HOW_IT_WORKS_STEPS = [
  {
    key: "traffic",
    label: "Traffic",
    color: "campaign-red",
    individual: {
      title: "Drop in your campaign details",
      description: "Paste your creative, URL, and tracking tag into one form, built for someone moving fast without a team behind them.",
      builtFor: "Solo ops managers and freelancers",
      features: [
        "Save reusable templates for repeat clients",
        "No approval chain, submit and move on",
        "Personal history of every campaign you've trafficked",
      ],
    },
    team: {
      title: "Standardize how your team traffics",
      description: "Everyone on the desk uses the same fields and required rules, so nothing depends on who happens to be on shift.",
      builtFor: "Agencies and in-house ops teams",
      features: [
        "Shared field templates enforced across every teammate",
        "Assign campaigns to specific traffickers with ownership tags",
        "New hires follow the same steps from day one",
      ],
    },
  },
  {
    key: "validate",
    label: "Validate",
    color: "campaign-blue",
    individual: {
      title: "Get instant validation",
      description: "Every check runs in seconds, so you know before you hit publish, not after a client calls about it.",
      builtFor: "Anyone who QAs their own work",
      features: [
        "One-click re-validation after a quick fix",
        "Plain-language explanation for every failed check",
        "No configuration needed, sensible defaults out of the box",
      ],
    },
    team: {
      title: "Shared QA rules, no exceptions",
      description: "One ruleset across the whole team means nothing slips through because someone skipped a step or used their own checklist.",
      builtFor: "Teams managing multiple clients",
      features: [
        "Custom rule sets per client or campaign type",
        "QA pass rates tracked per team member",
        "Admins lock rules so they can't be quietly skipped",
      ],
    },
  },
  {
    key: "launch",
    label: "Launch",
    color: "campaign-mint",
    individual: {
      title: "Ship with confidence",
      description: "Mark it live knowing every link and tag already passed, no second-guessing after the fact.",
      builtFor: "Independent traffickers",
      features: [
        "One-tap launch once QA is green",
        "Personal launch log for your own records",
        "Undo window in case something changes last minute",
      ],
    },
    team: {
      title: "Clear ownership, every launch",
      description: "See who cleared what, and route sign-off to the right teammate before anything goes live.",
      builtFor: "Teams with approval workflows",
      features: [
        "Require sign-off from a lead before go-live",
        "Full launch audit trail visible to the whole team",
        "Notify stakeholders automatically the moment it's live",
      ],
    },
  },
  {
    key: "monitor",
    label: "Monitor",
    color: "campaign-yellow",
    individual: {
      title: "Keep an eye on what's live",
      description: "A simple view of every campaign you've shipped and its current health, all in one place.",
      builtFor: "Anyone managing their own campaign list",
      features: [
        "Single view of everything you personally have live",
        "Simple alerts if a link breaks after launch",
        "No noise from campaigns that aren't yours",
      ],
    },
    team: {
      title: "One dashboard for the whole desk",
      description: "Team leads see SLA health and campaign status across every member, not just their own queue.",
      builtFor: "Team leads and account managers",
      features: [
        "Desk-wide view across every teammate's campaigns",
        "SLA breach alerts routed to the right lead",
        "Exportable reports for client and leadership updates",
      ],
    },
  },
];
