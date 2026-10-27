import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearning } from '../contexts/LearningContext';
import { LanguageCard } from '../components/cards/LanguageCard';
import { CulturalPattern } from '../components/common/CulturalPattern';
import { Globe2, ShieldCheck, Sparkles } from 'lucide-react';

export const LanguageSelectionPage: React.FC = () => {
  const { allLanguages, selectedLanguage, setSelectedLanguageId } = useLearning();
  const navigate = useNavigate();

  const handleSelectLanguage = (id: string) => {
    setSelectedLanguageId(id);
    navigate('/dashboard');
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2.5">
        <div className="inline-flex items-center gap-2 bg-cream-100 border border-sage-300 px-3.5 py-1 rounded-full text-xs font-bold text-forest-700">
          <Globe2 className="w-3.5 h-3.5 text-gold-500" />
          <span>Indigenous Languages of India</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-teal-950">
          Choose Your Language
        </h1>
        <p className="text-base sm:text-lg text-teal-700 font-medium">
          Discover a language. Connect with its culture.
        </p>

        <div className="pt-2">
          <CulturalPattern variant="strip" color="#214B32" />
        </div>
      </div>

      {/* Verification Notice / Methodology Badge */}
      <div className="max-w-4xl mx-auto p-4 bg-cream-50 border-2 border-dashed border-sage-300 rounded-2xl flex items-center gap-3 text-xs text-teal-800">
        <ShieldCheck className="w-5 h-5 text-forest-600 shrink-0" />
        <p>
          <span className="font-bold">Authenticity & Verification:</span> All curriculum modules are curated with respect to indigenous phonetics and folk traditions. Sample content is clearly marked as{' '}
          <span className="italic font-semibold text-forest-700">Pending Native Speaker Verification</span>{' '}
          and updated regularly with community educators.
        </p>
      </div>

      {/* Grid of Tribal Language Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {allLanguages.map((language) => (
          <LanguageCard
            key={language.languageId}
            language={language}
            isSelected={language.languageId === selectedLanguage.languageId}
            onSelect={handleSelectLanguage}
          />
        ))}
      </div>

      {/* Propose a language banner */}
      <div className="max-w-3xl mx-auto mt-12 p-6 bg-gradient-to-r from-forest-50 to-cream-100 border-2 border-forest-200 rounded-3xl text-center space-y-3">
        <Sparkles className="w-6 h-6 text-gold-500 mx-auto" />
        <h4 className="font-display font-bold text-lg text-forest-800">
          Speak Another Indigenous Language?
        </h4>
        <p className="text-xs text-teal-700 max-w-xl mx-auto leading-relaxed">
          We are expanding to support Gondi, Kui, Bhili, Garo, Khasi, and more. Join our linguistic preservation circle to contribute foundational words or stories.
        </p>
        <button
          onClick={() => navigate('/community')}
          className="text-xs font-bold text-forest-700 hover:text-forest-900 underline"
        >
          Contribute Cultural Knowledge →
        </button>
      </div>
    </div>
  );
};
