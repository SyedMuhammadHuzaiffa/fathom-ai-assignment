# Fathom-style Meeting Intelligence — Take-Home Assignment

A focused recreation of Fathom's post-meeting experience, built within the assignment time constraint. It prioritizes the workflow that follows a meeting: finding the right call, reviewing its context, moving through the conversation, extracting decisions, and sharing the useful moment.

## Live links

- [Live deployment](https://fathom-ai-assignment.vercel.app)
- [Public GitHub repository](https://github.com/SyedMuhammadHuzaiffa/fathom-ai-assignment)

## Core product experience

- Searchable, filterable meetings dashboard
- Meeting detail pages with a simulated playback timeline and timestamp-synchronized transcript
- AI-style summaries with Enhanced and Demo template switching
- Action items, highlights, and linked timestamps
- Share a complete meeting or a specific highlight/moment
- Public, read-only meeting and moment share routes
- Responsive desktop and mobile layouts
- Seeded scenarios ranging from a short test call to a realistic 58:47 meeting with eight participants

## Product judgement and deliberate scope

This is intentionally a post-meeting product. Real meeting capture, a notetaker bot, calendar integration, Zoom/Google Meet/Microsoft Teams integration, authentication, billing, and team administration are outside the assignment scope. Recording/capture was explicitly permitted to be stubbed, so the implementation uses deterministic seeded frontend data for meetings, transcripts, summaries, actions, and highlights. The time was invested in making the review, retrieval, and sharing experience coherent and convincing.

## Real Fathom reconnaissance

The real product was used before implementation to study its dashboard, search, meeting detail, playback/timeline, transcript, AI summary, summary customization/template switching, action-item treatment, and multi-participant meeting experience.

Share/clip controls were not available in the tested account, so this clone models its sharing interaction intentionally. The approximately 60-minute, eight-person scenario is based on the assignment requirement; it is not presented as an observation from that Fathom account.

## Tech stack

- Next.js 16 with React 19 and TypeScript
- Tailwind CSS
- Vercel
- Local deterministic seeded data; no application backend

## Architecture

The app uses the Next.js App Router. Seeded meeting records in `src/data/meetings.ts` supply the scenario data, while client-side state powers deterministic search, filters, playback simulation, summary-template switching, action completion, and sharing interactions. Dynamic meeting routes and public read-only share routes keep the experience focused without introducing an unnecessary backend.

Important routes:

- `/` — meetings dashboard
- `/meetings/[id]` — meeting detail
- `/share/[meetingId]` — public read-only meeting recap
- `/share/[meetingId]?moment=[highlightId]` — public read-only shared moment

## Run locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

Checks:

```bash
npm run lint
npm run build
```

The npm scripts use webpack for local CSS compilation reliability in restricted environments.

## Seeded scenarios

The seeded library includes a short recording walkthrough, several normal working meetings, and a 58:47 eight-participant Q4 planning call. Each scenario includes realistic summaries, action items, highlights, and, where applicable, shareable moments.

## Agent capture compliance

Automatic Codex lifecycle hooks capture prompts and final responses into [`.agent-logs/`](.agent-logs/). [`CAPTURE-TEST.md`](CAPTURE-TEST.md) documents canary verification. Logs were committed progressively alongside development; they do not expose chain-of-thought or tool-call traces.

## Deployment

The project is deployed at [fathom-ai-assignment.vercel.app](https://fathom-ai-assignment.vercel.app). Logged-out production access was verified.
