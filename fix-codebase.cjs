const fs = require('fs');
const path = require('path');

const replacements = [
    { from: /bg-\[oklch\(0\.92_0\.02_145\)]/g, to: 'bg-(--forest-mist)' },
    { from: /text-\[oklch\(0\.24_0\.05_145\)]/g, to: 'text-(--forest-deep)' },
    { from: /bg-\[oklch\(0\.38_0\.08_145\)]/g, to: 'bg-(--forest)' },
    { from: /text-\[oklch\(0\.38_0\.08_145\)]/g, to: 'text-(--forest)' },
    { from: /hover:bg-\[oklch\(0\.97_0\.01_85\)]/g, to: 'hover:bg-(--cream-warm)' },
    { from: /border-\[oklch\(0\.22_0\.01_85\/8%\)]/g, to: 'border-(--line)' },
    { from: /border-\[oklch\(0\.22_0\.01_85\/15%\)]/g, to: 'border-(--line)' },
    { from: /bg-\[oklch\(0\.97_0\.01_85\)]/g, to: 'bg-(--cream-warm)' },
    { from: /bg-\[oklch\(0\.88_0\.06_82\)]/g, to: 'bg-(--gold-soft)' },
    { from: /text-\[oklch\(0\.48_0\.01_85\)]/g, to: 'text-(--charcoal-soft)' },
    { from: /hover:bg-\[oklch\(0\.24_0\.05_145\)]/g, to: 'hover:bg-(--forest-deep)' },
    { from: /hover:bg-\[oklch\(0\.92_0\.02_145\)]/g, to: 'hover:bg-(--forest-mist)' },
    { from: /hover:border-\[oklch\(0\.38_0\.08_145\)]/g, to: 'hover:border-(--forest)' },
    { from: /hover:bg-\[oklch\(0\.92_0\.02_145\)\/20%]/g, to: 'hover:bg-(--forest-mist)/20' },
];

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    for (const r of replacements) {
        content = content.replace(r.from, r.to);
    }

    const dateRegex = /new Date\(([^),]+)\)/g;
    let addedImport = false;
    
    // Only replace single-argument new Date() to avoid messing with multi-arg constructions
    content = content.replace(dateRegex, (match, p1) => {
        if (p1.trim() !== '' && !p1.includes('undefined')) {
            addedImport = true;
            return `parseISO(${p1})`;
        }
        return match;
    });

    if (addedImport && !original.includes('parseISO')) {
        // If it already has date-fns import, we append parseISO
        if (content.includes("from 'date-fns'")) {
            content = content.replace(/(import\s+{)([^}]*)(}\s+from\s+['"]date-fns['"])/, (match, p1, p2, p3) => {
                return p1 + p2 + ', parseISO' + p3;
            });
        } else {
            content = `import { parseISO } from 'date-fns';\n` + content;
        }
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated:', filePath);
    }
}

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            processFile(fullPath);
        }
    }
}

walk(path.join(__dirname, 'resources/js'));
