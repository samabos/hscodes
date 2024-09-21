import { createClient } from '@/utils/supabase/server';
import { Trash2, Edit3Icon } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function ProjectsList() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: rows } = await supabase.from("projects").select();

  return (
    <div className="p-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Button
              asChild
              size="sm"
              variant={"secondary"}
              disabled
              className="opacity-75 "
            >
        <Link href="/home/project/manage/0">
          Add Project
        </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {rows && rows.length > 0 ? (
          rows.map((project: any) => (
            <div
              key={project.id}
              className="bg-white dark:bg-zinc-800 rounded-lg p-6 py-4 shadow-md hover:shadow-lg transition-shadow duration-300 relative"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-200">{project.name}</h2>
                {project.framework && (
                  <span className="bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {project.framework}
                  </span>
                )}
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-2">{project.description}</p>

              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                <span>Start: {new Date(project.start_date).toLocaleDateString()}</span>
                <span>End: {new Date(project.end_date).toLocaleDateString()}</span>
              </div>

              <div className="flex justify-between items-center">
                {/* Left Section */}
                <a
                  href={`/home/project/artefacts/${project.id}`}
                  className="text-slate-600 dark:text-slate-400 hover:text-sky-800 dark:hover:text-sky-500 font-semibold"
                >
                  Artefacts
                </a>
                
                {/* Right Section */}
                <div className="flex gap-4">
                  <Link href={`/home/project/manage/${project.id}`} className="text-grey-500 hover:text-grey-700">
                    <Edit3Icon size={20} />
                  </Link>
                  <button className="text-red-500 hover:text-red-700">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No projects found.</p>
        )}
      </div>
    </div>
  );
}
