import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/adminApi';
import { AdminLanguage } from '../../types';
import { useNotification } from '../../contexts/NotificationContext';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import {
  Globe2,
  PlusCircle,
  Edit2,
  Trash2,
  Archive,
  Search,
  Sparkles,
  CheckCircle2,
  XCircle,
  Star,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

export const AdminLanguagesPage: React.FC = () => {
  const { addToast } = useNotification();

  const [languages, setLanguages] = useState<AdminLanguage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLang, setEditingLang] = useState<AdminLanguage | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [nativeName, setNativeName] = useState('');
  const [scriptName, setScriptName] = useState('');
  const [region, setRegion] = useState('');
  const [description, setDescription] = useState('');
  const [speakersCount, setSpeakersCount] = useState('');
  const [languageFamily, setLanguageFamily] = useState('');
  const [sampleGreeting, setSampleGreeting] = useState('');
  const [sampleGreetingMeaning, setSampleGreetingMeaning] = useState('');
  const [culturalNote, setCulturalNote] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<AdminLanguage | null>(null);

  const fetchLanguages = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getLanguages();
      setLanguages(data);
    } catch {
      addToast({ type: 'error', title: 'Error', message: 'Failed to fetch languages.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  const openAddModal = () => {
    setEditingLang(null);
    setName('');
    setNativeName('');
    setScriptName('');
    setRegion('');
    setDescription('');
    setSpeakersCount('');
    setLanguageFamily('Austroasiatic (Munda branch)');
    setSampleGreeting('Johar');
    setSampleGreetingMeaning('Greetings of respect');
    setCulturalNote('');
    setIsFeatured(false);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (lang: AdminLanguage) => {
    setEditingLang(lang);
    setName(lang.name);
    setNativeName(lang.nativeName);
    setScriptName(lang.scriptName);
    setRegion(lang.region);
    setDescription(lang.description);
    setSpeakersCount(lang.speakersCount);
    setLanguageFamily(lang.languageFamily);
    setSampleGreeting(lang.sampleGreeting);
    setSampleGreetingMeaning(lang.sampleGreetingMeaning);
    setCulturalNote(lang.culturalNote || '');
    setIsFeatured(Boolean(lang.isFeatured));
    setIsActive(lang.isActive);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        nativeName,
        scriptName,
        region,
        description,
        speakersCount,
        languageFamily,
        sampleGreeting,
        sampleGreetingMeaning,
        culturalNote,
        isFeatured,
        isActive,
      };

      if (editingLang) {
        await adminApi.updateLanguage(editingLang.languageId, payload);
        addToast({ type: 'success', title: 'Language Updated', message: `${name} has been updated.` });
      } else {
        await adminApi.createLanguage(payload);
        addToast({ type: 'success', title: 'Language Added', message: `${name} added to VANISETU.` });
      }

      setIsModalOpen(false);
      fetchLanguages();
    } catch (err: unknown) {
      addToast({
        type: 'error',
        title: 'Operation Failed',
        message: err instanceof Error ? err.message : 'Could not save language.',
      });
    }
  };

  const handleDelete = async (lang: AdminLanguage, force: boolean = false) => {
    try {
      const res = await adminApi.deleteLanguage(lang.languageId, force);
      if (res.archived) {
        addToast({
          type: 'info',
          title: 'Language Archived',
          message: res.message,
        });
      } else {
        addToast({
          type: 'success',
          title: 'Language Deleted',
          message: res.message,
        });
      }
      setDeleteTarget(null);
      fetchLanguages();
    } catch (err: unknown) {
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: err instanceof Error ? err.message : 'Could not delete language.',
      });
    }
  };

  const filtered = languages.filter((l) =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-sage-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-forest-100 text-forest-800 text-xs font-bold px-3 py-1 rounded-full mb-1">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Indigenous Linguistic Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-teal-950">
            Language Management
          </h1>
          <p className="text-xs sm:text-sm text-teal-700 font-medium">
            Manage tribal language entries, native scripts, cultural notes, and display visibility.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={openAddModal}
          icon={<PlusCircle className="w-4 h-4" />}
        >
          Add Tribal Language
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3 bg-cream-100 border-2 border-sage-200 rounded-2xl p-3 shadow-sm">
        <Search className="w-4 h-4 text-forest-600 shrink-0 ml-1" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by language name, script, or region..."
          className="bg-transparent border-none text-xs sm:text-sm font-medium text-teal-950 placeholder-teal-600 focus:outline-none w-full"
        />
      </div>

      {/* Languages Table */}
      <div className="bg-cream-100 border-2 border-sage-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b-2 border-sage-200 bg-cream-50 text-teal-700 uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Language & Script</th>
                <th className="py-3 px-4">Family & Region</th>
                <th className="py-3 px-4">Speakers</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage-200 text-teal-900 font-medium">
              {filtered.map((lang) => (
                <tr key={lang.languageId} className="hover:bg-cream-200/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-forest-700">
                    #{lang.displayOrder}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-forest-600 text-cream-100 font-bold flex items-center justify-center text-xs shrink-0">
                        {lang.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-teal-950">{lang.name}</span>
                          {lang.isFeatured && (
                            <span title="Featured">
                              <Star className="w-3.5 h-3.5 text-gold-500 fill-current" />
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gold-600 font-semibold block">
                          {lang.nativeName} ({lang.scriptName})
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-teal-950 block">{lang.languageFamily}</span>
                    <span className="text-[11px] text-teal-600">{lang.region}</span>
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold text-teal-700">
                    {lang.speakersCount}
                  </td>
                  <td className="py-3 px-4">
                    {lang.isArchived ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-cream-300 text-teal-700 px-2 py-0.5 rounded-full border border-sage-300">
                        <Archive className="w-3 h-3" />
                        Archived
                      </span>
                    ) : lang.isActive ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-forest-100 text-forest-800 px-2 py-0.5 rounded-full border border-forest-300">
                        <CheckCircle2 className="w-3 h-3 text-forest-600" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-cream-200 text-teal-600 px-2 py-0.5 rounded-full border border-sage-300">
                        Disabled
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(lang)}
                        className="p-1.5 rounded-xl hover:bg-cream-200 text-teal-700 hover:text-forest-700 transition-colors"
                        title="Edit Language"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(lang)}
                        className="p-1.5 rounded-xl hover:bg-terracotta-100 text-teal-700 hover:text-terracotta-700 transition-colors"
                        title="Delete or Archive Language"
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

      {/* Add / Edit Language Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingLang ? `Edit ${editingLang.name}` : 'Add Tribal Language'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Language Name (English)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Mundari"
              required
            />
            <Input
              label="Native Script Name"
              value={nativeName}
              onChange={(e) => setNativeName(e.target.value)}
              placeholder="e.g. मुंडारी / Mundari Bani"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Script Identifier"
              value={scriptName}
              onChange={(e) => setScriptName(e.target.value)}
              placeholder="e.g. Ol Chiki / Warang Citi"
            />
            <Input
              label="Linguistic Family"
              value={languageFamily}
              onChange={(e) => setLanguageFamily(e.target.value)}
              placeholder="e.g. Austroasiatic (Munda branch)"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Primary Region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="e.g. Jharkhand, Odisha, West Bengal"
              required
            />
            <Input
              label="Speakers Estimate"
              value={speakersCount}
              onChange={(e) => setSpeakersCount(e.target.value)}
              placeholder="e.g. 1.2+ Million speakers"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Sample Greeting"
              value={sampleGreeting}
              onChange={(e) => setSampleGreeting(e.target.value)}
              placeholder="e.g. Johar"
            />
            <Input
              label="Greeting Meaning"
              value={sampleGreetingMeaning}
              onChange={(e) => setSampleGreetingMeaning(e.target.value)}
              placeholder="e.g. Greetings of respect and harmony"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-teal-900 block">Description & Cultural Heritage</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-cream-50 border border-sage-300 rounded-2xl p-2.5 text-xs text-teal-950 focus:outline-none focus:border-forest-600"
              placeholder="Brief historical and cultural background..."
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-teal-900">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-forest-600 focus:ring-forest-500"
              />
              <span>Enabled & Visible to Learners</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-teal-900">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-gold-500 focus:ring-gold-400"
              />
              <span>Mark as Featured Language</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-sage-200">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {editingLang ? 'Save Changes' : 'Create Language'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete / Archive Confirmation Dialog */}
      {deleteTarget && (
        <Modal
          isOpen={true}
          onClose={() => setDeleteTarget(null)}
          title={`Remove Language: ${deleteTarget.name}`}
          maxWidth="sm"
        >
          <div className="space-y-4">
            <div className="p-3 bg-gold-50 border border-gold-300 rounded-2xl flex items-start gap-2.5 text-xs text-teal-900">
              <AlertTriangle className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
              <p>
                To protect student progress and curriculum referential integrity, languages with associated modules will be safely <strong>Archived</strong> instead of permanently destroyed.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-sage-200">
              <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="bg-terracotta-600 hover:bg-terracotta-700 border-terracotta-800"
                onClick={() => handleDelete(deleteTarget)}
              >
                Safe Archive / Remove
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
