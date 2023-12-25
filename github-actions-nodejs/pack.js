const adm = require("adm-zip");
const fs = require("fs");
const path = require("path");

const branch = process.env.GITHUB_REF.split('/').slice(-1)[0];

if (branch == "main") {
    const dir = path.dirname(__dirname);
    const directories = fs.readdirSync(dir);
    const sorted = [];
    const blacklist = ["README.md", "github-actions-nodejs", ".git", ".github", "node_modules", "package.json", "package-lock.json"];
    for (const sort of directories) {
        if (!blacklist.includes(sort)) {
            sorted.push(sort);
        }
    }
    for (const directory of sorted) {
        const builds = fs.readdirSync(`${dir}/${directory}`).filter((v) => v != "Builds");
        for (const build of builds) {
            const files = fs.readdirSync(`${dir}/${directory}/${build}`);
            const zip = new adm();
            for (const file of files) {
                zip.addLocalFile(`${dir}/${directory}/${build}/${file}`, undefined);
            }
            if (!fs.existsSync(`${dir}/${directory}/Builds`)) fs.mkdirSync(`${dir}/${directory}/Builds`);
            zip.writeZip(`${dir}/${directory}/Builds/${build}.zip`);
        }
    }
}
