/**
 * courseParams — Route param encoding / decoding for course and unit routes.
 *
 * Strategy: opaque prefixed IDs so URLs never expose raw integers.
 *   Course:  c{id}    →  e.g. "c1"
 *   Unit:    u{order} →  e.g. "u3"
 *
 * Route format:  /courses/:courseSlug/units/:unitSlug
 * Example:       /courses/c1/units/u3
 *
 * Future migration: when the backend starts returning real slugs
 * (e.g. "aptis-general", "present-simple-daily-routines"), the
 * parseCourseParam / parseUnitParam functions already handle them
 * via the `slug` branch — no route changes needed.
 *
 * Security note: route params are for navigation convenience only.
 * Authorization is enforced server-side on every API call.
 */

// ── Encode ────────────────────────────────────────────────────

/**
 * @param {number|string} courseId
 * @returns {string}
 */
export function encodeCourseParam(courseId) {
  return `c${courseId}`
}

/**
 * @param {number|string} unitOrder — 1-based unit order
 * @returns {string}
 */
export function encodeUnitParam(unitOrder) {
  return `u${unitOrder}`
}

// ── Decode ────────────────────────────────────────────────────

/**
 * Parse a :courseSlug route param.
 *
 * Returns:
 *   { id: number }   — encoded param ("c1")   OR legacy bare integer ("1")
 *   { slug: string } — real slug ("aptis-general")
 *   null             — invalid / missing
 *
 * @param {string|null|undefined} param
 * @returns {{ id: number } | { slug: string } | null}
 */
export function parseCourseParam(param) {
  if (!param || typeof param !== 'string') return null
  if (/^c\d+$/.test(param)) return { id: parseInt(param.slice(1), 10) }
  if (/^\d+$/.test(param)) return { id: parseInt(param, 10) } // legacy numeric fallback
  return { slug: param }
}

/**
 * Parse a :unitSlug route param.
 *
 * Returns:
 *   { order: number } — encoded param ("u3")   OR legacy bare integer ("3")
 *   { slug: string }  — real slug ("present-simple-daily-routines")
 *   null              — invalid / missing
 *
 * @param {string|null|undefined} param
 * @returns {{ order: number } | { slug: string } | null}
 */
export function parseUnitParam(param) {
  if (!param || typeof param !== 'string') return null
  if (/^u\d+$/.test(param)) return { order: parseInt(param.slice(1), 10) }
  if (/^\d+$/.test(param)) return { order: parseInt(param, 10) } // legacy numeric fallback
  return { slug: param }
}

// ── Path builder ──────────────────────────────────────────────

/**
 * Build the full unit route path from numeric IDs.
 *
 * @param {number|string} courseId
 * @param {number|string} unitOrder — 1-based
 * @returns {string}
 */
export function buildUnitPath(courseId, unitOrder) {
  return `/courses/${encodeCourseParam(courseId)}/units/${encodeUnitParam(unitOrder)}`
}

// ── Resolver ──────────────────────────────────────────────────

/**
 * Resolve a parsed course param against the courses list.
 * Falls back to the first available course when nothing matches.
 *
 * @param {{ id?: number, slug?: string } | null} parsed
 * @param {Array<{ id: number, slug?: string, name?: string }>} courses
 * @returns {object | null}
 */
export function resolveCourse(parsed, courses) {
  if (!courses?.length) return null
  if (!parsed) return courses[0]

  if (parsed.id != null) {
    return courses.find(c => c.id === parsed.id) ?? courses[0]
  }
  if (parsed.slug) {
    return (
      courses.find(c => c.slug === parsed.slug || c.name === parsed.slug) ??
      courses[0]
    )
  }
  return courses[0]
}
