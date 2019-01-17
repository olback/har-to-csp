const url = require('url');

// Load data
const data = require('./report-uri.com.har.json');
const baseRequest = url.parse(data.log.pages[0].title);

console.log(baseRequest.host);

const reqs = [];

for (const e of data.log.entries) {
    reqs.push(url.parse(e.request.url).host);
}

console.log([... new Set(reqs)]);