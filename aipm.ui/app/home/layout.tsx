import { ReactNode } from 'react';
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import Link from 'next/link';
import HomeSidebar from '@/components/home-side-bar';

export default function HomeLayout({ children }: { children: ReactNode }) {

  return (
    <div className="flex">
      <input
        type="checkbox"
        id="drawer-toggle"
        className="sr-only peer"
        defaultChecked
      />
      <label
        htmlFor="drawer-toggle"
        className="fixed top-2 left-0 z-30 inline-block p-3 transition-all duration-500 bg-none rounded-lg peer-checked:rotate-180"
      >
        <PanelLeftOpen size={22} className="text-muted-foreground" />
      </label>

      {/* Sidebar and main content */}
      <div className="fixed top-0 left-0 z-20 w-64 h-full bg-slate dark:bg-zinc-950
      transition-transform duration-200 bg-grey-300 transform -translate-x-full shadow-lg peer-checked:translate-x-0">
        <div className="px-0 py-16">
          {/* Sidebar content */}
            <HomeSidebar />
           
        </div>
      </div>

      <div className="flex-1 transition-all duration-500 peer-checked:ml-64 bg-slate dark:bg-zinc-900">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
            <div className="flex gap-4 ml-10 items-center text-xl font-bold text-nowrap"> <Link href={"/"}>AI PM</Link> </div>
              <div className="w-full flex justify-between items-center p-2 text-sm">
                <div className="flex gap-5 items-center font-semibold">
                  {/* Add global navigation items here */}
                </div>
                <ThemeSwitcher/>
                {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
              </div>
          </nav>
        {/* Main content */}
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
