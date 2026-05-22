const { execSync } = require('child_process');

const args = process.argv.slice(2).join(' ');

try {
    execSync(`npx playwright test ${args}`, {
        stdio: 'inherit'
    });
} catch (e) {

}

execSync('node ./reports/generate_report.js', {
    stdio: 'inherit'
})