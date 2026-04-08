const { withGradleProperties } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function run(cmd) {
  try { return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); }
  catch { return ''; }
}

function findJava17() {
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
    '/usr/local/lib/jvm/java-17',
    '/opt/java/17',
    '/opt/jdk-17',
    '/opt/jdk/17',
  ];

  // SDKMAN
  const sdkman = path.join(home, '.sdkman', 'candidates', 'java');
  if (fs.existsSync(sdkman)) {
    try {
      fs.readdirSync(sdkman).filter(v => /^17/.test(v))
        .forEach(v => candidates.push(path.join(sdkman, v)));
    } catch {}
  }

  // Scan /usr/lib/jvm for dirs with "17"
  ['/usr/lib/jvm', '/usr/local/lib/jvm', '/opt'].forEach(dir => {
    if (!fs.existsSync(dir)) return;
    try {
      fs.readdirSync(dir).filter(e => /17/.test(e))
        .forEach(e => candidates.push(path.join(dir, e)));
    } catch {}
  });

  // update-java-alternatives
  run('update-java-alternatives --list 2>/dev/null').split('\n').forEach(line => {
    const parts = line.trim().split(/\s+/);
    if (parts.length >= 3 && /17/.test(parts[0])) {
      candidates.push(parts[2].replace(/\/bin\/java$/, ''));
    }
  });

  // Broad find (time-limited)
  run('timeout 5 find /usr/lib/jvm /usr/local /opt ' + home + ' -maxdepth 6 -name "java" -type f 2>/dev/null')
    .split('\n').filter(Boolean)
    .forEach(p => candidates.push(p.replace(/\/bin\/java$/, '').replace(/\/jre\/bin\/java$/, '')));

  const seen = new Set();
  for (const dir of candidates) {
    if (!dir || seen.has(dir)) continue;
    seen.add(dir);
    const bin = path.join(dir, 'bin', 'java');
    if (!fs.existsSync(bin)) continue;
    const v = run(`"${bin}" -version 2>&1`);
    if (v.includes('version "17')) {
      console.log(`[withJava17] Found Java 17 at: ${dir}`);
      return dir;
    }
  }

  // Debug: log what IS on the machine
  console.warn('[withJava17] Java 17 not found! /usr/lib/jvm contains:');
  console.warn(run('ls /usr/lib/jvm 2>/dev/null || echo "(empty or missing)"'));
  console.warn('[withJava17] JAVA_HOME env:', process.env.JAVA_HOME || '(not set)');
  console.warn('[withJava17] java -version:', run('java -version 2>&1'));
  return null;
}

const withJava17 = (config) => {
  return withGradleProperties(config, (cfg) => {
    const java17 = findJava17();
    if (java17) {
      // Remove existing org.gradle.java.home if present
      cfg.modResults = cfg.modResults.filter(
        item => !(item.type === 'property' && item.key === 'org.gradle.java.home')
      );
      cfg.modResults.push({
        type: 'property',
        key: 'org.gradle.java.home',
        value: java17,
      });
      console.log(`[withJava17] Set org.gradle.java.home=${java17} in gradle.properties`);
    }
    return cfg;
  });
};

module.exports = withJava17;
