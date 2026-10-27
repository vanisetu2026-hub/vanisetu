import React, { useState } from 'react';
import { useLearning } from '../contexts/LearningContext';
import { useAuth } from '../contexts/AuthContext';
import { LANGUAGES } from '../data/tribalData';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import {
  Users2,
  Scroll,
  Heart,
  PlusCircle,
  Sparkles,
  MapPin,
  Globe2,
  BookOpen,
  Filter,
} from 'lucide-react';

export const CommunityPage: React.FC = () => {
  const { communityContributions, addContribution, likeContribution, isContributionLiked } = useLearning();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'all' | 'story' | 'song' | 'proverb' | 'word'>('all');
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state for contribution
  const [contentType, setContentType] = useState<'word' | 'story' | 'song' | 'proverb'>('story');
  const [languageId, setLanguageId] = useState('mundari');
  const [title, setTitle] = useState('');
  const [tribalText, setTribalText] = useState('');
  const [content, setContent] = useState('');
  const [translation, setTranslation] = useState('');
  const [culturalContext, setCulturalContext] = useState('');
  const [region, setRegion] = useState('');

  const filteredContributions = communityContributions.filter((item) => {
    if (activeTab !== 'all' && item.contentType !== activeTab) return false;
    if (selectedLanguageFilter !== 'all' && item.languageId !== selectedLanguageFilter) return false;
    return item.moderationStatus === 'approved';
  });

  const handleSubmitContribution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !translation) return;

    addContribution({
      uid: user?.uid || 'anonymous',
      authorName: user?.name ? `${user.name} (Contributor)` : 'Community Elder',
      languageId,
      contentType,
      title,
      content,
      tribalText,
      translation,
      culturalContext,
      region: region || 'Jharkhand, India',
    });

    // Reset and close
    setTitle('');
    setTribalText('');
    setContent('');
    setTranslation('');
    setCulturalContext('');
    setRegion('');
    setIsModalOpen(false);
  };

  const tabs = [
    { id: 'all', label: 'All Heritage' },
    { id: 'story', label: 'Folk Tales & Legends' },
    { id: 'song', label: 'Traditional Songs' },
    { id: 'proverb', label: 'Proverbs & Sayings' },
  ];

  return (
    <div className="space-y-8 py-2">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-terracotta-500 via-terracotta-600 to-forest-700 text-cream-50 rounded-3xl p-6 sm:p-8 shadow-earthy flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-cream-100/20 px-3 py-1 rounded-full text-xs font-bold text-gold-300">
            <Scroll className="w-3.5 h-3.5" />
            <span>Oral Traditions & Folklore</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight">
            Cultural Preservation Sanctuary
          </h1>
          <p className="text-sm text-cream-100 leading-relaxed font-medium">
            Tribal languages carry sacred songs, oral cosmologies, and proverbs passed down through millennia.
            Contribute and explore ancestral knowledge documented with cultural reverence.
          </p>
        </div>

        <Button
          variant="gold"
          size="lg"
          onClick={() => setIsModalOpen(true)}
          icon={<PlusCircle className="w-5 h-5" />}
          className="shrink-0"
        >
          Contribute Knowledge
        </Button>
      </div>

      {/* Filter Tabs & Language Selection */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-sage-200 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`
                px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0
                ${
                  activeTab === tab.id
                    ? 'bg-forest-600 text-cream-50 shadow-sm'
                    : 'bg-cream-100 hover:bg-cream-200 text-teal-800 border border-sage-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filter by Language */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-forest-600 shrink-0" />
          <select
            value={selectedLanguageFilter}
            onChange={(e) => setSelectedLanguageFilter(e.target.value)}
            className="bg-cream-100 border-2 border-sage-300 rounded-2xl px-3 py-1.5 text-xs font-bold text-teal-800 focus:border-forest-600 outline-none"
          >
            <option value="all">All Languages</option>
            {LANGUAGES.map((l) => (
              <option key={l.languageId} value={l.languageId}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Contributions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredContributions.map((item) => {
          const lang = LANGUAGES.find((l) => l.languageId === item.languageId);
          return (
            <div
              key={item.contributionId}
              className="bg-cream-100 border-2 border-sage-200 rounded-3xl p-6 sm:p-7 shadow-earthy hover:shadow-earthy-lg transition-all flex flex-col justify-between space-y-5"
            >
              <div>
                {/* Header: Type, Language & Region */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-forest-700 bg-forest-100 px-2.5 py-0.5 rounded-full">
                      {item.contentType}
                    </span>
                    <span className="text-xs font-bold text-teal-600 flex items-center gap-1">
                      <Globe2 className="w-3 h-3 text-forest-500" />
                      {lang?.name || item.languageId}
                    </span>
                  </div>

                  <span className="text-[11px] text-teal-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-terracotta-500" />
                    {item.region}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-extrabold font-display text-teal-950 mb-3">
                  {item.title}
                </h3>

                {/* Original Oral Text / Verse */}
                {item.tribalText && (
                  <div className="p-3.5 bg-cream-50 rounded-2xl border border-sage-200 mb-3 text-sm font-bold text-forest-800 font-sans italic">
                    &ldquo;{item.tribalText}&rdquo;
                  </div>
                )}

                {/* Story/Narrative Body */}
                <p className="text-sm text-teal-800 leading-relaxed font-medium">
                  {item.content}
                </p>

                {/* Cultural Significance Context */}
                {item.culturalContext && (
                  <div className="mt-4 p-3 bg-forest-50/60 rounded-2xl border border-forest-200 text-xs text-forest-900 leading-snug">
                    <span className="font-bold block uppercase tracking-wider text-[10px] text-forest-700 mb-0.5">
                      Cultural Significance:
                    </span>
                    {item.culturalContext}
                  </div>
                )}
              </div>

              {/* Footer: Author attribution & Like Button */}
              <div className="pt-4 border-t border-sage-200 flex items-center justify-between text-xs text-teal-600 font-medium">
                <span>Preserved by <strong className="text-teal-900">{item.authorName}</strong></span>

                <button
                  type="button"
                  onClick={() => likeContribution(item.contributionId)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all active:scale-95 ${
                    isContributionLiked(item.contributionId)
                      ? 'bg-terracotta-100 text-terracotta-700 border border-terracotta-300 shadow-sm'
                      : 'bg-cream-200 hover:bg-cream-300 text-teal-700 hover:text-terracotta-600'
                  }`}
                  title={isContributionLiked(item.contributionId) ? 'Unlike' : 'Like'}
                  aria-label={isContributionLiked(item.contributionId) ? 'Unlike story' : 'Like story'}
                >
                  <Heart
                    className={`w-4 h-4 transition-transform ${
                      isContributionLiked(item.contributionId)
                        ? 'fill-current text-terracotta-600 scale-110'
                        : 'text-teal-600'
                    }`}
                  />
                  <span>{item.likesCount}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contribution Submission Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Contribute Cultural Knowledge"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmitContribution} className="space-y-4">
          <p className="text-xs text-teal-700 font-medium leading-relaxed mb-2">
            Share traditional oral songs, village stories, proverbs, or rare dialect phrases.
            All contributions undergo respectful elder verification before public publication.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-teal-800 mb-1">Content Type</label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value as typeof contentType)}
                className="w-full rounded-2xl bg-cream-50 border-2 border-sage-300 py-2.5 px-3.5 text-sm font-bold text-teal-900 focus:border-forest-600 outline-none"
              >
                <option value="story">Folk Tale / Story</option>
                <option value="song">Traditional Song (Sereng)</option>
                <option value="proverb">Proverb / Wisdom (Binti)</option>
                <option value="word">Dialect Word / Phrase</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-teal-800 mb-1">Language</label>
              <select
                value={languageId}
                onChange={(e) => setLanguageId(e.target.value)}
                className="w-full rounded-2xl bg-cream-50 border-2 border-sage-300 py-2.5 px-3.5 text-sm font-bold text-teal-900 focus:border-forest-600 outline-none"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.languageId} value={l.languageId}>
                    {l.name} ({l.nativeName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Title / Heading"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Song of the Karam Harvest or Village Legend"
            required
          />

          <Input
            label="Original Tribal Text / Lyrics (if known)"
            value={tribalText}
            onChange={(e) => setTribalText(e.target.value)}
            placeholder="Lyrics or phrases in native script / transliteration"
          />

          <div>
            <label className="block text-xs font-bold text-teal-800 mb-1">
              Full Story, Lyrics, or Explanation
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              placeholder="Describe the folk tale, lyrical context, or story narrative..."
              className="w-full rounded-2xl bg-cream-50 border-2 border-sage-300 p-3.5 text-sm font-medium text-teal-900 focus:border-forest-600 outline-none"
              required
            />
          </div>

          <Input
            label="English or Hindi Translation"
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            placeholder="Meaning of the phrase, song, or proverb"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Cultural Context & Festival"
              value={culturalContext}
              onChange={(e) => setCulturalContext(e.target.value)}
              placeholder="e.g. Sung during Sarhul flower festival"
            />

            <Input
              label="Region / Village"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="e.g. Khunti, Jharkhand"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button type="button" variant="ghost" size="md" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" size="md" icon={<Sparkles className="w-4 h-4" />}>
              Submit for Verification
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
