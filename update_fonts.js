const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(file));
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            results.push(file);
        }
    });
    return results;
}

const files = walkDir('frontend/src');
let modifiedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    let newContent = content.replace(/className="([^"]*font-sans[^"]*)"/g, (match, classes) => {
        classes = classes.replace(/\btext-8xl\b/g, 'text-7xl font-medium');
        classes = classes.replace(/\btext-7xl\b/g, 'text-6xl font-medium');
        classes = classes.replace(/\btext-6xl\b/g, 'text-5xl font-medium');
        classes = classes.replace(/\btext-5xl\b/g, 'text-4xl font-medium');
        classes = classes.replace(/\btext-4xl\b/g, 'text-3xl font-medium');
        classes = classes.replace(/\btext-3xl\b/g, 'text-2xl font-medium');
        classes = classes.replace(/\btext-2xl\b/g, 'text-xl font-medium');
        
        // Ensure not too many bold tags
        classes = classes.replace(/\bfont-bold\b/g, 'font-medium');

        let classArray = classes.split(' ');
        classArray = [...new Set(classArray)]; // deduplicate
        return 'className="' + classArray.join(' ') + '"';
    });

    if (newContent !== original) {
        fs.writeFileSync(file, newContent, 'utf8');
        modifiedCount++;
    }
});
console.log('Modified ' + modifiedCount + ' files.');
