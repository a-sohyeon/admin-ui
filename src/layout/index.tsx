import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CustomSidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";
interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  return (
    <>
      <SidebarProvider>
        <CustomSidebar />
        <Header />
        <div className="pt-[var(--header-height)] w-full px-[5.6rem] pb-[1.6rem] flex">
          <main>{children}</main>
        </div>
        <Toaster />
      </SidebarProvider>
    </>
  );
};
