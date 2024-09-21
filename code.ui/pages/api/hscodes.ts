// pages/api/hscodes.ts
import { createClient } from '@/utils/supabase/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { HSCode, Prediction } from '@/models';

const supabase = createClient();


async function nav(req : NextApiRequest, res : NextApiResponse) {
    const { id, pid, level } = req.query;
    const query = supabase.from('hscodes').select('*').order('order', {ascending:true});
   
  if (id !== null && id !== undefined && id !== 'null') {
      query.eq('hs_id', id);
  }
  
  if (pid !== null && pid !== undefined && pid !== 'null') {
      query.eq('hs_parent_id', pid);
  }
  
  if (level) {
  query.eq('level', level);
  }
  
    const { data, error } = await query;
  
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data || []);
  }

async function navWithCode(req : NextApiRequest, res : NextApiResponse) {
  const { code } = req.query;
  const { data, error } = await supabase
    .from('hscodes')
    .select('*')
    .eq('code', code);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data || []);
}

async function search(req : NextApiRequest, res : NextApiResponse) {
  const { keyword } = req.query;
  const { data, error } = await supabase
    .from('hscodes')
    .select('*')
    .ilike('description', `%${keyword}%`);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data || []);
}

async function ask(req : NextApiRequest, res : NextApiResponse) {
  const { keyword } = req.body; // Use POST for RPC calls
  const { data, error } = await supabase.rpc('ask_hscode', { keyword });

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data || { hscode: [], prediction: [] });
}

async function get(req: NextApiRequest, res: NextApiResponse) {
    const { page, size, keyword } = req.query;
  
    // Check if required query parameters are provided
    if (typeof page !== 'string' || typeof size !== 'string' || typeof keyword !== 'string') {
      return res.status(400).json({ error: 'Invalid query parameters' });
    }
  
    // Convert page and size to numbers
    const pageNumber = parseInt(page, 10);
    const sizeNumber = parseInt(size, 10);
  
    const { data, error } = await supabase
      .from('hscodes')
      .select('*')
      .range((pageNumber - 1) * sizeNumber, pageNumber * sizeNumber - 1)
      .ilike('description', `%${keyword}%`);
  
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data || []);
  }

async function add(req : NextApiRequest, res : NextApiResponse) {
  const hsCode = req.body; // Expecting HSCode object in body
  const { data, error } = await supabase
    .from('hscodes')
    .insert([hsCode]);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json(data?.[0] || {});
}

async function update(req : NextApiRequest, res : NextApiResponse) {
  const hsCode = req.body; // Expecting HSCode object in body
  const { data, error } = await supabase
    .from('hscodes')
    .update(hsCode)
    .eq('id', hsCode.id);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data?.[0] || {});
}

async function deleteCode(req : NextApiRequest, res : NextApiResponse) {
  const { id } = req.query; // Expecting id as query parameter
  const { error } = await supabase
    .from('hscodes')
    .delete()
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(204).end(); // No content on successful delete
}

export default async function handler(req : NextApiRequest, res : NextApiResponse) {
  switch (req.method) {
    case 'GET':
      if (req.query.pid && req.query.level) {
        console.log(req);
        return nav(req, res);
      } else if (req.query.code) {
        return navWithCode(req, res);
      } else if (req.query.keyword) {
        return search(req, res);
      } else if (req.query.page && req.query.size && req.query.keyword) {
        return get(req, res);
      }
      return res.status(400).json({ error: 'Invalid query parameters' });
      
    case 'POST':
      if (req.body.keyword) {
        return ask(req, res);
      } else {
        return add(req, res);
      }
      
    case 'PUT':
      return update(req, res);
      
    case 'DELETE':
      return deleteCode(req, res);
      
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
