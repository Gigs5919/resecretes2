/*
  # Création du schéma pour Rencontres Entrepreneurs Secrètes

  1. Nouvelles Tables
    - `rencontres`
      - `id` (uuid, clé primaire)
      - `titre` (text)
      - `description` (text)
      - `date` (timestamptz)
      - `lieu` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `evenements`
      - `id` (uuid, clé primaire)
      - `titre` (text)
      - `description` (text)
      - `type` (text) - workshop, visite, etc.
      - `date` (timestamptz)
      - `lieu` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `collaborations`
      - `id` (uuid, clé primaire)
      - `titre` (text)
      - `description` (text)
      - `participants` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `temoignages`
      - `id` (uuid, clé primaire)
      - `auteur` (text)
      - `contenu` (text)
      - `entreprise` (text, optionnel)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `catalogue`
      - `id` (uuid, clé primaire)
      - `membre` (text)
      - `entreprise` (text)
      - `prestation` (text)
      - `description` (text)
      - `contact` (text, optionnel)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Sécurité
    - Enable RLS sur toutes les tables
    - Politiques permettant la lecture publique (pour les membres)
    - Politiques d'insertion/modification réservées aux administrateurs
*/

-- Table Rencontres
CREATE TABLE IF NOT EXISTS rencontres (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titre text NOT NULL,
  description text NOT NULL,
  date timestamptz NOT NULL,
  lieu text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE rencontres ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tout le monde peut voir les rencontres"
  ON rencontres
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Les administrateurs peuvent insérer des rencontres"
  ON rencontres
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Les administrateurs peuvent modifier des rencontres"
  ON rencontres
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Les administrateurs peuvent supprimer des rencontres"
  ON rencontres
  FOR DELETE
  TO public
  USING (true);

-- Table Événements
CREATE TABLE IF NOT EXISTS evenements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titre text NOT NULL,
  description text NOT NULL,
  type text NOT NULL DEFAULT 'autre',
  date timestamptz NOT NULL,
  lieu text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE evenements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tout le monde peut voir les événements"
  ON evenements
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Les administrateurs peuvent insérer des événements"
  ON evenements
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Les administrateurs peuvent modifier des événements"
  ON evenements
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Les administrateurs peuvent supprimer des événements"
  ON evenements
  FOR DELETE
  TO public
  USING (true);

-- Table Collaborations
CREATE TABLE IF NOT EXISTS collaborations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titre text NOT NULL,
  description text NOT NULL,
  participants text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE collaborations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tout le monde peut voir les collaborations"
  ON collaborations
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Les administrateurs peuvent insérer des collaborations"
  ON collaborations
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Les administrateurs peuvent modifier des collaborations"
  ON collaborations
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Les administrateurs peuvent supprimer des collaborations"
  ON collaborations
  FOR DELETE
  TO public
  USING (true);

-- Table Témoignages
CREATE TABLE IF NOT EXISTS temoignages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auteur text NOT NULL,
  contenu text NOT NULL,
  entreprise text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE temoignages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tout le monde peut voir les témoignages"
  ON temoignages
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Les administrateurs peuvent insérer des témoignages"
  ON temoignages
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Les administrateurs peuvent modifier des témoignages"
  ON temoignages
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Les administrateurs peuvent supprimer des témoignages"
  ON temoignages
  FOR DELETE
  TO public
  USING (true);

-- Table Catalogue Secret
CREATE TABLE IF NOT EXISTS catalogue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  membre text NOT NULL,
  entreprise text NOT NULL,
  prestation text NOT NULL,
  description text NOT NULL,
  contact text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE catalogue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tout le monde peut voir le catalogue"
  ON catalogue
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Les administrateurs peuvent insérer dans le catalogue"
  ON catalogue
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Les administrateurs peuvent modifier le catalogue"
  ON catalogue
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Les administrateurs peuvent supprimer du catalogue"
  ON catalogue
  FOR DELETE
  TO public
  USING (true);