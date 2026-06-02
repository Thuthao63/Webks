const fs = require('fs');
const filesToStar = [
    'frontend/src/pages/Admin/Dashboard.jsx',
    'frontend/src/pages/client/Services.jsx',
    'frontend/src/pages/client/Promotions.jsx',
    'frontend/src/pages/client/Profile.jsx',
    'frontend/src/pages/client/Contact.jsx',
    'frontend/src/pages/client/About.jsx',
    'frontend/src/pages/Admin/ManageDiscounts.jsx'
];

filesToStar.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/import\s+\{([^}]*)\}\s+from\s+['"]lucide-react['"]/g, (match, imports) => {
        let parts = imports.split(',').map(s => s.trim()).filter(s => s);
        let unique = [...new Set(parts)];
        return 'import { ' + unique.join(', ') + ' } from "lucide-react"';
    });
    fs.writeFileSync(file, content, 'utf8');
});
