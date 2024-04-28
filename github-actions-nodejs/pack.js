const adm = require("adm-zip");
const fs = require("fs");
const path = require("path");

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
            if (fs.statSync(`${dir}/${directory}/${build}/${file}`).isDirectory()) 
                zip.addLocalFolder(`${dir}/${directory}/${build}/${file}`)
            else
                zip.addLocalFile(`${dir}/${directory}/${build}/${file}`);
        }
        if (!fs.existsSync(`${dir}/${directory}/Builds`)) fs.mkdirSync(`${dir}/${directory}/Builds`);
        zip.writeZip(`${dir}/${directory}/Builds/${build}.zip`);
    }
}
