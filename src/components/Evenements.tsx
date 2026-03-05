import { useState, useEffect } from 'react';
import { supabase, Evenement } from '../lib/supabase';
import { Calendar, MapPin, Plus, CreditCard as Edit2, Trash2, Tag } from 'lucide-react';

export default function Evenements() {
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    type: 'workshop',
    date: '',
    lieu: '',
  });

  useEffect(() => {
    loadEvenements();
  }, []);

  const loadEvenements = async () => {
    const { data, error } = await supabase
      .from('evenements')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Erreur:', error);
    } else {
      setEvenements(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      const { error } = await supabase
        .from('evenements')
        .update({ ...formData, updated_at: new Date().toISOString() })
        .eq('id', editingId);

      if (error) console.error('Erreur:', error);
    } else {
      const { error } = await supabase
        .from('evenements')
        .insert([formData]);

      if (error) console.error('Erreur:', error);
    }

    setFormData({ titre: '', description: '', type: 'workshop', date: '', lieu: '' });
    setIsAdding(false);
    setEditingId(null);
    loadEvenements();
  };

  const handleEdit = (evenement: Evenement) => {
    setFormData({
      titre: evenement.titre,
      description: evenement.description,
      type: evenement.type,
      date: evenement.date.split('T')[0],
      lieu: evenement.lieu,
    });
    setEditingId(evenement.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      const { error } = await supabase
        .from('evenements')
        .delete()
        .eq('id', id);

      if (error) console.error('Erreur:', error);
      loadEvenements();
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

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      workshop: 'bg-green-100 text-green-800',
      visite: 'bg-orange-100 text-orange-800',
      conference: 'bg-blue-100 text-blue-800',
      autre: 'bg-gray-100 text-gray-800',
    };
    return colors[type] || colors.autre;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Événements Spéciaux</h2>
        <button
          onClick={() => {
            setIsAdding(!isAdding);
            setEditingId(null);
            setFormData({ titre: '', description: '', type: 'workshop', date: '', lieu: '' });
          }}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <Plus size={20} />
          Ajouter
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Modifier l\'événement' : 'Nouvel événement'}
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Titre"
              value={formData.titre}
              onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="workshop">Workshop</option>
              <option value="visite">Visite</option>
              <option value="conference">Conférence</option>
              <option value="autre">Autre</option>
            </select>
            <input
              type="datetime-local"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Lieu"
              value={formData.lieu}
              onChange={(e) => setFormData({ ...formData, lieu: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
              >
                {editingId ? 'Mettre à jour' : 'Ajouter'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  setFormData({ titre: '', description: '', type: 'workshop', date: '', lieu: '' });
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
        {evenements.map((evenement) => (
          <div key={evenement.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-800">{evenement.titre}</h3>
                  <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(evenement.type)}`}>
                    <Tag size={12} />
                    {evenement.type}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{evenement.description}</p>
                <div className="flex flex-col gap-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{formatDate(evenement.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{evenement.lieu}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(evenement)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(evenement.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {evenements.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Aucun événement prévu pour le moment.
          </div>
        )}
      </div>
    </div>
  );
}
