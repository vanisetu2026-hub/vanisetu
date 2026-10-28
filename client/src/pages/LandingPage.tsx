import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Footer } from '../components/layout/Footer';
import { CulturalPattern } from '../components/common/CulturalPattern';
import heroIllustration from '../assets/hero-illustration.jpg';
import {
  BookOpen,
  Volume2,
  BookA,
  Users2,
  Trophy,
  Globe2,
  Scroll,
  Cpu,
  ArrowRight,
  Sparkles,
  Heart,
  CheckCircle2,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const features = [
    {
      title: 'Learn from Basics',
      desc: 'Start from zero. Learn at your own pace through structured, bite-sized lessons designed for everyday fluency.',
      icon: BookOpen,
      color: 'bg-forest-100 text-forest-700',
    },
    {
      title: 'Listen & Speak',
      desc: 'Listen to native pronunciation and practice speaking. Authentic phonetic guidance and voice recognition support.',
      icon: Volume2,
      color: 'bg-gold-100 text-gold-700',
    },
    {
      title: 'Digital Dictionary',
      desc: 'Explore words, grammatical nuances, meanings in Hindi & English, audio recordings, and cultural usage examples.',
      icon: BookA,
      color: 'bg-mutedblue-100 text-mutedblue-700',
    },
    {
      title: 'Community Powered',
      desc: 'Contribute words, folk songs, and proverbs. Validated by native speaker elders to safeguard endangered dialects.',
      icon: Users2,
      color: 'bg-sage-100 text-sage-700',
    },
    {
      title: 'Gamified Learning',
      desc: 'Duolingo-inspired quizzes, daily streaks, XP points, and milestone badges that make learning deeply engaging.',
      icon: Trophy,
      color: 'bg-tribalpurple-100 text-tribalpurple-700',
    },
    {
      title: 'Explore Tribal Languages',
      desc: 'Discover Mundari, Santali (Ol Chiki), Ho (Warang Citi), Kurukh, and more regional cultural identities.',
      icon: Globe2,
      color: 'bg-forest-100 text-forest-700',
    },
    {
      title: 'Preserve Oral Traditions',
      desc: 'Safeguard ancestral folk tales, sacred grove (Sarna) stories, songs of Karam and Sarhul for future generations.',
      icon: Scroll,
      color: 'bg-terracotta-100 text-terracotta-700',
    },
    {
      title: 'Future Ready',
      desc: 'AI-assisted speech practice, script transliteration, digital language archiving, and open knowledge access.',
      icon: Cpu,
      color: 'bg-gold-100 text-gold-700',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-6 pb-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Cultural Geometric Border Accent */}
        <div className="mb-6 sm:mb-8">
          <CulturalPattern variant="strip" color="#214B32" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-cream-100 border-2 border-forest-300 px-3.5 py-1.5 rounded-full text-xs font-bold text-forest-800 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-500 fill-gold-500" />
              <span>A Digital Bridge for Tribal Languages</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold font-display text-forest-800 tracking-tight leading-[1.1]">
              Because every <br />
              <span className="text-gold-500 underline decoration-forest-400 decoration-wavy decoration-2">
                language
              </span>{' '}
              carries a culture.
            </h1>

            <p className="text-sm sm:text-lg lg:text-xl text-teal-800 font-medium max-w-2xl leading-relaxed mx-auto lg:mx-0">
              Learn tribal languages from the basics and help preserve the rich culture, stories,
              and heritage behind them. Interactive Duolingo-style lessons for Mundari, Santali,
              Ho, and Kurukh.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1 sm:pt-2">
              <Link to="/learn" className="w-full sm:w-auto">
                <Button
                  variant="gold"
                  size="lg"
                  fullWidth={true}
                  icon={<ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />}
                  iconPosition="right"
                >
                  Start Learning Free
                </Button>
              </Link>

              <Link to="/languages" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" fullWidth={true}>
                  Explore Languages
                </Button>
              </Link>
            </div>

            {/* Trust points */}
            <div className="pt-2 sm:pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-6 text-[11px] sm:text-xs font-bold text-teal-700">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-forest-600 shrink-0" />
                <span>100% Free & Open</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-forest-600 shrink-0" />
                <span>Native Elder Verified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-forest-600 shrink-0" />
                <span>Zero Ads</span>
              </div>
            </div>
          </div>

          {/* Right Hero Illustration: Culturally Respectful Learning & Intergenerational Bridge */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[340px] sm:max-w-md aspect-square bg-cream-100 rounded-3xl border-3 border-sage-300 shadow-earthy-lg overflow-hidden flex flex-col items-center justify-center group">
              <img
                src={heroIllustration}
                alt="Tribal elder teaching a child indigenous language and scripts on a digital tablet"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="eager"
              />

              {/* Gentle gradient overlay at bottom for the caption pill */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-teal-950/40 via-teal-950/10 to-transparent pointer-events-none" />

              <div className="absolute bottom-3 sm:bottom-4 left-3 right-3 sm:left-4 sm:right-4 bg-cream-50/95 backdrop-blur-md p-2 sm:p-2.5 rounded-2xl border border-sage-300 shadow-md text-[11px] sm:text-xs font-bold text-teal-950 flex items-center justify-center gap-1.5 text-center">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
                <span>Connecting Generations Through Digital Preservation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Language Quick Strip (Swipable on mobile) */}
      <section className="bg-forest-600 text-cream-100 py-4 sm:py-6 px-4 sm:px-6 lg:px-8 border-y-4 border-gold-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <Globe2 className="w-6 h-6 sm:w-7 sm:h-7 text-gold-400 shrink-0" />
            <div>
              <h4 className="font-display font-extrabold text-base sm:text-lg text-cream-50 leading-none">
                Supported Indigenous Languages
              </h4>
              <p className="text-[11px] sm:text-xs text-cream-200 mt-0.5">Verified sample courses ready to explore</p>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-1 md:pb-0 touch-pan-x">
            {[
              { name: 'Mundari', script: 'मुंडारी' },
              { name: 'Santali', script: 'ᱥᱟᱱᱛᱟᱲᱤ' },
              { name: 'Ho', script: 'ᱦᱳ' },
              { name: 'Kurukh', script: 'कुड़ुख़' },
            ].map((lang) => (
              <Link
                key={lang.name}
                to="/languages"
                className="bg-forest-700/80 hover:bg-forest-800 border border-forest-500 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl transition-all flex items-center gap-1.5 shrink-0 group"
              >
                <span className="font-bold text-cream-50 text-xs sm:text-sm">{lang.name}</span>
                <span className="text-[10px] sm:text-xs text-gold-300 font-medium">({lang.script})</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8 Feature Cards Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-2 sm:space-y-3">
          <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-forest-700 bg-forest-100 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full">
            Complete Learning Platform
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-display text-teal-950 leading-tight">
            Engineered for Fluency & Heritage Preservation
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-teal-700 font-medium">
            Everything you need to learn tribal languages from zero, understand native pronunciations,
            and explore centuries of oral wisdom.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                className="bg-cream-100 border-2 border-sage-200 rounded-3xl p-5 sm:p-7 shadow-earthy hover:shadow-earthy-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${feat.color} flex items-center justify-center mb-4 sm:mb-5 shadow-sm`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="font-display font-extrabold text-lg sm:text-xl text-teal-950 mb-1.5 sm:mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-teal-700 font-medium leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Cultural Mission Callout */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-cream-100 border-y-2 border-sage-200">
        <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
          <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-terracotta-500 mx-auto fill-current animate-pulse" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-forest-800">
            Preserving Voices Before They Fade
          </h2>
          <p className="text-xs sm:text-base lg:text-lg text-teal-800 font-medium leading-relaxed max-w-2xl mx-auto">
            According to UNESCO, indigenous languages across the world are disappearing at alarming rates.
            VANISETU bridges this gap with technology, empowering youth, educators, and communities to learn
            and document their heritage with pride.
          </p>
          <div className="pt-2">
            <Link to="/signup">
              <Button variant="gold" size="lg">
                Join the Movement
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
