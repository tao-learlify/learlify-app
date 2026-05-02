/**
 * UnitView — root component for the Unit Learning Experience.
 *
 * Responsibilities:
 *  1. Inject unit theme as CSS custom properties at the root
 *  2. Initialize and provide the progress state via Context
 *  3. Compose UnitHeader + UnitFlow
 *  4. Mount XPFeedback overlay
 *
 * Usage:
 *   <UnitView unit={unit1} />
 */
import React, { useState, useCallback } from 'react';
import type { Unit } from '../../../schemas/course/hierarchy';
import { UnitProgressContext } from './hooks/UnitProgressContext';
import { useUnitProgress }     from './hooks/useUnitProgress';
import { UnitHeader }          from './UnitHeader';
import { UnitFlow }            from './UnitFlow';
import { XPFeedback }          from './ui/XPFeedback';

interface UnitViewProps {
  unit: Unit;
  /** Called when the unit is fully completed */
  onComplete?: () => void;
  /** Called when user clicks "Next Unit" in the completion card */
  onNextUnit?: () => void;
  /** Called when user clicks "Back to course" in the completion card */
  onBackToCourse?: () => void;
  /** Called when progress is made (exercise completed, XP earned) */
  onProgressUpdate?: (xp: number, exercisesCompleted: number, progressPercent: number) => void;
  /** Called when the section is fully completed (exam passed) */
  onSectionComplete?: (finalXp: number, examScore: number) => void;
}

export function UnitView({ unit, onComplete, onNextUnit, onBackToCourse, onProgressUpdate, onSectionComplete }: UnitViewProps) {
  const progress = useUnitProgress(unit);

  // XP feedback state
  const [feedbackXP, setFeedbackXP] = useState(0);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  
  // Track last reported completion state to avoid duplicate reports
  const lastReportedComplete = React.useRef(false);

  const accent     = unit.theme?.accent    ?? 'var(--color-brand-primary)';
  const accentSoft = unit.theme?.accentSoft ?? 'var(--color-brand-primary-light)';
  const surface    = unit.theme?.surface   ?? 'var(--color-bg-page)';

  const handleXP = useCallback((xp: number) => {
    setFeedbackXP(xp);
    setFeedbackVisible(true);
    
    // Report progress to backend
    if (onProgressUpdate) {
      const totalSections = unit.sections?.length || 1;
      const completedSections = progress.completedSectionIds?.length || 0;
      const progressPercent = completedSections / totalSections;
      const exercisesCompleted = completedSections;
      
      onProgressUpdate(xp, exercisesCompleted, progressPercent);
    }
  }, [onProgressUpdate, unit.sections, progress.completedSectionIds]);

  const dismissFeedback = useCallback(() => {
    setFeedbackVisible(false);
  }, []);

  // Report section completion to backend
  React.useEffect(() => {
    if (progress.isUnitComplete && onSectionComplete && !lastReportedComplete.current) {
      lastReportedComplete.current = true;
      const finalXp = progress.totalXP || 0;
      // TODO: Track actual exam score when exam system is integrated
      const examScore = 100; // Default passing score
      onSectionComplete(finalXp, examScore);
    }
  }, [progress.isUnitComplete, onSectionComplete, progress.totalXP]);
  
  // Call onComplete when unit is fully done
  React.useEffect(() => {
    if (progress.isUnitComplete && onComplete) {
      // Small delay so the user sees the complete banner first
      const timer = setTimeout(onComplete, 2500);
      return () => clearTimeout(timer);
    }
  }, [progress.isUnitComplete, onComplete]);

  return (
    <UnitProgressContext.Provider value={progress}>
      {/*
        Root container:
        - Injects unit theme tokens as CSS custom properties
        - Sets the page background to the unit surface color
        - min-height ensures the flow area fills the screen
      */}
      <div
        className="tw:min-h-screen tw:bg-bg-page"
        style={
          {
            '--unit-accent':      accent,
            '--unit-accent-soft': accentSoft,
            '--unit-surface':     surface,
            backgroundColor:      surface,
          } as React.CSSProperties
        }
      >
        {/* Sticky header */}
        <UnitHeader unit={unit} />

        {/* Scrollable learning flow */}
        <main>
          <UnitFlow
            unit={unit}
            accent={accent}
            onXP={handleXP}
            onNextUnit={onNextUnit}
            onBackToCourse={onBackToCourse}
          />
        </main>

        {/* XP toast — rendered at the document root level (fixed position) */}
        <XPFeedback
          xp={feedbackXP}
          visible={feedbackVisible}
          accent={accent}
          onDismiss={dismissFeedback}
        />
      </div>
    </UnitProgressContext.Provider>
  );
}
