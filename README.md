# Elastic Presentation

A React-based interactive presentation tool for Elastic field teams. Walk prospects through Elastic's platform, capabilities, and value with a polished, customizable presentation — all running locally in the browser.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Scenes](#scenes)
- [Customization](#customization)
  - [Scene Settings](#scene-settings)
  - [Team Settings](#team-settings)
  - [Per-Scene Content](#per-scene-content)
- [Navigation](#navigation)
- [Theming](#theming)
- [Persistence](#persistence)

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

The app runs at `http://localhost:5173` by default and uses hash-based routing (`/#/scene-id`).

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 18 |
| Build | Vite 5 |
| Routing | react-router-dom 7 (HashRouter) |
| Styling | Tailwind CSS 3 |
| Animation | anime.js 4 |
| Icons | Font Awesome (free-solid) |
| Analytics | Vercel Analytics |
| Fonts | Mier B (headlines), Inter (body), Space Mono (code) |

---

## Project Structure

```
presentation-2.0/
├── public/                     # Static assets (fonts, logos, images)
├── src/
│   ├── main.jsx                # App entry — HashRouter setup
│   ├── App.jsx                 # Scene registry, routing, global nav, inline scenes
│   ├── index.css               # Tailwind base, fonts, custom keyframes
│   ├── components/
│   │   ├── SceneSettings.jsx   # Settings panel + useSceneConfiguration hook
│   │   ├── Navigation.jsx      # Global prev/next nav buttons
│   │   ├── ProgressBar.jsx     # Bottom progress indicator
│   │   └── ErrorBoundary.jsx
│   ├── context/
│   │   ├── ThemeContext.jsx     # Dark/light mode
│   │   └── TeamContext.jsx      # Team member data
│   ├── scenes/                 # All active scene components
│   │   └── _backup/            # Archived older versions
│   ├── animations/             # Reusable animation utilities
│   └── hooks/                  # Custom React hooks
├── tailwind.config.js
└── vite.config.js
```

---

## Scenes

The presentation is made up of **scenes** — individual full-screen slides. Scenes are registered in `App.jsx` and can be enabled, disabled, reordered, and customized via the Settings panel.

### Available Scenes

| Scene | ID | Description |
|---|---|---|
| **Hero** | `hero` | Opening screen with animated search bar and Elastic branding |
| **Agenda** | `agenda` | Auto-generated agenda from enabled scenes, adaptive grid layout |
| **Team** | `team` | Team introductions pulled from Team Settings |
| **About Elastic** | `about` | Company stats and platform overview |
| **Business Value** | `business-value` | Four core value pillars: Risk, Time, Resilience, Cost |
| **Problem Patterns** | `problem-patterns` | Filterable problem patterns across Observability, Security, and Search |
| **Unified Strategy** | `unified-strategy` | Full platform diagram: data sources → capabilities → solutions |
| **Data Explosion** | `data-explosion` | Animated chart showing structured vs. unstructured data growth |
| **Data Mesh** | `data-mesh` | Multi-stage story: data silos → unified Elastic mesh |
| **Cross-Cluster** | `cross-cluster` | Cross-cluster search and replication architecture |
| **Security** | `security` | AI-driven security: attack discovery, threat hunting, automation |
| **Schema** | `schema` | Schema on Read vs. Schema on Write comparison with ECS |
| **Access Control** | `access-control` | RBAC/ABAC, field-level security, PII masking |
| **Data Tiering** | `data-tiering` | Hot, warm, cold, and frozen tier lifecycle |
| **Licensing** | `licensing` | Free vs. Enterprise feature comparison |
| **Consolidation** | `consolidation` | Before/after: tool sprawl → Elastic consolidation |
| **ES\|QL** | `esql` | ES\|QL pipeline stages with live query examples |
| **Services** | `services` | Professional services journey with Zero Downtime Migration demo |
| **Next Steps** | `next-steps` | Call to action, de-risking options, and team contact panel |
| **Panel** | `panel` | Featured panel discussion layout with speaker cards |

### Scene Groups

Scenes can be grouped under a shared agenda entry using the `group` metadata field in Scene Settings. All scenes sharing the same group name will appear as a single item on the Agenda slide.

---

## Customization

All customization is done through the **Settings panel**, accessible via the gear icon in the top navigation bar. Settings are automatically saved to `localStorage` and persist across sessions.

### Scene Settings

The **Scenes** tab lets you:

- **Enable / disable** individual scenes — disabled scenes are hidden from the presentation and the agenda
- **Reorder** scenes by dragging them up and down the list
- **Set custom durations** shown on the Agenda slide
- **Assign a group** to cluster scenes under a single agenda entry

### Team Settings

The **Team** tab lets you configure the people presenting. Each team member has:

| Field | Description |
|---|---|
| Name | Full name |
| Role | Job title (e.g. Account Executive, Solutions Architect) |
| Email | Contact email |
| Phone | Contact phone or scheduling link |
| Photo | Avatar image URL |
| Color | Accent color for their card |

Team members with the role **Account Executive**, **Solutions Architect**, or **Customer Architect** are automatically surfaced in the **Next Steps** scene contact panel.

### Per-Scene Content

The **Customizations** tab exposes content fields for each scene. Select a scene from the dropdown to edit its fields. Here's what each scene supports:

| Scene | Customizable Content |
|---|---|
| **Hero** | Typing animation text, banner title, accent word, subtitle |
| **About Elastic** | Subtitle, stats (value, label, description), features |
| **Problem Patterns** | Problem items per category (Observability, Security, Search) |
| **Data Explosion** | Eyebrow, headline, animated stat counters with labels and sources |
| **Cross-Cluster** | Eyebrow, title, benefits list, hub/site names, cluster config |
| **Unified Strategy** | Eyebrow, title parts, subtitle |
| **Consolidation** | Full before/after content: pain points, stats, tools, labels |
| **Schema** | Eyebrow, title, subtitles, data source names |
| **Access Control** | Domain, department names, role labels, actions, sensitive field values |
| **Services** | Header eyebrow/title/subtitle, hidden costs, data source names |
| **Next Steps** | Header, CTA name/email/phone/scheduling link |
| **Panel** | Eyebrow, title, accent phrase, date, time; per-speaker: name, role, org, note, avatar, Moderator/Elastic tags |

---

## Navigation

- **Previous / Next** buttons move between scenes globally
- **Dot indicators** along the bottom show your position; hover for scene names
- **Progress bar** at the very bottom fills as you advance through the deck
- Some scenes have **internal stages** advanced with their own controls (e.g. Data Mesh, Security, Services Zero Downtime Demo)
- The **Services** scene includes a **Reset** button in the nav bar when the Zero Downtime Demo is active

URL routing uses the hash: `/#/<scene-id>` — you can deep-link directly to any scene.

---

## Theming

The app supports **dark mode** (default) and **light mode**, toggled via the moon/sun icon in the nav bar.

- Dark mode uses the full Elastic dark palette — deep blue backgrounds, teal and white accents
- Light mode uses white surfaces with Elastic blue and ink tones
- All scenes and components respond to the active theme
- The selected theme is persisted to `localStorage` under the key `presentation-theme`

---

## Persistence

All user configuration is saved automatically to `localStorage`:

| Key | What it stores |
|---|---|
| `presentation-scene-config` | Enabled scenes, order, custom durations, per-scene metadata |
| `presentation-team-config` | Team title, subtitle, and all member records |
| `presentation-theme` | `'dark'` or `'light'` |

To reset everything to defaults, use the **Reset** option available in the Settings panel, or clear `localStorage` in your browser's developer tools.
