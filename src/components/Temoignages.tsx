import { useState, useEffect } from 'react';
import { supabase, Temoignage } from '../lib/supabase';
import { MessageSquare, Plus, CreditCard as Edit2, Trash2, Building2 } from 'lucide-react';

export default function Temoignages() {
  const [temoignages, setTemoignages] = useState<Temoignage[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    auteur: '',
    contenu: '',
    entreprise: '',
  });

  useEffect(() => {
    loadTemoignages();
  }, []);

  const loadTemoignages = async () => {
    const { data, error } = await supabase
      .from('temoignages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur:', error);
    } else {
      setTemoignages(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      const { error } = await supabase
        .from('temoignages')
        .update({ ...formData, updated_at: new Date().toISOString() })
        .eq('id', editingId);

      if (error) console.error('Erreur:', error);
    } else {
      const { error } = await supabase
        .from('temoignages')
        .insert([formData]);

      if (error) console.error('Erreur:', error);
    }

    setFormData({ auteur: '', contenu: '', entreprise: '' });
    setIsAdding(false);
    setEditingId(null);
    loadTemoignages();
  };

  const handleEdit = (temoignage: Temoignage) => {
    setFormData({
      auteur: temoignage.auteur,
      contenu: temoignage.contenu,
      entreprise: temoignage.entreprise,
    });
    setEditingId(temoignage.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ?')) {
      const { error } = await supabase
        .from('temoignages')
        .delete()
        .eq('id', id);

      if (error) console.error('Erreur:', error);
      loadTemoignages();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Témoignages</h2>
        <button
          onClick={() => {
            setIsAdding(!isAdding);
            setEditingId(null);
            setFormData({ auteur: '', contenu: '', entreprise: '' });
          }}
          className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
        >
          <Plus size={20} />
          Ajouter
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Modifier le témoignage' : 'Nouveau témoignage'}
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Auteur"
              value={formData.auteur}
              onChange={(e) => setFormData({ ...formData, auteur: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Entreprise (optionnel)"
              value={formData.entreprise}
              onChange={(e) => setFormData({ ...formData, entreprise: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <textarea
              placeholder="Témoignage"
              value={formData.contenu}
              onChange={(e) => setFormData({ ...formData, contenu: e.target.value })}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition"
              >
                {editingId ? 'Mettre à jour' : 'Ajouter'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  setFormData({ auteur: '', contenu: '', entreprise: '' });
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Annuler
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {temoignages.map((temoignage) => (
          <div key={temoignage.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-4">
              <MessageSquare className="text-teal-600" size={24} />
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(temoignage)}
                  className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(temoignage.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <p className="text-gray-700 italic mb-4 leading-relaxed">"{temoignage.contenu}"</p>
            <div className="border-t pt-3">
              <p className="font-semibold text-gray-800">{temoignage.auteur}</p>
              {temoignage.entreprise && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <Building2 size={14} />
                  <span>{temoignage.entreprise}</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {temoignages.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            Aucun témoignage pour le moment.
          </div>
        )}
      </div>
    </div>
  );
}
