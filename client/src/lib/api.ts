// Thin frontend API layer preserving exact KineticMesh contracts

export async function fetchApi<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    let errMsg = `Request failed: ${res.status} ${res.statusText}`;
    try {
      const data = await res.json();
      if (data.error) errMsg = data.error;
      else if (data.message) errMsg = data.message;
    } catch {
      // fallback
    }
    throw new Error(errMsg);
  }

  return res.json();
}

export const api = {
  // Auth
  checkAuth: () => fetchApi<{ authenticated: boolean; user?: { id: number; username: string; role: string } }>("/api/auth/check"),
  login: (body: { username: string; password: string }) =>
    fetchApi("/api/login", { method: "POST", body: JSON.stringify(body) }),
  logout: () => fetchApi("/api/logout", { method: "POST" }),
  getDiscordEnabled: () => fetchApi<{ enabled: boolean }>("/api/discord-enabled"),
  getDiscordAuthUrl: () => fetchApi<{ url: string }>("/api/discord-auth-url"),

  // User VMs
  getVMs: () => fetchApi<any[]>("/api/vms"),
  getVM: (id: string | number) => fetchApi<any>(`/api/vms/${id}`),
  getVMStats: (id: string | number) => fetchApi<any>(`/api/vms/${id}/stats`),
  startVM: (id: string | number) => fetchApi(`/api/vms/${id}/start`, { method: "POST" }),
  stopVM: (id: string | number, force = false) =>
    fetchApi(`/api/vms/${id}/stop`, { method: "POST", body: JSON.stringify({ force }) }),
  restartVM: (id: string | number) => fetchApi(`/api/vms/${id}/restart`, { method: "POST" }),
  deleteVM: (id: string | number) => fetchApi(`/api/vms/${id}`, { method: "DELETE" }),
  getVMLogs: (id: string | number) => fetchApi<any[]>(`/api/vms/${id}/logs`),
  getVMSnapshots: (id: string | number) => fetchApi<any[]>(`/api/vms/${id}/snapshots`),
  createVMSnapshot: (id: string | number, name: string) =>
    fetchApi(`/api/vms/${id}/snapshots`, { method: "POST", body: JSON.stringify({ name }) }),
  rollbackVMSnapshot: (id: string | number, name: string) =>
    fetchApi(`/api/vms/${id}/snapshots/${encodeURIComponent(name)}/rollback`, { method: "POST" }),

  // Hardware / Creation Presets
  getOSTemplates: () => fetchApi<any[]>("/api/os-templates"),
  getCPUModels: () => fetchApi<any>("/api/cpu-models"),
  getDNSProviders: () => fetchApi<any[]>("/api/dns-providers"),
  getISOList: () => fetchApi<any[]>("/api/iso-list"),
  attachISO: (id: string | number, iso_file: string) =>
    fetchApi(`/api/vms/${id}/iso/attach`, { method: "POST", body: JSON.stringify({ iso_file }) }),
  detachISO: (id: string | number) =>
    fetchApi(`/api/vms/${id}/iso/detach`, { method: "POST" }),

  // VM Management
  createVM: (data: any) => fetchApi("/api/vms", { method: "POST", body: JSON.stringify(data) }),
  updateVM: (id: string | number, data: any) =>
    fetchApi(`/api/vms/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  // User Profile
  getProfile: () => fetchApi<any>("/api/user/profile"),
  updateProfile: (data: any) => fetchApi("/api/user/profile", { method: "PUT", body: JSON.stringify(data) }),
  updatePassword: (data: any) => fetchApi("/api/user/password", { method: "PUT", body: JSON.stringify(data) }),
  getDiscordAccountInfo: () => fetchApi<any>("/api/discord-account-info"),

  // Admin APIs
  getAdminVMs: () => fetchApi<any[]>("/api/admin/vms"),
  getAdminStats: () => fetchApi<any>("/api/admin/system-stats"),
  getAdminUsers: () => fetchApi<any[]>("/api/admin/users"),
  createAdminUser: (data: any) => fetchApi("/api/admin/users", { method: "POST", body: JSON.stringify(data) }),
  updateAdminUser: (id: number, data: any) =>
    fetchApi(`/api/admin/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteAdminUser: (id: number) => fetchApi(`/api/admin/users/${id}`, { method: "DELETE" }),
  getAdminSettings: () => fetchApi<any>("/api/admin/settings"),
  updateAdminSettings: (data: any) =>
    fetchApi("/api/admin/settings", { method: "PUT", body: JSON.stringify(data) }),
  getDiscordSettings: () => fetchApi<any>("/api/admin/discord-settings"),
  updateDiscordSettings: (data: any) =>
    fetchApi("/api/admin/discord-settings", { method: "PUT", body: JSON.stringify(data) }),
  getAdminTemplates: () => fetchApi<any[]>("/api/admin/templates"),
  createAdminTemplate: (data: any) =>
    fetchApi("/api/admin/templates", { method: "POST", body: JSON.stringify(data) }),
  deleteAdminTemplate: (id: number) =>
    fetchApi(`/api/admin/templates/${id}`, { method: "DELETE" }),
  clearTemplateCache: () =>
    fetchApi("/api/admin/templates/cache/clear", { method: "POST" }),
};
