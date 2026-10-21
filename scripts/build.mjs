import fs from 'node:fs';
let html=fs.readFileSync('src/index.html','utf8');
html=html.replace('<title>栖心 Flow · 你的专属冥想</title>','<title>栖心 Flow · 同频社区预览</title>');
html=html.replace('</style>',['experience.css','visuals.css','community.css'].map(f=>fs.readFileSync('src/'+f,'utf8')).join('\n')+'\n</style>');
const js=['app.js','experience.js'].map(f=>fs.readFileSync('src/'+f,'utf8')).join('\n')+'\nconst CARD_IMAGES='+fs.readFileSync('src/card-images.json','utf8')+';\n'+['visuals.js','community.js'].map(f=>fs.readFileSync('src/'+f,'utf8')).join('\n');
const serverHtml=html;
html=html.replace('<script src="/app.js"></script>',()=>'<script>'+js.replaceAll('</script','<\\/script')+'</script>');
fs.writeFileSync('dist/index.html',html);console.log('Built standalone community preview');

fs.mkdirSync('dist/server',{recursive:true});
fs.writeFileSync('dist/server/index.js','const PAGE='+JSON.stringify(serverHtml)+';\nconst APP='+JSON.stringify(js)+';\n'+fs.readFileSync('worker/handler.js','utf8'));
