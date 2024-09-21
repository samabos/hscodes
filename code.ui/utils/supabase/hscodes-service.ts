import { createClient } from '@/utils/supabase/client';  // Import your client creation logic
import { HSCode, Prediction } from '@/models';

const supabase = createClient();

class HSCodeService {
  // Retrieve HSCode based on pid and level
  async nav(req: { pid: number; level: number }): Promise<HSCode[]> {
    const { data, error } = await supabase
      .from('hscodes')
      .select('*')
      .eq('hs_parent_id', req.pid)
      .eq('level', req.level);

    if (error) throw new Error(`Error fetching HSCode data: ${error.message}`);
    return data || [];
  }

  // Retrieve HSCode based on code
  async navWithCode(req: { code: string }): Promise<HSCode[]> {
    const { data, error } = await supabase
      .from('hscodes')
      .select('*')
      .eq('Code', req.code);

    if (error) throw new Error(`Error fetching HSCode by code: ${error.message}`);
    return data || [];
  }

  // Search HSCode by keyword
  async search(req: { keyword: string }): Promise<HSCode[]> {
    const { data, error } = await supabase
      .from('hscodes')
      .select('*')
      .ilike('description', `%${req.keyword}%`);  // Use 'Description' or the actual column name

    if (error) throw new Error(`Error searching HSCode: ${error.message}`);
    return data || [];
  }

  // RPC call to a custom function in Supabase to handle HSCode predictions
  async ask(req: string): Promise<{ hscode: HSCode[]; prediction: Prediction[] }> {
    const { data, error } = await supabase.rpc('ask_hscode', { keyword: req });

    if (error) throw new Error(`Error calling RPC function 'ask_hscode': ${error.message}`);
    return data || { hscode: [], prediction: [] };
  }

  // Get paginated HSCodes with a keyword filter
  async get(params: { page: number; size: number; keyword: string }): Promise<HSCode[]> {
    const { data, error } = await supabase
      .from('hscodes')
      .select('*')
      .range((params.page - 1) * params.size, params.page * params.size - 1)  // Pagination logic
      .ilike('description', `%${params.keyword}%`);

    if (error) throw new Error(`Error fetching paginated HSCode: ${error.message}`);
    return data || [];
  }

  // Insert a new HSCode
  async add(req: HSCode): Promise<HSCode> {
    const { data, error } = await supabase
      .from('hscodes')
      .insert([req]);

    if (error) throw new Error(`Error adding HSCode: ${error.message}`);
    return data?.[0] || ({} as HSCode);
  }

  // Update an existing HSCode
  async update(req: HSCode): Promise<HSCode> {
    const { data, error } = await supabase
      .from('hscodes')
      .update(req)
      .eq('id', req.id);

    if (error) throw new Error(`Error updating HSCode: ${error.message}`);
    return data?.[0] || ({} as HSCode);
  }

  // Delete an HSCode by id
  async delete(req: { id: number }): Promise<void> {
    const { error } = await supabase
      .from('hscodes')
      .delete()
      .eq('id', req.id);

    if (error) throw new Error(`Error deleting HSCode: ${error.message}`);
  }
}

export default new HSCodeService();
