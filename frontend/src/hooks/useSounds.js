import { audio } from "assets/audio"

function useSounds () {
  /**
   * 
   * @param {'complete' | 'incomplete' | 'ping' | 'notification'} sound
   * @param {AudioNodeOptions} options
   */
  const play = async (sound, options) => {
    if (audio[sound]) {
      const ref = new Audio(audio[sound])

      if (options) {
        Object.assign(ref, options)
      }

      try {
        ref.play()
      } catch (err) {
        console.error(err)
      }
    }
  }

  return {
    play
  }
}

export default useSounds