const http = require('http');
const fs = require('fs');
const path = require('path');

const CONFIG_FILE = path.join(__dirname, 'hero_offsets.json');
let state = {};
let heroConfigs = {};

// Load existing configs on startup
if (fs.existsSync(CONFIG_FILE)) {
    try {
        heroConfigs = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    } catch (e) {
        console.error("[ERROR] Failed to load hero_offsets.json", e);
    }
}

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

    // POST /set - Full state sync
    if (req.method === 'POST' && req.url === '/set') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                state = JSON.parse(body);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'ok' }));
            } catch (e) { res.writeHead(400); res.end('Invalid JSON'); }
        });
    } 
    // GET /get - Get state + master configs
    else if (req.method === 'GET' && req.url === '/get') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ state, heroConfigs }));
    } 
    // POST /save-config - Save a master hero config
    else if (req.method === 'POST' && req.url === '/save-config') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                if (data.heroId) {
                    heroConfigs[data.heroId] = {
                        offx: data.offx,
                        offy: data.offy,
                        zoom: data.zoom
                    };
                    fs.writeFileSync(CONFIG_FILE, JSON.stringify(heroConfigs, null, 4));
                    console.log(`[SAVED] Master config for ${data.heroId}`);
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'ok' }));
            } catch (e) { res.writeHead(400); res.end('Invalid JSON'); }
        });
    }
    else { 
        let rawPath = req.url === '/' ? 'index.html' : req.url.split('?')[0];
        if (rawPath === '/favicon.ico') { res.writeHead(204); res.end(); return; }
        try {
            rawPath = decodeURIComponent(rawPath);
        } catch (e) {}
        let filePath = path.join(__dirname, rawPath);
        let extname = path.extname(filePath).toLowerCase();
        let contentType = 'text/html; charset=utf-8';
        switch (extname) {
            case '.js': contentType = 'text/javascript; charset=utf-8'; break;
            case '.css': contentType = 'text/css; charset=utf-8'; break;
            case '.json': contentType = 'application/json; charset=utf-8'; break;
            case '.png': contentType = 'image/png'; break;
            case '.jpg':
            case '.jpeg': contentType = 'image/jpeg'; break;
            case '.webp': contentType = 'image/webp'; break;
            case '.gif': contentType = 'image/gif'; break;
            case '.mp3': contentType = 'audio/mpeg'; break;
            case '.svg': contentType = 'image/svg+xml'; break;
            case '.ico': contentType = 'image/x-icon'; break;
        }
        
        fs.readFile(filePath, (error, content) => {
            if (error) {
                res.writeHead(404);
                res.end('Not Found');
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content);
            }
        });
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`[AOV MASTER SYNC] Server running at http://localhost:${PORT}/`);
    console.log(`[INFO] Master configs saved to: ${CONFIG_FILE}`);
});
