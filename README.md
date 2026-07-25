# WalkSafe Admin

WalkSafe Admin is the web-based administration dashboard for the **WalkSafe** personal-safety platform. It gives administrators a real-time control center to monitor users, respond to SOS alerts, manage danger zones, and review safety analytics — all backed by Firebase Firestore for live data updates.

## Features

- **Dashboard** — At-a-glance stats for total users, users currently online, active journeys, and live SOS alerts, plus a feed of recent journeys and alerts.
- **Live Map** — Real-time map (built with Leaflet / React-Leaflet) showing online users, active journeys, and danger zones across the coverage area.
- **SOS Alerts** — Live feed of incoming SOS/emergency alerts with location details for rapid response.
- **Danger Zones** — View and manage reported danger zones, categorized by risk level (medium, high, risky).
- **User Management** — Browse and manage registered users of the WalkSafe mobile app.
- **Analytics** — Aggregated insights from journeys, feedback, users, and danger zones.
- **Authentication** — Simple protected-route login flow guarding access to the admin panel.

## Tech Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) — build tool and dev server
- [React Router](https://reactrouter.com/) — client-side routing
- [Firebase](https://firebase.google.com/) (Firestore) — real-time backend data
- [Leaflet](https://leafletjs.com/) / [React-Leaflet](https://react-leaflet.js.org/) — interactive maps
- [React Icons](https://react-icons.github.io/react-icons/) — icon set
- [Oxlint](https://oxc.rs/) — linting

## Project Structure

```
WalkSafe_Admin/
├── public/                 # Static assets (favicon, icons)
├── src/
│   ├── components/         # Reusable UI components (Sidebar, Header, LiveMap)
│   ├── context/             # React context providers (AuthContext)
│   ├── hooks/                # Custom hooks (useFirestore data hooks)
│   ├── pages/                 # Route-level pages (Dashboard, Analytics, SosAlerts, etc.)
│   ├── App.tsx                 # App routes and layout
│   ├── firebase.ts             # Firebase app initialization
│   ├── main.tsx                 # App entry point
│   └── index.css                 # Global styles
├── package.json
└── vite.config.ts
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm (bundled with Node.js)
- A Firebase project with Firestore enabled

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ChamalInd/WalkSafe_Admin.git
   cd WalkSafe_Admin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase:
   Update `src/firebase.ts` with your own Firebase project configuration (apiKey, authDomain, projectId, etc.) if you're connecting to a different Firestore backend.

4. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173` (default Vite port).

### Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite development server with hot module reloading |
| `npm run build` | Type-check with `tsc` and build the production bundle |
| `npm run lint` | Run Oxlint against the codebase |
| `npm run preview` | Preview the production build locally |

## Usage

Once running, sign in through the login page to access the admin dashboard. From there you can:

1. View real-time platform stats on the **Dashboard**.
2. Track online users and active journeys on the **Live Map**.
3. Respond to incoming **SOS Alerts**.
4. Review and manage **Danger Zones**.
5. Browse registered users under **User Management**.
6. Explore trends and insights under **Analytics**.

> **Note:** Authentication in this project is a simple demo-level check. Replace it with a production-grade authentication method (e.g., Firebase Authentication) before deploying publicly.

## Contributing

Contributions are welcome. Please open an issue to discuss any significant changes before submitting a pull request.

## License

This project was built as part of the **Hacklite 3.0** hackathon, with development assisted by AI tools.
