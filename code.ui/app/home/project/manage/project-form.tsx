'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from "@/components/ui/button";

interface ProjectFormProps {
  id: number | null; // Handle both new (null) and edit (number) cases
}

export default function ProjectForm({ id }: ProjectFormProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState<string | ''>('');
  const [description, setDescription] = useState<string | ''>('');
  const [startDate, setStartDate] = useState<string | ''>('');
  const [endDate, setEndDate] = useState<string | ''>('');
  const [framework, setFramework] = useState<string | ''>('');
  const [methodology, setMethodology] = useState<string | ''>('');
  const [sector, setSector] = useState<string | ''>('');

  const getProject = useCallback(async () => {
    if (id === null) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('projects')
        .select('id, name, description, starts_at, ends_at, framework, methodology, sector')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setName(data.name || '');
        setDescription(data.description || '');
        setStartDate(data.starts_at || '');
        setEndDate(data.ends_at || '');
        setFramework(data.framework || '');
        setMethodology(data.methodology || '');
        setSector(data.sector || '');
      }
    } catch (error) {
      alert('Error loading project data!');
    } finally {
      setLoading(false);
    }
  }, [id, supabase]);

  useEffect(() => {
    if (id) {
      getProject();
    } else {
      // Reset the form for creating a new project
      setName('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setFramework('');
      setMethodology('');
      setSector('');
      setLoading(false);
    }
  }, [id, getProject]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      setLoading(true);

      const { error } = await supabase.from('projects').upsert({
        id: id || undefined, // Use id if present; otherwise, let Supabase handle insertion
        name,
        description,
        starts_at: startDate,
        ends_at: endDate,
        framework,
        methodology,
        sector
      });

      if (error) throw error;

      alert('Project saved!');
    } catch (error) {
      alert('Error saving the project!');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className='md:max-w-2xl'>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Project Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-zinc-900 dark:border-zinc-700"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-zinc-900 dark:border-zinc-700"
          />
        </div>
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-zinc-900 dark:border-zinc-700"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-zinc-900 dark:border-zinc-700"
          />
        </div>
        <div>
          <label htmlFor="sector" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Sector (Health, ICT, Construction, etc)
          </label>
          <input
            type="text"
            id="sector"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-zinc-900 dark:border-zinc-700"
          />
        </div>
        <div>
          <label htmlFor="framework" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Framework (prince2, PMP)
          </label>
          <input
            type="text"
            id="framework"
            value={framework}
            onChange={(e) => setFramework(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-zinc-900 dark:border-zinc-700"
          />
        </div>
        <div>
          <label htmlFor="methodology" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Methodology (agile, agile-scrumb, agile-kanban, waterfall)
          </label>
          <input
            type="text"
            id="methodology"
            value={methodology}
            onChange={(e) => setMethodology(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-zinc-900 dark:border-zinc-700"
          />
        </div>
        <Button
              size="sm"
              variant={"default"}
              type="submit"
            ><text>{id ? 'Update Project' : 'Add Project'}</text>
          </Button>
      </form>
    </div>
  );
}
