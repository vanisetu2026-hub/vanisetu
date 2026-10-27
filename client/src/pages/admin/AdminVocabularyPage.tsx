import React, { useState, useEffect, useMemo } from 'react';
import {
  BookA,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Volume2,
  Star,
  CheckCircle,
  Clock,
  Edit2,
  Trash2,
  X,
  Languages,
  Sparkles
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import type { AdminVocabulary, AdminLanguage } from '../../types';

const CATEGORIES: AdminVocabulary['category'][] = [
  'Greetings',
  'Nature',
  'Family',
  'Numbers',
  'Festival',
  'Everyday',
  'Kinship',
  'Food'
];

export const AdminVocabularyPage: React.FC = () => {
  const [vocabularies, setVocabularies] = useState<AdminVocabulary[]>([]);
  const [languages, setLanguages] = useState<AdminLanguage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPos, setSelectedPos] = useState<string>('all');

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminVocabulary | null>(null);
  const [saving, setSaving] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<AdminVocabulary>>({
    word: '',
    nativeScript: '',
    transliteration: '',
    englishMeaning: '',
    hindiMeaning: '',
    partOfSpeech: 'noun',
    pronunciationAudioText: '',
    exampleSentence: {
      tribal: '',
      transliteration: '',
      translation: ''
    },
    audioURL: '',
    imageURL: '',
    languageId: 'santali',
    category: 'Greetings',
    culturalContext: '',
    isFeatured: false,
    isPublished: true,
    verificationStatus: 'verified'
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [vData, lData] = await Promise.all([
        adminApi.getVocabulary(),
        adminApi.getLanguages()
      ]);
      setVocabularies(vData);
      setLanguages(lData);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load vocabulary');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openNewModal = () => {
    setEditingItem(null);
    setFormData({
      word: '',
      nativeScript: '',
      transliteration: '',
      englishMeaning: '',
      hindiMeaning: '',
      partOfSpeech: 'noun',
      pronunciationAudioText: '',
      exampleSentence: {
        tribal: '',
        transliteration: '',
        translation: ''
      },
      audioURL: '',
      imageURL: '',
      languageId: languages[0]?.languageId || 'santali',
      category: 'Greetings',
      culturalContext: '',
      isFeatured: false,
      isPublished: true,
      verificationStatus: 'verified'
    });
    setShowModal(true);
  };

  const openEditModal = (item: AdminVocabulary) => {
    setEditingItem(item);
    setFormData({
      ...item,
      exampleSentence: item.exampleSentence || { tribal: '', transliteration: '', translation: '' }
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this vocabulary entry?')) return;
    try {
      await adminApi.deleteVocabulary(id);
      await loadData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete vocabulary');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.word || !formData.englishMeaning) {
      alert('Word and English meaning are required.');
      return;
    }

    try {
      setSaving(true);
      if (editingItem) {
        await adminApi.updateVocabulary(editingItem.vocabularyId, formData);
      } else {
        await adminApi.createVocabulary(formData);
      }
      setShowModal(false);
      await loadData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to save vocabulary');
    } finally {
      setSaving(false);
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(vocabularies, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `vanisetu_vocabulary_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportSubmit = async () => {
    try {
      setImportStatus('Processing import...');
      const parsed = JSON.parse(importJsonText);
      if (!Array.isArray(parsed)) {
        throw new Error('Import data must be a JSON array of vocabulary items.');
      }
      for (const item of parsed) {
        await adminApi.createVocabulary(item);
      }
      setImportStatus(`Imported ${parsed.length} entries successfully!`);
      setTimeout(() => {
        setShowImportModal(false);
        setImportStatus(null);
        setImportJsonText('');
        loadData();
      }, 1000);
    } catch (err: unknown) {
      setImportStatus(`Import Error: ${err instanceof Error ? err.message : 'Failed'}`);
    }
  };

  const filteredVocab = useMemo(() => {
    return vocabularies.filter(v => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        v.word.toLowerCase().includes(q) ||
        v.transliteration?.toLowerCase().includes(q) ||
        v.englishMeaning.toLowerCase().includes(q) ||
        v.hindiMeaning?.toLowerCase().includes(q) ||
        v.nativeScript?.toLowerCase().includes(q);
      const matchesLang = selectedLanguage === 'all' || v.languageId === selectedLanguage;
      const matchesCat = selectedCategory === 'all' || v.category === selectedCategory;
      const matchesPos = selectedPos === 'all' || v.partOfSpeech === selectedPos;
      return matchesSearch && matchesLang && matchesCat && matchesPos;
    });
  }, [vocabularies, searchQuery, selectedLanguage, selectedCategory, selectedPos]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-vanisetu-primary flex items-center gap-2">
            <BookA className="w-7 h-7 text-vanisetu-accent" />
            Tribal Vocabulary Repository
          </h1>
          <p className="text-sm text-vanisetu-text-muted mt-1">
            Curate indigenous lexicons, Ol Chiki / native scripts, IPA phonetics, and trilingual translations.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-vanisetu-primary/20 text-vanisetu-primary rounded-lg text-sm font-medium hover:bg-vanisetu-cream/60 transition shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export JSON
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-vanisetu-primary/20 text-vanisetu-primary rounded-lg text-sm font-medium hover:bg-vanisetu-cream/60 transition shadow-sm"
          >
            <Upload className="w-4 h-4" />
            Bulk Import
          </button>
          <button
            onClick={openNewModal}
            className="flex items-center gap-2 px-4 py-2 bg-vanisetu-primary text-vanisetu-cream rounded-lg text-sm font-semibold hover:bg-vanisetu-primary-dark transition shadow-md"
          >
            <Plus className="w-4 h-4" />
            Add Word
          </button>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-vanisetu-primary/10 shadow-sm">
          <p className="text-xs text-vanisetu-text-muted font-medium">Total Lexicon Words</p>
          <p className="text-2xl font-bold text-vanisetu-primary mt-0.5">{vocabularies.length}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-vanisetu-primary/10 shadow-sm">
          <p className="text-xs text-vanisetu-text-muted font-medium">Verified Entries</p>
          <p className="text-2xl font-bold text-green-700 mt-0.5">
            {vocabularies.filter(v => v.verificationStatus === 'verified').length}
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-vanisetu-primary/10 shadow-sm">
          <p className="text-xs text-vanisetu-text-muted font-medium">Featured Words</p>
          <p className="text-2xl font-bold text-vanisetu-accent mt-0.5">
            {vocabularies.filter(v => v.isFeatured).length}
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-vanisetu-primary/10 shadow-sm">
          <p className="text-xs text-vanisetu-text-muted font-medium">Languages Represented</p>
          <p className="text-2xl font-bold text-vanisetu-primary mt-0.5">
            {new Set(vocabularies.map(v => v.languageId)).size}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl border border-vanisetu-primary/10 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search word, script, transliteration, English or Hindi..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-vanisetu-text-muted">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter:</span>
            </div>
            <select
              value={selectedLanguage}
              onChange={e => setSelectedLanguage(e.target.value)}
              className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-vanisetu-primary outline-none"
            >
              <option value="all">All Languages</option>
              {languages.map(l => (
                <option key={l.languageId} value={l.languageId}>
                  {l.name}
                </option>
              ))}
            </select>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-vanisetu-primary outline-none"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={selectedPos}
              onChange={e => setSelectedPos(e.target.value)}
              className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-vanisetu-primary outline-none"
            >
              <option value="all">All Parts of Speech</option>
              <option value="greeting">Greeting</option>
              <option value="noun">Noun</option>
              <option value="verb">Verb</option>
              <option value="adjective">Adjective</option>
              <option value="adverb">Adverb</option>
              <option value="pronoun">Pronoun</option>
              <option value="phrase">Phrase</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vocabulary Cards / Table */}
      <div className="bg-white rounded-xl border border-vanisetu-primary/10 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-vanisetu-text-muted">Loading vocabulary entries...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 text-sm">{error}</div>
        ) : filteredVocab.length === 0 ? (
          <div className="p-12 text-center text-sm text-vanisetu-text-muted">
            No vocabulary found matching your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-vanisetu-cream/60 border-b border-vanisetu-primary/10 text-xs text-vanisetu-primary font-semibold">
                <tr>
                  <th className="py-3 px-4">Word / Script</th>
                  <th className="py-3 px-4">Language</th>
                  <th className="py-3 px-4">Part of Speech</th>
                  <th className="py-3 px-4">English & Hindi Meaning</th>
                  <th className="py-3 px-4">Pronunciation</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredVocab.map(v => {
                  const lang = languages.find(l => l.languageId === v.languageId);
                  return (
                    <tr key={v.vocabularyId} className="hover:bg-vanisetu-cream/20 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-vanisetu-primary text-base">{v.word}</span>
                              {v.nativeScript && (
                                <span className="font-serif px-1.5 py-0.5 rounded bg-vanisetu-cream text-vanisetu-primary text-xs border border-vanisetu-primary/20">
                                  {v.nativeScript}
                                </span>
                              )}
                              {v.isFeatured && (
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              )}
                            </div>
                            {v.transliteration && (
                              <p className="text-xs text-vanisetu-text-muted italic">/{v.transliteration}/</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs">
                        <span className="inline-flex items-center gap-1 text-gray-700 font-medium">
                          <Languages className="w-3 h-3 text-vanisetu-accent" />
                          {lang?.name || v.languageId}
                        </span>
                        {v.category && (
                          <p className="text-[11px] text-vanisetu-text-muted">{v.category}</p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold uppercase bg-gray-100 text-gray-700">
                          {v.partOfSpeech}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs">
                        <p className="font-medium text-gray-800">{v.englishMeaning}</p>
                        {v.hindiMeaning && (
                          <p className="text-vanisetu-text-muted text-[11px]">{v.hindiMeaning}</p>
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-600">
                        {v.pronunciationAudioText && (
                          <span className="font-mono text-xs bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200">
                            {v.pronunciationAudioText}
                          </span>
                        )}
                        {v.audioURL && (
                          <button
                            type="button"
                            onClick={() => {
                              const audio = new Audio(v.audioURL);
                              audio.play().catch(() => alert('Audio file not found at path'));
                            }}
                            className="ml-2 inline-flex items-center text-vanisetu-primary hover:text-vanisetu-accent"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            v.verificationStatus === 'verified'
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {v.verificationStatus === 'verified' ? (
                            <CheckCircle className="w-3 h-3 text-green-600" />
                          ) : (
                            <Clock className="w-3 h-3 text-amber-600" />
                          )}
                          {v.verificationStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditModal(v)}
                            title="Edit"
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(v.vocabularyId)}
                            title="Delete"
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-vanisetu-primary/20 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-vanisetu-primary flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-vanisetu-accent" />
                {editingItem ? 'Edit Vocabulary Entry' : 'Add Vocabulary Entry'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Target Language *</label>
                  <select
                    value={formData.languageId}
                    onChange={e => setFormData({ ...formData, languageId: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none"
                  >
                    {languages.map(l => (
                      <option key={l.languageId} value={l.languageId}>
                        {l.name} ({l.nativeName})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Part of Speech *</label>
                  <select
                    value={formData.partOfSpeech}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        partOfSpeech: e.target.value as AdminVocabulary['partOfSpeech']
                      })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none"
                  >
                    <option value="noun">Noun</option>
                    <option value="verb">Verb</option>
                    <option value="adjective">Adjective</option>
                    <option value="adverb">Adverb</option>
                    <option value="greeting">Greeting</option>
                    <option value="pronoun">Pronoun</option>
                    <option value="phrase">Phrase</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Tribal Word *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Johar"
                    value={formData.word}
                    onChange={e => setFormData({ ...formData, word: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Native Script</label>
                  <input
                    type="text"
                    placeholder="e.g., ᱡᱚᱦᱟᱨ"
                    value={formData.nativeScript || ''}
                    onChange={e => setFormData({ ...formData, nativeScript: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none font-serif"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Transliteration</label>
                  <input
                    type="text"
                    placeholder="e.g., jo-haar"
                    value={formData.transliteration || ''}
                    onChange={e => setFormData({ ...formData, transliteration: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none italic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">English Meaning *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Greetings / Hello"
                    value={formData.englishMeaning}
                    onChange={e => setFormData({ ...formData, englishMeaning: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Hindi Meaning</label>
                  <input
                    type="text"
                    placeholder="e.g., नमस्कार / अभिवादन"
                    value={formData.hindiMeaning || ''}
                    onChange={e => setFormData({ ...formData, hindiMeaning: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none font-serif"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={e =>
                      setFormData({ ...formData, category: e.target.value as AdminVocabulary['category'] })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">IPA / Phonetic Guide</label>
                  <input
                    type="text"
                    placeholder="dʒoː.haːr"
                    value={formData.pronunciationAudioText || ''}
                    onChange={e => setFormData({ ...formData, pronunciationAudioText: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none font-mono"
                  />
                </div>
              </div>

              {/* Example Sentence */}
              <div className="space-y-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-xs font-bold text-gray-700">Example Sentence:</span>
                <input
                  type="text"
                  placeholder="Tribal sentence..."
                  value={formData.exampleSentence?.tribal || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      exampleSentence: {
                        tribal: e.target.value,
                        transliteration: formData.exampleSentence?.transliteration || '',
                        translation: formData.exampleSentence?.translation || ''
                      }
                    })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none"
                />
                <input
                  type="text"
                  placeholder="English translation..."
                  value={formData.exampleSentence?.translation || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      exampleSentence: {
                        tribal: formData.exampleSentence?.tribal || '',
                        transliteration: formData.exampleSentence?.transliteration || '',
                        translation: e.target.value
                      }
                    })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Cultural Context</label>
                <textarea
                  rows={2}
                  placeholder="Traditions, spiritual significance or folklore associated with this word..."
                  value={formData.culturalContext || ''}
                  onChange={e => setFormData({ ...formData, culturalContext: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-vanisetu-primary focus:ring-vanisetu-primary"
                  />
                  <span className="text-xs font-medium text-gray-700">Mark as Featured Word</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-700">Status:</span>
                  <select
                    value={formData.verificationStatus}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        verificationStatus: e.target.value as AdminVocabulary['verificationStatus']
                      })
                    }
                    className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:ring-2 focus:ring-vanisetu-primary outline-none"
                  >
                    <option value="verified">Verified</option>
                    <option value="sample_pending_verification">Pending Verification</option>
                    <option value="needs_revision">Needs Revision</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-vanisetu-primary text-vanisetu-cream rounded-lg text-sm font-semibold hover:bg-vanisetu-primary-dark shadow disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingItem ? 'Update Word' : 'Create Word'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-vanisetu-primary/20 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-vanisetu-primary flex items-center gap-2">
                <Upload className="w-5 h-5 text-vanisetu-accent" />
                Bulk Import Vocabulary (JSON)
              </h3>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportStatus(null);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-vanisetu-text-muted">
              Paste an array of vocabulary entries containing <code>word</code>, <code>nativeScript</code>, <code>languageId</code>, and <code>englishMeaning</code>.
            </p>
            <textarea
              rows={8}
              value={importJsonText}
              onChange={e => setImportJsonText(e.target.value)}
              placeholder='[&#10;  {&#10;    "word": "Johar",&#10;    "nativeScript": "ᱡᱚᱦᱟᱨ",&#10;    "languageId": "santali",&#10;    "englishMeaning": "Greetings / Hello",&#10;    "partOfSpeech": "greeting"&#10;  }&#10;]'
              className="w-full border border-gray-200 rounded-lg p-3 text-xs font-mono focus:ring-2 focus:ring-vanisetu-primary outline-none"
            />
            {importStatus && (
              <p className="text-xs font-semibold text-vanisetu-primary">{importStatus}</p>
            )}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImportSubmit}
                disabled={!importJsonText.trim()}
                className="px-5 py-2 bg-vanisetu-primary text-vanisetu-cream rounded-lg text-xs font-bold hover:bg-vanisetu-primary-dark shadow disabled:opacity-50"
              >
                Import Entries
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
