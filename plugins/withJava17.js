const { withGradleProperties } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const JDK17_DIR = '/tmp/jdk17';
const JDK17_MARKER = '/tmp/jdk17/.ready';

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

function findJava17() {
  const home = process.env.HOME || '/home/expo';

  // Check marker file written by eas-build-post-install script
  if (fs.existsSync(JDK17_MARKER)) {
    const markerPath = fs.readFileSync(JDK17_MARKER, 'utf8').trim();
    if (markerPath && isJava17(markerPath)) {
      console.log(`[withJava17] Using Java 17 from marker: ${markerPath}`);
      return markerPath;
    }
  }

  // Check downloaded JDK directly
  if (isJava17(JDK17_DIR)) {
    console.log(`[withJava17] Using downloaded JDK at ${JDK17_DIR}`);
    return JDK17_DIR;
  }

  // Standard path candidates
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
  for (const dir of candidates) {
    if (!dir || seen.has(dir)) continue;
    seen.add(dir);
    if (isJava17(dir)) {
      console.log(`[withJava17] Found Java 17 at: ${dir}`);
      return dir;
    }
  }

  console.warn('[withJava17] Java 17 not found!');
  console.warn('[withJava17] /usr/lib/jvm:', run('ls /usr/lib/jvm 2>/dev/null'));
  console.warn('[withJava17] java -version:', run('java -version 2>&1'));
  console.warn('[withJava17] JAVA_HOME:', process.env.JAVA_HOME || '(not set)');
  return null;
}

const withJava17 = (config) => {
  return withGradleProperties(config, (cfg) => {
    const java17 = findJava17();
    if (java17) {
      cfg.modResults = cfg.modResults.filter(
        item => !(item.type === 'property' && item.key === 'org.gradle.java.home')
      );
      cfg.modResults.push({
        type: 'property',
        key: 'org.gradle.java.home',
        value: java17,
      });
      console.log(`[withJava17] org.gradle.java.home=${java17}`);
    }
    return cfg;
  });
};

module.exports = withJava17;
