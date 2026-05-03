#!/usr/bin/env node

/**
 * Generates local `.env` files from `.env.example` with random secrets.
 * Safe to run multiple times — won't overwrite existing `.env` files.
 */
import { readFileSync, existsSync, writeFileSync } from 'node:fs'
import { createHash, randomBytes } from 'node:crypto'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const packages = [
  { name: 'backend', envPath: 'backend/.env', examplePath: 'backend/.env.example' },
]

let created = 0
let skipped = 0

for (const pkg of packages) {
  const envFile = resolve(ROOT, pkg.envPath)
  const exampleFile = resolve(ROOT, pkg.examplePath)

  if (existsSync(envFile)) {
    console.log(`  ⏭  ${pkg.name}/.env already exists — skipping`)
    skipped++
    continue
  }

  if (!existsSync(exampleFile)) {
    console.log(`  ⚠️   ${pkg.name}/.env.example not found — skipping`)
    skipped++
    continue
  }

  let template = readFileSync(exampleFile, 'utf-8')
  const jwtSecret = randomBytes(32).toString('hex')
  template = template.replace("JWT_SECRET=''", `JWT_SECRET='${jwtSecret}'`)
  template = template.replace("STRONG_HASH=10", "STRONG_HASH=4")

  writeFileSync(envFile, template, 'utf-8')
  console.log(`  ✅  ${pkg.name}/.env created with random JWT_SECRET`)
  created++
}

console.log(`\nDone — ${created} created, ${skipped} skipped`)
