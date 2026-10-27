import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { Heart, Globe2, Sparkles, BookOpen, Instagram } from 'lucide-react';

const XIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const Footer: React.FC = () => {
  return (
    <footer className="bg-cream-100 border-t-2 border-sage-200 mt-20 pt-16 pb-12 text-teal-800">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info & Social Links */}
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

            {/* Social Media Links */}
            <div className="pt-2">
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-2.5">
                Connect With Us
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/vanisetu2026?utm_source=qr&cplk=MTN3cDJoanFrajJhcw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-2xl bg-cream-50 hover:bg-forest-600 text-forest-700 hover:text-cream-50 border-2 border-sage-300 hover:border-forest-600 flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-105 group"
                  title="Follow VANISETU on Instagram"
                  aria-label="VANISETU Instagram"
                >
                  <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </a>

                <a
                  href="https://x.com/vanisetu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-2xl bg-cream-50 hover:bg-forest-600 text-forest-700 hover:text-cream-50 border-2 border-sage-300 hover:border-forest-600 flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-105 group"
                  title="Follow VANISETU on X (Twitter)"
                  aria-label="VANISETU on X"
                >
                  <XIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </a>
              </div>
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

          <div className="flex items-center gap-4 flex-wrap justify-center">
            {/* Quick social handles */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/vanisetu2026?utm_source=qr&cplk=MTN3cDJoanFrajJhcw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-forest-700 transition-colors flex items-center gap-1 font-bold"
              >
                <Instagram className="w-3.5 h-3.5 text-forest-600" />
                <span>@vanisetu2026</span>
              </a>
              <span className="text-sage-400">•</span>
              <a
                href="https://x.com/vanisetu"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-forest-700 transition-colors flex items-center gap-1 font-bold"
              >
                <XIcon className="w-3.5 h-3.5 text-forest-600" />
                <span>@vanisetu</span>
              </a>
            </div>

            <div className="hidden sm:inline text-sage-400">|</div>

            <div className="flex items-center gap-1">
              <span>Built with</span>
              <Heart className="w-3.5 h-3.5 text-terracotta-500 fill-current inline" />
              <span>for tribal revitalization • VANISETU © 2026</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
