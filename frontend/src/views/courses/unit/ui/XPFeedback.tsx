import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightning } from '@phosphor-icons/react';

interface XPFeedbackProps {
  xp: number;
  visible: boolean;
  accent: string;
  onDismiss: () => void;
}

export function XPFeedback({ xp, visible, accent, onDismiss }: XPFeedbackProps) {
  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(onDismiss, 2200);
    return () => window.clearTimeout(timer);
  }, [visible, onDismiss]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          // fixed bottom-center; x: -50% applied via transform
          className="tw:fixed tw:bottom-8 tw:left-1/2 tw:z-[500]"
          initial={{ opacity: 0, y: 28, x: '-50%' }}
          animate={{ opacity: 1, y: 0,  x: '-50%' }}
          exit={{    opacity: 0, y: -14, x: '-50%' }}
          transition={{
            duration: 0.38,
            ease: [0.34, 1.56, 0.64, 1], // easing-bounce from tokens
          }}
        >
          <div
            className="tw:flex tw:items-center tw:gap-2 tw:px-5 tw:py-3 tw:rounded-pill tw:text-white tw:font-semibold tw:text-base"
            style={{
              backgroundColor: accent,
              boxShadow: 'var(--shadow-3)',
            }}
          >
            <Lightning size={18} weight="fill" />
            <span>+{xp} XP</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
