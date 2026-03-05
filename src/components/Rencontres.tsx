import { useState, useEffect } from 'react';
import { supabase, Rencontre } from '../lib/supabase';
import { Calendar, MapPin, Plus, CreditCard as Edit2, Trash2 } from 'lucide-react';

export default function Rencontres() {
  const [rencontres, setRencontres] = useState<Rencontre[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    date: '',
    lieu: '',
  });

  useEffect(() => {
    loadRencontres();
  }, []);

  const loadRencontres = async () => {
    const { data, error } = await supabase
      .from('rencontres')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Erreur:', error);
    } else {
      setRencontres(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      const { error } = await supabase
        .from('rencontres')
        .update({ ...formData, updated_at: new Date().toISOString() })
        .eq('id', editingId);

      if (error) console.error('Erreur:', error);
    } else {
      const { error } = await supabase
        .from('rencontres')
        .insert([formData]);

      if (error) console.error('Erreur:', error);
    }

    setFormData({ titre: '', description: '', date: '', lieu: '' });
    setIsAdding(false);
    setEditingId(null);
    loadRencontres();
  };

  const handleEdit = (rencontre: Rencontre) => {
    setFormData({
      titre: rencontre.titre,
      description: rencontre.description,
      date: rencontre.date.split('T')[0],
      lieu: rencontre.lieu,
    });
    setEditingId(rencontre.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette rencontre ?')) {
      const { error } = await supabase
        .from('rencontres')
        .delete()
        .eq('id', id);

      if (error) console.error('Erreur:', error);
      loadRencontres();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Prochaines Rencontres</h2>
        <button
          onClick={() => {
            setIsAdding(!isAdding);
            setEditingId(null);
            setFormData({ titre: '', description: '', date: '', lieu: '' });
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          Ajouter
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Modifier la rencontre' : 'Nouvelle rencontre'}
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Titre"
              value={formData.titre}
              onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="datetime-local"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Lieu"
              value={formData.lieu}
              onChange={(e) => setFormData({ ...formData, lieu: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                {editingId ? 'Mettre à jour' : 'Ajouter'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  setFormData({ titre: '', description: '', date: '', lieu: '' });
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Annuler
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {rencontres.map((rencontre) => (
          <div key={rencontre.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{rencontre.titre}</h3>
                <p className="text-gray-600 mb-3">{rencontre.description}</p>
                <div className="flex flex-col gap-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{formatDate(rencontre.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{rencontre.lieu}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(rencontre)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(rencontre.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {rencontres.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Aucune rencontre prévue pour le moment.
          </div>
        )}
      </div>
    </div>
  );
}
