const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function run(cmd) {
  try { return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); }
  catch { return ''; }
}

function isJava17(dir) {
  const bin = path.join(dir, 'bin', 'java');
  if (!fs.existsSync(bin)) return false;
  const v = run(`"${bin}" -version 2>&1`);
  return v.includes('version "17');
}

const home = process.env.HOME || '/home/expo';

const candidates = [
  '/usr/lib/jvm/java-17-amazon-corretto',
  '/usr/lib/jvm/java-17-amazon-corretto-amd64',
  '/usr/lib/jvm/java-17-openjdk-amd64',
  '/usr/lib/jvm/java-17-openjdk',
  '/usr/lib/jvm/java-17',
  '/usr/lib/jvm/temurin-17',
  '/usr/lib/jvm/temurin-17-amd64',
  '/usr/lib/jvm/zulu-17-amd64',
  '/usr/lib/jvm/zulu17',
  '/usr/local/lib/jvm/java-17',
  '/opt/java/17',
  '/opt/jdk-17',
  '/opt/jdk/17',
];

// SDKMAN paths
const sdkman = path.join(home, '.sdkman', 'candidates', 'java');
if (fs.existsSync(sdkman)) {
  try {
    fs.readdirSync(sdkman).forEach(v => {
      if (/^17/.test(v)) candidates.push(path.join(sdkman, v));
    });
  } catch {}
}

// Scan /usr/lib/jvm directory for anything with 17 in name
['/usr/lib/jvm', '/usr/local/lib/jvm', '/opt'].forEach(dir => {
  if (!fs.existsSync(dir)) return;
  try {
    fs.readdirSync(dir)
      .filter(e => /17/.test(e))
      .forEach(e => candidates.push(path.join(dir, e)));
  } catch {}
});

// Find via update-java-alternatives
run('update-java-alternatives --list 2>/dev/null').split('\n').forEach(line => {
  const parts = line.trim().split(/\s+/);
  if (parts.length >= 3 && /17/.test(parts[0])) {
    candidates.push(parts[2].replace(/\/bin\/java$/, '').replace(/\/jre\/bin\/java$/, ''));
  }
});

// Find via broad filesystem search (time-limited)
run('timeout 5 find /usr/lib/jvm /usr/local /opt ' + home + ' -maxdepth 6 -name "java" -type f 2>/dev/null')
  .split('\n')
  .filter(Boolean)
  .forEach(p => candidates.push(p.replace(/\/bin\/java$/, '').replace(/\/jre\/bin\/java$/, '')));

// Deduplicate and test
const seen = new Set();
let java17Home = null;
for (const dir of candidates) {
  if (!dir || seen.has(dir)) continue;
  seen.add(dir);
  if (isJava17(dir)) {
    java17Home = dir;
    console.log(`[set-java17] Found Java 17 at: ${dir}`);
    break;
  }
}

if (!java17Home) {
  console.warn('[set-java17] Java 17 not found on this machine.');
  console.warn('[set-java17] /usr/lib/jvm contents: ' + run('ls /usr/lib/jvm 2>/dev/null'));
  console.warn('[set-java17] System java: ' + run('java -version 2>&1'));
  process.exit(0);
}

// Write to global Gradle properties
const gradleDir = path.join(home, '.gradle');
fs.mkdirSync(gradleDir, { recursive: true });
const propsFile = path.join(gradleDir, 'gradle.properties');
const existing = fs.existsSync(propsFile) ? fs.readFileSync(propsFile, 'utf8') : '';
const entry = `org.gradle.java.home=${java17Home}`;
if (existing.includes('org.gradle.java.home')) {
  const updated = existing.replace(/org\.gradle\.java\.home=.*/g, entry);
  fs.writeFileSync(propsFile, updated);
} else {
  fs.appendFileSync(propsFile, '\n' + entry + '\n');
}
console.log(`[set-java17] Set org.gradle.java.home=${java17Home} in ${propsFile}`);

// Try to also set for /etc/environment (best-effort)
try {
  const envFile = '/etc/environment';
  const envContent = fs.existsSync(envFile) ? fs.readFileSync(envFile, 'utf8') : '';
  if (!envContent.includes('JAVA_HOME')) {
    fs.appendFileSync(envFile, `\nJAVA_HOME=${java17Home}\n`);
  }
} catch {}
