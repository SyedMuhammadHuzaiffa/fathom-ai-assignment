export type Participant = {
  name: string;
  initials: string;
  role: string;
  color: string;
};

export type TranscriptLine = {
  timestamp: string;
  speaker: string;
  text: string;
};

export type Meeting = {
  id: string;
  title: string;
  date: string;
  time: string;
  durationSeconds: number;
  participants: Participant[];
  transcript: TranscriptLine[];
  summary: { heading: string; body: string }[];
  actionItems: { owner: string; task: string; due?: string }[];
  highlights: { timestamp: string; title: string; note: string }[];
  clips: { id: string; title: string; start: string; end: string; shareable: boolean }[];
  status: "shared" | "private";
};

const people = {
  huzaifa: { name: "Syed Huzaifa", initials: "SH", role: "Product Engineer", color: "#14b8d4" },
  maya: { name: "Maya Chen", initials: "MC", role: "VP, Product", color: "#8b7cf6" },
  jonah: { name: "Jonah Brooks", initials: "JB", role: "Staff Designer", color: "#ee7ca6" },
  elena: { name: "Elena Rossi", initials: "ER", role: "Engineering Lead", color: "#f59e62" },
  marcus: { name: "Marcus Lee", initials: "ML", role: "Customer Success", color: "#59b984" },
  aisha: { name: "Aisha Rahman", initials: "AR", role: "Growth Lead", color: "#e5ad45" },
  daniel: { name: "Daniel Ortiz", initials: "DO", role: "Head of Sales", color: "#4e9ee8" },
  priya: { name: "Priya Nair", initials: "PN", role: "Data Scientist", color: "#c179d8" },
  theo: { name: "Theo Martin", initials: "TM", role: "Founder, Northstar", color: "#57ad97" },
  naomi: { name: "Naomi Park", initials: "NP", role: "Product Manager", color: "#ca765c" },
};

export const meetings: Meeting[] = [
  {
    id: "test-call",
    title: "Test call — recording walkthrough",
    date: "2026-09-14",
    time: "10:06 AM",
    durationSeconds: 134,
    participants: [people.huzaifa, people.maya, people.jonah],
    transcript: [
      { timestamp: "00:08", speaker: "Maya Chen", text: "This is a quick walkthrough of how the recorder joins and captures a call." },
      { timestamp: "00:42", speaker: "Syed Huzaifa", text: "I can see the timeline moving and the highlight control is available." },
      { timestamp: "01:31", speaker: "Jonah Brooks", text: "Let us mark this moment so we have a short clip to share with the team." },
    ],
    summary: [
      { heading: "Meeting purpose", body: "Validate the meeting recorder and review the basic post-call workflow." },
      { heading: "Key takeaways", body: "Recording, transcription, and moment capture worked as expected during the short test." },
    ],
    actionItems: [
      { owner: "Syed Huzaifa", task: "Confirm the processed transcript is available in the workspace.", due: "Today" },
    ],
    highlights: [
      { timestamp: "01:31", title: "Creating a shareable moment", note: "Jonah demonstrates when to mark a key moment." },
    ],
    clips: [
      { id: "recording-walkthrough", title: "How to mark a key moment", start: "01:24", end: "01:55", shareable: true },
    ],
    status: "private",
  },
  {
    id: "mobile-onboarding-review",
    title: "Mobile onboarding — design review",
    date: "2026-09-12",
    time: "2:30 PM",
    durationSeconds: 2058,
    participants: [people.maya, people.jonah, people.huzaifa, people.elena, people.naomi],
    transcript: [
      { timestamp: "02:18", speaker: "Jonah Brooks", text: "The first-run experience needs one clear success moment before we ask for notification access." },
      { timestamp: "14:46", speaker: "Naomi Park", text: "Activation improves when the sample workspace is visible before account setup is complete." },
      { timestamp: "28:09", speaker: "Elena Rossi", text: "We can ship the progressive permission flow behind the existing onboarding flag." },
    ],
    summary: [
      { heading: "Decision", body: "Lead with a sample workspace and defer notification permission until after the first completed task." },
      { heading: "Design notes", body: "Reduce the welcome flow to three focused screens and keep data import optional." },
    ],
    actionItems: [
      { owner: "Jonah Brooks", task: "Publish the revised three-screen onboarding prototype.", due: "Sep 15" },
      { owner: "Elena Rossi", task: "Add the progressive-permission experiment flag.", due: "Sep 17" },
    ],
    highlights: [
      { timestamp: "14:46", title: "The activation insight", note: "Naomi connects sample data to faster activation." },
      { timestamp: "26:40", title: "Final flow decision", note: "The team aligns on the progressive permission approach." },
    ],
    clips: [],
    status: "shared",
  },
  {
    id: "q4-go-to-market",
    title: "Q4 go-to-market planning",
    date: "2026-09-10",
    time: "11:00 AM",
    durationSeconds: 3527,
    participants: [people.huzaifa, people.maya, people.aisha, people.daniel, people.marcus, people.elena, people.priya, people.jonah],
    transcript: [
      { timestamp: "04:12", speaker: "Aisha Rahman", text: "The launch story should lead with time recovered, then prove accuracy with customer examples." },
      { timestamp: "22:38", speaker: "Daniel Ortiz", text: "Enterprise buyers keep asking about security before they ask about integrations." },
      { timestamp: "41:05", speaker: "Priya Nair", text: "We will have a reliable benchmark once the remaining evaluation set is labeled." },
      { timestamp: "53:22", speaker: "Maya Chen", text: "The October milestone stays focused: team workspaces, trust, and a repeatable launch motion." },
    ],
    summary: [
      { heading: "Launch strategy", body: "Position the release around recovered focus time, supported by trust and accuracy evidence." },
      { heading: "October scope", body: "Prioritize team workspaces, security materials, and three design-partner stories." },
      { heading: "Risks", body: "Evaluation labeling and customer approvals are the two schedule-sensitive dependencies." },
    ],
    actionItems: [
      { owner: "Aisha Rahman", task: "Draft the launch narrative and channel plan.", due: "Sep 18" },
      { owner: "Daniel Ortiz", task: "Consolidate enterprise security objections.", due: "Sep 16" },
      { owner: "Marcus Lee", task: "Request approval for three customer stories.", due: "Sep 19" },
    ],
    highlights: [
      { timestamp: "22:38", title: "Security is a buying prerequisite", note: "Daniel summarizes the most common enterprise blocker." },
      { timestamp: "53:22", title: "October launch scope", note: "Maya closes with the authoritative priority set." },
    ],
    clips: [
      { id: "q4-launch-scope", title: "The Q4 launch thesis", start: "52:48", end: "54:06", shareable: true },
    ],
    status: "shared",
  },
  {
    id: "northstar-discovery",
    title: "Northstar Labs — customer discovery",
    date: "2026-09-08",
    time: "4:00 PM",
    durationSeconds: 2812,
    participants: [people.theo, people.marcus, people.maya, people.huzaifa],
    transcript: [
      { timestamp: "06:51", speaker: "Theo Martin", text: "Our team loses the thread when decisions live across calls, chat, and someone’s private notes." },
      { timestamp: "19:14", speaker: "Marcus Lee", text: "Would a weekly roll-up help, or do you need decisions available immediately after each call?" },
      { timestamp: "35:27", speaker: "Theo Martin", text: "Immediate is better, but the real value is being able to find the why two months later." },
    ],
    summary: [
      { heading: "Customer need", body: "Northstar needs durable decision context that remains searchable long after a meeting ends." },
      { heading: "Opportunity", body: "Connect decisions to their source moments and make cross-meeting retrieval feel immediate." },
    ],
    actionItems: [
      { owner: "Marcus Lee", task: "Send Theo a workspace search prototype.", due: "Sep 15" },
      { owner: "Maya Chen", task: "Add decision provenance to the discovery brief." },
    ],
    highlights: [
      { timestamp: "35:27", title: "Finding the why later", note: "Theo explains the long-term value of meeting context." },
    ],
    clips: [],
    status: "shared",
  },
  {
    id: "engineering-weekly",
    title: "Engineering weekly — reliability",
    date: "2026-09-04",
    time: "9:30 AM",
    durationSeconds: 1128,
    participants: [people.elena, people.huzaifa, people.priya, people.naomi],
    transcript: [
      { timestamp: "03:05", speaker: "Elena Rossi", text: "Processing latency is back inside our target after last night’s queue change." },
      { timestamp: "09:32", speaker: "Priya Nair", text: "Speaker separation still degrades when more than six people join from one room." },
      { timestamp: "15:01", speaker: "Syed Huzaifa", text: "I will add the shared-room case to our regression fixture this week." },
    ],
    summary: [
      { heading: "System health", body: "Queue latency recovered; shared-room speaker separation remains the main quality issue." },
      { heading: "This week", body: "Expand regression coverage before tuning the speaker attribution model." },
    ],
    actionItems: [
      { owner: "Syed Huzaifa", task: "Add a shared-room regression fixture.", due: "Sep 11" },
      { owner: "Priya Nair", task: "Segment attribution errors by participant count." },
    ],
    highlights: [
      { timestamp: "03:05", title: "Latency is back on target", note: "Elena confirms the queue change resolved the incident." },
    ],
    clips: [],
    status: "private",
  },
  {
    id: "product-hiring-debrief",
    title: "Senior product designer — debrief",
    date: "2026-08-29",
    time: "1:15 PM",
    durationSeconds: 1594,
    participants: [people.maya, people.jonah, people.naomi, people.elena],
    transcript: [
      { timestamp: "05:44", speaker: "Jonah Brooks", text: "The systems thinking was strong, especially in how they narrowed the ambiguous brief." },
      { timestamp: "13:20", speaker: "Elena Rossi", text: "Their collaboration examples were specific and they invited engineering into the tradeoffs early." },
      { timestamp: "22:11", speaker: "Maya Chen", text: "We have enough signal to move forward to references." },
    ],
    summary: [
      { heading: "Recommendation", body: "Move the candidate to references based on strong systems thinking and cross-functional collaboration." },
      { heading: "Follow-up", body: "Validate operating pace and people-management expectations during references." },
    ],
    actionItems: [
      { owner: "Naomi Park", task: "Coordinate two candidate references.", due: "Sep 2" },
    ],
    highlights: [
      { timestamp: "22:11", title: "Proceed to references", note: "Maya records the panel decision." },
    ],
    clips: [],
    status: "private",
  },
];
