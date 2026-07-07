const fs = require('fs');
let code = fs.readFileSync('resources/js/pages/home.tsx', 'utf8');

// The required lucide imports
const icons = ['Tent', 'Mountain', 'Sunrise', 'Camera', 'Utensils', 'Compass', 'ArrowRight', 'Map', 'MapPin', 'Clock', 'QrCode', 'Droplet', 'Heart', 'TreePine', 'Star', 'User', 'Calendar', 'Eye', 'MapPinned', 'ChevronRight', 'ChevronLeft'];

// Replace patterns based on path/shapes
const replacements = [
    { pattern: /<svg[^>]*class(?:Name)?="([^"]*)"[^>]*>[\s\S]*?M4 20l4-9 4 9M12 20l4-9 4 9M8 11l4-7 4 7[\s\S]*?<\/svg>/g, icon: 'Tent' },
    { pattern: /<svg[^>]*class(?:Name)?="([^"]*)"[^>]*>[\s\S]*?M3 20l6-14 4 8 3-5 5 11H3z[\s\S]*?<\/svg>/g, icon: 'Mountain' },
    { pattern: /<svg[^>]*class(?:Name)?="([^"]*)"[^>]*>[\s\S]*?M12 2v3M12 19v3[\s\S]*?<\/svg>/g, icon: 'Sunrise' },
    { pattern: /<svg[^>]*class(?:Name)?="([^"]*)"[^>]*>[\s\S]*?M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2[\s\S]*?<\/svg>/g, icon: 'Camera' },
    { pattern: /<svg[^>]*class(?:Name)?="([^"]*)"[^>]*>[\s\S]*?M4 10h16M6 10V6a2 2 0 012-2h8a2 2 0 012 2v4[\s\S]*?<\/svg>/g, icon: 'Utensils' },
    { pattern: /<svg[^>]*class(?:Name)?="([^"]*)"[^>]*>[\s\S]*?M12 2l2\.5 6\.5L21 9l-5 4 2 7-6-4-6 4 2-7-5-4 6\.5-\.5z[\s\S]*?<\/svg>/g, icon: 'Compass' }, // Star shaped -> Compass
    { pattern: /<svg[^>]*class(?:Name)?="([^"]*)"[^>]*>[\s\S]*?M5 12h14M13 6l6 6-6 6[\s\S]*?<\/svg>/g, icon: 'ArrowRight' },
    { pattern: /<svg[^>]*class(?:Name)?="([^"]*)"[^>]*>[\s\S]*?M9 20l-6-3V4l6 3 6-3 6 3v13l-6-3-6 3z[\s\S]*?<\/svg>/g, icon: 'Map' },
    { pattern: /<svg[^>]*class(?:Name)?="([^"]*)"[^>]*>[\s\S]*?M12 21c-4-3-8-6\.5-8-11a8 8 0 0116 0c0 4\.5-4 8-8 11z[\s\S]*?<\/svg>/g, icon: 'MapPin' },
    { pattern: /<svg[^>]*class(?:Name)?="([^"]*)"[^>]*>[\s\S]*?M12 7v5l3\.5 2[\s\S]*?<\/svg>/g, icon: 'Clock' },
    { pattern: /<svg[^>]*class(?:Name)?="([^"]*)"[^>]*>[\s\S]*?M13 13h3v3h-3zM19 13v3M13 19h3M17 19h3v-3[\s\S]*?<\/svg>/g, icon: 'QrCode' },
    { pattern: /<svg[^>]*class(?:Name)?="([^"]*)"[^>]*>[\s\S]*?M12 2C12 2 6 9 6 14a6 6 0 0012 0c0-5-6-12-6-12z[\s\S]*?<\/svg>/g, icon: 'Droplet' },
    { pattern: /<svg[^>]*class(?:Name)?="([^"]*)"[^>]*>[\s\S]*?M20\.8 4\.6c-1\.9-1\.9-5-1\.9-6\.9 0L12 6\.5[\s\S]*?<\/svg>/g, icon: 'Heart' },
    { pattern: /<svg[^>]*class(?:Name)?="([^"]*)"[^>]*>[\s\S]*?M8 7V3m8 4V3m-9 8h10M5 21V7a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2z[\s\S]*?<\/svg>/g, icon: 'Calendar' },
    { pattern: /<svg[^>]*class(?:Name)?="([^"]*)"[^>]*>[\s\S]*?M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2[\s\S]*?<\/svg>/g, icon: 'User' },
    { pattern: /<svg[^>]*class(?:Name)?="([^"]*)"[^>]*>[\s\S]*?M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z[\s\S]*?<\/svg>/g, icon: 'Eye' },
];

let replacedCount = 0;
let usedIcons = new Set();

replacements.forEach(rep => {
    code = code.replace(rep.pattern, (match, className) => {
        replacedCount++;
        usedIcons.add(rep.icon);

        return '<' + rep.icon + ' className="' + className + '" />';
    });
});

if (usedIcons.size > 0) {
    const importStr = 'import { ' + Array.from(usedIcons).join(', ') + " } from 'lucide-react';\n";
    code = code.replace("import { motion } from 'motion/react';", "import { motion } from 'motion/react';\n" + importStr);
}

fs.writeFileSync('resources/js/pages/home.tsx', code);
console.log('Replaced ' + replacedCount + ' icons.');
