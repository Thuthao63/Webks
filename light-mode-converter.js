const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'frontend/src/pages/Admin');
const files = fs.readdirSync(dir).filter(f => f.startsWith('Manage') && f.endsWith('.jsx'));

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Modals & Backgrounds
    content = content.replace(/bg-\[\#0a0a0a\]/g, 'bg-white');
    content = content.replace(/bg-\[\#050505\]/g, 'bg-slate-50');
    content = content.replace(/bg-black\/80 backdrop-blur-sm/g, 'bg-slate-900/40 backdrop-blur-sm');
    
    // Borders
    content = content.replace(/border-white\/5/g, 'border-slate-100');
    content = content.replace(/border-white\/10/g, 'border-slate-200');
    content = content.replace(/border-white\/20/g, 'border-slate-300');
    content = content.replace(/border border-white\/10 text-white p-4 rounded-2xl/g, 'border border-slate-200 text-slate-900 p-4 rounded-2xl font-sans');

    // Table rows & backgrounds
    content = content.replace(/bg-white\/\[0\.01\]/g, 'bg-slate-50/50 font-sans');
    content = content.replace(/bg-white\/\[0\.02\]/g, 'bg-slate-50');
    content = content.replace(/bg-white\/5/g, 'bg-slate-50');
    content = content.replace(/bg-white\/10/g, 'bg-slate-100');
    
    // Text Colors
    content = content.replace(/text-white/g, 'text-slate-900');
    content = content.replace(/text-gray-400/g, 'text-slate-400');
    content = content.replace(/text-gray-500/g, 'text-slate-500');
    content = content.replace(/text-gray-600/g, 'text-slate-500');
    content = content.replace(/text-gray-700/g, 'text-slate-400');
    content = content.replace(/text-gray-800/g, 'text-slate-300');
    
    // Hovers
    content = content.replace(/hover:bg-white\/\[0\.01\]/g, 'hover:bg-slate-50');
    content = content.replace(/hover:bg-white\/10/g, 'hover:bg-slate-100');
    content = content.replace(/hover:text-white/g, 'hover:text-slate-900');
    
    // Typography refinements
    content = content.replace(/text-xs text-slate-500 uppercase font-bold tracking-wider/g, 'text-[10px] text-slate-400 uppercase font-black tracking-widest font-sans');
    content = content.replace(/<tbody className="divide-y divide-slate-100">/g, '<tbody className="divide-y divide-slate-100 bg-white">');
    content = content.replace(/text-slate-900 font-bold text-sm tracking-wide/g, 'text-slate-700 font-bold text-sm font-sans');
    content = content.replace(/text-amber-500 font-black text-lg tracking-wider/g, 'text-slate-900 font-black text-sm tracking-wider font-sans');
    content = content.replace(/text-xs text-slate-500 uppercase">vnđ/g, 'text-[10px] text-slate-400 uppercase">vnđ');
    content = content.replace(/text-xs rounded-2xl shadow-luxury hover:scale-105/g, 'text-[11px] rounded-xl shadow-md shadow-amber-500/20 hover:-translate-y-0.5');

    // Badges
    content = content.replace(/text-sm font-black uppercase tracking-widest border text-(emerald|amber|rose|blue)-400 border-\1-500\/20 bg-\1-500\/5/g, 'text-[10px] font-black uppercase tracking-widest border text-$1-600 border-$1-500/20 bg-$1-50 font-sans');

    // Swal Config
    content = content.replace(/background: '#0a0a0ae6'/g, "background: '#ffffff'");
    content = content.replace(/color: '#fff'/g, "color: '#0f172a'");
    content = content.replace(/backdrop: 'rgba\(0,0,0,0\.8\)'/g, "backdrop: 'rgba(15,23,42,0.4)'");
    content = content.replace(/cancelButton: 'bg-slate-50 border border-slate-200 text-slate-900/g, "cancelButton: 'bg-slate-100 border border-slate-200 text-slate-700");

    fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Conversion completed successfully.');
