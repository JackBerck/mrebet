const fs = require('fs');
let code = fs.readFileSync('resources/js/components/public/public-footer.tsx', 'utf8');

const getIconName = (svg) => {
    if (svg.includes('x="3" y="3" width="18" height="18" rx="5"')) {
return 'Instagram';
}

    if (svg.includes('M14 9h3V6h-3a4 4 0 00-4 4v2H7v3h3v6h3v-6h3l1-3h-4v-2a1 1 0 011-1z')) {
return 'Facebook';
}

    if (svg.includes('M11 10l4 2-4 2v-4z')) {
return 'Youtube';
}

    if (svg.includes('M22 16.92v3a2 2 0 01-2.18 2')) {
return 'Phone';
}

    if (svg.includes('M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z')) {
return 'Mail';
}

    if (svg.includes('M12 21c-4-3-8-6.5-8-11a8 8 0 0116 0c0 4.5-4 8-8 11z')) {
return 'MapPin';
}

    return null;
};

let usedIcons = new Set();
let result = "";
let i = 0;
let replaceCount = 0;

while (i < code.length) {
    let svgStart = code.indexOf('<svg', i);

    if (svgStart === -1) {
        result += code.substring(i);
        break;
    }
    
    let svgEnd = code.indexOf('</svg>', svgStart);

    if (svgEnd === -1) {
        result += code.substring(i);
        break;
    }

    svgEnd += 6; 
    
    let svgStr = code.substring(svgStart, svgEnd);
    let iconName = getIconName(svgStr);
    
    result += code.substring(i, svgStart);
    
    if (iconName) {
        let classMatch = svgStr.match(/className="([^"]*)"/);
        let className = classMatch ? classMatch[1] : "";
        result += '<' + iconName + (className ? ' className="' + className + '"' : '') + ' />';
        usedIcons.add(iconName);
        replaceCount++;
    } else {
        result += svgStr;
    }
    
    i = svgEnd;
}

if (usedIcons.size > 0) {
    const importStr = 'import { ' + Array.from(usedIcons).join(', ') + " } from 'lucide-react';\n";
    result = importStr + result;
}

fs.writeFileSync('resources/js/components/public/public-footer.tsx', result);
console.log('Replaced ' + replaceCount + ' icons.');
