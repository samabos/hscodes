import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
  <h1 className="text-2xl font-semibold">Project Overview</h1>
  <p className="mt-4 text-gray-600">
    Welcome to our project management application. This platform is designed to help teams efficiently manage their projects from start to finish. 
    Our tool features a dynamic and responsive layout, ensuring a seamless user experience across all devices.
  </p>
  <p className="text-gray-600">
    The application includes a sidebar that provides quick access to various sections, including project artefacts, management tools, and settings. 
    The sidebar can be toggled to open or close, dynamically adjusting the width of the main content area. This layout is designed to maximize screen real estate while keeping essential navigation options readily accessible.
  </p>
  <p className="text-gray-600">
    In the main content area, users can view and interact with project details, manage tasks, and review artefacts. The interface is intuitive and user-friendly, making it easy to track progress and collaborate with team members.
  </p>
  <p className="text-gray-600">
    Whether you are working on a small team project or managing multiple large-scale initiatives, our application provides the tools and flexibility you need to stay organized and achieve your goals efficiently.
  </p>
</div>

  );
}
