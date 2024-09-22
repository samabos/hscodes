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
    <div className="flex flex-col flex-1 dark:bg-gray-800 ">
          {/* Navigation */}
          <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="flex gap-2 ml-8 items-center text-xl font-bold whitespace-nowrap">
              <Link href={"/"} className="flex items-center">
                  <img src="/images/large-logo.svg" className="w-10" alt="logo" />
                  <span className="ml-2">hs.codes</span>
              </Link>
          </div>

            <div className="w-full flex justify-between items-center p-3 px-5 text-sm">
              <div className="flex gap-5 items-center font-semibold">
                {/* Add global navigation items here */}
              </div>
              {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
            </div>
          </nav>
          {/* Main content */}
          <main className="flex-1 w-full h-full">
            <div className="flex flex-col h-full justify-center items-center">
                {children}
            </div>
        </main>
    </div>
      {/* Footer */}
      <footer className="dark:bg-gray-800 w-full flex items-center justify-center border-t text-center text-xs gap-8 py-4 border-t border-t-foreground/10 h-16">
                <p>
                  Powered by{" "}
                  <a
                    href={"/"}
                    className="font-bold hover:underline"
                    rel="noreferrer"
                  >
                    hs.codes
                  </a>
                </p>
                <ThemeSwitcher />
      </footer>
    </>
   
  );
}
