# KineticMesh — Frontend Migration Audit

This document records the classification of all files involved in the source-to-source transplant of the Pterodactyl / Arix theme into KineticMesh.

---

## 1. Files Copied / Adapted Directly from Theme Source

### Assets (`public/arix/` and `public/favicons/`)
- `public/arix/background-login.png`: Desaturated high-res login backdrop.
- `public/arix/logo.png` & `public/arix/Kroxy.png`: Primary brand logo.
- `public/arix/Console.svg`: Terminal illustration.
- `public/arix/Graphs-1.svg` & `public/arix/Graphs-2.svg`: Resource telemetry graphics.
- `public/arix/SideGraphs-1.svg` & `public/arix/SideGraphs-2.svg`: Side graph graphics.
- `public/arix/ServerRow-1.svg` through `ServerRow-4.svg`: Layout row indicators.
- `public/arix/StatsCards-1.svg` & `StatsCards-2.svg`: Card preset layouts.
- `public/arix/layout-1.svg` through `layout-5.svg`: Layout diagrams.
- `public/arix/loginLayout-1.svg` through `loginLayout-4.svg`: Login layout presets.
- `public/arix/meta-tags.png`: OpenGraph preview image.
- `public/arix/online.mp3`, `offline.mp3`, `copy.mp3`: State transition and interaction sound cues.
- `public/favicons/*`: Complete multi-resolution favicon set.

### Styling & Design Tokens
- `client/src/index.css`: Direct implementation of `public/themes/pterodactyl/css/arix.css` custom properties and `GlobalStylesheet.ts` rules (`.rounded-box:hover`, `.backdrop`, `.kx-stagger`, `.kx-live`, background gradients).
- `client/tailwind.config.js`: Direct replication of theme color aliases (`arix`, `gray50-900`, `success`, `danger`, `secondary`), font families (`Space Grotesk`, `Inter`, `JetBrains Mono`), and radius tokens (`box`, `component`).

### Presentation Layer & Components
- `views/**/*.ejs` (51 files): Direct translation of `wrapper.blade.php` with `#kx-boot` loading screen, theme fonts, and session injection.
- `client/src/components/theme/SideBar.tsx`: Direct adaptation of `resources/scripts/components/SideBar.tsx`.
- `client/src/components/theme/NavigationBar.tsx`: Direct adaptation of `resources/scripts/components/NavigationBar.tsx`.
- `client/src/components/theme/SubNavigation.tsx`: Direct adaptation of `resources/scripts/components/Navigation.tsx`.
- `client/src/components/theme/dashboard/VMCard.tsx`: Direct adaptation of `resources/scripts/components/dashboard/ServerCard.tsx`.
- `client/src/components/theme/server/Console.tsx`: Direct adaptation of `resources/scripts/components/server/console/Console.tsx`.
- `client/src/components/theme/server/PowerButtons.tsx`: Direct adaptation of `resources/scripts/components/server/console/PowerButtons.tsx`.
- `client/src/components/theme/server/StatGraphs.tsx`: Direct adaptation of `resources/scripts/components/server/console/StatGraphs.tsx`.
- `client/src/components/theme/server/ServerDetailsBlock.tsx`: Direct adaptation of `resources/scripts/components/server/console/ServerDetailsBlock.tsx`.
- `client/src/components/theme/elements/Button.tsx`: Direct adaptation of `resources/scripts/components/elements/button/Button.tsx`.
- `client/src/components/theme/elements/Dialog.tsx`: Direct adaptation of `resources/scripts/components/elements/dialog/index.tsx`.
- `client/src/components/theme/elements/CopyOnClick.tsx`: Direct adaptation of `resources/scripts/components/elements/CopyOnClick.tsx`.
- `client/src/components/theme/elements/Field.tsx`: Direct adaptation of `resources/scripts/components/elements/Field.tsx`.
- `client/src/components/theme/elements/Input.tsx`: Direct adaptation of `resources/scripts/components/elements/Input.tsx`.
- `client/src/components/theme/elements/Alert.tsx`: Direct adaptation of `resources/scripts/components/elements/Alert.tsx`.
- `client/src/components/theme/elements/PageContentBlock.tsx`: Direct adaptation of `resources/scripts/components/elements/PageContentBlock.tsx`.
- `client/src/components/theme/elements/ServerContentBlock.tsx`: Direct adaptation of `resources/scripts/components/elements/ServerContentBlock.tsx`.
- `client/src/pages/auth/Login.tsx`: Direct adaptation of `resources/scripts/components/auth/LoginContainer.tsx`.
- `client/src/pages/auth/Register.tsx`: Direct adaptation of `resources/scripts/components/auth/LoginFormContainer.tsx`.
- `client/src/pages/user/Dashboard.tsx`: Direct adaptation of `resources/scripts/components/dashboard/DashboardContainer.tsx`.
- `client/src/pages/user/VMList.tsx`: Direct adaptation of theme dense table and card listing layouts.
- `client/src/pages/user/VMDetail.tsx`: Direct adaptation of theme server management tabs and layout.
- `client/src/pages/user/Console.tsx`: Direct adaptation of `resources/scripts/components/server/console/ServerConsoleContainer.tsx`.
- `client/src/pages/user/SSH.tsx`: Direct adaptation of theme console workspace for Web SSH.
- `client/src/pages/user/Profile.tsx`: Direct adaptation of `resources/scripts/components/dashboard/AccountOverviewContainer.tsx`.

---

## 2. Files Newly Created for KineticMesh Architecture

- `client/vite.config.ts`: Configured Vite to bundle client code directly into `public/dist/assets/`.
- `client/tsconfig.json`: TypeScript configuration for React 18 and Vite.
- `client/src/main.tsx`: Client mounting entrypoint binding to `#root`.
- `client/src/App.tsx`: Route synchronizer listening to browser `popstate` and routing between KineticMesh paths.
- `docs/theme-transplant-map.md`: Traceability mapping between theme sources and KineticMesh components.
- `docs/frontend-migration-audit.md`: This audit document.

---

## 3. Files Intentionally Omitted from Theme Source & Rationale

| Theme File / Directory | Reason for Omission |
|---|---|
| `app/Http/Controllers/*`, `app/Models/*`, `app/Services/*` | PHP backend code. KineticMesh uses Node.js / Express / SQLite; porting PHP backend logic is strictly forbidden. |
| `database/migrations/*` | Laravel database migrations. KineticMesh's SQLite database schema is locked. |
| `routes/web.php`, `routes/api.php` | Laravel routing definitions. KineticMesh Express routes are authoritative. |
| `resources/scripts/components/server/minecraft/*` | Minecraft-specific modules (datapacks, modpacks, worlds, player manager). KineticMesh is a general-purpose VPS control plane. |
| `resources/scripts/components/server/schedules/*` | Pterodactyl cron/schedule runner. KineticMesh does not have a backend task scheduler. |
| `resources/scripts/components/server/databases/*` | MySQL database provisioning system. KineticMesh does not provision managed databases. |

---

## 4. Backend Files Intentionally Untouched (Zero Changes)

- `app.js`: 100% locked. Zero route modifications, zero middleware changes, zero WebSocket changes.
- `package.json` (backend dependencies): No changes to backend packages.
- SQLite database & queries: Zero schema migrations, zero table alters.
- QEMU / KVM virtualization logic: Zero changes.
- SSH backend daemon: Zero changes.
- WebSocket `/console/:id` & `/ssh-terminal` server implementations: Zero changes.
