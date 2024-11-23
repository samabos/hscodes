'use client';

import { useEffect, useState, use } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ArtefactsPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const supabase = createClient();
  const { id } = params;



  const [projectName, setProjectName] = useState<string | null>(null);
  const [projectSector, setProjectSector] = useState<string | null>(null);
  const [projectFramework, setProjectFramework] = useState<string | null>(null);
  const [selectedArtefact, setSelectedArtefact] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');

  // Default list of artefacts
  const defaultArtefacts = ["PID", "Business Case", "Project Plan", "Risk Register"];
  const [artefacts, setArtefacts] = useState<{ id: number, artefact_name: string, artefact_text: string }[]>([]);

  useEffect(() => {
    // Fetch the project details
    async function fetchProject() {
      const { data: project, error } = await supabase
        .from('projects')
        .select('name, description, sector, framework')
        .eq('id', id)
        .single();
        
      if (project) {
        setProjectName(project.name);
        setPrompt(project.description || '');
        setProjectSector(project.sector || '');
        setProjectFramework(project.framework || '');
      }
      if (error) console.error('Error fetching project:', error);
    }

    // Fetch artefacts
    async function fetchProjectArtefacts() {
      const { data: fetchedArtefacts, error } = await supabase
        .from('artefacts')
        .select('id, artefact_name, artefact_text')
        .eq('project_id', id);
        
      if (fetchedArtefacts && fetchedArtefacts.length > 0) {
        setArtefacts(fetchedArtefacts);
      } else {
        setArtefacts(defaultArtefacts.map(name => ({ id: 0, artefact_name: name, artefact_text: '' })));
      }
      
      // Set content for the initially selected artefact if any
      if (selectedArtefact) {
        const artefact = fetchedArtefacts?.find(a => a.artefact_name === selectedArtefact);
        if (artefact) {
          setContent(artefact.artefact_text);
        }
      }
      
      if (error) console.error('Error fetching project artefacts:', error);
    }

    fetchProject();
    fetchProjectArtefacts();
  }, [id, supabase]);

  useEffect(() => {
    if (selectedArtefact) {
      const artefact = artefacts.find(a => a.artefact_name === selectedArtefact);
      if (artefact) {
        setContent(artefact.artefact_text);
      } else {
        setContent(''); // Clear content if no artefact found
      }
    }
  }, [selectedArtefact, artefacts]);

  const handleGenerateContent = async () => {
    // Mock API call to generate AI content based on selected artefact and prompt
    const generatedContent = await fetch('/api/generate-content', {
      method: 'POST',
      body: JSON.stringify({
        artefact: selectedArtefact,
        prompt: prompt,
        sector: projectSector,
        framework: projectFramework
      }),
    }).then(res => res.json());
    
    setContent(generatedContent.content);
  };

  const handleSaveContent = async () => {
    // Save generated content to the database
    await fetch('/api/save-artefact-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        artefactName: selectedArtefact,
        content: content,
        projectId: id,
      }),
    }).then(res => res.json())
      .then(data => {
        alert(data.message || 'Content saved successfully!');
      })
      .catch(err => {
        console.error('Error saving content:', err);
      });
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(content)
      .then(() => {
        alert('Content copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy content:', err);
      });
  };

  return (
    <div className="flex">
      {/* Left Sidebar: Artefact List */}
      <div className="w-1/4 border-gray-100 dark:border-zinc-800 p-0 rounded-md">
        <h2 className="text-xl font-semibold mb-4">{projectName} - Artefacts</h2>
        <ul className="flex flex-col space-y-6 lg:space-y-2 border-l border-slate-100 dark:border-slate-800">
          {artefacts.length > 0 ? artefacts.map(artefact => (
            <li key={artefact.artefact_name}>
              <button
                className={`block border-l pl-4 -ml-px border-transparent hover:border-slate-400 dark:hover:border-slate-500 ${selectedArtefact === artefact.artefact_name ? 'border-slate-400 dark:border-sky-500 text-sky-500 dark:text-sky-300' : 'text-slate-700 dark:text-slate-400'}`}
                onClick={() => setSelectedArtefact(artefact.artefact_name)}
              >
                {artefact.artefact_name}
              </button>
            </li>
          )) : defaultArtefacts.map(name => (
            <li key={name}>
              <button
                className={`block border-l pl-4 -ml-px border-transparent hover:border-slate-400 dark:hover:border-slate-500 ${selectedArtefact === name ? 'border-slate-400 dark:border-sky-500 text-sky-500 dark:text-sky-300' : 'text-slate-700 dark:text-slate-400'}`}
                onClick={() => setSelectedArtefact(name)}
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Right Content Area: Markdown Viewer */}
      <div className="w-3/4 p-4 bg-white dark:bg-zinc-900 text-gray dark:text-gray-300">
        {selectedArtefact ? (
          <>
            <h2 className="text-xl font-bold mb-4">{selectedArtefact}</h2>
            
            {/* Prompt Box */}
            <div className="mb-4">
              <label htmlFor="prompt" className="block text-sm font-medium mb-2">
                AI Prompt:
              </label>
              <input
                id="prompt"
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full p-2 mb-4 border rounded-md dark:bg-zinc-800"
                placeholder={`Enter a prompt to adjust the ${selectedArtefact}`}
              />
              <Button
                size="sm"
                variant={"default"}
                className="opacity-75"
                onClick={handleGenerateContent}
              >
                Generate Content
              </Button>
            </div>
            
            {/* Markdown Viewer */}
            <div className="markdown-body min-h-94 p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700 mb-4">
              <ReactMarkdown className={'min-h-94'}
                children={content}
                remarkPlugins={[remarkGfm]}
              />
            </div>
            
            {/* Copy to Clipboard Button */}
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyToClipboard}
            >
              Copy to Clipboard
            </Button>
            
            {/* Save Content Button 
            <Button
              size="sm"
              variant="default"
              onClick={handleSaveContent}
              className="ml-4"
            >
              Save Content
            </Button>*/}
            
            {/* Markdown Editor */}
            <h4 className="font-semibold mb-2 mt-8">Markdown Script</h4>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-[200px] p-4 border rounded-md dark:bg-zinc-800"
              placeholder={`Generated content for ${selectedArtefact}`}
            />
          </>
        ) : (
          <p>Select an artefact from the left to start editing.</p>
        )}
      </div>
    </div>
  );
}
