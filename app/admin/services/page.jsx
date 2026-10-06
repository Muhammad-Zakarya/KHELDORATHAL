'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, X, AlertCircle } from 'lucide-react';

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    priceType: 'Request a Quote',
    price: 'Variable',
    currency: 'USD',
  });

  const [error, setError] = useState('');

  const fetchServices = () => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.services) setServices(data.services);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData({
      title: '',
      description: '',
      technologies: 'Next.js, React, MongoDB',
      priceType: 'Request a Quote',
      price: 'Variable',
      currency: 'USD',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (serv) => {
    setEditingService(serv);
    setFormData({
      title: serv.title,
      description: serv.description,
      technologies: serv.technologies ? serv.technologies.join(', ') : '',
      priceType: serv.priceType || 'Request a Quote',
      price: serv.price || 'Variable',
      currency: serv.currency || 'USD',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    await fetch(`/api/services/${id}`, { method: 'DELETE' });
    fetchServices();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const techArray = formData.technologies
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      ...formData,
      technologies: techArray,
    };

    try {
      let res;
      if (editingService) {
        res = await fetch(`/api/services/${editingService._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchServices();
      } else {
        setError(data.error || 'Operation failed.');
      }
    } catch {
      setError('An error occurred.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-500/20 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white break-words">Manage Services</h1>
          <p className="text-xs text-purple-200/70">Add, update, or remove company service offerings.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 px-5 py-2.5 text-xs font-semibold text-white hover:opacity-95 transition-all shadow-lg shadow-cyan-500/20 shrink-0 text-center"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs font-mono text-purple-300">Loading services...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((serv) => (
            <div
              key={serv._id}
              className="rounded-3xl border border-purple-500/30 bg-[#0d0725] p-4 sm:p-6 space-y-4 flex flex-col justify-between shadow-xl hover:border-purple-500/60 transition-all"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-white break-words">{serv.title}</h3>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenEdit(serv)}
                      className="rounded-full border border-purple-500/30 bg-[#120934] p-2 text-slate-400 hover:text-white hover:border-cyan-400/50 transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(serv._id)}
                      className="rounded-full border border-red-500/30 bg-red-500/10 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-purple-200/80 line-clamp-2 leading-relaxed break-words">{serv.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {serv.technologies?.map((tech, i) => (
                    <span key={i} className="rounded-full bg-[#120934] px-2.5 py-0.5 text-[10px] font-mono text-purple-200 border border-purple-500/30">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-3 border-t border-purple-500/20 text-[11px] font-mono text-cyan-300 flex justify-between">
                <span>Pricing: {serv.priceType || 'Quote'}</span>
                <span>{serv.currency}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SERVICE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-purple-500/30 bg-[#0d0725] p-5 sm:p-7 space-y-5 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 text-purple-300 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-bold text-white break-words">
              {editingService ? 'Edit Service' : 'Add New Service'}
            </h3>

            {error && (
              <div className="flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-purple-200 mb-1.5">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-2xl border border-purple-500/30 bg-[#070318] px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div>
                <label className="block font-semibold text-purple-200 mb-1.5">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-2xl border border-purple-500/30 bg-[#070318] px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div>
                <label className="block font-semibold text-purple-200 mb-1.5">Technologies (Comma Separated)</label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  className="w-full rounded-2xl border border-purple-500/30 bg-[#070318] px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-purple-200 mb-1.5">Price Label</label>
                  <input
                    type="text"
                    value={formData.priceType}
                    onChange={(e) => setFormData({ ...formData, priceType: e.target.value })}
                    className="w-full rounded-2xl border border-purple-500/30 bg-[#070318] px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-purple-200 mb-1.5">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full rounded-2xl border border-purple-500/30 bg-[#070318] px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="PKR">PKR (Rs)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex flex-col-reverse sm:flex-row justify-end gap-2.5 border-t border-purple-500/20">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto rounded-full border border-purple-500/30 bg-[#120934] px-5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 px-6 py-2.5 text-xs font-semibold text-white hover:opacity-95 transition-all shadow-lg shadow-cyan-500/20 text-center"
                >
                  {editingService ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
