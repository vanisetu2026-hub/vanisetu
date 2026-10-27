import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/adminApi';
import { AdminModule, AdminLanguage, ModuleStatus } from '../../types';
import { useNotification } from '../../contexts/NotificationContext';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import {
  Layers,
  PlusCircle,
  Edit2,
  Trash2,
  Copy,
  Clock,
  CheckCircle2,
  AlertCircle,
  Archive,
  Search,
  Filter,
} from 'lucide-react';

export const AdminModulesPage: React.FC = () => {
  const { addToast } = useNotification();

  const [modules, setModules] = useState<AdminModule[]>([]);
  const [languages, setLanguages] = useState<AdminLanguage[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<AdminModule | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [languageId, setLanguageId] = useState('mundari');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<AdminModule['difficulty']>('Beginner');
  const [estimatedDuration, setEstimatedDuration] = useState('45 mins');
  const [learningObjectives, setLearningObjectives] = useState('Master greetings\nLearn polite parting terms');
  const [status, setStatus] = useState<ModuleStatus>('draft');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [mods, langs] = await Promise.all([
        adminApi.getModules(selectedLanguage, selectedStatus),
        adminApi.getLanguages(),
      ]);
      setModules(mods);
      setLanguages(langs);
    } catch {
      addToast({ type: 'error', title: 'Error', message: 'Failed to load modules.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedLanguage, selectedStatus]);

  const openAddModal = () => {
    setEditingModule(null);
    setTitle('');
    setLanguageId(languages[0]?.languageId || 'mundari');
    setDescription('');
    setDifficulty('Beginner');
    setEstimatedDuration('45 mins');
    setLearningObjectives('Master greetings\nLearn polite parting terms');
    setStatus('draft');
    setIsModalOpen(true);
  };

  const openEditModal = (mod: AdminModule) => {
    setEditingModule(mod);
    setTitle(mod.title);
    setLanguageId(mod.languageId);
    setDescription(mod.description);
    setDifficulty(mod.difficulty);
    setEstimatedDuration(mod.estimatedDuration);
    setLearningObjectives((mod.learningObjectives || []).join('\n'));
    setStatus(mod.status);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title,
        languageId,
        description,
        difficulty,
        estimatedDuration,
        learningObjectives: learningObjectives.split('\n').filter((s) => s.trim().length > 0),
        status,
      };

      if (editingModule) {
        await adminApi.updateModule(editingModule.moduleId, payload);
        addToast({ type: 'success', title: 'Module Updated', message: `${title} updated.` });
      } else {
        await adminApi.createModule(payload);
        addToast({ type: 'success', title: 'Module Created', message: `${title} created as draft.` });
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err: unknown) {
      addToast({
        type: 'error',
        title: 'Error',
        message: err instanceof Error ? err.message : 'Could not save module.',
      });
    }
  };

  const handleDuplicate = async (mod: AdminModule) => {
    try {
      await adminApi.duplicateModule(mod.moduleId);
      addToast({ type: 'success', title: 'Module Duplicated', message: `Created copy of ${mod.title}.` });
      fetchData();
    } catch {
      addToast({ type: 'error', title: 'Error', message: 'Could not duplicate module.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this module?')) return;
    try {
      await adminApi.deleteModule(id);
      addToast({ type: 'success', title: 'Module Deleted', message: 'Module removed.' });
      fetchData();
    } catch {
      addToast({ type: 'error', title: 'Error', message: 'Could not delete module.' });
    }
  };

  const filtered = modules.filter((m) =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-sage-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-forest-100 text-forest-800 text-xs font-bold px-3 py-1 rounded-full mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Curriculum Organization</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-teal-950">
            Module Management
          </h1>
          <p className="text-xs sm:text-sm text-teal-700 font-medium">
            Create learning units, set progression milestones, learning objectives, and durations.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={openAddModal}
          icon={<PlusCircle className="w-4 h-4" />}
        >
          Create New Module
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-cream-100 border-2 border-sage-200 rounded-2xl p-3 shadow-sm">
        {/* Search */}
        <div className="flex items-center gap-2 px-2">
          <Search className="w-4 h-4 text-forest-600 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search modules..."
            className="bg-transparent border-none text-xs font-medium text-teal-950 placeholder-teal-600 focus:outline-none w-full"
          />
        </div>

        {/* Language Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-teal-600 shrink-0">Language:</span>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full bg-cream-50 border border-sage-300 rounded-xl px-2.5 py-1 text-xs font-bold text-teal-900"
          >
            <option value="all">All Languages</option>
            {languages.map((l) => (
              <option key={l.languageId} value={l.languageId}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-teal-600 shrink-0">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-cream-50 border border-sage-300 rounded-xl px-2.5 py-1 text-xs font-bold text-teal-900"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Module Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((mod) => (
          <div
            key={mod.moduleId}
            className="bg-cream-100 border-2 border-sage-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between hover:border-forest-300 transition-colors space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-forest-100 text-forest-800 px-2.5 py-0.5 rounded-full border border-forest-300">
                  {mod.languageId}
                </span>

                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                    mod.status === 'published'
                      ? 'bg-forest-600 text-cream-50'
                      : mod.status === 'draft'
                      ? 'bg-gold-200 text-teal-900'
                      : 'bg-cream-300 text-teal-600'
                  }`}
                >
                  {mod.status}
                </span>
              </div>

              <h3 className="font-display font-extrabold text-base text-teal-950 mb-1">
                {mod.title}
              </h3>
              <p className="text-xs text-teal-700 line-clamp-2 font-medium">
                {mod.description || 'No description provided.'}
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-sage-200">
              <div className="flex items-center justify-between text-xs text-teal-600 font-semibold">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {mod.estimatedDuration}
                </span>
                <span className="bg-cream-50 px-2 py-0.5 rounded-md border border-sage-200">
                  {mod.difficulty}
                </span>
              </div>

              <div className="flex items-center justify-end gap-1.5 pt-1">
                <button
                  onClick={() => handleDuplicate(mod)}
                  className="p-1.5 rounded-xl hover:bg-cream-200 text-teal-700 hover:text-forest-700 transition-colors"
                  title="Duplicate Module"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openEditModal(mod)}
                  className="p-1.5 rounded-xl hover:bg-cream-200 text-teal-700 hover:text-forest-700 transition-colors"
                  title="Edit Module"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(mod.moduleId)}
                  className="p-1.5 rounded-xl hover:bg-terracotta-100 text-teal-700 hover:text-terracotta-700 transition-colors"
                  title="Delete Module"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingModule ? `Edit Module` : 'Create New Module'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Module Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Simple Greetings & Fundamentals"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-bold text-teal-900 block mb-1">Language</label>
              <select
                value={languageId}
                onChange={(e) => setLanguageId(e.target.value)}
                className="w-full bg-cream-50 border border-sage-300 rounded-2xl p-2.5 text-xs font-bold text-teal-950 focus:outline-none focus:border-forest-600"
              >
                {languages.map((l) => (
                  <option key={l.languageId} value={l.languageId}>
                    {l.name} ({l.nativeName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-teal-900 block mb-1">Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as AdminModule['difficulty'])}
                className="w-full bg-cream-50 border border-sage-300 rounded-2xl p-2.5 text-xs font-bold text-teal-950 focus:outline-none focus:border-forest-600"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Cultural Heritage">Cultural Heritage</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Estimated Duration"
              value={estimatedDuration}
              onChange={(e) => setEstimatedDuration(e.target.value)}
              placeholder="e.g. 45 mins"
            />

            <div>
              <label className="text-xs font-bold text-teal-900 block mb-1">Publication Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ModuleStatus)}
                className="w-full bg-cream-50 border border-sage-300 rounded-2xl p-2.5 text-xs font-bold text-teal-950 focus:outline-none focus:border-forest-600"
              >
                <option value="draft">Draft (Private)</option>
                <option value="published">Published (Live)</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-teal-900 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-cream-50 border border-sage-300 rounded-2xl p-2.5 text-xs text-teal-950 focus:outline-none focus:border-forest-600"
              placeholder="Brief summary of what this module covers..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-teal-900 block">
              Learning Objectives (One per line)
            </label>
            <textarea
              value={learningObjectives}
              onChange={(e) => setLearningObjectives(e.target.value)}
              rows={3}
              className="w-full bg-cream-50 border border-sage-300 rounded-2xl p-2.5 text-xs text-teal-950 focus:outline-none focus:border-forest-600 font-mono"
              placeholder="Master everyday greetings&#10;Learn kinship pronouns"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-sage-200">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {editingModule ? 'Save Changes' : 'Create Module'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
