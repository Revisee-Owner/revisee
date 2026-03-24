"use client";

import { useSession } from "next-auth/react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  return (
    <div className="flex min-h-screen">
      <Sidebar plan="FREE" />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          userName={session?.user?.name || "Student"}
          userImage={session?.user?.image || undefined}
        />
        <main className="flex-1 px-4 lg:px-8 py-6">{children}</main>
      </div>
    </div>
  );
}
