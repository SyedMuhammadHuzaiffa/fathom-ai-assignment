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
  actionItems: { owner: string; task: string; due?: string; timestamp?: string }[];
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
      { timestamp: "00:23", speaker: "Syed Huzaifa", text: "The recording indicator is live, so we should have a clean sample to review in a minute." },
      { timestamp: "00:42", speaker: "Syed Huzaifa", text: "I can see the timeline moving and the highlight control is available." },
      { timestamp: "01:04", speaker: "Maya Chen", text: "Great. The participant names and timestamps should make the processed transcript easy to scan." },
      { timestamp: "01:31", speaker: "Jonah Brooks", text: "Let us mark this moment so we have a short clip to share with the team." },
      { timestamp: "01:58", speaker: "Syed Huzaifa", text: "That covers the test. I will stop the recorder and confirm the call appears in My Calls." },
    ],
    summary: [
      { heading: "Meeting purpose", body: "Validate the meeting recorder and review the basic post-call workflow." },
      { heading: "Key takeaways", body: "Recording, transcription, and moment capture worked as expected during the short test." },
    ],
    actionItems: [
      { owner: "Syed Huzaifa", task: "Confirm the processed transcript is available in the workspace.", due: "Today", timestamp: "01:58" },
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
      { timestamp: "00:34", speaker: "Maya Chen", text: "Today I want us to leave with one onboarding direction that we can confidently put in front of customers this week." },
      { timestamp: "02:18", speaker: "Jonah Brooks", text: "The first-run experience needs one clear success moment before we ask for notification access." },
      { timestamp: "04:51", speaker: "Naomi Park", text: "In the latest sessions, people understood the workspace quickly but hesitated when the permissions prompt interrupted them." },
      { timestamp: "07:26", speaker: "Syed Huzaifa", text: "We can let people explore a complete sample and keep the real data connection as an explicit next step." },
      { timestamp: "10:03", speaker: "Elena Rossi", text: "That also lowers the technical risk because the sample experience does not depend on import finishing in the background." },
      { timestamp: "12:17", speaker: "Jonah Brooks", text: "I will simplify the first screen so the sample workspace is the primary action and import becomes secondary." },
      { timestamp: "14:46", speaker: "Naomi Park", text: "Activation improves when the sample workspace is visible before account setup is complete." },
      { timestamp: "17:08", speaker: "Maya Chen", text: "Let us use that as the principle: show value first, then ask the customer to invest in setup." },
      { timestamp: "19:42", speaker: "Syed Huzaifa", text: "For returning users, the current flow can stay intact so we do not introduce an unnecessary migration state." },
      { timestamp: "22:05", speaker: "Jonah Brooks", text: "The revised flow is welcome, sample workspace, then a contextual setup card after the first completed task." },
      { timestamp: "24:33", speaker: "Naomi Park", text: "We should measure sample-task completion separately from account completion so we know where confidence changes." },
      { timestamp: "26:40", speaker: "Maya Chen", text: "We are aligned on the progressive permission approach and the three-screen structure." },
      { timestamp: "28:09", speaker: "Elena Rossi", text: "We can ship the progressive permission flow behind the existing onboarding flag." },
      { timestamp: "30:27", speaker: "Syed Huzaifa", text: "I will wire the sample state into the existing flag and add events for the new activation checkpoints." },
      { timestamp: "32:58", speaker: "Maya Chen", text: "Perfect. Jonah owns the prototype, Elena and Huzaifa own the flagged implementation, and Naomi will define the readout." },
    ],
    summary: [
      { heading: "Decision", body: "Lead with a sample workspace and defer notification permission until after the first completed task." },
      { heading: "Design notes", body: "Reduce the welcome flow to three focused screens and keep data import optional." },
    ],
    actionItems: [
      { owner: "Jonah Brooks", task: "Publish the revised three-screen onboarding prototype.", due: "Sep 15", timestamp: "12:17" },
      { owner: "Elena Rossi", task: "Add the progressive-permission experiment flag.", due: "Sep 17", timestamp: "28:09" },
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
      { timestamp: "00:21", speaker: "Maya Chen", text: "We have fifty-eight minutes to lock the launch story, the October product boundary, and the work that must happen before customer previews." },
      { timestamp: "01:47", speaker: "Marcus Lee", text: "The strongest design-partner feedback is still about getting focus time back after calls, not about having another place to store notes." },
      { timestamp: "04:12", speaker: "Aisha Rahman", text: "The launch story should lead with time recovered, then prove accuracy with customer examples." },
      { timestamp: "06:36", speaker: "Jonah Brooks", text: "Visually, we can make recovered time tangible by connecting one decision to the exact conversation moment that produced it." },
      { timestamp: "08:54", speaker: "Syed Huzaifa", text: "The product can support that story now. Every transcript turn already has the timing and speaker context we need for provenance." },
      { timestamp: "11:16", speaker: "Priya Nair", text: "For accuracy claims, I want to separate measured transcription quality from the qualitative feedback customers give us about usefulness." },
      { timestamp: "13:43", speaker: "Elena Rossi", text: "Agreed. We should not let launch copy imply that an evaluation covers workflows we have not actually benchmarked." },
      { timestamp: "16:08", speaker: "Aisha Rahman", text: "I will structure the narrative as problem, recovered focus, trustworthy source context, and then customer proof." },
      { timestamp: "18:31", speaker: "Marcus Lee", text: "I can likely secure two written quotes this week, but the larger customer needs legal approval before we name them." },
      { timestamp: "20:09", speaker: "Daniel Ortiz", text: "That is enough for the first sales enablement draft as long as we keep the third story anonymous." },
      { timestamp: "22:38", speaker: "Daniel Ortiz", text: "Enterprise buyers keep asking about security before they ask about integrations." },
      { timestamp: "24:57", speaker: "Elena Rossi", text: "We have the architecture answers. The gap is packaging them into a security overview that sales can share without an engineer on every call." },
      { timestamp: "27:12", speaker: "Syed Huzaifa", text: "I can pair with Daniel on the technical review and make sure the data-flow diagram matches the current system." },
      { timestamp: "29:36", speaker: "Jonah Brooks", text: "I will give the security material the same visual language as the product so it feels like part of the launch, not a separate appendix." },
      { timestamp: "31:48", speaker: "Maya Chen", text: "Good. Security is a launch prerequisite; the deeper integration catalog can stay outside the October critical path." },
      { timestamp: "34:14", speaker: "Aisha Rahman", text: "For channels, we will start with design partners and founder-led demos before expanding into the broader campaign." },
      { timestamp: "36:39", speaker: "Marcus Lee", text: "That gives customer success time to capture objections and feed them back into the public launch material." },
      { timestamp: "38:52", speaker: "Priya Nair", text: "The evaluation set is eighty percent labeled. The remaining calls include the noisiest multi-speaker examples, so they matter disproportionately." },
      { timestamp: "41:05", speaker: "Priya Nair", text: "We will have a reliable benchmark once the remaining evaluation set is labeled." },
      { timestamp: "43:27", speaker: "Elena Rossi", text: "Let us protect two engineering days for any regressions the final benchmark exposes, but keep that separate from adding new surface area." },
      { timestamp: "45:46", speaker: "Syed Huzaifa", text: "I will prepare the release candidate early enough that Priya can run the frozen evaluation before we open the preview group." },
      { timestamp: "47:58", speaker: "Daniel Ortiz", text: "Sales will recruit the preview group from accounts that already cleared security review, which removes a predictable delay." },
      { timestamp: "49:41", speaker: "Jonah Brooks", text: "The demo should stay centered on a real meeting: find the decision, hear the source, and share the context with the team." },
      { timestamp: "51:37", speaker: "Aisha Rahman", text: "That sequence is the campaign spine. It is specific, demonstrable, and connects directly to recovered focus time." },
      { timestamp: "53:22", speaker: "Maya Chen", text: "The October milestone stays focused: team workspaces, trust, and a repeatable launch motion." },
      { timestamp: "55:06", speaker: "Marcus Lee", text: "I will send the customer approval tracker after this call and flag any story that puts the schedule at risk." },
      { timestamp: "56:18", speaker: "Daniel Ortiz", text: "I own the consolidated security objections and will have a sales-ready first pass by Wednesday." },
      { timestamp: "57:42", speaker: "Maya Chen", text: "We have the owners and the boundary. Please raise a risk immediately if it threatens trust, the benchmark, or the three preview stories." },
    ],
    summary: [
      { heading: "Launch strategy", body: "Position the release around recovered focus time, supported by trust and accuracy evidence." },
      { heading: "October scope", body: "Prioritize team workspaces, security materials, and three design-partner stories." },
      { heading: "Risks", body: "Evaluation labeling and customer approvals are the two schedule-sensitive dependencies." },
    ],
    actionItems: [
      { owner: "Aisha Rahman", task: "Draft the launch narrative and channel plan.", due: "Sep 18", timestamp: "16:08" },
      { owner: "Daniel Ortiz", task: "Consolidate enterprise security objections.", due: "Sep 16", timestamp: "56:18" },
      { owner: "Marcus Lee", task: "Request approval for three customer stories.", due: "Sep 19", timestamp: "55:06" },
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
      { owner: "Marcus Lee", task: "Send Theo a workspace search prototype.", due: "Sep 15", timestamp: "19:14" },
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
      { owner: "Syed Huzaifa", task: "Add a shared-room regression fixture.", due: "Sep 11", timestamp: "15:01" },
      { owner: "Priya Nair", task: "Segment attribution errors by participant count.", timestamp: "09:32" },
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
