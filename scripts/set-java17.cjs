const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

try {
  const JDK17_DIR = '/tmp/jdk17';
  const JDK17_MARKER = '/tmp/jdk17/.ready';
  const JDK17_URL = 'https://api.adoptium.net/v3/binary/latest/17/ga/linux/x64/jdk/hotspot/normal/eclipse';

  function run(cmd, opts) {
    try { return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opts }).trim(); }
    catch { return ''; }
  }

  function isJava17(dir) {
    try {
      const bin = path.join(dir, 'bin', 'java');
      if (!fs.existsSync(bin)) return false;
      const v = run(`"${bin}" -version 2>&1`);
      return v.includes('version "17') || v.includes('"17.');
    } catch { return false; }
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
    '/usr/lib/jvm/msopenjdk-17',
    '/usr/local/lib/jvm/java-17',
    '/opt/java/17',
    '/opt/jdk-17',
    JDK17_DIR,
  ];

  try {
    const sdkman = path.join(home, '.sdkman', 'candidates', 'java');
    if (fs.existsSync(sdkman)) {
      fs.readdirSync(sdkman).filter(v => /^17/.test(v)).forEach(v => candidates.push(path.join(sdkman, v)));
    }
  } catch {}

  try {
    ['/usr/lib/jvm', '/usr/local/lib/jvm', '/opt'].forEach(dir => {
      if (!fs.existsSync(dir)) return;
      try { fs.readdirSync(dir).filter(e => /17/.test(e)).forEach(e => candidates.push(path.join(dir, e))); } catch {}
    });
  } catch {}

  try {
    run('timeout 5 find /usr/lib/jvm -maxdepth 4 -name "java" -type f 2>/dev/null')
      .split('\n').filter(Boolean)
      .forEach(p => candidates.push(p.replace(/\/bin\/java$/, '').replace(/\/jre\/bin\/java$/, '')));
  } catch {}

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

  if (!java17Home) {
    console.log('[set-java17] Java 17 not found locally. Downloading from Adoptium...');
    try {
      fs.mkdirSync(JDK17_DIR, { recursive: true });
      execSync(
        `curl -L --retry 3 --retry-delay 2 --connect-timeout 30 -o /tmp/jdk17.tar.gz "${JDK17_URL}" && ` +
        `tar -xzf /tmp/jdk17.tar.gz -C "${JDK17_DIR}" --strip-components=1 && ` +
        `rm -f /tmp/jdk17.tar.gz`,
        { stdio: ['ignore', 'inherit', 'inherit'], timeout: 180000 }
      );
      if (isJava17(JDK17_DIR)) {
        java17Home = JDK17_DIR;
        console.log(`[set-java17] Downloaded JDK 17 to ${JDK17_DIR}`);
      }
    } catch (e) {
      console.log('[set-java17] Download failed:', e.message);
    }
  }

  if (!java17Home) {
    console.log('[set-java17] Could not obtain Java 17. Skipping.');
    process.exit(0);
  }

  try {
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
    fs.writeFileSync(JDK17_MARKER, java17Home);
  } catch (e) {
    console.log('[set-java17] Could not write gradle.properties:', e.message);
  }

  console.log('[set-java17] Done.');
} catch (e) {
  console.log('[set-java17] Unexpected error (non-fatal):', e.message);
  process.exit(0);
}
