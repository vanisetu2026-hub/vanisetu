import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { Heart, Globe2, Sparkles, BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-cream-100 border-t-2 border-sage-200 mt-20 pt-16 pb-12 text-teal-800">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Logo size="md" showTagline={true} />
            <p className="text-sm text-teal-700 leading-relaxed font-medium">
              VANISETU is a digital bridge for tribal languages. Dedicated to learning,
              preserving, and revitalizing indigenous linguistic wisdom and oral heritage.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-forest-700">
              <Sparkles className="w-4 h-4 text-gold-500" />
              <span>Because every language carries a culture.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-forest-700 mb-4 text-base">Explore</h4>
            <ul className="space-y-2.5 text-sm font-semibold text-teal-700">
              <li>
                <Link to="/languages" className="hover:text-forest-600 transition-colors flex items-center gap-1.5">
                  <Globe2 className="w-4 h-4 text-forest-500" />
                  <span>Tribal Languages</span>
                </Link>
              </li>
              <li>
                <Link to="/learn" className="hover:text-forest-600 transition-colors flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-forest-500" />
                  <span>Interactive Lessons</span>
                </Link>
              </li>
              <li>
                <Link to="/dictionary" className="hover:text-forest-600 transition-colors">
                  Digital Dictionary
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-forest-600 transition-colors">
                  Oral Traditions & Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* Supported Languages */}
          <div>
            <h4 className="font-display font-bold text-forest-700 mb-4 text-base">Languages</h4>
            <ul className="space-y-2 text-sm text-teal-700 font-medium">
              <li className="flex items-center justify-between">
                <span>Mundari (मुंडारी)</span>
                <span className="text-xs bg-forest-100 text-forest-700 px-2 py-0.5 rounded-full font-bold">Live</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Santali (ᱥᱟᱱᱛᱟᱲᱤ)</span>
                <span className="text-xs bg-forest-100 text-forest-700 px-2 py-0.5 rounded-full font-bold">Live</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Ho (ᱦᱳ)</span>
                <span className="text-xs bg-forest-100 text-forest-700 px-2 py-0.5 rounded-full font-bold">Live</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Kurukh (कुड़ुख़)</span>
                <span className="text-xs bg-forest-100 text-forest-700 px-2 py-0.5 rounded-full font-bold">Live</span>
              </li>
            </ul>
          </div>

          {/* Cultural Preservation Mission */}
          <div>
            <h4 className="font-display font-bold text-forest-700 mb-4 text-base">Preservation</h4>
            <p className="text-xs text-teal-700 leading-relaxed font-medium mb-3">
              We collaborate with native speakers, folk cultural elders, and linguistic researchers. All community contributions are reviewed with cultural reverence.
            </p>
            <Link
              to="/community"
              className="inline-block text-xs font-bold text-forest-700 bg-forest-50 border-2 border-forest-300 px-3.5 py-1.5 rounded-xl hover:bg-forest-100 transition-colors"
            >
              Contribute a Word or Story
            </Link>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="pt-8 border-t border-sage-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-teal-600 text-center sm:text-left">
          <p className="italic font-display font-bold text-teal-800 text-sm">
            &ldquo;Learn a language. Connect with a culture. Preserve a heritage.&rdquo;
          </p>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-terracotta-500 fill-current inline" />
            <span>for indigenous linguistic revitalization • VANISETU © 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
