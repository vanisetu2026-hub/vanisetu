import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLearning } from '../contexts/LearningContext';
import { useNotification } from '../contexts/NotificationContext';
import { ProgressBar } from '../components/common/ProgressBar';
import { Button } from '../components/common/Button';
import { PathNode, Unit, Section } from '../types';
import { getCurriculumSections, UNIT_THEMES } from '../data/curriculumData';
import { PathNodeCard } from '../components/cards/PathNodeCard';
import { UnitHeaderBanner } from '../components/lesson/UnitHeaderBanner';
import { UnitGuidebookModal } from '../components/lesson/UnitGuidebookModal';
import { ChestRewardModal } from '../components/lesson/ChestRewardModal';
import { ScriptPracticeModal } from '../components/lesson/ScriptPracticeModal';
import { SectionSelectorModal } from '../components/lesson/SectionSelectorModal';
import {
  Sparkles,
  Flame,
  ArrowRight,
  ArrowDown,
  BookOpen,
  Trophy,
  Target,
  Compass,
  Layers,
  ChevronDown,
} from 'lucide-react';

export const LearnPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { selectedLanguage, isLessonCompleted, completedLessons } = useLearning();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  // Load 3 Sections (each with 8 units) tailored to current tribal language
  const sections: Section[] = getCurriculumSections(selectedLanguage.languageId);

  // Claimed chests & completed script nodes (persistent in localStorage)
  const [claimedChests, setClaimedChests] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vanisetu_claimed_chests');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [completedScripts, setCompletedScripts] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vanisetu_completed_scripts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Check node completed state (checks context state, localStorage fallback, and user profile)
  const isNodeCompleted = (node: PathNode): boolean => {
    if (node.type === 'lesson' || node.type === 'trophy') {
      const lid = node.lessonId || '';
      return (
        isLessonCompleted(lid) ||
        isLessonCompleted(node.nodeId) ||
        completedLessons.includes(lid) ||
        completedLessons.includes(node.nodeId) ||
        (user?.completedLessons?.includes(lid) ?? false) ||
        (user?.completedLessons?.includes(node.nodeId) ?? false)
      );
    }
    if (node.type === 'chest') {
      return claimedChests.includes(node.nodeId);
    }
    if (node.type === 'script') {
      return completedScripts.includes(node.nodeId);
    }
    return false;
  };

  // Determine initial active section:
  // 1. Saved preference for this language
  // 2. Or the first section that contains an uncompleted unlocked lesson
  const getInitialSectionId = (): string => {
    try {
      const saved = localStorage.getItem(`vanisetu_active_section_${selectedLanguage.languageId}`);
      if (saved && sections.some((s) => s.sectionId === saved)) {
        return saved;
      }
      for (const sec of sections) {
        const hasPending = sec.units.some((u) =>
          u.nodes.some(
            (n) => (n.type === 'lesson' || n.type === 'trophy') && !isNodeCompleted(n)
          )
        );
        if (hasPending) {
          return sec.sectionId;
        }
      }
    } catch {
      // Fallback
    }
    return sections[0]?.sectionId || `${selectedLanguage.languageId}_sec_1`;
  };

  // Active Section state
  const [activeSectionId, setActiveSectionId] = useState<string>(getInitialSectionId);

  // References for active unit, active lesson node, path container, and user interaction
  const activeUnitRef = useRef<HTMLDivElement | null>(null);
  const activeNodeRef = useRef<HTMLDivElement | null>(null);
  const pathContainerRef = useRef<HTMLDivElement | null>(null);
  const userHasInteractedRef = useRef<boolean>(false);

  // If language changes, sync active section
  useEffect(() => {
    setActiveSectionId(getInitialSectionId());
    userHasInteractedRef.current = false;
  }, [selectedLanguage.languageId]);

  const handleSelectSection = (sectionId: string) => {
    setActiveSectionId(sectionId);
    try {
      localStorage.setItem(`vanisetu_active_section_${selectedLanguage.languageId}`, sectionId);
    } catch {
      // ignore
    }
    userHasInteractedRef.current = false;
  };

  const currentSection =
    sections.find((s) => s.sectionId === activeSectionId) || sections[0];

  // Modals state
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [selectedGuidebookUnit, setSelectedGuidebookUnit] = useState<Unit | null>(null);
  const [selectedChestNode, setSelectedChestNode] = useState<PathNode | null>(null);
  const [selectedScriptNode, setSelectedScriptNode] = useState<PathNode | null>(null);

  // Helper: check if a whole unit is unlocked
  const isUnitUnlocked = (unitIdx: number, allUnits: Unit[]): boolean => {
    // Unit 1 (index 0) is always unlocked
    if (unitIdx === 0) return true;
    const prevUnit = allUnits[unitIdx - 1];
    if (!prevUnit) return false;

    // Previous unit is unlocked if its finale trophy is completed,
    // OR if all previous unit core lessons are completed.
    const prevTrophy = prevUnit.nodes.find((n) => n.type === 'trophy');
    if (prevTrophy && isNodeCompleted(prevTrophy)) return true;

    const prevLessons = prevUnit.nodes.filter((n) => n.type === 'lesson');
    if (prevLessons.length > 0 && prevLessons.every((n) => isNodeCompleted(n))) {
      return true;
    }

    return false;
  };

  // Check node unlocked state
  const isNodeUnlocked = (
    node: PathNode,
    unitNodes: PathNode[],
    unitIdx: number,
    allUnits: Unit[]
  ): boolean => {
    // If the unit itself is locked, no node inside it is unlocked
    if (!isUnitUnlocked(unitIdx, allUnits)) return false;

    // First node of an unlocked unit is always unlocked
    const nodeIdx = unitNodes.findIndex((n) => n.nodeId === node.nodeId);
    if (nodeIdx === 0) return true;

    // Gather all prior core lessons in this unit before the current node
    const priorLessons = unitNodes.slice(0, nodeIdx).filter((n) => n.type === 'lesson');

    // If there are no prior core lessons, it is unlocked
    if (priorLessons.length === 0) return true;

    // If this node is a core lesson (e.g. Lesson 2):
    // Unlocks as soon as all prior core lessons in this unit are completed!
    // Never blocked by milestone chests or script glyphs.
    if (node.type === 'lesson') {
      return priorLessons.every((l) => isNodeCompleted(l));
    }

    // If this node is a trophy (unit finale):
    // Unlocks as soon as all core lessons in this unit are completed!
    if (node.type === 'trophy') {
      const allUnitLessons = unitNodes.filter((n) => n.type === 'lesson');
      return allUnitLessons.every((l) => isNodeCompleted(l));
    }

    // If this node is a milestone chest or script practice:
    // Unlocks as soon as the core lesson immediately preceding it is completed!
    const immediatePrecedingLesson = [...priorLessons].pop();
    if (immediatePrecedingLesson) {
      return isNodeCompleted(immediatePrecedingLesson);
    }

    return true;
  };

  // Find the single current active node in this section
  // Priority 1: First unlocked, uncompleted core lesson or trophy
  let activeNode: PathNode | null = null;
  let activeUnitForHeader = currentSection.units[0];

  for (const unit of currentSection.units) {
    const unitIdx = unit.unitNumber - 1;
    if (!isUnitUnlocked(unitIdx, currentSection.units)) continue;

    for (const node of unit.nodes) {
      if (node.type === 'lesson' || node.type === 'trophy') {
        const unlocked = isNodeUnlocked(node, unit.nodes, unitIdx, currentSection.units);
        const completed = isNodeCompleted(node);
        if (unlocked && !completed) {
          activeNode = node;
          activeUnitForHeader = unit;
          break;
        }
      }
    }
    if (activeNode) break;
  }

  // Priority 2: If all core lessons & trophies are done, check for unclaimed milestone chests or scripts
  if (!activeNode) {
    for (const unit of currentSection.units) {
      const unitIdx = unit.unitNumber - 1;
      if (!isUnitUnlocked(unitIdx, currentSection.units)) continue;

      for (const node of unit.nodes) {
        const unlocked = isNodeUnlocked(node, unit.nodes, unitIdx, currentSection.units);
        const completed = isNodeCompleted(node);
        if (unlocked && !completed) {
          activeNode = node;
          activeUnitForHeader = unit;
          break;
        }
      }
      if (activeNode) break;
    }
  }

  // Fallback to first node if everything is completed or default
  if (!activeNode) {
    activeNode = currentSection.units[0]?.nodes[0] || null;
    activeUnitForHeader = currentSection.units[0];
  }

  // User interaction detection: stop auto-scroll immediately if user scrolls or touches manually
  useEffect(() => {
    const onUserInteraction = () => {
      userHasInteractedRef.current = true;
    };

    const events: (keyof WindowEventMap)[] = ['wheel', 'touchmove', 'touchstart', 'keydown'];
    events.forEach((evt) => window.addEventListener(evt, onUserInteraction, { passive: true }));

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, onUserInteraction));
    };
  }, []);

  // Compute exact target scroll Y position accounting for sticky Navbar and UnitHeaderBanner
  const getScrollTargetY = (): number => {
    // If learner is at Unit 1 and the very first lesson, keep comfortably at the top of the page
    if (activeUnitForHeader.unitNumber === 1 && (activeNode?.order || 1) <= 1) {
      return 0;
    }

    const navbar = document.querySelector('header');
    const banner = document.querySelector('[data-sticky-banner="true"]');
    const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 56;
    const bannerHeight = banner ? banner.getBoundingClientRect().height : 110;
    const headerOffset = navbarHeight + bannerHeight + 16;

    // For Unit > 1, if active node is early in the unit (order <= 3), scroll to unit container/divider
    if (activeUnitForHeader.unitNumber > 1 && (activeNode?.order || 1) <= 3 && activeUnitRef.current) {
      const rect = activeUnitRef.current.getBoundingClientRect();
      return Math.max(0, rect.top + window.pageYOffset - headerOffset);
    }

    // If active node is later in unit (e.g. lesson 2 or trophy), scroll directly to active node
    if (activeNodeRef.current) {
      const rect = activeNodeRef.current.getBoundingClientRect();
      return Math.max(0, rect.top + window.pageYOffset - headerOffset);
    }

    // Fallback to active unit
    if (activeUnitRef.current) {
      const rect = activeUnitRef.current.getBoundingClientRect();
      return Math.max(0, rect.top + window.pageYOffset - headerOffset);
    }

    return 0;
  };

  const safeScrollTo = (top: number, smooth = false) => {
    try {
      window.scrollTo({
        top,
        behavior: smooth ? 'smooth' : 'auto',
      });
    } catch {
      window.scrollTo(0, top);
    }
  };

  const performAutoScroll = (instant = false) => {
    if (userHasInteractedRef.current) return;
    const targetY = getScrollTargetY();
    const currentY = window.pageYOffset || document.documentElement.scrollTop;
    if (Math.abs(currentY - targetY) > 8) {
      safeScrollTo(targetY, !instant);
    }
  };

  const scrollToActiveUnitAndNode = () => {
    userHasInteractedRef.current = false;
    performAutoScroll(false);
  };

  // Automatic multi-phase scroll to active unit/node on mount, section switch, or language switch
  useEffect(() => {
    // 1. Disable browser scroll restoration so it never jumps back to 0 on route navigation
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    userHasInteractedRef.current = false;

    // 2. Immediate microtask / rAF (instant jump so user never sees Unit 1 flash)
    requestAnimationFrame(() => {
      performAutoScroll(true);
    });

    // 3. Multi-phase stabilization as CSS, fonts, and mascots load
    const t1 = setTimeout(() => performAutoScroll(true), 50);
    const t2 = setTimeout(() => performAutoScroll(true), 150);
    const t3 = setTimeout(() => performAutoScroll(true), 350);
    const t4 = setTimeout(() => performAutoScroll(false), 700);

    // 4. ResizeObserver on path container to handle dynamic image/font expansions
    let ro: ResizeObserver | null = null;
    let roTimeout: NodeJS.Timeout | null = null;

    if (pathContainerRef.current && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        if (!userHasInteractedRef.current) {
          performAutoScroll(true);
        }
      });
      ro.observe(pathContainerRef.current);
      // Disconnect observer after 2.5s once layout is completely static
      roTimeout = setTimeout(() => {
        ro?.disconnect();
      }, 2500);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      if (ro) ro.disconnect();
      if (roTimeout) clearTimeout(roTimeout);
    };
  }, [activeSectionId, selectedLanguage.languageId, activeNode?.nodeId, activeUnitForHeader.unitId]);

  // Handle clicking on a path node
  const handleNodeClick = (node: PathNode) => {
    if (node.type === 'lesson' || node.type === 'trophy') {
      navigate(`/lesson/${node.lessonId || 'mun_l1'}`, {
        state: {
          nodeId: node.nodeId,
          unitId: node.unitId,
          lessonId: node.lessonId,
        },
      });
    } else if (node.type === 'chest') {
      setSelectedChestNode(node);
    } else if (node.type === 'script') {
      setSelectedScriptNode(node);
    }
  };

  // Claim chest reward
  const handleClaimChest = () => {
    if (!selectedChestNode || claimedChests.includes(selectedChestNode.nodeId)) return;
    const updated = [...claimedChests, selectedChestNode.nodeId];
    setClaimedChests(updated);
    localStorage.setItem('vanisetu_claimed_chests', JSON.stringify(updated));

    if (user) {
      updateUser({ totalXP: (user.totalXP || 0) + (selectedChestNode.rewardChest?.xp || 30) });
    }

    addToast({
      type: 'xp',
      title: '+30 Bonus XP Claimed! 🎁',
      message: 'Milestone treasure chest opened! Ancestral wisdom unlocked.',
    });
  };

  // Complete script glyph practice
  const handleCompleteScript = () => {
    if (!selectedScriptNode || completedScripts.includes(selectedScriptNode.nodeId)) return;
    const updated = [...completedScripts, selectedScriptNode.nodeId];
    setCompletedScripts(updated);
    localStorage.setItem('vanisetu_completed_scripts', JSON.stringify(updated));

    if (user) {
      updateUser({ totalXP: (user.totalXP || 0) + selectedScriptNode.xpReward });
    }

    addToast({
      type: 'xp',
      title: `+${selectedScriptNode.xpReward} XP Earned! 🔤`,
      message: `Mastered native script glyph "${selectedScriptNode.scriptChar}"!`,
    });
  };

  // Alias for manual invocation if needed
  const scrollToActiveNode = scrollToActiveUnitAndNode;

  // Progress metrics
  const allSectionNodes = currentSection.units.flatMap((u) => u.nodes);
  const totalNodesCount = allSectionNodes.length;
  const completedNodesCount = allSectionNodes.filter((n) => isNodeCompleted(n)).length;
  const sectionProgressPercent = Math.round(
    (completedNodesCount / (totalNodesCount || 1)) * 100
  );

  const dailyGoalXP = user?.dailyGoal || 50;
  const dailyProgressXP = Math.min(
    dailyGoalXP,
    user?.totalXP ? user.totalXP % (dailyGoalXP || 50) : 0
  );

  return (
    <div className="space-y-6 pb-20 relative">
      {/* Duolingo Layout Grid: Main Path Column + Desktop Right Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column (8 cols): Sticky Duolingo Unit Header + 8 Units Road */}
        <div className="lg:col-span-8 space-y-4 sm:space-y-6">
          {/* Authentic Sticky Duolingo Unit Banner (matching screenshot 1) */}
          <UnitHeaderBanner
            unit={activeUnitForHeader}
            sectionNumber={currentSection.sectionNumber}
            languageName={selectedLanguage.name}
            activeNode={activeNode}
            onOpenGuidebook={() => setSelectedGuidebookUnit(activeUnitForHeader)}
            onOpenSectionSelector={() => setIsSectionModalOpen(true)}
            onStartActiveLesson={() => activeNode && handleNodeClick(activeNode)}
            onScrollToCurrentUnit={scrollToActiveUnitAndNode}
          />

          {/* Section Progress Bar */}
          <div className="bg-cream-100 border-2 border-sage-200 rounded-2xl p-3 sm:p-4 shadow-sm flex items-center justify-between gap-4">
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center justify-between text-xs font-bold text-teal-900">
                <span>Section {currentSection.sectionNumber} Mastery</span>
                <span className="text-amber-700 font-extrabold">
                  {completedNodesCount} / {totalNodesCount} Nodes ({sectionProgressPercent}%)
                </span>
              </div>
              <ProgressBar current={completedNodesCount} total={totalNodesCount} color="gold" height="sm" />
            </div>

            <button
              onClick={() => setIsSectionModalOpen(true)}
              className="shrink-0 text-xs font-extrabold text-forest-700 hover:text-forest-900 bg-forest-50 hover:bg-forest-100 border border-forest-200 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 shadow-2xs"
            >
              <span>Switch Section</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Continuous Winding Snake Path (8 Units) */}
          <div
            ref={pathContainerRef}
            className="bg-cream-100 border-2 border-sage-200 rounded-3xl p-4 sm:p-8 shadow-earthy"
          >
            {currentSection.units.map((unit, unitIdx) => {
              const isCurrentUnit = unit.unitId === activeUnitForHeader.unitId;

              return (
                <div
                  key={unit.unitId}
                  ref={isCurrentUnit ? activeUnitRef : undefined}
                  className="w-full scroll-mt-28 sm:scroll-mt-36"
                >
                  {/* Duolingo Unit Divider (matching screenshot 2: "Describe people" divider) */}
                  {unitIdx > 0 && (
                    <div className="my-8 sm:my-12 flex items-center justify-center w-full max-w-lg mx-auto">
                      <div className="flex-1 h-0.5 bg-sage-300" />
                      <div className="px-4 py-1.5 bg-cream-50 border-2 border-sage-300 rounded-2xl shadow-xs text-center mx-2 space-y-0.5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-forest-700 block">
                          Unit {unit.unitNumber}
                        </span>
                        <span className="text-xs sm:text-sm font-extrabold font-display text-teal-950">
                          {unit.title}
                        </span>
                      </div>
                      <div className="flex-1 h-0.5 bg-sage-300" />
                    </div>
                  )}

                  {/* Winding Nodes for this Unit */}
                  <div className="py-2 flex flex-col items-center">
                    {unit.nodes.map((node, nodeIdx) => {
                      const completed = isNodeCompleted(node);
                      const unlocked = isNodeUnlocked(
                        node,
                        unit.nodes,
                        unitIdx,
                        currentSection.units
                      );
                      const isActiveNode = activeNode ? node.nodeId === activeNode.nodeId : false;

                      return (
                        <div
                          key={node.nodeId}
                          ref={isActiveNode ? activeNodeRef : undefined}
                          className="w-full flex justify-center"
                        >
                          <PathNodeCard
                            node={node}
                            themeColor={unit.themeColor}
                            isCompleted={completed}
                            isUnlocked={unlocked}
                            isActive={isActiveNode}
                            isChestClaimed={claimedChests.includes(node.nodeId)}
                            onSelect={handleNodeClick}
                            index={nodeIdx}
                            mascot={unit.mascot}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Desktop Widgets (Sticky on Laptop/Desktop) */}
        <div className="hidden lg:block lg:col-span-4 space-y-6 sticky top-24">
          {/* Daily Goal & Streak Card */}
          <div className="bg-cream-100 border-2 border-sage-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
                Daily Goal
              </span>
              <Target className="w-4 h-4 text-gold-500" />
            </div>

            <div>
              <p className="text-2xl font-extrabold font-display text-teal-900">
                {dailyProgressXP} / {dailyGoalXP}{' '}
                <span className="text-xs font-bold text-gold-600">XP</span>
              </p>
              <p className="text-xs text-teal-600 font-medium mt-0.5">
                {dailyProgressXP >= dailyGoalXP
                  ? 'Goal completed for today! Awesome work!'
                  : `${dailyGoalXP - dailyProgressXP} XP to reach today’s target`}
              </p>
            </div>

            <ProgressBar current={dailyProgressXP} total={dailyGoalXP} color="gold" height="sm" />

            <div className="pt-3 border-t border-sage-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame
                  className={`w-4 h-4 ${
                    (user?.currentStreak || 0) > 0
                      ? 'text-terracotta-500 fill-current animate-bounce'
                      : 'text-teal-400'
                  }`}
                />
                <span className="text-xs font-bold text-teal-800">
                  {user?.currentStreak || 0} Day Streak
                </span>
              </div>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                  (user?.currentStreak || 0) > 0
                    ? 'text-terracotta-600 bg-terracotta-50 border-terracotta-200'
                    : 'text-teal-600 bg-cream-200 border-sage-200'
                }`}
              >
                {(user?.currentStreak || 0) > 0 ? 'Active Fire 🔥' : 'Start Today'}
              </span>
            </div>
          </div>

          {/* Flashcards Practice Quick Card */}
          <div className="bg-cream-100 border-2 border-sage-200 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-forest-600 uppercase tracking-wider">
                Word Practice
              </span>
              <BookOpen className="w-4 h-4 text-forest-600" />
            </div>
            <h3 className="text-lg font-bold font-display text-teal-900">
              Vocabulary Flashcards
            </h3>
            <p className="text-xs text-teal-700 font-medium leading-relaxed">
              Strengthen memory with native pronunciations, flip flashcards, and cultural example sentences.
            </p>
            <Button
              variant="outline"
              size="sm"
              fullWidth={true}
              onClick={() => navigate('/vocabulary')}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              className="text-xs py-2"
            >
              Practice Flashcards
            </Button>
          </div>

          {/* Cultural Heritage Card */}
          <div className="bg-gradient-to-br from-cream-50 to-gold-50/60 border-2 border-sage-200 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-forest-700 uppercase tracking-wider">
              <Compass className="w-4 h-4 text-forest-600" />
              <span>Cultural Heritage</span>
            </div>
            <h3 className="font-display font-bold text-lg text-teal-950">
              The Sacred Grove (Sarna)
            </h3>
            <p className="text-xs text-teal-700 leading-relaxed font-medium">
              In tribal cosmology, nature is an elder kin to cherish. Every village preserves a virgin forest patch where the Sal trees bloom unpruned.
            </p>
            <Link
              to="/community"
              className="text-xs font-bold text-forest-700 hover:underline inline-block pt-1"
            >
              Explore Tribal Stories & Folktales →
            </Link>
          </div>
        </div>
      </div>

      {/* Modals */}
      <UnitGuidebookModal
        isOpen={selectedGuidebookUnit !== null}
        onClose={() => setSelectedGuidebookUnit(null)}
        unit={selectedGuidebookUnit}
        languageId={selectedLanguage.languageId}
      />

      <ChestRewardModal
        isOpen={selectedChestNode !== null}
        onClose={() => setSelectedChestNode(null)}
        reward={selectedChestNode?.rewardChest}
        isClaimed={selectedChestNode ? claimedChests.includes(selectedChestNode.nodeId) : false}
        onClaim={handleClaimChest}
      />

      <ScriptPracticeModal
        isOpen={selectedScriptNode !== null}
        onClose={() => setSelectedScriptNode(null)}
        scriptChar={selectedScriptNode?.scriptChar}
        languageName={selectedLanguage.name}
        languageId={selectedLanguage.languageId}
        isCompleted={selectedScriptNode ? completedScripts.includes(selectedScriptNode.nodeId) : false}
        onComplete={handleCompleteScript}
      />

      <SectionSelectorModal
        isOpen={isSectionModalOpen}
        onClose={() => setIsSectionModalOpen(false)}
        sections={sections}
        activeSectionId={activeSectionId}
        onSelectSection={handleSelectSection}
        languageName={selectedLanguage.name}
      />
    </div>
  );
};
