// scripts/setup.mjs
// One-time setup: `npm run setup`
// 1) installs dependencies  2) creates .env with your API key
// 3) creates the database   4) checks that your key works
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import { createInterface } from 'node:readline/promises';

const run = (cmd) => execSync(cmd, { stdio: 'inherit' });
const step = (msg) => console.log(`\n▶ ${msg}`);

// 1) dependencies
if (!fs.existsSync('node_modules')) {
  step('Installing dependencies');
  run('npm install');
}

// 2) .env
if (!fs.existsSync('.env')) {
  step('Creating .env from .env.example');
  fs.copyFileSync('.env.example', '.env');
}

let env = fs.readFileSync('.env', 'utf-8');
const read = (key) => env.match(new RegExp(`^${key}=(.*)$`, 'm'))?.[1]?.trim().replace(/^"|"$/g, '');

if (!read('CR_API_TOKEN')) {
  step('Clash Royale API key');
  console.log('Create one at https://developer.clashroyale.com (My Account → Create New Key).');
  console.log('Keys only work from the IP addresses you list. See the README if you are unsure.');
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const token = (await rl.question('Paste your key (or press Enter to skip): ')).trim();
  rl.close();
  if (token) {
    env = /^CR_API_TOKEN=/m.test(env)
      ? env.replace(/^CR_API_TOKEN=.*$/m, `CR_API_TOKEN=${token}`)
      : `${env}\nCR_API_TOKEN=${token}\n`;
    fs.writeFileSync('.env', env);
  }
}

// 3) database
step('Creating / updating the database');
run('npx prisma migrate deploy');

// 4) check the key
const token = read('CR_API_TOKEN');
const base = read('CR_API_BASE_URL') || 'https://api.clashroyale.com/v1';
if (!token) {
  console.log('\n⚠️  No API key yet. Add CR_API_TOKEN to .env, then run `npm run setup` again.');
} else {
  step('Checking your API key');
  const res = await fetch(`${base}/cards`, { headers: { Authorization: `Bearer ${token}` } });
  if (res.ok) {
    console.log('✔ API key works');
  } else {
    const body = await res.json().catch(() => ({}));
    console.log(`✖ The API answered ${res.status}: ${body.message ?? body.reason ?? 'unknown error'}`);
    if (body.reason === 'accessDenied.invalidIp') {
      console.log('  → Create a new key for the IP shown above, or use the RoyaleAPI proxy (see README).');
    }
  }
}

console.log('\nDone! Start the app with `npm run dev` and open http://localhost:3000');
