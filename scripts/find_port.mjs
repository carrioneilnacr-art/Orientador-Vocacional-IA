import http from 'http';

async function checkPort(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${port}/api/vocacional`, { timeout: 1500 }, (res) => {
      resolve({ port, status: res.statusCode });
    });
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
  });
}

async function main() {
  for (const p of [3000, 3001, 3002, 3003, 8080]) {
    const r = await checkPort(p);
    if (r) {
      console.log(`Port ${p} is ACTIVE, status: ${r.status}`);
      return;
    }
  }
  console.log('No active dev server found on common ports');
}

main();
