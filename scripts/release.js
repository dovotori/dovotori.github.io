const { execSync } = require('child_process');
const fs = require('fs');
const semver = require('semver');
const pkg = require('../package.json');

function getCurrentBranch() {
  return execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
}

async function release() {
  try {
    // Check if on master branch
    const currentBranch = getCurrentBranch();
    if (currentBranch !== 'master') {
      console.error('❌ Releases can only be created from the master branch');
      console.error(`Current branch is: ${currentBranch}`);
      process.exit(1);
    }

    // 1. Bump version
    const newVersion = semver.inc(pkg.version, 'patch');
    pkg.version = newVersion;
    fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));

    execSync('git fetch');
    execSync('git pull origin master');

    // 2. Generate changelog
    execSync('npm run changelog');

    // 3. Build and deploy
    execSync('npm run build');
    execSync('npm run deploy');

    // 4. Commit changes
    execSync('git add package.json CHANGELOG.md');
    execSync(`git commit -m "chore: release v${newVersion}"`);
    execSync(`git tag v${newVersion}`);
    execSync('git push origin master --tags');

    // 5. Create GitHub release using gh CLI
    const changelog = fs.readFileSync('CHANGELOG.md', 'utf8');
    const releaseNotes = changelog.split('#### ')[1].split('\n\n')[1];

    execSync(`gh release create v${newVersion} \
      --title "v${newVersion}" \
      --notes "${releaseNotes}" \
      --target master`);

    console.log(`🚀 Successfully released version ${newVersion}`);
  } catch (err) {
    console.error('Error during deployment:', err);
    process.exit(1);
  }
}

release();
