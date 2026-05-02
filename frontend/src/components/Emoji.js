import React from 'react'

import Student from 'assets/img/student.png'
import Done from 'assets/img/done.png'
import Evaluation from 'assets/img/evaluation.png'
import Chat from 'assets/img/chat.png'
import Test from 'assets/img/test.png'
import Shocked from 'assets/img/shocked.png'
import Microphone from 'assets/img/microphone.png'
import Next from 'assets/img/right.png'
import Wav from 'assets/img/wav.png'
import Play from 'assets/img/play.png'
import Image from 'assets/img/image.png'
import Listening from 'assets/img/listening.png'
import Reading from 'assets/img/studying.png'
import Speaking from 'assets/img/speaking.png'
import Writing from 'assets/img/writing.png'
import Professor from 'assets/img/teacher.png'
import Love from 'assets/img/love.png'
import Gift from 'assets/img/gift-card.png'
import Learning from 'assets/img/online-learning.png'
import Homework from 'assets/img/homework.png'

import Report from 'assets/img/report.png'
import Send from 'assets/img/send.png'
import Megaphone from 'assets/img/megaphone.png'
import Checked from 'assets/img/checked.png'
import Unchecked from 'assets/img/unchecked.png'
import Arrow from 'assets/img/arrow.png'
import Teacher from 'assets/img/teacher.png'
import Language from 'assets/img/course.png'

/**
 * @typedef {Object} EmojiProps
 * @property {string} className
 * @property {string} name
 * @property {number} height
 * @property {number} width
 * @property {() => void?} onClick
 */

const emojiMap = new Map([
  ['Comment', { src: Chat, alt: 'comment' }],
  ['Student', { src: Student, alt: 'Student' }],
  ['Done', { src: Done, alt: 'Done' }],
  ['Evaluation', { src: Evaluation, alt: 'Evaluation ' }],
  ['Test', { src: Test, alt: 'Test' }],
  ['Shocked', { src: Shocked, alt: 'shocked' }],
  ['Micro', { src: Microphone, alt: 'Microphone ' }],
  ['Next', { src: Next, alt: 'Next' }],
  ['Wav', { src: Wav, alt: 'Wav' }],
  ['Play', { src: Play, alt: 'Play' }],
  ['Image', { src: Image, alt: 'Image' }],
  ['Listening', { src: Listening, alt: 'Listening' }],
  ['Reading', { src: Reading, alt: 'Reading' }],
  ['Speaking', { src: Speaking, alt: 'Speaking' }],
  ['Writing', { src: Writing, alt: 'Writing' }],
  ['Professor', { src: Professor, alt: 'Professor' }],
  ['Love', { src: Love, alt: 'love' }],
  ['Gift', { src: Gift, alt: 'gift' }],
  ['Learning', { src: Learning, alt: 'learning' }],
  ['Homework', { src: Homework, alt: 'homework' }],
  ['Report', { src: Report, alt: 'report' }],
  ['Send', { src: Send, alt: 'send' }],
  ['Megaphone', { src: Megaphone, alt: 'megaphone' }],
  ['Checked', { src: Checked, alt: 'checked' }],
  ['Unchecked', { src: Unchecked, alt: 'unchecked' }],
  ['Arrow', { src: Arrow, alt: 'arrow' }],
  ['Teacher', { src: Teacher, alt: 'teacher' }],
  ['Language', { src: Language, alt: 'language ' }]
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
