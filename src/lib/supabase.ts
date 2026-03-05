import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Rencontre = {
  id: string;
  titre: string;
  description: string;
  date: string;
  lieu: string;
  created_at: string;
  updated_at: string;
};

export type Evenement = {
  id: string;
  titre: string;
  description: string;
  type: string;
  date: string;
  lieu: string;
  created_at: string;
  updated_at: string;
};

export type Collaboration = {
  id: string;
  titre: string;
  description: string;
  participants: string;
  created_at: string;
  updated_at: string;
};

export type Temoignage = {
  id: string;
  auteur: string;
  contenu: string;
  entreprise: string;
  created_at: string;
  updated_at: string;
};

export type CatalogueItem = {
  id: string;
  membre: string;
  entreprise: string;
  prestation: string;
  description: string;
  contact: string;
  created_at: string;
  updated_at: string;
};
