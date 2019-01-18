interface Header {
    name: string;
    value: string;
}

interface CspObject {
    // 'default-src': string[];
    // 'script-src'?: string[];
    // 'style-src'?: string[];
    // 'img-src'?: string[];
    // 'font-src'?: string[];
    // 'connect-src'?: string[];
    // 'media-src'?: string[];
    // 'object-src'?: string[];
    // 'frame-src'?: string[];
    // 'worker-src'?: string[];
    // 'frame-ancestors'?: string[];
    // 'form-action'?: string[];
    // 'upgrade-insecure-requests'?: null;
    // 'block-all-mixed-content'?: null;
    // 'require-sri-for'?: string[];
    // 'sandbox'?: string[];
    // 'reflected-xss'?: string[];
    // 'base-uri'?: string;
    // 'manifest-src'?: string[];
    // 'plugin-types'?: string[];
    // 'report-to'?: string;
    [propery: string]: string[];
}
