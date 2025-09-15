const https = require('https');

// Test CORS headers
const options = {
  hostname: 'back-api.nikkisuper.my.id',
  port: 443,
  path: '/content/privacy-policy',
  method: 'GET',
  headers: {
    'Origin': 'https://nikkisuper.co.id'
  }
};

const req = https.request(options, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:');
  console.log('Access-Control-Allow-Origin:', res.headers['access-control-allow-origin']);
  console.log('Access-Control-Allow-Methods:', res.headers['access-control-allow-methods']);
  console.log('Access-Control-Allow-Headers:', res.headers['access-control-allow-headers']);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const jsonData = JSON.parse(data);
      console.log('Response success:', jsonData.success);
    } catch (e) {
      console.log('Response:', data.substring(0, 200));
    }
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.end();
