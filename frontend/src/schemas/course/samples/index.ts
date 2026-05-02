/**
 * Course Unit Samples - Schema v2
 * 
 * Exporta todas las unidades del curso Aptis (1-15).
 * Se usan como override del backend mientras migramos.
 * 
 * STATUS:
 *   ✅ unit-1 through unit-15: Todas completas en Schema v2
 */

import type { Unit } from "../hierarchy";

export { unit1 } from "./unit-1";
export { unit2 } from "./unit-2";
export { unit3 } from "./unit-3";
export { unit4 } from "./unit-4";
export { unit5 } from "./unit-5";
export { unit6 } from "./unit-6";
export { unit7 } from "./unit-7";
export { unit8 } from "./unit-8";
export { unit9 } from "./unit-9";
export { unit10 } from "./unit-10";
export { unit11 } from "./unit-11";
export { unit12 } from "./unit-12";
export { unit13 } from "./unit-13";
export { unit14 } from "./unit-14";
export { unit15 } from "./unit-15";

/**
 * Mapa de unidades por ID
 * Usado para cargar dinámicamente: getCourseUnit(1) → unit1
 */
export const COURSE_UNITS: Record<number, () => Promise<{ default: Unit }>> = {
  1: () => import("./unit-1").then((m) => ({ default: m.unit1 })),
  2: () => import("./unit-2").then((m) => ({ default: m.unit2 })),
  3: () => import("./unit-3").then((m) => ({ default: m.unit3 })),
  4: () => import("./unit-4").then((m) => ({ default: m.unit4 })),
  5: () => import("./unit-5").then((m) => ({ default: m.unit5 })),
  6: () => import("./unit-6").then((m) => ({ default: m.unit6 })),
  7: () => import("./unit-7").then((m) => ({ default: m.unit7 })),
  8: () => import("./unit-8").then((m) => ({ default: m.unit8 })),
  9: () => import("./unit-9").then((m) => ({ default: m.unit9 })),
  10: () => import("./unit-10").then((m) => ({ default: m.unit10 })),
  11: () => import("./unit-11").then((m) => ({ default: m.unit11 })),
  12: () => import("./unit-12").then((m) => ({ default: m.unit12 })),
  13: () => import("./unit-13").then((m) => ({ default: m.unit13 })),
  14: () => import("./unit-14").then((m) => ({ default: m.unit14 })),
  15: () => import("./unit-15").then((m) => ({ default: m.unit15 })),
};

/**
 * Obtener una unidad por número de orden
 * @param order - Orden de la unidad (1-15)
 * @returns Unit o undefined si no existe
 */
export async function getCourseUnit(order: number): Promise<Unit | undefined> {
  const loader = COURSE_UNITS[order];
  if (!loader) return undefined;
  try {
    const module = await loader();
    return module.default;
  } catch (error) {
    console.error(`Failed to load unit ${order}:`, error);
    return undefined;
  }
}

/**
 * Obtener todas las unidades disponibles
 */
export async function getAllCourseUnits(): Promise<Unit[]> {
  const units: Unit[] = [];
  for (let i = 1; i <= 15; i++) {
    const unit = await getCourseUnit(i);
    if (unit) units.push(unit);
  }
  return units;
}
