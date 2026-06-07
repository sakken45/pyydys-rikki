# Pyydys — Offline Service Tracker

## Original Problem Statement
> I want a service calendar where I can keep track of what vehicles to bring into service or bring out of service, it also needs an odd jobs bar similar to the services. The services needs an option for preset places, people and an ability to add dates and what vehicles. The odd jobs donot require a place. The people should be added after the job is done and should be able to be pickable from preset people. There should be an archive similar to the service calendar page. The archive should be seperated by date. Strip out any cloud backend or remote database dependencies

## User Choices
- Fully offline; no cloud / no Emergent subscription required.
- Vertical list layout (NOT a month-grid calendar) matching the reference screenshot.
- Settings page also exposes "rename every button" label-overrides.

## Architecture
- React 19 single-page app, React Router for `/`, `/archive`, `/settings`.
- All persistence in **browser localStorage** (`pyydys.services.v1`, `pyydys.oddJobs.v1`, `pyydys.presets.v1`, `pyydys.labels.v1`).
- App-wide context (`AppProvider`) wraps state, presets and i18n label helper `t(key)`.
- No backend API calls. The FastAPI backend bundled with the template is **unused**.
- UI: Tailwind + shadcn/ui (pill buttons, rounded-2xl cards) with IBM Plex Sans + Manrope + Roboto Mono.

## Implemented Features (v1 — Feb 2026)
- Active page with two columns (Services / Odd Jobs), search, empty states, status counter in sidebar.
- New Service dialog: vehicle (with preset picker fallback), IN/OUT action toggle, date, place (presets), notes.
- New Odd Job dialog: title, date, optional vehicle, notes — **no place** field.
- Mark-as-done → prompts to pick people (from presets), then archives the entry.
- Archive page grouped by completion date (newest first), with separate Services / Odd Jobs sub-columns per day.
- Restore from archive, delete (active & archived).
- Settings page: manage preset Places / People / Vehicles, rename any label, reset labels, danger-zone "Erase all local data".

## P1 — Not Yet Implemented
- Export / import JSON backup (so data can move between browsers).
- Recurring services (e.g. every 6 months).
- PWA install + offline service worker (truly install-to-home-screen).
- Dark mode toggle.

## P2
- Per-vehicle service history view.
- Reminders / notifications.
