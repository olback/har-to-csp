#!/usr/bin/node

import * as url from 'url';
import * as path from 'path';
import { argv, cwd, exit } from 'process';

if (typeof argv[2] === 'undefined') {
    console.log('Usage: har2csp <input-file.json>');
    exit(1);
}

const data: Har.Dump = require(path.join(cwd(), argv[2]));
const baseRequest = url.parse(data.log.pages[0].title);

const quotedWords = [
    'none',
    'self',
    'unsafe-inline',
    'unsafe-eval'
];

const csp: CspObject = {
    'default-src': ['none']
}

console.log(`Generating CSP for ${baseRequest.hostname}.`);

function getHeader(headers: Har.Header[], name: string): string | null {

    for (const h of headers) {

        if (h.name === name) {
            return h.value;
        }

    }

    return null;

}

function getContentTypeOption(mime: string): string {

    const m = mime.split(';')[0];

    switch (true) {

        case m.includes('javascript'):
            return 'script-src';

        case m.includes('css'):
            return 'style-src';

        case m.includes('image'):
            return 'img-src';

        case m.includes('font'):
            return 'font-src';

        case (m.includes('audio') || m.includes('video')):
            return 'media-src';

        case m.includes('manifest'):
            return 'manifest-src';

        default:
            return 'default-src';

    }

}

function generateCspString(c: CspObject): string {

    let r = 'Content-Security-Policy ';

    for (const o in c) {

        r += `${o} `;
        r += c[o].map(v => quotedWords.indexOf(v) !== -1 ? `'${v}'` : v).join(' ');
        r += '; ';

    }

    return r;

}

for (const e of data.log.entries) {

    const host = String(url.parse(e.request.url).host);
    const mime = getHeader(e.response.headers, 'content-type');

    if (!mime || mime.includes('html')) {
        continue;
    }

    const type = getContentTypeOption(mime);

    if (typeof csp[type] === 'undefined') {
        csp[type] = [];
    }

    if (host === baseRequest.host) {

        csp[type].push('self');

    } else {

        csp[type].push(host);

    }

    for (const p in csp) {
        csp[p] = [... new Set(csp[p])];
    }

}

console.log(generateCspString(csp));
