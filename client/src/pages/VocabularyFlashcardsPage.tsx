import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearning } from '../contexts/LearningContext';
import { VocabularyCard } from '../components/cards/VocabularyCard';
import { ProgressBar } from '../components/common/ProgressBar';
import { DICTIONARY_ITEMS } from '../data/tribalData';
import { ArrowLeft, BookOpen, Sparkles, Filter } from 'lucide-react';

export const VocabularyFlashcardsPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedLanguage, favorites, toggleFavorite } = useLearning();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Filter vocabulary by selected language
  const languageWords = DICTIONARY_ITEMS.filter(
    (item) => item.languageId === selectedLanguage.languageId
  );

  const displayWords =
    categoryFilter === 'All'
      ? languageWords
      : languageWords.filter((w) => w.category === categoryFilter);

  const [currentIndex, setCurrentIndex] = useState(0);

  const currentItem = displayWords[currentIndex] || languageWords[0];

  const categories = ['All', 'Greetings', 'Nature', 'Family', 'Everyday', 'Festival'];

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-sage-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2.5 rounded-2xl bg-cream-100 hover:bg-cream-300 border border-sage-300 text-teal-800 transition-colors"
            title="Back to dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-100 px-2.5 py-0.5 rounded-full">
                {selectedLanguage.name} Flashcards
              </span>
              <span className="text-xs text-teal-600 font-semibold">
                Interactive Vocabulary
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-teal-950 mt-1">
              Vocabulary Deck
            </h1>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-forest-600 shrink-0 hidden sm:block" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategoryFilter(cat);
                setCurrentIndex(0);
              }}
              className={`
                px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0
                ${
                  categoryFilter === cat
                    ? 'bg-forest-600 text-cream-50 shadow-sm'
                    : 'bg-cream-100 hover:bg-cream-200 text-teal-800 border border-sage-300'
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar through the deck */}
      {displayWords.length > 0 && (
        <div className="max-w-xl mx-auto">
          <ProgressBar
            current={currentIndex + 1}
            total={displayWords.length}
            color="gold"
            height="sm"
            showPercentage={true}
          />
        </div>
      )}

      {/* Main Flashcard Component */}
      {currentItem ? (
        <div className="py-4">
          <VocabularyCard
            item={currentItem}
            currentIndex={currentIndex}
            totalItems={displayWords.length}
            onNext={() => setCurrentIndex((prev) => Math.min(prev + 1, displayWords.length - 1))}
            onPrev={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
            isFavorite={favorites.includes(currentItem.vocabularyId)}
            onToggleFavorite={() => toggleFavorite(currentItem.vocabularyId)}
          />
        </div>
      ) : (
        <div className="text-center py-12 bg-cream-100 rounded-3xl border-2 border-sage-200">
          <BookOpen className="w-10 h-10 text-teal-400 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-teal-900">No words found in this category</h3>
          <p className="text-xs text-teal-600 mt-1">Try switching to &quot;All&quot; categories.</p>
        </div>
      )}

      {/* Verification footnote */}
      <div className="p-3 bg-cream-50 rounded-2xl border border-sage-200 text-center text-xs text-teal-700 font-medium">
        <Sparkles className="w-3.5 h-3.5 text-gold-500 inline mr-1.5" />
        Sample Content — Curated with indigenous phonetics. Native speaker verified updates added continually.
      </div>
    </div>
  );
};
