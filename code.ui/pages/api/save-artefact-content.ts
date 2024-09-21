// pages/api/save-artefact-content.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/utils/supabase/client';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { artefactName, content, projectId } = req.body;
    //console.log(req.body);
    const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  

    try {
      // Update the content in the database
      const { data, error } = await supabase
        .from('artefacts')
        .upsert({
            id: undefined,
             project_id: projectId, 
             artefact_name: artefactName, 
             artefact_text: content,
            user_id: user?.id });

      if (error) throw error;

      res.status(200).json({ message: 'Content saved successfully!' });
    } catch (error) {
        console.log(error);
      res.status(500).json({ error: 'Error saving content' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

export default handler;
