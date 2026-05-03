import React from 'react'

import {
  Panda,
  PandaSpeaking,
  SkillGrammarVocabulary,
  SkillListening,
  SkillReading,
  SkillSpeaking,
  BadgeCompleted,
  BadgeDiamond,
  BadgeGold,
  BadgeMaster,
  BadgeRuby,
  BadgeSilver,
  DecDialog,
  DecGo,
  DecGreen,
  DecBlue,
  AnimWaiting,
} from 'assets/illustrations'

/**
 * @typedef {Object} EmojiProps
 * @property {string} className
 * @property {string} name
 * @property {number} height
 * @property {number} width
 * @property {() => void?} onClick
 */

const emojiMap = new Map([
  ['Comment', { src: DecDialog, alt: 'comment' }],
  ['Student', { src: Panda, alt: 'Student' }],
  ['Done', { src: BadgeCompleted, alt: 'Done' }],
  ['Evaluation', { src: BadgeMaster, alt: 'Evaluation' }],
  ['Test', { src: BadgeGold, alt: 'Test' }],
  ['Shocked', { src: Panda, alt: 'shocked' }],
  ['Micro', { src: PandaSpeaking, alt: 'Microphone' }],
  ['Next', { src: DecGo, alt: 'Next' }],
  ['Wav', { src: AnimWaiting, alt: 'Wav' }],
  ['Play', { src: DecGo, alt: 'Play' }],
  ['Image', { src: DecGreen, alt: 'Image' }],
  ['Listening', { src: SkillListening, alt: 'Listening' }],
  ['Reading', { src: SkillReading, alt: 'Reading' }],
  ['Speaking', { src: SkillSpeaking, alt: 'Speaking' }],
  ['Writing', { src: SkillGrammarVocabulary, alt: 'Writing' }],
  ['Professor', { src: Panda, alt: 'Professor' }],
  ['Love', { src: BadgeRuby, alt: 'love' }],
  ['Gift', { src: BadgeDiamond, alt: 'gift' }],
  ['Learning', { src: BadgeCompleted, alt: 'learning' }],
  ['Homework', { src: BadgeSilver, alt: 'homework' }],
  ['Report', { src: BadgeDiamond, alt: 'report' }],
  ['Send', { src: DecGo, alt: 'send' }],
  ['Megaphone', { src: PandaSpeaking, alt: 'megaphone' }],
  ['Checked', { src: BadgeCompleted, alt: 'checked' }],
  ['Unchecked', { src: DecBlue, alt: 'unchecked' }],
  ['Arrow', { src: DecGo, alt: 'arrow' }],
  ['Teacher', { src: Panda, alt: 'teacher' }],
  ['Language', { src: SkillGrammarVocabulary, alt: 'language' }]
])

/**
 * @type {React.FunctionComponent<EmojiProps>} Emoji
 */
const Emoji = ({ className, height, name, width, onClick }) => {
  return emojiMap.has(name) ? (
    <img
      alt={emojiMap.get(name).alt}
      className={className}
      onClick={onClick}
      src={emojiMap.get(name).src}
      width={width}
      height={height}
    />
  ) : (
    <React.Fragment />
  )
}

Emoji.defaultProps = {
  className: '',
  onClick: () => null
}

export default Emoji
