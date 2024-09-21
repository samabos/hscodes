import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { EnvVarWarning } from "@/components/env-var-warning";
import Link from "next/link";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
    <div className="flex flex-col flex-1">
          {/* Navigation */}
          <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="flex gap-4 ml-8 items-center text-xl font-bold text-nowrap"> <Link href={"/"}>AI PM</Link> </div>
            <div className="w-full flex justify-between items-center p-3 px-5 text-sm">
              <div className="flex gap-5 items-center font-semibold">
                {/* Add global navigation items here */}
              </div>
              {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
            </div>
          </nav>
          {/* Main content */}
          <main className="flex-1 w-full h-full">
            <div className="flex flex-col h-full justify-center items-center px-4 py-8">
                {children}
            </div>
        </main>
    </div>
      {/* Footer */}
      <footer className="w-full flex items-center justify-center border-t text-center text-xs gap-8 py-4">
                <p>
                  Powered by{" "}
                  <a
                    href="https://github.com/samabos"
                    target="_blank"
                    className="font-bold hover:underline"
                    rel="noreferrer"
                  >
                    mabos
                  </a>
                </p>
                <ThemeSwitcher />
      </footer>
    </>
   
  );
}
