const fs = require('fs');
const path = require('path');

const walk = function(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('.jsx')) {
            results.push(file);
        }
    });
    return results;
};

const files = walk('frontend/src');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    const hasProtectedImage = content.includes('ProtectedImage');

    const imgRegex = /<img\b([^>]*)>/g;
    content = content.replace(imgRegex, (match, attrs) => {
        if (attrs.includes('assets/cards') || attrs.includes('imagePath')) {
            changed = true;
            return '<ProtectedImage' + attrs + '/>';
        }
        return match;
    });

    if (changed) {
        if (!hasProtectedImage) {
            const depth = file.split('/').length - 3;
            let importPath = './ProtectedImage';
            if (file.includes('/pages/')) importPath = '../components/ProtectedImage';
            
            const lastImportIndex = content.lastIndexOf('import ');
            const nextNewline = content.indexOf('\n', lastImportIndex);
            content = content.slice(0, nextNewline + 1) + "import ProtectedImage from '" + importPath + "';\n" + content.slice(nextNewline + 1);
        }
        fs.writeFileSync(file, content);
        console.log('Updated', file);
    }
});
