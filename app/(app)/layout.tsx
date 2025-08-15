"use client";

import type React from "react";

import { WithSidebar, AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, Plus } from "lucide-react";
import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <WithSidebar>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center gap-3 border-b px-4">
          <SidebarTrigger />
          <div className="ml-1 font-semibold">Community Manager</div>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden md:block">
              <Input placeholder="Pesquisar..." className="h-8 w-[220px]" />
            </div>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="gap-1 bg-transparent"
            >
              <Link href="/community/new">
                <Plus className="size-4" />
                {"Criar Comunidade"}
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Bell className="size-4" />
              <span className="sr-only">Notificações</span>
            </Button>
          </div>
        </header>
        <main className="p-4">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </SidebarInset>
    </WithSidebar>
  );
}
