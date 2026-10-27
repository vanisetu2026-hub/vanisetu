import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/adminApi';
import { AdminLesson, AdminModule, AdminLanguage } from '../../types';
import { useNotification } from '../../contexts/NotificationContext';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import {
  GraduationCap,
  PlusCircle,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
} from 'lucide-react';

export const AdminLessonsPage: React.FC = () => {
  const { addToast } = useNotification();

  const [lessons, setLessons] = useState<AdminLesson[]>([]);
  const [modules, setModules] = useState<AdminModule[]>([]);
  const [languages, setLanguages] = useState<AdminLanguage[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<AdminLesson | null>(null);
  const [previewLesson, setPreviewLesson] = useState<AdminLesson | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [languageId, setLanguageId] = useState('mundari');
  const [description, setDescription] = useState('');
  const [xpReward, setXpReward] = useState('20');
  const [culturalInsight, setCulturalInsight] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [les, mods, langs] = await Promise.all([
        adminApi.getLessons(selectedModule),
        adminApi.getModules(),
        adminApi.getLanguages(),
      ]);
      setLessons(les);
      setModules(mods);
      setLanguages(langs);
      if (!moduleId && mods.length > 0) {
        setModuleId(mods[0].moduleId);
      }
    } catch {
      addToast({ type: 'error', title: 'Error', message: 'Failed to fetch lessons.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedModule]);

  const openAddModal = () => {
    setEditingLesson(null);
    setTitle('');
    setModuleId(modules[0]?.moduleId || '');
    setLanguageId(languages[0]?.languageId || 'mundari');
    setDescription('');
    setXpReward('20');
    setCulturalInsight('');
    setStatus('draft');
    setIsModalOpen(true);
  };

  const openEditModal = (lesson: AdminLesson) => {
    setEditingLesson(lesson);
    setTitle(lesson.title);
    setModuleId(lesson.moduleId);
    setLanguageId(lesson.languageId);
    setDescription(lesson.description);
    setXpReward(lesson.xpReward.toString());
    setCulturalInsight(lesson.culturalInsight || '');
    setStatus(lesson.status === 'published' ? 'published' : 'draft');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title,
        moduleId,
        languageId,
        description,
        xpReward: Number(xpReward) || 20,
        culturalInsight,
        status,
      };

      if (editingLesson) {
        await adminApi.updateLesson(editingLesson.lessonId, payload);
        addToast({ type: 'success', title: 'Lesson Updated', message: `${title} updated.` });
      } else {
        await adminApi.createLesson(payload);
        addToast({ type: 'success', title: 'Lesson Created', message: `${title} created.` });
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err: unknown) {
      addToast({
        type: 'error',
        title: 'Error',
        message: err instanceof Error ? err.message : 'Could not save lesson.',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;
    try {
      await adminApi.deleteLesson(id);
      addToast({ type: 'success', title: 'Lesson Deleted', message: 'Lesson removed.' });
      fetchData();
    } catch {
      addToast({ type: 'error', title: 'Error', message: 'Could not delete lesson.' });
    }
  };

  const filtered = lessons.filter((l) =>
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-sage-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-forest-100 text-forest-800 text-xs font-bold px-3 py-1 rounded-full mb-1">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Interactive Pedagogical Units</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-teal-950">
            Lesson Management
          </h1>
          <p className="text-xs sm:text-sm text-teal-700 font-medium">
            Configure learning sequences, XP reward values, cultural context insights, and live preview.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={openAddModal}
          icon={<PlusCircle className="w-4 h-4" />}
        >
          Add New Lesson
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-cream-100 border-2 border-sage-200 rounded-2xl p-3 shadow-sm">
        <div className="flex items-center gap-2 px-2">
          <Search className="w-4 h-4 text-forest-600 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lessons by title or keyword..."
            className="bg-transparent border-none text-xs font-medium text-teal-950 placeholder-teal-600 focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-teal-600 shrink-0">Parent Module:</span>
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="w-full bg-cream-50 border border-sage-300 rounded-xl px-2.5 py-1 text-xs font-bold text-teal-900"
          >
            <option value="all">All Modules</option>
            {modules.map((m) => (
              <option key={m.moduleId} value={m.moduleId}>
                {m.title} ({m.languageId})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lessons Table */}
      <div className="bg-cream-100 border-2 border-sage-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b-2 border-sage-200 bg-cream-50 text-teal-700 uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3 px-4">Seq</th>
                <th className="py-3 px-4">Lesson Details</th>
                <th className="py-3 px-4">Language & Module</th>
                <th className="py-3 px-4">XP Reward</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage-200 text-teal-900 font-medium">
              {filtered.map((lesson) => (
                <tr key={lesson.lessonId} className="hover:bg-cream-200/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-forest-700">
                    #{lesson.order}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-sm text-teal-950 block">{lesson.title}</span>
                    <span className="text-xs text-teal-600 line-clamp-1">{lesson.description}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-forest-800 uppercase text-[10px] bg-forest-100 px-2 py-0.5 rounded-md border border-forest-300 block w-max">
                      {lesson.languageId}
                    </span>
                    <span className="text-[11px] text-teal-600 block mt-0.5 truncate max-w-xs">
                      {modules.find((m) => m.moduleId === lesson.moduleId)?.title || lesson.moduleId}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-gold-600">
                    +{lesson.xpReward} XP
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        lesson.status === 'published'
                          ? 'bg-forest-100 text-forest-800 border border-forest-300'
                          : 'bg-gold-100 text-gold-800 border border-gold-300'
                      }`}
                    >
                      {lesson.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setPreviewLesson(lesson)}
                        className="p-1.5 rounded-xl hover:bg-cream-200 text-teal-700 hover:text-forest-700 transition-colors"
                        title="Live Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(lesson)}
                        className="p-1.5 rounded-xl hover:bg-cream-200 text-teal-700 hover:text-forest-700 transition-colors"
                        title="Edit Lesson"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(lesson.lessonId)}
                        className="p-1.5 rounded-xl hover:bg-terracotta-100 text-teal-700 hover:text-terracotta-700 transition-colors"
                        title="Delete Lesson"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Lesson Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingLesson ? 'Edit Lesson' : 'Add New Lesson'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Lesson Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Simple Greetings (Johar)"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-bold text-teal-900 block mb-1">Parent Module</label>
              <select
                value={moduleId}
                onChange={(e) => setModuleId(e.target.value)}
                className="w-full bg-cream-50 border border-sage-300 rounded-2xl p-2.5 text-xs font-bold text-teal-950 focus:outline-none focus:border-forest-600"
                required
              >
                {modules.map((m) => (
                  <option key={m.moduleId} value={m.moduleId}>
                    {m.title} ({m.languageId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-teal-900 block mb-1">Language</label>
              <select
                value={languageId}
                onChange={(e) => setLanguageId(e.target.value)}
                className="w-full bg-cream-50 border border-sage-300 rounded-2xl p-2.5 text-xs font-bold text-teal-950 focus:outline-none focus:border-forest-600"
              >
                {languages.map((l) => (
                  <option key={l.languageId} value={l.languageId}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="XP Reward"
              type="number"
              value={xpReward}
              onChange={(e) => setXpReward(e.target.value)}
              placeholder="20"
              required
            />

            <div>
              <label className="text-xs font-bold text-teal-900 block mb-1">Publication Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                className="w-full bg-cream-50 border border-sage-300 rounded-2xl p-2.5 text-xs font-bold text-teal-950 focus:outline-none focus:border-forest-600"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-teal-900 block">Lesson Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-cream-50 border border-sage-300 rounded-2xl p-2.5 text-xs text-teal-950 focus:outline-none focus:border-forest-600"
              placeholder="What learners will master in this lesson..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-teal-900 block">Cultural Context & Insight</label>
            <textarea
              value={culturalInsight}
              onChange={(e) => setCulturalInsight(e.target.value)}
              rows={2}
              className="w-full bg-cream-50 border border-sage-300 rounded-2xl p-2.5 text-xs text-teal-950 focus:outline-none focus:border-forest-600"
              placeholder="Cultural notes explaining indigenous traditions..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-sage-200">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {editingLesson ? 'Save Changes' : 'Create Lesson'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Live Preview Modal */}
      {previewLesson && (
        <Modal
          isOpen={true}
          onClose={() => setPreviewLesson(null)}
          title={`Preview Lesson: ${previewLesson.title}`}
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="p-4 bg-forest-700 text-cream-50 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-gold-300">
                Lesson #{previewLesson.order} • {previewLesson.languageId}
              </span>
              <h3 className="font-display font-extrabold text-lg mt-0.5">{previewLesson.title}</h3>
              <p className="text-xs text-cream-200 mt-1">{previewLesson.description}</p>
            </div>

            {previewLesson.culturalInsight && (
              <div className="p-3 bg-cream-50 border border-sage-200 rounded-xl text-xs text-teal-900 leading-relaxed">
                <span className="font-bold text-forest-700 flex items-center gap-1 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-gold-500" />
                  Cultural Lore:
                </span>
                {previewLesson.culturalInsight}
              </div>
            )}

            <div className="flex items-center justify-between text-xs font-bold text-teal-700 pt-2 border-t border-sage-200">
              <span>XP Reward: +{previewLesson.xpReward} XP</span>
              <span className="uppercase text-forest-700">{previewLesson.status}</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
