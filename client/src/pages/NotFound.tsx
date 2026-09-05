import * as React from "react";
import { Server, ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Empty } from "@/components/ui/empty";

export function NotFound() {
  return (
    <AppShell breadcrumbs={[{ label: "404 Not Found" }]}>
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <Empty
          icon={<Server className="h-6 w-6 text-muted-foreground" />}
          title="Endpoint Not Found"
          description="The requested page route or resource is not available on this KineticMesh hypervisor node."
          action={
            <Button
              onClick={() => (window.location.href = "/dashboard")}
              className="gap-1.5 text-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Return to Dashboard</span>
            </Button>
          }
        />
      </div>
    </AppShell>
  );
}
