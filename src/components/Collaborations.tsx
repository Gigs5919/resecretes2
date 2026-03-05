import { useState, useEffect } from 'react';
import { supabase, Collaboration } from '../lib/supabase';
import { Users, Plus, CreditCard as Edit2, Trash2 } from 'lucide-react';

export default function Collaborations() {
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    participants: '',
  });

  useEffect(() => {
    loadCollaborations();
  }, []);

  const loadCollaborations = async () => {
    const { data, error } = await supabase
      .from('collaborations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur:', error);
    } else {
      setCollaborations(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      const { error } = await supabase
        .from('collaborations')
        .update({ ...formData, updated_at: new Date().toISOString() })
        .eq('id', editingId);

      if (error) console.error('Erreur:', error);
    } else {
      const { error } = await supabase
        .from('collaborations')
        .insert([formData]);

      if (error) console.error('Erreur:', error);
    }

    setFormData({ titre: '', description: '', participants: '' });
    setIsAdding(false);
    setEditingId(null);
    loadCollaborations();
  };

  const handleEdit = (collaboration: Collaboration) => {
    setFormData({
      titre: collaboration.titre,
      description: collaboration.description,
      participants: collaboration.participants,
    });
    setEditingId(collaboration.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette collaboration ?')) {
      const { error } = await supabase
        .from('collaborations')
        .delete()
        .eq('id', id);

      if (error) console.error('Erreur:', error);
      loadCollaborations();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Collaborations</h2>
        <button
          onClick={() => {
            setIsAdding(!isAdding);
            setEditingId(null);
            setFormData({ titre: '', description: '', participants: '' });
          }}
          className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition"
        >
          <Plus size={20} />
          Ajouter
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Modifier la collaboration' : 'Nouvelle collaboration'}
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Titre"
              value={formData.titre}
              onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Participants (ex: Jean Dupont & Marie Martin)"
              value={formData.participants}
              onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition"
              >
                {editingId ? 'Mettre à jour' : 'Ajouter'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  setFormData({ titre: '', description: '', participants: '' });
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Annuler
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {collaborations.map((collaboration) => (
          <div key={collaboration.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold text-gray-800">{collaboration.titre}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(collaboration)}
                  className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(collaboration.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <p className="text-gray-600 mb-3">{collaboration.description}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-amber-50 px-3 py-2 rounded-lg">
              <Users size={16} />
              <span>{collaboration.participants}</span>
            </div>
          </div>
        ))}
        {collaborations.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            Aucune collaboration enregistrée pour le moment.
          </div>
        )}
      </div>
    </div>
  );
}
