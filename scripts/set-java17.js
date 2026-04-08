const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const candidates = [
  '/usr/lib/jvm/java-17-amazon-corretto',
  '/usr/lib/jvm/java-17-amazon-corretto-amd64',
  '/usr/lib/jvm/temurin-17',
  '/usr/lib/jvm/temurin-17-amd64',
  '/usr/lib/jvm/java-17-openjdk-amd64',
  '/usr/lib/jvm/java-17-openjdk',
  '/usr/lib/jvm/java-17',
  '/usr/local/lib/jvm/java-17',
];

let java17Home = null;

for (const dir of candidates) {
  const javaBin = path.join(dir, 'bin', 'java');
  if (fs.existsSync(javaBin)) {
    java17Home = dir;
    console.log(`[set-java17] Found Java 17 at: ${dir}`);
    break;
  }
}

if (!java17Home) {
  try {
    const result = execSync(
      "find /usr/lib/jvm /usr/local/lib/jvm /opt /usr/java -maxdepth 2 -name 'java' -type f 2>/dev/null | head -20",
      { encoding: 'utf8' }
    );
    const lines = result.trim().split('\n').filter(Boolean);
    for (const javaExec of lines) {
      try {
        const version = execSync(`"${javaExec}" -version 2>&1`, { encoding: 'utf8' });
        if (version.includes('version "17')) {
          java17Home = path.dirname(path.dirname(javaExec));
          console.log(`[set-java17] Discovered Java 17 at: ${java17Home}`);
          break;
        }
      } catch {}
    }
  } catch {}
}

if (!java17Home) {
  console.warn('[set-java17] Java 17 not found — Gradle will use system default.');
  process.exit(0);
}

const gradleDir = path.join(process.env.HOME || '/root', '.gradle');
fs.mkdirSync(gradleDir, { recursive: true });

const propsFile = path.join(gradleDir, 'gradle.properties');
const entry = `org.gradle.java.home=${java17Home}\n`;

const existing = fs.existsSync(propsFile) ? fs.readFileSync(propsFile, 'utf8') : '';
if (!existing.includes('org.gradle.java.home')) {
  fs.appendFileSync(propsFile, entry);
  console.log(`[set-java17] Wrote to ${propsFile}: ${entry.trim()}`);
} else {
  console.log(`[set-java17] org.gradle.java.home already set in ${propsFile}`);
}
