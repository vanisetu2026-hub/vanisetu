import React from 'react';
import { Modal } from '../common/Modal';
import { Section } from '../../types';
import { CheckCircle2, ChevronRight, Compass, Layers, Lock } from 'lucide-react';

interface SectionSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: Section[];
  activeSectionId: string;
  onSelectSection: (sectionId: string) => void;
  languageName: string;
}

export const SectionSelectorModal: React.FC<SectionSelectorModalProps> = ({
  isOpen,
  onClose,
  sections,
  activeSectionId,
  onSelectSection,
  languageName,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${languageName} Sections`} maxWidth="lg">
      <div className="space-y-4 py-2">
        <p className="text-xs sm:text-sm text-teal-700 font-medium">
          Choose a section to view its curriculum path. Each section contains <strong>8 focused thematic units</strong> with interactive exercises, script practice, and milestone rewards.
        </p>

        <div className="space-y-3">
          {sections.map((sec) => {
            const isActive = sec.sectionId === activeSectionId;
            return (
              <button
                key={sec.sectionId}
                type="button"
                onClick={() => {
                  onSelectSection(sec.sectionId);
                  onClose();
                }}
                className={`
                  w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-start justify-between gap-4 group touch-manipulation
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-forest-50 to-cream-100 border-forest-600 shadow-earthy ring-2 ring-forest-500/30'
                      : 'bg-white hover:bg-cream-50 border-sage-300 hover:border-forest-400'
                  }
                `}
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-forest-600 text-cream-50'
                          : 'bg-cream-200 text-teal-800'
                      }`}
                    >
                      Section {sec.sectionNumber}
                    </span>
                    <span className="text-[11px] font-bold text-amber-700">
                      {sec.units.length} Units
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-black font-display text-teal-950">
                    {sec.title}
                  </h4>

                  <p className="text-xs text-teal-700 font-medium leading-relaxed">
                    {sec.description}
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] font-bold text-forest-700 bg-forest-100 px-2 py-0.5 rounded">
                      Units 1 - 8
                    </span>
                    <span className="text-[10px] text-teal-600 font-mono">
                      • ~40 Interactive Nodes
                    </span>
                  </div>
                </div>

                <div className="shrink-0 self-center">
                  {isActive ? (
                    <div className="w-8 h-8 rounded-full bg-forest-600 text-cream-50 flex items-center justify-center shadow-xs">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-cream-200 text-teal-600 flex items-center justify-center group-hover:bg-forest-100 group-hover:text-forest-700 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
