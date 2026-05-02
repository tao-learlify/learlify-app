/**
 * Reproduces exactly what MailService.sendMail() does post-migration.
 * Run: node scripts/test-mail-service.mjs
 */
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadEnv(file) {
  try {
    const raw = readFileSync(resolve(__dirname, '..', file), 'utf8')
    for (const line of raw.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq === -1) continue
      const key = trimmed.slice(0, eq).trim()
      const val = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '')
      if (!process.env[key]) process.env[key] = val
    }
  } catch { /* ignore */ }
}

loadEnv('.env.development')
loadEnv('.env')

// --- mirror MailService constructor ---
const client = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  }
})

const SES_FROM_EMAIL    = process.env.SES_FROM_EMAIL    || 'support@learlify.com'
const SES_REPLY_TO_EMAIL = process.env.SES_REPLY_TO_EMAIL || 'support@learlify.com'
const EMAIL_DEVELOPMENT  = process.env.EMAIL_DEVELOPMENT

// --- mirror MailService.sendMail() ---
async function sendMail(options) {
  const from = options.from ?? SES_FROM_EMAIL
  const to   = process.env.NODE_ENV === 'development'
    ? (EMAIL_DEVELOPMENT ?? options.to)
    : options.to

  if (!to) { console.warn('No recipient — skipping'); return }

  const toAddresses = Array.isArray(to) ? to : [to]

  const command = new SendEmailCommand({
    Source: from,
    Destination: { ToAddresses: toAddresses },
    ReplyToAddresses: [options.replyTo ?? SES_REPLY_TO_EMAIL],
    Message: {
      Subject: { Data: options.subject, Charset: 'UTF-8' },
      Body: {
        ...(options.text && { Text: { Data: options.text, Charset: 'UTF-8' } }),
        ...(options.html && { Html: { Data: options.html, Charset: 'UTF-8' } })
      }
    }
  })

  const result = await client.send(command)
  return result.MessageId
}

// --- run test ---
console.log(`\n📧  MailService end-to-end test`)
console.log(`   Region  : ${process.env.AWS_REGION}`)
console.log(`   From    : ${SES_FROM_EMAIL}`)
console.log(`   Reply-To: ${SES_REPLY_TO_EMAIL}`)
console.log(`   To (dev): ${EMAIL_DEVELOPMENT}\n`)

try {
  const messageId = await sendMail({
    subject: '✅ MailService SES test — Learlify',
    text: 'MailService is working correctly with AWS SES.',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#323065">MailService SES test ✅</h2>
        <p>The <strong>Learlify backend</strong> MailService is correctly sending via AWS SES.</p>
        <p style="color:#888;font-size:12px">Sent at ${new Date().toISOString()} — region: ${process.env.AWS_REGION}</p>
      </div>`
  })
  console.log(`✅  Email sent! MessageId: ${messageId}`)
} catch (err) {
  console.error(`❌  Failed: ${err.name} — ${err.message}`)
  process.exit(1)
}
