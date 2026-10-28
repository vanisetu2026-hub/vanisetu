import React, { useState, useEffect, useMemo } from 'react';
import {
  HelpCircle,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Copy,
  Download,
  Upload,
  Play,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  Volume2,
  Image as ImageIcon,
  Sparkles,
  BookOpen,
  ShieldCheck,
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import { LESSON_INTRODUCED_VOCABULARY } from '../../data/tribalData';
import type { AdminQuestion, AdminLesson, AdminLanguage, QuestionType } from '../../types';

const QUESTION_TYPES: { id: QuestionType; label: string; icon: string; desc: string }[] = [
  { id: 'multiple_choice', label: 'Multiple Choice', icon: '🔘', desc: 'Single correct answer from options' },
  { id: 'multiple_select', label: 'Multiple Select', icon: '☑️', desc: 'Choose all correct options' },
  { id: 'fill_blank', label: 'Fill in the Blank', icon: '✍️', desc: 'Fill the missing word or phrase' },
  { id: 'translation', label: 'Translation', icon: '🌐', desc: 'Translate tribal phrase to English/Hindi' },
  { id: 'match_pairs', label: 'Matching Pairs', icon: '🧩', desc: 'Connect words to their correct meaning' },
  { id: 'word_arrangement', label: 'Word Arrangement', icon: '🔤', desc: 'Reorder scrambled words into sentence' },
  { id: 'listening_comprehension', label: 'Listening Comprehension', icon: '🎧', desc: 'Listen to spoken audio and select answer' },
  { id: 'audio_pronunciation', label: 'Audio Pronunciation', icon: '🎙️', desc: 'Listen and practice authentic pronunciation' },
  { id: 'image_based', label: 'Image-Based', icon: '🖼️', desc: 'Identify cultural artifact, craft or item' },
  { id: 'true_false', label: 'True or False', icon: '⚖️', desc: 'Verify if statement is accurate' },
  { id: 'short_answer', label: 'Short Answer', icon: '📝', desc: 'Type brief tribal response' },
  { id: 'vocabulary_recognition', label: 'Vocab Recognition', icon: '📖', desc: 'Match native script/word to pronunciation' }
];

export const AdminQuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [lessons, setLessons] = useState<AdminLesson[]>([]);
  const [languages, setLanguages] = useState<AdminLanguage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLesson, setSelectedLesson] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // Modals
  const [showEditor, setShowEditor] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<AdminQuestion | null>(null);
  const [previewQuestion, setPreviewQuestion] = useState<AdminQuestion | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<AdminQuestion>>({
    questionText: '',
    questionType: 'multiple_choice',
    languageId: 'santali',
    lessonId: 'les-snt-01',
    moduleId: 'mod-snt-01',
    difficulty: 'easy',
    options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
    correctAnswer: 'Option 1',
    explanation: '',
    hint: '',
    audioURL: '',
    imageURL: '',
    xpReward: 10,
    timeLimit: 30,
    sequence: 1,
    status: 'published'
  });
  const [optionsInput, setOptionsInput] = useState('Option 1\nOption 2\nOption 3\nOption 4');
  const [correctAnswerInput, setCorrectAnswerInput] = useState('Option 1');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Interactive preview state
  const [previewAnswer, setPreviewAnswer] = useState<string>('');
  const [previewChecked, setPreviewChecked] = useState<boolean>(false);
  const [previewIsCorrect, setPreviewIsCorrect] = useState<boolean>(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [qData, lData, langData] = await Promise.all([
        adminApi.getQuestions(),
        adminApi.getLessons(),
        adminApi.getLanguages()
      ]);
      setQuestions(qData);
      setLessons(lData);
      setLanguages(langData);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openNewModal = () => {
    setEditingQuestion(null);
    const initialLesson = lessons[0]?.lessonId || 'les-snt-01';
    const initialLang = lessons[0]?.languageId || 'santali';
    const initialMod = lessons[0]?.moduleId || 'mod-snt-01';
    setFormData({
      questionText: '',
      questionType: 'multiple_choice',
      languageId: initialLang,
      lessonId: initialLesson,
      moduleId: initialMod,
      difficulty: 'easy',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 'Option A',
      explanation: 'Explanation for learners...',
      hint: 'Remember the key greeting tone.',
      audioURL: '',
      imageURL: '',
      xpReward: 10,
      timeLimit: 30,
      sequence: questions.length + 1,
      status: 'published'
    });
    setOptionsInput('Option A\nOption B\nOption C\nOption D');
    setCorrectAnswerInput('Option A');
    setValidationError(null);
    setShowEditor(true);
  };

  const openEditModal = (q: AdminQuestion) => {
    setEditingQuestion(q);
    setFormData({ ...q });
    setOptionsInput(Array.isArray(q.options) ? q.options.join('\n') : '');
    setCorrectAnswerInput(
      Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : (q.correctAnswer || '')
    );
    setValidationError(null);
    setShowEditor(true);
  };

  const handleDuplicate = async (q: AdminQuestion) => {
    try {
      const duplicated = {
        ...q,
        questionText: `${q.questionText} (Copy)`,
        sequence: q.sequence + 1
      };
      delete (duplicated as { questionId?: string }).questionId;
      await adminApi.createQuestion(duplicated);
      await loadData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to duplicate question');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await adminApi.deleteQuestion(id);
      await loadData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete question');
    }
  };

  const validateQuestion = (): boolean => {
    if (!formData.questionText?.trim()) {
      setValidationError('Question text is required.');
      return false;
    }

    const type = formData.questionType;
    const opts = optionsInput.split('\n').map(o => o.trim()).filter(Boolean);

    if (['multiple_choice', 'multiple_select', 'image_based', 'vocabulary_recognition'].includes(type || '')) {
      if (opts.length < 2) {
        setValidationError(`At least 2 options are required for ${type} questions.`);
        return false;
      }
    }

    if (!correctAnswerInput.trim()) {
      setValidationError('Correct answer cannot be empty.');
      return false;
    }

    if (type === 'multiple_choice' && !opts.includes(correctAnswerInput.trim())) {
      setValidationError('Correct answer must match one of the listed options.');
      return false;
    }

    if (type === 'listening_comprehension' && !formData.audioURL?.trim()) {
      setValidationError('Listening Comprehension questions require an Audio URL.');
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateQuestion()) return;

    try {
      setSaving(true);
      const opts = optionsInput.split('\n').map(o => o.trim()).filter(Boolean);
      let parsedCorrect: string | string[] = correctAnswerInput.trim();

      if (formData.questionType === 'multiple_select') {
        parsedCorrect = correctAnswerInput.split(',').map(s => s.trim()).filter(Boolean);
      }

      const payload: Partial<AdminQuestion> = {
        ...formData,
        options: opts.length > 0 ? opts : undefined,
        correctAnswer: parsedCorrect
      };

      if (editingQuestion) {
        await adminApi.updateQuestion(editingQuestion.questionId, payload);
      } else {
        await adminApi.createQuestion(payload);
      }
      setShowEditor(false);
      await loadData();
    } catch (err: unknown) {
      setValidationError(err instanceof Error ? err.message : 'Failed to save question');
    } finally {
      setSaving(false);
    }
  };

  // Preview interactive handlers
  const openPreview = (q: AdminQuestion) => {
    setPreviewQuestion(q);
    setPreviewAnswer('');
    setPreviewChecked(false);
    setPreviewIsCorrect(false);
  };

  const handleCheckPreview = () => {
    if (!previewQuestion) return;
    setPreviewChecked(true);
    const correct = previewQuestion.correctAnswer;
    if (Array.isArray(correct)) {
      setPreviewIsCorrect(correct.includes(previewAnswer.trim()));
    } else {
      setPreviewIsCorrect(correct.toLowerCase().trim() === previewAnswer.toLowerCase().trim());
    }
  };

  // Export questions to JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(questions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `vanisetu_questions_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Bulk import
  const handleImportSubmit = async () => {
    try {
      setImportStatus('Importing...');
      const parsed = JSON.parse(importJsonText);
      if (!Array.isArray(parsed)) {
        throw new Error('Import data must be a JSON array of question objects.');
      }
      const res = await adminApi.bulkImportQuestions(parsed);
      setImportStatus(`Successfully imported ${res.importedCount} questions!`);
      setTimeout(() => {
        setShowImportModal(false);
        setImportStatus(null);
        setImportJsonText('');
        loadData();
      }, 1200);
    } catch (err: unknown) {
      setImportStatus(`Import Error: ${err instanceof Error ? err.message : 'Invalid JSON'}`);
    }
  };

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchesSearch =
        q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.questionId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || q.questionType === selectedType;
      const matchesLesson = selectedLesson === 'all' || q.lessonId === selectedLesson;
      const matchesDiff = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
      return matchesSearch && matchesType && matchesLesson && matchesDiff;
    });
  }, [questions, searchQuery, selectedType, selectedLesson, selectedDifficulty]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-vanisetu-primary flex items-center gap-2">
            <HelpCircle className="w-7 h-7 text-vanisetu-accent" />
            Question Management System
          </h1>
          <p className="text-sm text-vanisetu-text-muted mt-1">
            Build, validate, preview and calibrate all 12 exercise and assessment types for tribal lessons.
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
            Add Question
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-vanisetu-primary/10 shadow-sm">
          <p className="text-xs text-vanisetu-text-muted font-medium">Total Questions</p>
          <p className="text-2xl font-bold text-vanisetu-primary mt-0.5">{questions.length}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-vanisetu-primary/10 shadow-sm">
          <p className="text-xs text-vanisetu-text-muted font-medium">Published Questions</p>
          <p className="text-2xl font-bold text-green-700 mt-0.5">
            {questions.filter(q => q.status === 'published').length}
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-vanisetu-primary/10 shadow-sm">
          <p className="text-xs text-vanisetu-text-muted font-medium">Drafts</p>
          <p className="text-2xl font-bold text-amber-600 mt-0.5">
            {questions.filter(q => q.status === 'draft').length}
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-vanisetu-primary/10 shadow-sm">
          <p className="text-xs text-vanisetu-text-muted font-medium">Question Types Active</p>
          <p className="text-2xl font-bold text-vanisetu-accent mt-0.5">
            {new Set(questions.map(q => q.questionType)).size} / 12
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-vanisetu-primary/10 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by question text or ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-vanisetu-primary focus:border-transparent outline-none"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-vanisetu-text-muted">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters:</span>
            </div>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-vanisetu-primary outline-none"
            >
              <option value="all">All Types (12)</option>
              {QUESTION_TYPES.map(t => (
                <option key={t.id} value={t.id}>
                  {t.icon} {t.label}
                </option>
              ))}
            </select>
            <select
              value={selectedLesson}
              onChange={e => setSelectedLesson(e.target.value)}
              className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-vanisetu-primary outline-none"
            >
              <option value="all">All Lessons</option>
              {lessons.map(l => (
                <option key={l.lessonId} value={l.lessonId}>
                  {l.title}
                </option>
              ))}
            </select>
            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
              className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-vanisetu-primary outline-none"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions Table */}
      <div className="bg-white rounded-xl border border-vanisetu-primary/10 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-vanisetu-text-muted">Loading questions repository...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 text-sm">{error}</div>
        ) : filteredQuestions.length === 0 ? (
          <div className="p-12 text-center text-sm text-vanisetu-text-muted">
            No questions found matching your filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-vanisetu-cream/60 border-b border-vanisetu-primary/10 text-xs text-vanisetu-primary font-semibold">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Question</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Lesson & Language</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4">XP</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredQuestions.map(q => {
                  const typeObj = QUESTION_TYPES.find(t => t.id === q.questionType);
                  const lesson = lessons.find(l => l.lessonId === q.lessonId);
                  const language = languages.find(lang => lang.languageId === q.languageId);

                  return (
                    <tr key={q.questionId} className="hover:bg-vanisetu-cream/20 transition">
                      <td className="py-3 px-4 text-xs font-mono text-gray-400">{q.sequence}</td>
                      <td className="py-3 px-4 max-w-sm">
                        <p className="font-medium text-vanisetu-primary line-clamp-2">{q.questionText}</p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-vanisetu-text-muted">
                          <span className="font-mono text-gray-400">{q.questionId}</span>
                          <span className="inline-flex items-center gap-0.5 text-forest-700 bg-forest-50 px-1.5 py-0.5 rounded text-[10px] font-semibold border border-forest-200" title="Strict prerequisite vocabulary compliant">
                            <ShieldCheck className="w-2.5 h-2.5 text-forest-600" /> Scaffolded
                          </span>
                          {q.audioURL && (
                            <span className="inline-flex items-center gap-0.5 text-blue-600">
                              <Volume2 className="w-3 h-3" /> Audio
                            </span>
                          )}
                          {q.imageURL && (
                            <span className="inline-flex items-center gap-0.5 text-purple-600">
                              <ImageIcon className="w-3 h-3" /> Image
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-vanisetu-primary/5 text-vanisetu-primary border border-vanisetu-primary/10">
                          <span>{typeObj?.icon || '❓'}</span>
                          <span>{typeObj?.label || q.questionType}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs">
                        <p className="font-medium text-gray-700">{lesson?.title || q.lessonId}</p>
                        <p className="text-vanisetu-text-muted text-[11px]">
                          {language?.name || q.languageId}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                            q.difficulty === 'easy'
                              ? 'bg-green-100 text-green-700'
                              : q.difficulty === 'medium'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {q.difficulty}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs font-semibold text-vanisetu-accent">
                        +{q.xpReward} XP
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            q.status === 'published'
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : 'bg-gray-100 text-gray-600 border border-gray-200'
                          }`}
                        >
                          {q.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openPreview(q)}
                            title="Interactive Learner Preview"
                            className="p-1.5 text-gray-500 hover:text-vanisetu-primary hover:bg-vanisetu-cream/60 rounded-lg transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(q)}
                            title="Edit Question"
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDuplicate(q)}
                            title="Duplicate Question"
                            className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(q.questionId)}
                            title="Delete Question"
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

      {/* Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-vanisetu-primary/20 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-vanisetu-primary flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-vanisetu-accent" />
                {editingQuestion ? 'Edit Question' : 'Add New Question'}
              </h2>
              <button
                onClick={() => setShowEditor(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {validationError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Question Type *</label>
                  <select
                    value={formData.questionType}
                    onChange={e =>
                      setFormData({ ...formData, questionType: e.target.value as QuestionType })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none"
                  >
                    {QUESTION_TYPES.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.icon} {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Difficulty *</label>
                  <select
                    value={formData.difficulty}
                    onChange={e =>
                      setFormData({ ...formData, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none"
                  >
                    <option value="easy">Easy (Beginner)</option>
                    <option value="medium">Medium (Intermediate)</option>
                    <option value="hard">Hard (Advanced)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Target Language *</label>
                  <select
                    value={formData.languageId}
                    onChange={e => setFormData({ ...formData, languageId: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none"
                  >
                    {languages.map(lang => (
                      <option key={lang.languageId} value={lang.languageId}>
                        {lang.name} ({lang.nativeName})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Parent Lesson *</label>
                  <select
                    value={formData.lessonId}
                    onChange={e => setFormData({ ...formData, lessonId: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none"
                  >
                    {lessons.map(les => (
                      <option key={les.lessonId} value={les.lessonId}>
                        {les.title} ({les.languageId})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Prerequisite Scaffolding Inspector */}
              {formData.lessonId && LESSON_INTRODUCED_VOCABULARY[formData.lessonId] && (
                <div className="p-3.5 bg-forest-50/70 border border-forest-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-forest-900">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-forest-600" />
                      <span>Introduced Lesson Vocabulary (Prerequisite Rule)</span>
                    </span>
                    <span className="text-[10px] bg-forest-100 text-forest-800 px-2 py-0.5 rounded font-extrabold">
                      {LESSON_INTRODUCED_VOCABULARY[formData.lessonId].length} Taught Words
                    </span>
                  </div>
                  <p className="text-[11px] text-forest-700 leading-tight">
                    Strict Prerequisite Rule: All questions, answers, and distractors must strictly use only words introduced in this lesson or previous lessons.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {LESSON_INTRODUCED_VOCABULARY[formData.lessonId].map((v, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-forest-300 text-xs text-forest-900 font-semibold shadow-xs"
                        title={`${v.englishMeaning} / ${v.hindiMeaning}`}
                      >
                        <strong className="text-forest-700">{v.word}</strong>
                        {v.nativeScript && v.nativeScript !== v.word && (
                          <span className="text-[10px] text-gray-500 font-mono">({v.nativeScript})</span>
                        )}
                        <span className="text-[10px] text-gray-400">• {v.englishMeaning}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Question Prompt / Text *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g., What is the authentic Santali greeting for 'Good Morning'?"
                  value={formData.questionText}
                  onChange={e => setFormData({ ...formData, questionText: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none"
                />
              </div>

              {/* Options */}
              {['multiple_choice', 'multiple_select', 'image_based', 'vocabulary_recognition'].includes(
                formData.questionType || ''
              ) && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Answer Options (One per line) *
                  </label>
                  <textarea
                    rows={4}
                    value={optionsInput}
                    onChange={e => setOptionsInput(e.target.value)}
                    placeholder="Option 1&#10;Option 2&#10;Option 3&#10;Option 4"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-vanisetu-primary outline-none"
                  />
                  <p className="text-[11px] text-vanisetu-text-muted mt-0.5">
                    Write each choice on a new line.
                  </p>
                </div>
              )}

              {/* Correct Answer */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Correct Answer *
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    formData.questionType === 'multiple_select'
                      ? 'Comma-separated (e.g., Option 1, Option 3)'
                      : 'Exact correct answer or option text'
                  }
                  value={correctAnswerInput}
                  onChange={e => setCorrectAnswerInput(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none"
                />
              </div>

              {/* Explanation & Hint */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Explanation</label>
                  <input
                    type="text"
                    placeholder="Why this answer is correct..."
                    value={formData.explanation || ''}
                    onChange={e => setFormData({ ...formData, explanation: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Learner Hint</label>
                  <input
                    type="text"
                    placeholder="Clue provided if learner is stuck..."
                    value={formData.hint || ''}
                    onChange={e => setFormData({ ...formData, hint: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none"
                  />
                </div>
              </div>

              {/* Media URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Audio URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="/audio/pronunciation.mp3"
                    value={formData.audioURL || ''}
                    onChange={e => setFormData({ ...formData, audioURL: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Image URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="/images/craft.png"
                    value={formData.imageURL || ''}
                    onChange={e => setFormData({ ...formData, imageURL: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none"
                  />
                </div>
              </div>

              {/* XP, Status & Ordering */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">XP Reward</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={formData.xpReward}
                    onChange={e => setFormData({ ...formData, xpReward: parseInt(e.target.value) || 10 })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Sequence #</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.sequence}
                    onChange={e => setFormData({ ...formData, sequence: parseInt(e.target.value) || 1 })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={e =>
                      setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowEditor(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-vanisetu-primary text-vanisetu-cream rounded-lg text-sm font-semibold hover:bg-vanisetu-primary-dark transition shadow-md disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingQuestion ? 'Update Question' : 'Create Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Live Learner Preview Modal */}
      {previewQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border-2 border-vanisetu-primary/30 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-vanisetu-accent/10 text-vanisetu-accent rounded-lg">
                  <Play className="w-4 h-4 fill-vanisetu-accent" />
                </span>
                <span className="text-sm font-bold text-vanisetu-primary">Learner Interactive Preview</span>
              </div>
              <button
                onClick={() => setPreviewQuestion(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Duolingo-style question card */}
            <div className="bg-vanisetu-cream/40 rounded-xl p-5 border border-vanisetu-primary/10 space-y-4">
              <div className="flex items-center justify-between text-xs text-vanisetu-text-muted">
                <span className="uppercase font-semibold tracking-wider text-vanisetu-accent">
                  {previewQuestion.questionType.replace('_', ' ')}
                </span>
                <span className="font-semibold text-green-700">+{previewQuestion.xpReward} XP</span>
              </div>

              <h3 className="text-base font-bold text-vanisetu-primary">
                {previewQuestion.questionText}
              </h3>

              {previewQuestion.imageURL && (
                <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200">
                  <img
                    src={previewQuestion.imageURL}
                    alt="Question artifact"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}

              {previewQuestion.audioURL && (
                <div className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-vanisetu-primary/20">
                  <button
                    type="button"
                    onClick={() => {
                      const audio = new Audio(previewQuestion.audioURL);
                      audio.play().catch(() => alert('Audio file not found at path'));
                    }}
                    className="p-2 bg-vanisetu-primary text-vanisetu-cream rounded-full hover:bg-vanisetu-primary-dark transition"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-vanisetu-text-muted font-medium">Click to hear spoken audio</span>
                </div>
              )}

              {/* Options rendering */}
              {previewQuestion.options && previewQuestion.options.length > 0 ? (
                <div className="grid grid-cols-1 gap-2 pt-2">
                  {previewQuestion.options.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setPreviewAnswer(opt);
                        setPreviewChecked(false);
                      }}
                      className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition ${
                        previewAnswer === opt
                          ? 'border-vanisetu-primary bg-vanisetu-primary/10 text-vanisetu-primary shadow-sm'
                          : 'border-gray-200 bg-white hover:border-vanisetu-primary/40'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="pt-2">
                  <input
                    type="text"
                    placeholder="Type your answer here..."
                    value={previewAnswer}
                    onChange={e => {
                      setPreviewAnswer(e.target.value);
                      setPreviewChecked(false);
                    }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none"
                  />
                </div>
              )}

              {/* Feedback banner */}
              {previewChecked && (
                <div
                  className={`p-3.5 rounded-xl border text-xs font-medium flex items-start gap-2.5 ${
                    previewIsCorrect
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}
                >
                  {previewIsCorrect ? (
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-bold">{previewIsCorrect ? 'Splendid! Correct Answer' : 'Incorrect'}</p>
                    <p className="mt-0.5">{previewQuestion.explanation || 'No explanation provided.'}</p>
                  </div>
                </div>
              )}

              {/* Check answer button */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={!previewAnswer}
                  onClick={handleCheckPreview}
                  className="w-full py-2.5 bg-vanisetu-primary text-vanisetu-cream rounded-xl text-sm font-bold hover:bg-vanisetu-primary-dark transition shadow-md disabled:opacity-40"
                >
                  Check Answer
                </button>
              </div>
            </div>
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
                Bulk Import Questions (JSON)
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
              Paste a JSON array containing question items with <code>questionText</code>, <code>questionType</code>, <code>languageId</code>, <code>lessonId</code>, and <code>correctAnswer</code>.
            </p>
            <textarea
              rows={8}
              value={importJsonText}
              onChange={e => setImportJsonText(e.target.value)}
              placeholder='[&#10;  {&#10;    "questionText": "Sample Santali greeting?",&#10;    "questionType": "multiple_choice",&#10;    "languageId": "santali",&#10;    "lessonId": "les-snt-01",&#10;    "options": ["Johar", "Namaste", "Hello"],&#10;    "correctAnswer": "Johar",&#10;    "difficulty": "easy"&#10;  }&#10;]'
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
                Import Questions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
