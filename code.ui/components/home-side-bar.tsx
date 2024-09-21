'use client'

import { useRouter } from 'next/router';
import Link from 'next/link';
import { usePathname } from 'next/navigation'



const HomeSidebar = () => {
  const pathname  = usePathname();

  return (
    <aside className="w-64 p-4">
    <h5 className="mb-8 lg:mb-3 font-semibold text-slate-900 dark:text-slate-200">Menu</h5>
          <nav className="flex flex-col space-y-6 lg:space-y-2 border-l border-slate-100 dark:border-slate-800">
          <Link href="/home" className={`block border-l pl-4 -ml-px border-transparent hover:border-slate-400 dark:hover:border-slate-500 ${pathname === '/home' ? 'border-slate-400 dark:border-sky-500 text-sky-500 dark:text-sky-300' : 'text-slate-700 dark:text-slate-400'}`}>
                Dashboard
            </Link>
            <Link href="/home/project/list" className={`block border-l pl-4 -ml-px border-transparent hover:border-slate-400 dark:hover:border-slate-500 ${ pathname?.startsWith('/home/project')? 'border-slate-400 dark:border-sky-500 text-sky-500 dark:text-sky-300' : 'text-slate-700 dark:text-slate-400'}`}>
                Projects
            </Link>
            <Link href="/home/account" className={`block border-l pl-4 -ml-px border-transparent hover:border-slate-400 dark:hover:border-slate-500 ${pathname === '/home/account' ? 'border-slate-400 dark:border-sky-500 text-sky-500 dark:text-sky-300' : 'text-slate-700 dark:text-slate-400'}`}>
                My profile
            </Link>
            
          </nav>
       </aside>
  );
};

export default HomeSidebar;
