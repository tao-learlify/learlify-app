import React, { useState, useMemo, memo } from 'react'
import clsx from 'clsx'
import { TrendUp } from '@phosphor-icons/react'
import styles from './ProgressGraph.module.scss'

/* ── Constants ──────────────────────────────────────────────────────────────── */

const LEVELS = { A2: 1, B1: 2, B2: 3 }

// viewBox dimensions
const VW = 500
const VH = 200
const PAD = { l: 44, r: 16, t: 24, b: 36 }
const CW = VW - PAD.l - PAD.r  // 440
const CH = VH - PAD.t - PAD.b  // 140

/* ── Coordinate helpers ─────────────────────────────────────────────────────── */

const levelToY = (lvl) => PAD.t + ((3 - lvl) / 2) * CH

const indexToX = (i, n) =>
  PAD.l + (n <= 1 ? CW / 2 : (i / (n - 1)) * CW)

/** Smooth cubic bezier path — horizontal S-curve between each pair of points */
const buildPath = (pts) => {
  if (!pts.length) return ''
  let d = `M ${pts[0].x},${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const cpx = (pts[i - 1].x + pts[i].x) / 2
    d += ` C ${cpx},${pts[i - 1].y} ${cpx},${pts[i].y} ${pts[i].x},${pts[i].y}`
  }
  return d
}

/* ── Default mock data ──────────────────────────────────────────────────────── */

const DEFAULT_DATA = [
  { session: 1,  level: 'A2', date: 'Jan 5'  },
  { session: 2,  level: 'A2', date: 'Jan 19' },
  { session: 3,  level: 'A2', date: 'Feb 2'  },
  { session: 4,  level: 'B1', date: 'Feb 16' },
  { session: 5,  level: 'B1', date: 'Mar 1'  },
  { session: 6,  level: 'B1', date: 'Mar 10' },
  { session: 7,  level: 'B2', date: 'Mar 18' },
]

/* ── Y-axis bands ───────────────────────────────────────────────────────────── */

const Y_BANDS = [
  { label: 'B2', lvl: 3, color: 'rgba(88,204,2,0.06)' },
  { label: 'B1', lvl: 2, color: 'rgba(26,86,219,0.06)' },
  { label: 'A2', lvl: 1, color: 'rgba(107,114,128,0.06)' },
]

const BAND_H = CH / 2  // each band spans half the chart height

/* ═══════════════════════════════════════════════════════════════════════════ */

/**
 * ProgressGraph — Game-style language level evolution chart.
 *
 * Renders a smooth SVG bezier line showing progression across A2 → B1 → B2
 * from evaluation to evaluation. No heavy chart library — pure SVG + CSS.
 *
 * @param {Array}   [data]     - Array of { session, level: 'A2'|'B1'|'B2', date }
 * @param {string}  [title]
 * @param {string}  [subtitle]
 * @param {string}  [className]
 */
const ProgressGraph = memo(function ProgressGraph({
  data = DEFAULT_DATA,
  title = 'Your Progress',
  subtitle = 'From A2 to B2',
  className,
}) {
  const [tooltip, setTooltip] = useState(null) // { point }

  /* ── Derived geometry ───────────────────────────────────────────────────── */

  const points = useMemo(
    () =>
      data.map((d, i) => ({
        ...d,
        lvl: LEVELS[d.level] ?? 1,
        x: indexToX(i, data.length),
        y: levelToY(LEVELS[d.level] ?? 1),
      })),
    [data]
  )

  const linePath = useMemo(() => buildPath(points), [points])

  const areaPath = useMemo(() => {
    if (points.length < 2) return ''
    const bot = PAD.t + CH
    return (
      `${linePath} ` +
      `L ${points[points.length - 1].x},${bot} ` +
      `L ${points[0].x},${bot} Z`
    )
  }, [linePath, points])

  const latestPt = points[points.length - 1]

  /* ── Hover hit-test ─────────────────────────────────────────────────────── */

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const mouseX = ((e.clientX - rect.left) / rect.width) * VW
    let nearest = null
    let minDist = 40
    points.forEach((pt) => {
      const d = Math.abs(pt.x - mouseX)
      if (d < minDist) {
        minDist = d
        nearest = pt
      }
    })
    setTooltip(nearest ? { point: nearest } : null)
  }

  /* ── X-axis labels: first, mid, last ───────────────────────────────────── */

  const xLabels = [
    points[0],
    points[Math.floor(points.length / 2)],
    points[points.length - 1],
  ].filter(Boolean)

  /* ── Render ─────────────────────────────────────────────────────────────── */

  return (
    <div className={clsx(styles.card, className)}>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.headerIcon} aria-hidden="true">
          <TrendUp weight="fill" size={20} />
        </div>
        <div className={styles.headerText}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        {latestPt && (
          <div className={styles.levelBadge} aria-label={`Current level: ${latestPt.level}`}>
            <span className={styles.levelBadgeText}>{latestPt.level}</span>
            <span className={styles.levelBadgeLabel}>current</span>
          </div>
        )}
      </div>

      {/* ── SVG graph ───────────────────────────────────────────────────── */}
      <div
        className={styles.graphWrap}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(null)}
      >
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          preserveAspectRatio="xMidYMid meet"
          className={styles.svg}
          aria-label="Language level progression over time"
          role="img"
        >
          <defs>
            {/* Area fill gradient */}
            <linearGradient id="pgAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#58cc02" stopOpacity="0.20" />
              <stop offset="100%" stopColor="#58cc02" stopOpacity="0"    />
            </linearGradient>
          </defs>

          {/* ── Level bands (subtle tinted rows) ──────────────────────── */}
          {Y_BANDS.map(({ label, lvl, color }, bi) => {
            const top = bi === 0 ? PAD.t : levelToY(lvl) - BAND_H / 2
            const bandH = bi === 0 || bi === 2 ? BAND_H * 0.75 : BAND_H
            return (
              <rect
                key={label}
                x={PAD.l}
                y={top}
                width={CW}
                height={bandH}
                fill={color}
                rx={4}
              />
            )
          })}

          {/* ── Horizontal grid lines at each level ───────────────────── */}
          {[3, 2, 1].map((lvl) => {
            const y = levelToY(lvl)
            const label = Object.keys(LEVELS).find((k) => LEVELS[k] === lvl)
            return (
              <g key={lvl}>
                <line
                  x1={PAD.l} y1={y}
                  x2={VW - PAD.r} y2={y}
                  stroke="var(--color-border-default)"
                  strokeWidth={1}
                  strokeDasharray="4 6"
                />
                <text
                  x={PAD.l - 8}
                  y={y + 4}
                  textAnchor="end"
                  className={styles.axisLabel}
                >
                  {label}
                </text>
              </g>
            )
          })}

          {/* ── Area fill ─────────────────────────────────────────────── */}
          <path d={areaPath} fill="url(#pgAreaGrad)" className={styles.area} />

          {/* ── Main line (animated draw-on) ───────────────────────────── */}
          <path
            d={linePath}
            fill="none"
            stroke="var(--color-progress)"
            strokeWidth={3.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.line}
          />

          {/* ── X-axis date labels ─────────────────────────────────────── */}
          {xLabels.map((pt) => (
            <text
              key={`xl-${pt.session}`}
              x={pt.x}
              y={VH - 6}
              textAnchor="middle"
              className={styles.axisLabel}
            >
              {pt.date}
            </text>
          ))}

          {/* ── Dots for each evaluation ──────────────────────────────── */}
          {points.map((pt, i) => {
            const isLatest  = i === points.length - 1
            const isHovered = tooltip?.point?.session === pt.session
            const r = isLatest ? 7 : isHovered ? 5.5 : 4
            return (
              <g key={`dot-${pt.session}`}>
                {/* Glow ring on latest */}
                {isLatest && (
                  <circle
                    cx={pt.x} cy={pt.y} r={16}
                    fill="var(--color-progress)"
                    className={styles.glowRing}
                  />
                )}

                <circle
                  cx={pt.x} cy={pt.y} r={r}
                  fill={isLatest || isHovered
                    ? 'var(--color-progress)'
                    : 'var(--color-bg-surface)'}
                  stroke="var(--color-progress)"
                  strokeWidth={isLatest ? 0 : 2.5}
                  className={styles.dot}
                  style={{ '--dot-delay': `${0.7 + i * 0.08}s` }}
                />

                {/* "B2 ✦" label floating above latest dot */}
                {isLatest && (
                  <text
                    x={pt.x} y={pt.y - 16}
                    textAnchor="middle"
                    className={styles.latestLabel}
                  >
                    {pt.level} ✦
                  </text>
                )}
              </g>
            )
          })}

          {/* ── Hover tooltip ─────────────────────────────────────────── */}
          {tooltip && (
            <g>
              {/* Cursor line */}
              <line
                x1={tooltip.point.x} y1={PAD.t}
                x2={tooltip.point.x} y2={PAD.t + CH}
                stroke="var(--color-border-strong)"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
              {/* Tooltip bubble */}
              <TooltipBubble point={tooltip.point} />
            </g>
          )}
        </svg>
      </div>

      {/* ── Legend ──────────────────────────────────────────────────────── */}
      <div className={styles.legend} aria-label="Level legend">
        <div className={clsx(styles.legendItem, styles.legendA2)}>
          <span className={styles.legendDot} />
          <span className={styles.legendLabel}>A2 — Beginner</span>
        </div>
        <div className={clsx(styles.legendItem, styles.legendB1)}>
          <span className={styles.legendDot} />
          <span className={styles.legendLabel}>B1 — Intermediate</span>
        </div>
        <div className={clsx(styles.legendItem, styles.legendB2)}>
          <span className={styles.legendDot} />
          <span className={styles.legendLabel}>B2 — Upper-Intermediate</span>
        </div>
      </div>
    </div>
  )
})

/* ── Tooltip bubble (extracted to keep render clean) ────────────────────────── */

function TooltipBubble({ point }) {
  const flipLeft = point.x > VW * 0.65
  const tipX = flipLeft ? point.x - 80 : point.x + 12
  const tipY = point.y - 32

  return (
    <g>
      <rect x={tipX} y={tipY} width={72} height={44} rx={8} fill="var(--color-text-primary)" />
      {/* Level text */}
      <text
        x={tipX + 36} y={tipY + 17}
        textAnchor="middle"
        className={styles.tooltipLevel}
      >
        {point.level}
      </text>
      {/* Date text */}
      <text
        x={tipX + 36} y={tipY + 33}
        textAnchor="middle"
        className={styles.tooltipDate}
      >
        {point.date}
      </text>
    </g>
  )
}

export default ProgressGraph
export { ProgressGraph }
