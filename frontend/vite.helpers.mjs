import { readdirSync } from 'node:fs'
import path from 'node:path'


export function normalizeBasePath(basePath = '/') {
  if (!basePath || basePath === '/') {
    return '/'
  }

  return `/${basePath.replace(/^\/+|\/+$/g, '')}/`
}

export function createSrcAliases(srcDirectory) {
  return readdirSync(srcDirectory, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && entry.name !== '@types')
    .map(entry => ({
      find: entry.name,
      replacement: path.resolve(srcDirectory, entry.name)
    }))
}
