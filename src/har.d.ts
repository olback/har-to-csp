/*
 *  Copyright olback © 2019
 *  olback.net
 *
 *  HAR 1.2 Spec WIP
 *
 */

declare namespace Har {

    interface Header {
        name: string;
        value: string;
    }

    interface QueryString {
        name: string;
        value: string;
    }

    interface Cookie {
        name: string;
        value: string;
        expires: string | null;
        httpOnly: boolean;
        secure: boolean;
    }

    interface Content {
        size: number;
        mimeType: string;
        text: string;
    }

    interface Request {
        method: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';
        url: string;
        httpVersion: string;
        headers: Header[];
        queryString: QueryString[];
        cookies: Cookie[];
        headersSize: number;
        bodySize: number;
    }

    interface Response {
        status: number;
        statusText: string;
        httpVersion: string;
        headers: Header[];
        cookies: Cookie[];
        content: Content;
        redirectURL: string;
        headersSize: number;
        bodySize: number;
        _transferSize: number;
    }

    interface Cache {

    }

    interface Timings {
        blocked: number;
        dns: number;
        ssl: number;
        connect: number;
        send: number;
        wait: number;
        receive: number;
        _blocked_queueing: number;
    }

    interface Creator {
        name: string;
        version: string;
    }

    interface PageTimings {
        onContentLoad: number;
        onLoad: number;
    }

    interface Page {
        startedDateTime: string;
        id: string;
        title: string;
        pageTimings: PageTimings;
    }

    interface Entry {
        startedDateTime: string;
        time: number;
        request: Request;
        response: Response;
        cache: Cache;
        timings: Timings;
        serverIPAddress: string;
        _initiator: {
            type: string;
        };
        _priority: string;
        _fromCache: string | undefined;
        connection: string;
        pageref: string;
    }

    interface Log {
        version: string;
        creator: Creator;
        pages: Page[];
        entries: Entry[];
    }

    interface Dump {
        log: Log;
    }

}
