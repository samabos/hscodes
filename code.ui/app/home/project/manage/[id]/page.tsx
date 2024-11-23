import ProjectForm from '../project-form';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function ManageProject(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const supabase = createClient();
    const { id } = params;

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/sign-in');
    }

    return <ProjectForm id={parseInt(id, 10)} />;
}
