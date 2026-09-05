# KineticMesh — Arix / Kroxy Theme Transplant Mapping

This document records the direct source-to-source mapping of components from the supplied Pterodactyl / Arix theme ZIP (`theme_ref/`) into KineticMesh.

---

## Component Architecture Mapping

| # | Source Theme File | Original Component | KineticMesh Equivalent | Target File | Functional Adaptation |
|---|---|---|---|---|---|
| 1 | `resources/views/templates/wrapper.blade.php` | Blade Theme Wrapper | EJS Presentation Shell | `views/**/*.ejs` | Translated Blade layout into EJS mounting shell with `#kx-boot` pulse loading screen, theme fonts, and CSS custom properties. |
| 2 | `public/themes/pterodactyl/css/arix.css` | Arix Global CSS | Design System Tokens | `client/src/index.css` | Full palette implementation: `--primary: #e5e5e6`, `--gray50` through `--gray900`, `--success*`, `--danger*`, `--secondary*`, `--radiusBox: 10px`, `--radiusInput: 7px`. |
| 3 | `resources/scripts/assets/css/GlobalStylesheet.ts` | Global Stylesheet | Theme Global Styles | `client/src/index.css` | Background radial gradients, card hover lift (`.rounded-box:hover`), staggered animations (`.kx-stagger`), and live status pulse (`.kx-live`). |
| 4 | `resources/scripts/components/SideBar.tsx` | SideBar (Preset 5) | Desktop Navigation | `client/src/components/theme/SideBar.tsx` | 264px fixed sidebar with rounded-2xl border, pill navigation links, active accent styling, logo `/arix/logo.png`, and user avatar account pill with dropdown. |
| 5 | `resources/scripts/components/NavigationBar.tsx` | Top Navigation Bar | Header Navigation | `client/src/components/theme/NavigationBar.tsx` | Compact top bar with VM selector, Discord link, Support link, and responsive mobile hamburger overlay. |
| 6 | `resources/scripts/components/Navigation.tsx` | Server SubNavigation | VM SubNavigation | `client/src/components/theme/SubNavigation.tsx` | Dedicated VM header bar with real-time status pill, copyable IP address, CPU/RAM/Disk stats, and power control actions. |
| 7 | `resources/scripts/components/dashboard/ServerCard.tsx` | ServerCard | VMCard | `client/src/components/theme/dashboard/VMCard.tsx` | Adapted server card into VMCard with `bg-gray-700 backdrop px-6 py-5 rounded-box`, live status, IP copy, resources, and "Manage VM" button. |
| 8 | `resources/scripts/components/dashboard/DashboardContainer.tsx` | DashboardContainer | User Dashboard | `client/src/pages/user/Dashboard.tsx` | Community banner cards (Discord, Support), fleet telemetry cards, search input, status filters, and responsive VM cards grid. |
| 9 | `resources/scripts/components/server/console/ServerConsoleContainer.tsx` | ServerConsoleContainer | VM Console Container | `client/src/pages/user/Console.tsx` | Combined serial terminal viewport with real-time StatGraphs and ServerDetailsBlock. |
| 10 | `resources/scripts/components/server/console/Console.tsx` | Console Terminal | QEMU Serial Console | `client/src/components/theme/server/Console.tsx` | Terminal window with monospace typography, auto-scroll toggle, clear output, and KineticMesh serial WebSocket integration (`/console/:id`). |
| 11 | `resources/scripts/components/server/console/PowerButtons.tsx` | PowerButtons | VM Power Controls | `client/src/components/theme/server/PowerButtons.tsx` | Start, Restart, and Stop/Kill buttons with confirmation dialog connected to `/api/vms/:id/{start,stop,restart}`. |
| 12 | `resources/scripts/components/server/console/StatGraphs.tsx` | StatGraphs | VM Telemetry Charts | `client/src/components/theme/server/StatGraphs.tsx` | Recharts-driven area charts for CPU utilization % and Memory MB/limit matching theme visual style. |
| 13 | `resources/scripts/components/server/console/ServerDetailsBlock.tsx` | ServerDetailsBlock | VM Metrics Cards | `client/src/components/theme/server/ServerDetailsBlock.tsx` | Three-card layout with prominent arix icon boxes displaying CPU, RAM, and Disk allocations. |
| 14 | `resources/scripts/components/auth/LoginContainer.tsx` & `LoginFormContainer.tsx` | Login Containers | Login View | `client/src/pages/auth/Login.tsx` | Fullscreen boxed login with `/arix/background-login.png`, radial overlay, logo, Field components, and Discord OAuth button. |
| 15 | `resources/scripts/components/auth/LoginFormContainer.tsx` | Boxed Form Container | Register View | `client/src/pages/auth/Register.tsx` | Account registration view with matching Arix boxed container and input fields. |
| 16 | `resources/scripts/components/dashboard/AccountOverviewContainer.tsx` | AccountOverviewContainer | Profile View | `client/src/pages/user/Profile.tsx` | Account header banner with gradient, UserAvatar, password update form, and tabbed SSH / API credentials section. |
| 17 | `resources/scripts/components/elements/button/Button.tsx` | Theme Button | Button | `client/src/components/theme/elements/Button.tsx` | Variant button system: `Button.Success`, `Button.Danger`, `Button.Text`, `Button.Primary`. |
| 18 | `resources/scripts/components/elements/dialog/index.tsx` | Dialog.Confirm | Confirmation Modal | `client/src/components/theme/elements/Dialog.tsx` | Modal dialog for power termination, VM deletion, and cache purging. |
| 19 | `resources/scripts/components/elements/CopyOnClick.tsx` | CopyOnClick | Copy to Clipboard | `client/src/components/theme/elements/CopyOnClick.tsx` | Click-to-copy utility with audio feedback (`/arix/copy.mp3`) and floating tooltip. |
| 20 | `resources/scripts/components/elements/Field.tsx` | Form Field | Form Field | `client/src/components/theme/elements/Field.tsx` | Form field composition with label, icon addon, input, and error messages. |
| 21 | `resources/scripts/components/elements/Input.tsx` | Form Input | Input | `client/src/components/theme/elements/Input.tsx` | Styled dark input with `rounded-component` and theme focus rings. |
| 22 | `resources/scripts/components/elements/Alert.tsx` | Alert Banner | Alert | `client/src/components/theme/elements/Alert.tsx` | Theme alert box with warning, error, info, and success variants. |
| 23 | `resources/scripts/components/elements/PageContentBlock.tsx` | PageContentBlock | Page Wrapper | `client/src/components/theme/elements/PageContentBlock.tsx` | Standardized page container with document title setter and KineticHost copyright footer. |
| 24 | `resources/scripts/components/elements/ServerContentBlock.tsx` | ServerContentBlock | Sub-page Header | `client/src/components/theme/elements/ServerContentBlock.tsx` | Header bar with icon badge and title. |
| 25 | `public/arix/*` | Theme Static Assets | Static Asset Bundle | `public/arix/*` | 28 transplanted files including logos, backgrounds, graphs, SVGs, and audio cues. |
