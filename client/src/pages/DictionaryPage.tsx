import React, { useState } from 'react';
import { useLearning } from '../contexts/LearningContext';
import { DICTIONARY_ITEMS, LANGUAGES } from '../data/tribalData';
import { AudioPlayer } from '../components/common/AudioPlayer';
import { Input } from '../components/common/Input';
import {
  Search,
  BookOpen,
  Star,
  Globe2,
  Filter,
  Sparkles,
} from 'lucide-react';

export const DictionaryPage: React.FC = () => {
  const { favorites, toggleFavorite } = useLearning();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLangFilter, setSelectedLangFilter] = useState<string>('all');
  const [selectedCatFilter, setSelectedCatFilter] = useState<string>('all');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Filter items
  const filteredWords = DICTIONARY_ITEMS.filter((item) => {
    // Language check
    if (selectedLangFilter !== 'all' && item.languageId !== selectedLangFilter) {
      return false;
    }
    // Category check
    if (selectedCatFilter !== 'all' && item.category.toLowerCase() !== selectedCatFilter.toLowerCase()) {
      return false;
    }
    // Favorite check
    if (showOnlyFavorites && !favorites.includes(item.vocabularyId)) {
      return false;
    }
    // Search query check
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchWord = item.word.toLowerCase().includes(q);
      const matchNative = item.nativeScript?.toLowerCase().includes(q) || false;
      const matchTrans = item.transliteration.toLowerCase().includes(q);
      const matchMeaning = item.englishMeaning.toLowerCase().includes(q);
      const matchHindi = item.hindiMeaning.toLowerCase().includes(q);
      return matchWord || matchNative || matchTrans || matchMeaning || matchHindi;
    }
    return true;
  });

  const categories = ['all', 'Greetings', 'Nature', 'Family', 'Festival', 'Everyday'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-sage-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-forest-100 text-forest-700 text-xs font-bold px-3 py-1 rounded-full mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Tribal Lexicon & Digital Archive</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-teal-950">
            Digital Dictionary
          </h1>
          <p className="text-sm text-teal-700 font-medium mt-0.5">
            Search vocabulary, native scripts, transliterations, and audio across tribal languages.
          </p>
        </div>

        {/* Favorite count pill */}
        <button
          onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all border-2 ${
            showOnlyFavorites
              ? 'bg-gold-200 border-gold-500 text-teal-900 shadow-sm'
              : 'bg-cream-100 hover:bg-cream-200 border-sage-300 text-teal-800'
          }`}
        >
          <Star className={`w-4 h-4 ${showOnlyFavorites ? 'fill-gold-500 text-gold-600' : ''}`} />
          <span>Saved Words ({favorites.length})</span>
        </button>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-cream-100 border-2 border-sage-200 rounded-3xl p-5 shadow-sm space-y-4">
        {/* Search Input */}
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search in Mundari, Santali, Ho, Kurukh, English, or Hindi..."
          leftIcon={<Search className="w-5 h-5 text-forest-600" />}
          className="bg-cream-50 text-base"
        />

        {/* Filter Pills */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
          {/* Language Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-teal-600 mr-1 hidden lg:inline">Language:</span>
            <button
              onClick={() => setSelectedLangFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedLangFilter === 'all'
                  ? 'bg-forest-600 text-cream-50'
                  : 'bg-cream-200 text-teal-800 hover:bg-cream-300'
              }`}
            >
              All Languages
            </button>
            {LANGUAGES.map((l) => (
              <button
                key={l.languageId}
                onClick={() => setSelectedLangFilter(l.languageId)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedLangFilter === l.languageId
                    ? 'bg-forest-600 text-cream-50'
                    : 'bg-cream-200 text-teal-800 hover:bg-cream-300'
                }`}
              >
                {l.name}
              </button>
            ))}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <Filter className="w-3.5 h-3.5 text-teal-500 shrink-0 hidden sm:block" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCatFilter(cat)}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold capitalize transition-all shrink-0 ${
                  selectedCatFilter === cat
                    ? 'bg-gold-400 text-teal-950 font-bold'
                    : 'bg-cream-200 text-teal-700 hover:bg-cream-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dictionary Results List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-teal-600 px-2">
          <span>Found {filteredWords.length} dictionary entries</span>
          {showOnlyFavorites && <span>Filtered by Favorites ⭐</span>}
        </div>

        {filteredWords.length === 0 ? (
          <div className="text-center py-16 bg-cream-100 rounded-3xl border-2 border-sage-200">
            <Search className="w-12 h-12 text-teal-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-teal-900">No matching words found</h3>
            <p className="text-xs text-teal-600 mt-1 max-w-sm mx-auto">
              Try adjusting your search terms or clearing language and category filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredWords.map((item) => {
              const isFav = favorites.includes(item.vocabularyId);
              const lang = LANGUAGES.find((l) => l.languageId === item.languageId);

              return (
                <div
                  key={item.vocabularyId}
                  className="bg-cream-100 border-2 border-sage-200 hover:border-forest-300 rounded-3xl p-5 shadow-sm transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    {/* Header: Language & Star Bookmark */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-forest-700 bg-forest-50 border border-forest-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Globe2 className="w-3 h-3 text-forest-500" />
                        {lang?.name || item.languageId}
                      </span>

                      <button
                        onClick={() => toggleFavorite(item.vocabularyId)}
                        className="p-1 rounded-full hover:bg-cream-200 text-teal-400 hover:text-gold-500 transition-colors"
                        title={isFav ? 'Remove from favorites' : 'Save word'}
                        aria-label="Toggle favorite"
                      >
                        <Star className={`w-5 h-5 ${isFav ? 'fill-gold-500 text-gold-500' : ''}`} />
                      </button>
                    </div>

                    {/* Word Presentation */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        {item.nativeScript && item.nativeScript !== item.word && (
                          <p className="text-xl font-extrabold text-forest-700 font-sans">
                            {item.nativeScript}
                          </p>
                        )}
                        <h3 className="text-2xl font-extrabold font-display text-teal-950 mt-0.5">
                          {item.word}
                        </h3>
                        <p className="text-xs font-semibold text-teal-600 mt-0.5">
                          /{item.transliteration}/
                        </p>
                      </div>

                      <AudioPlayer
                        text={item.word}
                        languageId={item.languageId}
                        size="md"
                        variant="gold"
                      />
                    </div>

                    {/* Meanings */}
                    <div className="mt-3.5 pt-3 border-t border-sage-200">
                      <p className="text-base font-bold text-teal-900">
                        {item.englishMeaning}
                      </p>
                      {item.hindiMeaning && (
                        <p className="text-xs font-semibold text-forest-700 mt-0.5">
                          {item.hindiMeaning}
                        </p>
                      )}
                    </div>

                    {/* Example Sentence */}
                    {item.exampleSentence && (
                      <div className="mt-3 p-3 bg-cream-50 rounded-2xl border border-sage-200 text-xs space-y-1">
                        <span className="font-bold text-forest-700 block uppercase tracking-wider text-[10px]">
                          Usage Example:
                        </span>
                        <p className="font-bold text-teal-900">{item.exampleSentence.tribal}</p>
                        <p className="text-teal-700 italic">
                          &ldquo;{item.exampleSentence.translation}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Category & Status */}
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="font-bold text-teal-600 bg-cream-200 px-2 py-0.5 rounded-md">
                      {item.category}
                    </span>
                    <span className="text-forest-700 italic flex items-center gap-1 font-medium">
                      <Sparkles className="w-3 h-3 text-gold-500" />
                      Phonetic verified
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
