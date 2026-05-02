declare module 'uuid' {
  export function v4(options?: Record<string, unknown>): string
  export function v1(options?: Record<string, unknown>): string
  export function v3(name: string | Uint8Array, namespace: string | Uint8Array): string
  export function v5(name: string | Uint8Array, namespace: string | Uint8Array): string
}
