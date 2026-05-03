import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { ReadingHeadingView } from 'components/ui'
import pandaImg from 'assets/illustrations/pandas/panda.svg'

// ── Sample exercises ──────────────────────────────────────────────────────────
// Each exercise: 8 headings (A–H), 7 paragraphs (19–25), 1 heading is a distractor.
// Mirrors APTIS Part B / Cambridge-style heading matching.
const READING_C_EXERCISES = [
  {
    title: 'The Rise of Vertical Forests',
    instruction:
      'Choose the most suitable heading (A–H) for paragraphs 19–25. There is one heading you do not need to use.',
    headings: [
      { letter: 'A', text: 'A response to urban overcrowding' },
      { letter: 'B', text: 'The challenges of maintenance' },
      { letter: 'C', text: 'The pioneers of a movement' },
      { letter: 'D', text: 'Air quality and human health' },
      { letter: 'E', text: 'A financial burden on developers' },
      { letter: 'F', text: 'Redefining the city-nature boundary' },
      { letter: 'G', text: 'Unexpected impacts on local wildlife' },
      { letter: 'H', text: 'Competition from traditional parks' }, // distractor
    ],
    paragraphs: [
      {
        num: 19,
        correct: 'F',
        text: 'The concept of vertical forests challenges our conventional understanding of what a building can be. Rather than separating the urban environment from the natural world, these structures deliberately blur the boundary between them. Façades are no longer simply walls — they become living ecosystems supporting thousands of plants, shrubs, and even mature trees. The visual impact on city skylines has prompted architects worldwide to reconsider the aesthetic possibilities of sustainable design.',
      },
      {
        num: 20,
        correct: 'C',
        text: "Milan's Bosco Verticale, completed in 2014, is widely regarded as the project that demonstrated the concept could work at scale. Its designers, Boeri Studio, overcame considerable scepticism to deliver two residential towers housing over 900 trees and 20,000 plants. The project's international success prompted commissions in Lausanne, Nanjing, and Eindhoven, establishing a new typology that has since been imitated across three continents.",
      },
      {
        num: 21,
        correct: 'D',
        text: 'Research conducted around completed vertical forest projects has documented measurable improvements in local air quality, with particulate matter levels notably lower in the immediate vicinity. Beyond this, residents report psychological benefits — reduced stress, better sleep, and a greater sense of connection to the seasons. The presence of vegetation also appears to moderate internal temperatures, reducing reliance on air conditioning during summer months.',
      },
      {
        num: 22,
        correct: 'A',
        text: 'As city populations accelerate, pressure on existing green space intensifies. Parks and public gardens cannot expand to match population growth, and street-level planting has limited capacity. Incorporating vegetation directly into the built fabric of the city represents one response to this scarcity. It allows green space to scale vertically rather than compete with development for precious urban land.',
      },
      {
        num: 23,
        correct: 'G',
        text: 'Ecologists monitoring Bosco Verticale were surprised to discover that the elevated greenery had become a habitat for species not previously recorded in central Milan. Bats, butterflies, and several bird species have established a regular presence in the canopy of the towers. This colonisation suggests that vertical forests could play an unplanned but significant role in supporting urban biodiversity well beyond their primary architectural purpose.',
      },
      {
        num: 24,
        correct: 'B',
        text: 'The ongoing care of thousands of plants at significant height is a far more demanding undertaking than conventional building maintenance. Teams of specialist arborists abseil down façades seasonally to prune, irrigate, and replace plants that have not survived. High winds accelerate moisture loss, requiring sophisticated automated irrigation systems. For building managers accustomed to standard maintenance schedules, the learning curve has proved steep.',
      },
      {
        num: 25,
        correct: 'E',
        text: 'The structural modifications required to support the weight of mature trees and the associated soil significantly increase construction costs. Engineering estimates suggest that vertical forest façades can add between fifteen and thirty per cent to the overall build budget. This premium places such projects beyond the reach of all but the most ambitious — or well-funded — developers, raising questions about whether the concept can ever become truly mainstream.',
      },
    ],
  },
  {
    title: 'Rewilding the Landscape',
    instruction:
      'Choose the most suitable heading (A–H) for paragraphs 19–25. There is one heading you do not need to use.',
    headings: [
      { letter: 'A', text: 'A continent leads the way' },
      { letter: 'B', text: 'The role of large predators' },
      { letter: 'C', text: 'Human conflict and compromise' },
      { letter: 'D', text: 'More than just nature conservation' },
      { letter: 'E', text: 'Measuring the results' },
      { letter: 'F', text: 'The origins of a concept' },
      { letter: 'G', text: 'Public opposition and its causes' },
      { letter: 'H', text: 'A challenge to traditional farming' }, // distractor
    ],
    paragraphs: [
      {
        num: 19,
        correct: 'F',
        text: "The term 'rewilding' entered conservation vocabulary in the 1990s, coined by activists who argued that protecting existing ecosystems was insufficient without actively restoring lost ones. Traditional conservation had focused on managing what remained; rewilding proposed something more radical — allowing, and even accelerating, the return of natural processes that human activity had suppressed. The approach questioned whether carefully managed nature reserves were truly wild at all.",
      },
      {
        num: 20,
        correct: 'A',
        text: 'Europe has become the most active region for rewilding projects, partly due to the large areas of abandoned agricultural land becoming available as farming consolidates. Countries including Scotland, Spain, and the Netherlands have launched ambitious schemes, while the Rewilding Europe organisation coordinates efforts across the continent. By 2030, the initiative aims to have established connected wildlife corridors spanning multiple countries.',
      },
      {
        num: 21,
        correct: 'B',
        text: "The reintroduction of apex predators such as wolves, lynx, and bears is considered by many scientists to be central to genuine rewilding. These animals create what ecologists call 'trophic cascades' — chains of ecological effects that flow down through the food web. The reintroduction of wolves to Yellowstone National Park famously altered the behaviour of elk herds, which in turn allowed riverbank vegetation to recover and even changed the course of streams.",
      },
      {
        num: 22,
        correct: 'D',
        text: 'Proponents of rewilding argue that its significance extends well beyond biodiversity. Restored forests and wetlands function as carbon sinks, contributing to climate mitigation goals. Reintroduced beavers reshape landscapes in ways that reduce flood risk downstream. These multiple benefits have attracted funding from sources beyond the traditional conservation sector, including government infrastructure budgets and corporate environmental commitments.',
      },
      {
        num: 23,
        correct: 'G',
        text: 'Despite scientific enthusiasm, rewilding proposals frequently encounter hostility from local communities. Farmers fear damage to livestock from predators, and rural residents express anxiety about safety near large carnivores. In some regions, opposition is cultural as much as practical: the landscape has been shaped by human hands for generations, and the suggestion that it should be abandoned to nature feels like an erasure of local heritage and identity.',
      },
      {
        num: 24,
        correct: 'C',
        text: 'Successful rewilding projects have generally required sustained engagement with local communities rather than imposing change from above. Compensation schemes for livestock lost to predators, careful monitoring, and inclusive decision-making processes have reduced opposition in several European countries. In Sweden, dialogue between conservationists and reindeer herders has produced co-management frameworks that allow wolf populations to recover while protecting traditional Sámi livelihoods.',
      },
      {
        num: 25,
        correct: 'E',
        text: 'Assessing the success of rewilding is methodologically complex. Species counts provide one measure, but the health of ecological processes is harder to quantify. Long-term monitoring projects in Knepp Estate in England and Białowieża Forest in Poland suggest that rewilded areas accumulate biodiversity at rates far exceeding those seen in conventionally managed reserves. However, researchers caution that results from one region cannot be straightforwardly applied elsewhere.',
      },
    ],
  },
]

const XP_REWARD = 25

// ── Done screen ───────────────────────────────────────────────────────────────
function DoneScreen({ total, xpEarned, onRestart, onExit }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh',
        gap: 40,
        padding: '40px 32px',
        background: 'linear-gradient(180deg, #EEF2FF 0%, #FFFFFF 40%)',
        textAlign: 'center',
      }}
    >
      <img
        src={pandaImg}
        alt=""
        aria-hidden="true"
        style={{
          width: 160,
          height: 'auto',
          filter: 'drop-shadow(0 8px 24px rgba(79,70,229,0.22))',
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h1
          style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 800,
            color: 'var(--color-text-primary)',
            margin: 0,
          }}
        >
          Reading session complete!
        </h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-muted)', margin: 0 }}>
          You completed {total} {total === 1 ? 'exercise' : 'exercises'} and earned +{xpEarned} XP!
        </p>
      </div>
      <div style={{ display: 'flex', gap: 12, width: '100%', maxWidth: 360 }}>
        <button
          onClick={onRestart}
          style={{
            flex: 1, padding: '14px 20px', borderRadius: 'var(--radius-xl)',
            border: '2.5px solid #C7D2FE', background: '#fff', color: '#4338CA',
            fontWeight: 700, fontSize: 'var(--text-base)', cursor: 'pointer',
            boxShadow: '0 4px 0 0 #C7D2FE',
          }}
        >
          Restart
        </button>
        <button
          onClick={onExit}
          style={{
            flex: 1, padding: '14px 20px', borderRadius: 'var(--radius-xl)',
            border: 'none', background: '#4F46E5', color: '#fff',
            fontWeight: 800, fontSize: 'var(--text-base)', cursor: 'pointer',
            boxShadow: '0 4px 0 0 #3730A3',
          }}
        >
          Back to dashboard
        </button>
      </div>
    </div>
  )
}

// ── ReadingCView ──────────────────────────────────────────────────────────────
export default function ReadingCView() {
  const history = useHistory()
  const [done, setDone] = useState(false)
  const [key,  setKey]  = useState(0)

  if (done) {
    return (
      <DoneScreen
        total={READING_C_EXERCISES.length}
        xpEarned={XP_REWARD * READING_C_EXERCISES.length}
        onRestart={() => { setKey(k => k + 1); setDone(false) }}
        onExit={() => history.push('/dashboard')}
      />
    )
  }

  return (
    <ReadingHeadingView
      key={key}
      exercises={READING_C_EXERCISES}
      xpReward={XP_REWARD}
      onComplete={() => setDone(true)}
      onQuit={() => history.goBack()}
    />
  )
}
