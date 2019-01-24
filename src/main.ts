#!/usr/bin/node

import * as url from 'url';
import * as path from 'path';
import * as fs from 'fs';
import { argv, cwd, exit } from 'process';

// Words that need single quotes in a valid CSP.
const quotedWords = [
    'none',
    'self',
    'unsafe-inline',
    'unsafe-eval'
];

// This is the CSP Object. This is where you set default values.
const csp: CspObject = {
    'default-src': ['none']
}

// Check if an argument was passed. If not, exit with an non-zero exit code.
if (typeof argv[2] === 'undefined') {
    console.log('Usage: har2csp <input-file>');
    exit(1);
}

// Open, read and parse the file.
const data: Har.Dump = JSON.parse(fs.readFileSync(path.join(cwd(), argv[2]), 'utf8'));

// Get the base request.
const baseRequest = url.parse(data.log.pages[0].title);

console.log(`Generating CSP for ${baseRequest.host}.`);

// Get header value. If the header does not exist, return null.
function getHeader(headers: Har.Header[], name: string): string | null {

    for (const header of headers) {

        if (header.name === name) {
            return header.value;
        }

    }

    return null;

}

// Get the CSP type / property that corresponds to the mime-type passed.
function getContentTypeOption(mime: string): string {

    switch (true) {

        case mime.includes('javascript'):
            return 'script-src';

        case mime.includes('css'):
            return 'style-src';

        case mime.includes('image'):
            return 'img-src';

        case mime.includes('font'):
            return 'font-src';

        case (mime.includes('audio') || mime.includes('video')):
            return 'media-src';

        case mime.includes('manifest'):
            return 'manifest-src';

        default:
            return 'default-src';

    }

}

// Generate the actual CSP string.
function generateCspString(c: CspObject): string {

    let cspString = 'Content-Security-Policy ';

    for (const propery in c) {

        cspString += `${propery} `; // Append property name.
        cspString += c[propery].map(v => quotedWords.indexOf(v) !== -1 ? `'${v}'` : v).join(' '); // Append values, make sure that 'self' and other keywords get quotes.
        cspString += '; '; // Add a semi-colon at the end.

    }

    return cspString;

}

// Loop through the data.
for (const entry of data.log.entries) {

    const host = String(url.parse(entry.request.url).host); // Get the host of the request.
    const mime = getHeader(entry.response.headers, 'content-type'); // Get the mime-type of the response.

    // If the mime-type is falsy of includes html, just continue the loop.
    if (!mime || mime.includes('html')) {
        continue;
    }

    const type = getContentTypeOption(mime); // Get the CSP type.

    // If the csp type if not defined, make sure it's an array.
    if (typeof csp[type] === 'undefined') {
        csp[type] = [];
    }

    if (host === baseRequest.host) {

        // If the host of the response is equal to the base-request, push 'self'.
        csp[type].push('self');

    } else {

        // Else, push host to the array of hosts to whitelist.
        csp[type].push(host);

    }

    // Loop through the CSP object, remove any duplicates in the arrays by creating a set and then spreading that to a new array.
    for (const property in csp) {
        csp[property] = [... new Set(csp[property])];
    }

}

// Log the generted CSP String to the console.
console.log(generateCspString(csp));
