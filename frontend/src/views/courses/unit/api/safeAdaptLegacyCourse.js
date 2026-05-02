import { adaptLegacyCourse } from './adaptLegacyCourse'

/**
 * safeAdaptLegacyCourse — error-safe wrapper around adaptLegacyCourse.
 *
 * Never throws. Returns a discriminated union so callers can branch
 * without try/catch.
 *
 * @param {unknown} raw       - Raw CDN JSON payload
 * @param {number}  unitIndex - 0-based unit index within the course
 * @returns {{ ok: true, unit: import('schemas/course/hierarchy').Unit } | { ok: false, error: Error }}
 */
export function safeAdaptLegacyCourse(raw, unitIndex) {
  try {
    const unit = adaptLegacyCourse(raw, unitIndex)

    if (!unit || typeof unit !== 'object') {
      return {
        ok: false,
        error: new Error(
          `Adapter returned ${unit === null ? 'null' : typeof unit} for unitIndex=${unitIndex}`
        )
      }
    }

    return { ok: true, unit }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err : new Error(String(err))
    }
  }
}
