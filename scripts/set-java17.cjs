const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const JDK17_DIR = '/tmp/jdk17';
const JDK17_MARKER = '/tmp/jdk17/.ready';
const JDK17_URL = 'https://api.adoptium.net/v3/binary/latest/17/ga/linux/x64/jdk/hotspot/normal/eclipse';

function run(cmd, opts) {
  try { return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], ...opts }).trim(); }
  catch { return ''; }
}

function isJava17(dir) {
  const bin = path.join(dir, 'bin', 'java');
  if (!fs.existsSync(bin)) return false;
  const v = run(`"${bin}" -version 2>&1`);
  return v.includes('version "17');
}

const home = process.env.HOME || '/home/expo';

// 1. Look for Java 17 in standard locations first
const candidates = [
  '/usr/lib/jvm/java-17-amazon-corretto',
  '/usr/lib/jvm/java-17-amazon-corretto-amd64',
  '/usr/lib/jvm/java-17-openjdk-amd64',
  '/usr/lib/jvm/java-17-openjdk',
  '/usr/lib/jvm/java-17',
  '/usr/lib/jvm/temurin-17',
  '/usr/lib/jvm/temurin-17-amd64',
  '/usr/lib/jvm/zulu-17-amd64',
  '/usr/lib/jvm/msopenjdk-17',
  '/usr/local/lib/jvm/java-17',
  '/opt/java/17',
  '/opt/jdk-17',
  JDK17_DIR,
];

// SDKMAN
const sdkman = path.join(home, '.sdkman', 'candidates', 'java');
if (fs.existsSync(sdkman)) {
  try { fs.readdirSync(sdkman).filter(v => /^17/.test(v)).forEach(v => candidates.push(path.join(sdkman, v))); } catch {}
}

// Scan /usr/lib/jvm
['/usr/lib/jvm', '/usr/local/lib/jvm', '/opt'].forEach(dir => {
  if (!fs.existsSync(dir)) return;
  try { fs.readdirSync(dir).filter(e => /17/.test(e)).forEach(e => candidates.push(path.join(dir, e))); } catch {}
});

// Broad find
run('timeout 5 find /usr/lib/jvm /usr/local /opt ' + home + ' -maxdepth 6 -name "java" -type f 2>/dev/null')
  .split('\n').filter(Boolean)
  .forEach(p => candidates.push(p.replace(/\/bin\/java$/, '').replace(/\/jre\/bin\/java$/, '')));

const seen = new Set();
let java17Home = null;
for (const dir of candidates) {
  if (!dir || seen.has(dir)) continue;
  seen.add(dir);
  if (isJava17(dir)) {
    java17Home = dir;
    console.log(`[set-java17] Found existing Java 17 at: ${dir}`);
    break;
  }
}

// 2. If not found, download JDK 17 from Eclipse Adoptium
if (!java17Home) {
  console.log('[set-java17] Java 17 not found locally. Downloading from Adoptium...');
  console.log('[set-java17] /usr/lib/jvm: ' + run('ls /usr/lib/jvm 2>/dev/null'));

  try {
    fs.mkdirSync(JDK17_DIR, { recursive: true });
    // Download and extract JDK 17
    execSync(
      `curl -L --retry 3 --retry-delay 2 -o /tmp/jdk17.tar.gz "${JDK17_URL}" && ` +
      `tar -xzf /tmp/jdk17.tar.gz -C "${JDK17_DIR}" --strip-components=1 && ` +
      `rm -f /tmp/jdk17.tar.gz`,
      { stdio: 'inherit', timeout: 180000 }
    );

    if (isJava17(JDK17_DIR)) {
      java17Home = JDK17_DIR;
      fs.writeFileSync(JDK17_MARKER, java17Home);
      console.log(`[set-java17] Downloaded JDK 17 to ${JDK17_DIR}`);
    } else {
      console.error('[set-java17] Downloaded JDK does not appear to be Java 17!');
      console.error('[set-java17] java -version:', run(`${JDK17_DIR}/bin/java -version 2>&1`));
    }
  } catch (e) {
    console.error('[set-java17] Failed to download JDK 17:', e.message);
  }
}

if (!java17Home) {
  console.warn('[set-java17] Could not obtain Java 17. Build may fail.');
  process.exit(0);
}

// 3. Write to ~/.gradle/gradle.properties
const gradleDir = path.join(home, '.gradle');
fs.mkdirSync(gradleDir, { recursive: true });
const propsFile = path.join(gradleDir, 'gradle.properties');
const existing = fs.existsSync(propsFile) ? fs.readFileSync(propsFile, 'utf8') : '';
const entry = `org.gradle.java.home=${java17Home}`;
if (existing.includes('org.gradle.java.home')) {
  fs.writeFileSync(propsFile, existing.replace(/org\.gradle\.java\.home=.*/g, entry));
} else {
  fs.appendFileSync(propsFile, '\n' + entry + '\n');
}
console.log(`[set-java17] Wrote ${entry} to ${propsFile}`);

// 4. Write marker for config plugin
fs.writeFileSync(JDK17_MARKER, java17Home);
console.log('[set-java17] Done.');
