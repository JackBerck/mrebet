const fs = require('fs');
let code = fs.readFileSync('resources/js/pages/home.tsx', 'utf8');

const getIconName = (svg) => {
    if (svg.includes('M4 20l4-9 4 9M12 20l4-9 4 9M8 11l4-7 4 7')) {
return 'Tent';
}

    if (svg.includes('M3 20l6-14 4 8 3-5 5 11H3z')) {
return 'Mountain';
}

    if (svg.includes('M12 2v3M12 19v3')) {
return 'Sunrise';
}

    if (svg.includes('M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2')) {
return 'Camera';
}

    if (svg.includes('M4 10h16M6 10V6a2 2 0 012-2h8a2 2 0 012 2v4')) {
return 'Utensils';
}

    if (svg.includes('M12 2l2.5 6.5L21 9l-5 4 2 7-6-4-6 4 2-7-5-4 6.5-.5z')) {
return 'Compass';
}

    if (svg.includes('M5 12h14M13 6l6 6-6 6')) {
return 'ArrowRight';
}

    if (svg.includes('M9 20l-6-3V4l6 3 6-3 6 3v13l-6-3-6 3z')) {
return 'Map';
}

    if (svg.includes('M12 21c-4-3-8-6.5-8-11a8 8 0 0116 0c0 4.5-4 8-8 11z')) {
return 'MapPin';
}

    if (svg.includes('M12 7v5l3.5 2')) {
return 'Clock';
}

    if (svg.includes('M13 13h3v3h-3zM19 13v3M13 19h3M17 19h3v-3')) {
return 'QrCode';
}

    if (svg.includes('M12 2C12 2 6 9 6 14a6 6 0 0012 0c0-5-6-12-6-12z')) {
return 'Droplet';
}

    if (svg.includes('M20.8 4.6c-1.9-1.9-5-1.9-6.9 0L12 6.5')) {
return 'Heart';
}

    if (svg.includes('M8 7V3m8 4V3m-9 8h10M5 21V7a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2z')) {
return 'Calendar';
}

    if (svg.includes('M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2')) {
return 'User';
}

    if (svg.includes('M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z')) {
return 'Eye';
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

    if (result.includes("import { useMotionReveal }")) {
        result = result.replace("import { useMotionReveal }", importStr + "import { useMotionReveal }");
    } else {
        result = importStr + result;
    }
}

fs.writeFileSync('resources/js/pages/home.tsx', result);
console.log('Replaced ' + replaceCount + ' icons.');
