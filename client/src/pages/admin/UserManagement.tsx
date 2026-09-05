import * as React from "react";
import {
  Users,
  UserPlus,
  Edit2,
  Trash2,
  Shield,
  Check,
  X,
  MoreVertical,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { DataTable, Column } from "@/components/ui/data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Empty } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { api } from "@/lib/api";

export function UserManagement() {
  const [users, setUsers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Create User Modal
  const [createOpen, setCreateOpen] = React.useState(false);
  const [newUsername, setNewUsername] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [newEmail, setNewEmail] = React.useState("");
  const [newRole, setNewRole] = React.useState("user");
  const [creating, setCreating] = React.useState(false);

  // Edit User Sheet
  const [editOpen, setEditOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<any>(null);
  const [editUsername, setEditUsername] = React.useState("");
  const [editEmail, setEditEmail] = React.useState("");
  const [editRole, setEditRole] = React.useState("user");
  const [editActive, setEditActive] = React.useState(true);
  const [editPassword, setEditPassword] = React.useState("");
  const [savingEdit, setSavingEdit] = React.useState(false);

  // Delete Dialog
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<any>(null);
  const [deleting, setDeleting] = React.useState(false);

  const loadUsers = async () => {
    try {
      const data = await api.getAdminUsers();
      setUsers(data || []);
    } catch (err: any) {
      toast({ title: "Failed to load users", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword) {
      toast({ title: "Username and password required", variant: "destructive" });
      return;
    }

    setCreating(true);
    try {
      await api.createAdminUser({
        username: newUsername,
        password: newPassword,
        email: newEmail,
        role: newRole,
      });
      toast({ title: "User Created Successfully", variant: "success" });
      setCreateOpen(false);
      setNewUsername("");
      setNewPassword("");
      setNewEmail("");
      loadUsers();
    } catch (err: any) {
      toast({ title: "Creation Failed", description: err.message, variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  const handleOpenEdit = (user: any) => {
    setEditingUser(user);
    setEditUsername(user.username || "");
    setEditEmail(user.email || "");
    setEditRole(user.role || "user");
    setEditActive(user.is_active !== 0);
    setEditPassword("");
    setEditOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setSavingEdit(true);
    try {
      await api.updateAdminUser(editingUser.id, {
        username: editUsername,
        email: editEmail,
        role: editRole,
        is_active: editActive ? 1 : 0,
        password: editPassword || undefined,
      });
      toast({ title: "User Updated Successfully", variant: "success" });
      setEditOpen(false);
      loadUsers();
    } catch (err: any) {
      toast({ title: "Update Failed", description: err.message, variant: "destructive" });
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      await api.deleteAdminUser(userToDelete.id);
      toast({ title: "User Deleted", variant: "success" });
      setDeleteOpen(false);
      setUserToDelete(null);
      loadUsers();
    } catch (err: any) {
      toast({ title: "Delete Failed", description: err.message, variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<any>[] = [
    {
      key: "user",
      header: "User Account",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar className="h-7 w-7">
            {row.discord_avatar ? (
              <AvatarImage src={`https://cdn.discordapp.com/avatars/${row.discord_id}/${row.discord_avatar}.png`} />
            ) : (
              <AvatarFallback className="text-[10px]">
                {row.username?.substring(0, 2).toUpperCase() || "US"}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-xs text-foreground truncate">{row.username}</span>
            <span className="text-[10px] text-muted-foreground font-mono">
              ID: {row.id} • {row.email || "No email"}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      sortable: true,
      render: (row) => (
        <Badge variant={row.role === "admin" ? "default" : "secondary"}>
          {row.role?.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge variant={row.is_active !== 0 ? "success" : "stopped"}>
          {row.is_active !== 0 ? "Active" : "Suspended"}
        </Badge>
      ),
    },
    {
      key: "last_login",
      header: "Last Activity",
      render: (row) => (
        <span className="text-[11px] text-muted-foreground font-mono">
          {row.last_login ? new Date(row.last_login).toLocaleDateString() : "Never"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => handleOpenEdit(row)}
            className="h-7 w-7"
          >
            <Edit2 className="h-3 w-3" />
            <span className="sr-only">Edit</span>
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              setUserToDelete(row);
              setDeleteOpen(true);
            }}
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AppShell breadcrumbs={[{ label: "User Management" }]}>
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Header with Title and Create Action */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              User Accounts
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage platform authentication, permissions, and tenant roles.
            </p>
          </div>

          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5 text-xs">
                <UserPlus className="h-3.5 w-3.5" />
                <span>Create User</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New User Account</DialogTitle>
                <DialogDescription>
                  Provision credentials and allocate permissions for a new tenant.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleCreate} className="space-y-3 pt-2">
                <Field label="Username" required>
                  <Input
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="tenant_admin"
                    className="h-8 text-xs font-mono"
                  />
                </Field>

                <Field label="Password" required>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-8 text-xs font-mono"
                  />
                </Field>

                <Field label="Email Address">
                  <Input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="tenant@domain.local"
                    className="h-8 text-xs"
                  />
                </Field>

                <Field label="Role">
                  <Select value={newRole} onValueChange={setNewRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User (Standard Tenant)</SelectItem>
                      <SelectItem value="admin">Administrator (Full Access)</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <DialogFooter className="pt-2">
                  <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={creating}>
                    {creating ? "Creating..." : "Create Account"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Data Table */}
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <Empty
            title="No Users Registered"
            description="There are no user accounts currently registered in the database."
          />
        ) : (
          <DataTable
            data={users}
            columns={columns}
            filterKey="username"
            filterPlaceholder="Filter users by name..."
          />
        )}

        {/* Edit User Sheet */}
        <Sheet open={editOpen} onOpenChange={setEditOpen}>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Edit User #{editingUser?.id}</SheetTitle>
              <SheetDescription>
                Modify permissions, email contact, and status flag
              </SheetDescription>
            </SheetHeader>

            <form onSubmit={handleSaveEdit} className="space-y-4 pt-4">
              <Field label="Username">
                <Input
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </Field>

              <Field label="Email Address">
                <Input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="h-8 text-xs"
                />
              </Field>

              <Field label="Reset Password (Optional)">
                <Input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Leave blank to keep existing"
                  className="h-8 text-xs font-mono"
                />
              </Field>

              <Field label="Role">
                <Select value={editRole} onValueChange={setEditRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="active_check"
                  checked={editActive}
                  onCheckedChange={(c) => setEditActive(!!c)}
                />
                <Label htmlFor="active_check" className="cursor-pointer text-xs">
                  Active Account (Uncheck to suspend)
                </Label>
              </div>

              <SheetFooter className="pt-4">
                <Button type="submit" disabled={savingEdit} className="w-full">
                  {savingEdit ? "Saving..." : "Save Changes"}
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>

        {/* Delete Confirmation Alert Dialog */}
        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete User Account</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to permanently delete user{" "}
                <span className="font-semibold text-foreground">{userToDelete?.username}</span>?
                This action is irreversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={deleting}>
                {deleting ? "Deleting..." : "Delete User"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppShell>
  );
}
