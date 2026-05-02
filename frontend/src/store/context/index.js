import { createContext } from 'react'
import { initialState } from 'state/exercise'
import participantReducer from 'views/meetings/components/reducer/participant'

const context = {
  evaluation: {
    evaluated: false,
    ranges: [],
    onUpdateRange: null,
    onEdit: null
  },
  chat: {
    unreads: 0
  },
  participant: {
    ...participantReducer
  }
}

export const StripeContext = createContext({})

export const EvaluationContext = createContext(context.evaluation)

export const ChatContext = createContext(context.chat)

export const ControlsContext = createContext(() => null)

export const ParticipantContextState = createContext(context.participant)

export const ParticipantContextDispatch = createContext(null)

/**
 * @type {import ('react').Context<{ localAudioTrack: import ('twilio-video').LocalAudioTrack, localVideoTrack: import ('twilio-video').LocalVideoTrack}>}
 */
export const LocalTracksContext = createContext({
  localAudioTrack: null,
  localVideoTrack: null
})

export const Authenticator = createContext(() => null)

export const StateContext = createContext({
  dispatch: null,
  state: null
})

export const ExamContext = createContext({
  ...initialState
})

export const ExerciseContext = createContext({
  count: {
    value: 0,
    limit: 0
  },
  exercise: null
})
