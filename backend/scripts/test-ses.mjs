/**
 * AWS SES test email script
 * Usage: node scripts/test-ses.mjs [to@email.com]
 *
 * Loads credentials from .env.development
 */
import { SESClient, SendEmailCommand, GetAccountSendingEnabledCommand } from '@aws-sdk/client-ses'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// --- load .env.development manually (no dotenv dependency needed) ---
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
  } catch {
    // ignore missing file
  }
}

loadEnv('.env.development')
loadEnv('.env')

const ACCESS_KEY = process.env.AWS_ACCESS_KEY
const SECRET_KEY = process.env.AWS_SECRET_KEY
const REGION     = process.env.AWS_REGION || 'eu-west-3'
const TO         = process.argv[2] || process.env.EMAIL_DEVELOPMENT

if (!ACCESS_KEY || !SECRET_KEY) {
  console.error('❌  AWS_ACCESS_KEY / AWS_SECRET_KEY not set')
  process.exit(1)
}

if (!TO) {
  console.error('❌  Provide a recipient: node scripts/test-ses.mjs you@email.com')
  process.exit(1)
}

const client = new SESClient({
  region: REGION,
  credentials: { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY }
})

console.log(`\n📧  AWS SES test`)
console.log(`   Region : ${REGION}`)
console.log(`   To     : ${TO}`)

// First, verify SES sending is enabled on this account
try {
  const { Enabled } = await client.send(new GetAccountSendingEnabledCommand({}))
  console.log(`   Sending enabled: ${Enabled}`)
} catch (err) {
  console.warn(`   ⚠️  Could not check account sending status: ${err.message}`)
}

// Use the same FROM identity used in the project
const FROM = process.env.SENDGRID_APTIS_EMAIL
  || process.env.SENDGRID_FROM_EMAIL
  || TO // fall back to self-send for sandbox testing

console.log(`   From   : ${FROM}\n`)

const command = new SendEmailCommand({
  Destination: { ToAddresses: [TO] },
  Message: {
    Subject: { Data: '✅ AWS SES test — Learlify Backend', Charset: 'UTF-8' },
    Body: {
      Text: {
        Data: 'This is a test email sent from the Learlify backend via AWS SES.',
        Charset: 'UTF-8'
      },
      Html: {
        Data: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
            <h2 style="color:#323065">AWS SES test ✅</h2>
            <p>This is a test email sent from the <strong>Learlify backend</strong> via AWS SES.</p>
            <p style="color:#888;font-size:12px">Sent at ${new Date().toISOString()} — region: ${REGION}</p>
          </div>`,
        Charset: 'UTF-8'
      }
    }
  },
  Source: FROM
})

try {
  const result = await client.send(command)
  console.log(`✅  Email sent successfully!`)
  console.log(`   MessageId: ${result.MessageId}`)
} catch (err) {
  console.error(`❌  SES send failed: ${err.name}`)
  console.error(`   ${err.message}`)

  if (err.name === 'MessageRejected') {
    console.error('\n   Likely cause: sender address is not verified in SES.')
    console.error('   Go to AWS SES → Verified identities → verify your sender email.')
  }
  if (err.name === 'SendingPausedException') {
    console.error('\n   SES sending is paused on this account.')
  }
  if (err.name === 'AccountSendingPausedException') {
    console.error('\n   Account-level sending is paused.')
  }
  if (err.message?.includes('sandbox')) {
    console.error('\n   In SES sandbox mode, both sender AND recipient must be verified.')
  }
  process.exit(1)
}
