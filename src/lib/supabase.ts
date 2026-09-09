import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gqdgruvxwajyknhralvy.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_WpMnE_p9kHpHR0u9mOyaDQ_QyhyN3yP';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
