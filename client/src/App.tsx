import * as React from "react";
import { Login } from "@/pages/auth/Login";
import { Dashboard } from "@/pages/user/Dashboard";
import { VMList } from "@/pages/user/VMList";
import { VMDetail } from "@/pages/user/VMDetail";
import { Console } from "@/pages/user/Console";
import { SSH } from "@/pages/user/SSH";
import { Profile } from "@/pages/user/Profile";
import { AdminDashboard } from "@/pages/admin/Dashboard";
import { VMCreate } from "@/pages/admin/VMCreate";
import { VMEdit } from "@/pages/admin/VMEdit";
import { UserManagement } from "@/pages/admin/UserManagement";
import { TemplateManagement } from "@/pages/admin/TemplateManagement";
import { Settings } from "@/pages/admin/Settings";
import { NotFound } from "@/pages/NotFound";

export function App() {
  const [pathname, setPathname] = React.useState(window.location.pathname);

  React.useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Route matching against actual KineticMesh routes
  if (pathname === "/login" || pathname === "/") {
    return <Login />;
  }

  if (pathname === "/dashboard") {
    return <Dashboard />;
  }

  if (pathname === "/vms") {
    return <VMList isAdmin={false} />;
  }

  // /vm/:id/console
  const consoleMatch = pathname.match(/^\/vm\/([^/]+)\/console$/);
  if (consoleMatch) {
    return <Console vmId={consoleMatch[1]} />;
  }

  // /admin/vm/:id/console
  const adminConsoleMatch = pathname.match(/^\/admin\/vm\/([^/]+)\/console$/);
  if (adminConsoleMatch) {
    return <Console vmId={adminConsoleMatch[1]} />;
  }

  // /vm/:id/ssh
  const sshMatch = pathname.match(/^\/vm\/([^/]+)\/ssh$/);
  if (sshMatch) {
    return <SSH vmId={sshMatch[1]} />;
  }

  // /admin/vm/:id/ssh
  const adminSshMatch = pathname.match(/^\/admin\/vm\/([^/]+)\/ssh$/);
  if (adminSshMatch) {
    return <SSH vmId={adminSshMatch[1]} />;
  }

  // /admin/vm/:id/edit
  const adminEditMatch = pathname.match(/^\/admin\/vm\/([^/]+)\/edit$/);
  if (adminEditMatch) {
    return <VMEdit vmId={adminEditMatch[1]} />;
  }

  // /vm/:id
  const vmDetailMatch = pathname.match(/^\/vm\/([^/]+)$/);
  if (vmDetailMatch) {
    return <VMDetail vmId={vmDetailMatch[1]} />;
  }

  // /admin/vm/:id
  const adminVmDetailMatch = pathname.match(/^\/admin\/vm\/([^/]+)$/);
  if (adminVmDetailMatch) {
    return <VMDetail vmId={adminVmDetailMatch[1]} />;
  }

  if (pathname === "/profile") {
    return <Profile />;
  }

  // Admin Routes
  if (pathname === "/admin/dashboard") {
    return <AdminDashboard />;
  }

  if (pathname === "/admin/vms") {
    return <VMList isAdmin={true} />;
  }

  if (pathname === "/admin/vm-create") {
    return <VMCreate />;
  }

  if (pathname.startsWith("/admin/users")) {
    return <UserManagement />;
  }

  if (pathname.startsWith("/admin/templates")) {
    return <TemplateManagement />;
  }

  if (pathname === "/admin/settings") {
    return <Settings />;
  }

  return <NotFound />;
}

export default App;
