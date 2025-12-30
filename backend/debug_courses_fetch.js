const http = require('http');

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/courses',
    method: 'GET',
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let data = '';
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log('JSON Parse Success');
            console.log('success:', json.success);
            if (json.data) {
                console.log('data count:', json.data.length);
                if (json.data.length > 0) {
                    console.log('First course keys:', Object.keys(json.data[0]));
                    console.log('First course title:', json.data[0].title);
                    console.log('First course _id:', json.data[0]._id);
                }
            } else {
                console.log('No data property found');
            }
        } catch (e) {
            console.error('JSON Parse Error:', e.message);
            console.log('First 100 chars:', data.substring(0, 100));
        }
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();
