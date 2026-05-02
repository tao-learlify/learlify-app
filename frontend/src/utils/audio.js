import { audio } from "assets/audio"

/**
 * @description
 * Avoiding re-creation of the media once is being called to avoid perfomance issues.
 */
const media = new Map([
  ['correct', audio.complete],
  ['incorrect', audio.incomplete],
  ['click', audio.click],
  ['ping', audio.ping],
  ['notification', audio.notification]
])

const AptisMedia = Object.freeze({
  sounds: {
    /**
     * @typedef {Object} MediaOptions
     * @property {number} volume
     * @param {'click' | 'correct' | 'incorrect' | 'ping' | 'notification'} sound
     * @param {MediaOptions} mediaOptions
     */
    play(sound, mediaOptions) {
      if (media.has(sound)) {
        const option = media.get(sound)

        const audio = new Audio(option)

        if (mediaOptions) {
          Object.assign(audio, {
            ...mediaOptions
          })
        }

        return audio.play()
      }

      return
    }
  }
})

export default AptisMedia
