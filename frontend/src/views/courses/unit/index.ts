// ── Unit Learning Experience — public API ─────────────────────
// Import UnitView to render a complete unit with header, flow,
// progress tracking, and XP feedback.
//
// Usage:
//   import { UnitView } from 'views/courses/unit';
//   <UnitView unit={unit1} onComplete={() => router.push('/next')} />

export { UnitView }        from './UnitView';
export { UnitHeader }      from './UnitHeader';
export { UnitFlow }        from './UnitFlow';
export { BlockRenderer }   from './BlockRenderer';

// UI primitives (available for composition in other views)
export { ProgressBar }   from './ui/ProgressBar';
export { XPBadge }       from './ui/XPBadge';
export { MascotWidget }  from './ui/MascotWidget';
export { BlockCard }     from './ui/BlockCard';
export { XPFeedback }    from './ui/XPFeedback';

// Progress hook + context (available for custom wrappers)
export { useUnitProgress }         from './hooks/useUnitProgress';
export { UnitProgressContext, useUnitProgressContext } from './hooks/UnitProgressContext';
export type { BlockUIState, UnitProgressAPI } from './hooks/useUnitProgress';
