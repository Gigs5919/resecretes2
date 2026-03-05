import { useState, useEffect } from 'react';
import { supabase, CatalogueItem } from '../lib/supabase';
import { Briefcase, Plus, CreditCard as Edit2, Trash2, Building2, Mail } from 'lucide-react';

export default function CatalogueSecret() {
  const [items, setItems] = useState<CatalogueItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    membre: '',
    entreprise: '',
    prestation: '',
    description: '',
    contact: '',
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const { data, error } = await supabase
      .from('catalogue')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur:', error);
    } else {
      setItems(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      const { error } = await supabase
        .from('catalogue')
        .update({ ...formData, updated_at: new Date().toISOString() })
        .eq('id', editingId);

      if (error) console.error('Erreur:', error);
    } else {
      const { error } = await supabase
        .from('catalogue')
        .insert([formData]);

      if (error) console.error('Erreur:', error);
    }

    setFormData({ membre: '', entreprise: '', prestation: '', description: '', contact: '' });
    setIsAdding(false);
    setEditingId(null);
    loadItems();
  };

  const handleEdit = (item: CatalogueItem) => {
    setFormData({
      membre: item.membre,
      entreprise: item.entreprise,
      prestation: item.prestation,
      description: item.description,
      contact: item.contact,
    });
    setEditingId(item.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette prestation ?')) {
      const { error } = await supabase
        .from('catalogue')
        .delete()
        .eq('id', id);

      if (error) console.error('Erreur:', error);
      loadItems();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Catalogue Secret</h2>
          <p className="text-gray-600 text-sm mt-1">Prestations des membres</p>
        </div>
        <button
          onClick={() => {
            setIsAdding(!isAdding);
            setEditingId(null);
            setFormData({ membre: '', entreprise: '', prestation: '', description: '', contact: '' });
          }}
          className="flex items-center gap-2 bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition"
        >
          <Plus size={20} />
          Ajouter
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Modifier la prestation' : 'Nouvelle prestation'}
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nom du membre"
              value={formData.membre}
              onChange={(e) => setFormData({ ...formData, membre: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Entreprise"
              value={formData.entreprise}
              onChange={(e) => setFormData({ ...formData, entreprise: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Prestation"
              value={formData.prestation}
              onChange={(e) => setFormData({ ...formData, prestation: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Contact (email, téléphone, etc.)"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-slate-700 text-white py-2 rounded-lg hover:bg-slate-800 transition"
              >
                {editingId ? 'Mettre à jour' : 'Ajouter'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  setFormData({ membre: '', entreprise: '', prestation: '', description: '', contact: '' });
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
        {items.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition border-t-4 border-slate-700">
            <div className="flex justify-between items-start mb-4">
              <Briefcase className="text-slate-700" size={24} />
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 text-slate-700 hover:bg-slate-50 rounded-lg transition"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-1">{item.prestation}</h3>
            <p className="text-gray-700 mb-3">{item.description}</p>

            <div className="border-t pt-3 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-gray-800">{item.membre}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 size={14} />
                <span>{item.entreprise}</span>
              </div>
              {item.contact && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={14} />
                  <span>{item.contact}</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            Aucune prestation dans le catalogue pour le moment.
          </div>
        )}
      </div>
    </div>
  );
}
