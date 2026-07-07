const fs = require('fs');
let code = fs.readFileSync('resources/js/pages/home.tsx', 'utf8');

function replaceTags(code) {
    let result = code;
    const regex = /<div([^>]*?data-reveal[^>]*?)>/g;
    let match;
    let changes = [];
    
    while ((match = regex.exec(result)) !== null) {
        let startIndex = match.index;
        let innerStartIndex = startIndex + match[0].length;
        
        let depth = 1;
        let currentIndex = innerStartIndex;
        let endIndex = -1;
        
        const tagRegex = /<\/?div/g;
        tagRegex.lastIndex = innerStartIndex;
        
        let tagMatch;

        while ((tagMatch = tagRegex.exec(result)) !== null) {
            if (tagMatch[0] === '<div') {
                depth++;
            } else if (tagMatch[0] === '</div') {
                depth--;

                if (depth === 0) {
                    endIndex = tagMatch.index;
                    break;
                }
            }
        }
        
        if (endIndex !== -1) {
            changes.push({
                start: startIndex,
                matchLength: match[0].length,
                end: endIndex,
                attributes: match[1]
            });
        }
    }
    
    // Process backwards to not mess up indices
    for (let i = changes.length - 1; i >= 0; i--) {
        const change = changes[i];
        let attrs = change.attributes.replace(/data-reveal-stagger/g, '').replace(/data-reveal/g, '');
        
        const startTag = '<motion.div' + attrs + ' initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: \"-10%\" }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>';
        const endTag = '</motion.div>';
        
        result = result.substring(0, change.end) + endTag + result.substring(change.end + 6);
        result = result.substring(0, change.start) + startTag + result.substring(change.start + change.matchLength);
    }
    
    return result;
}

const newCode = replaceTags(code);
fs.writeFileSync('resources/js/pages/home.tsx', newCode);
console.log('Replaced ' + (code.match(/data-reveal/g) || []).length + ' instances');
