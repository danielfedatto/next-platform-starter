import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const response = await fetch('https://bestjointcare.com/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch content: ${response.status} ${response.statusText}`);
        }

        let html = await response.text();
        const baseUrl = 'https://bestjointcare.com';

        // Function to convert URLs to absolute
        const convertToProxyUrl = (url) => {
            if (!url) return url;
            if (url.startsWith('data:')) return url;
            if (url.startsWith('http')) return url;
            if (url.startsWith('//')) return `https:${url}`;
            if (url.startsWith('/img/')) {
                const fixedUrl = `${baseUrl}/cb${url}`;
                return fixedUrl;
            }
            return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
        };

        // Function to fix image paths
        const fixImagePath = (url) => {
            if (!url) return url;
            if (url.startsWith('data:')) return url;
            if (url.startsWith('http')) {
                // Check if it's a bestjointcare.com URL that needs /cb/ prefix
                if (url.includes('bestjointcare.com/img/')) {
                    const fixedUrl = url.replace('bestjointcare.com/img/', 'bestjointcare.com/cb/img/');
                    return fixedUrl;
                }
                return url;
            }
            if (url.startsWith('//')) return `https:${url}`;
            if (url.startsWith('/img/')) {
                const fixedUrl = `${baseUrl}/cb${url}`;
                return fixedUrl;
            }
            // Handle relative paths without leading slash
            if (url.startsWith('img/')) {
                const fixedUrl = `${baseUrl}/cb/${url}`;
                return fixedUrl;
            }
            return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
        };

        // Handle uk-img images specifically
        const ukImgRegex = /<img[^>]*uk-img[^>]*>/gi;
        html = html.replace(ukImgRegex, (match) => {
            
            // Extract data-src if it exists
            const dataSrcMatch = match.match(/data-src="([^"]+)"/);
            if (dataSrcMatch) {
                const dataSrcUrl = dataSrcMatch[1];
                // Add src attribute right after uk-img
                return match.replace('uk-img=""', `uk-img="" src="${dataSrcUrl}"`);
            }
            
            return match;
        });

        // Convert image URLs in src and data-src attributes
        const srcRegex = /(src|data-src)="([^"]+)"/gi;
        html = html.replace(srcRegex, (match, attr, url) => {
            const fixedUrl = fixImagePath(url);
            return `${attr}="${fixedUrl}"`;
        });

        // Convert image URLs in style attributes
        const styleRegex = /style="[^"]*background-image:\s*url\(['"]?([^'")\s]+)['"]?\)[^"]*"/gi;
        html = html.replace(styleRegex, (match, url) => {
            const fixedUrl = fixImagePath(url);
            return match.replace(url, fixedUrl);
        });

        // Convert other relative URLs to absolute
        const urlRegex = /(href|action)="([^"]+)"/gi;
        html = html.replace(urlRegex, (match, attr, url) => {
            const absoluteUrl = convertToProxyUrl(url);
            return `${attr}="${absoluteUrl}"`;
        });

        // Ensure img tags have both src and data-src attributes
        const imgRegex = /<img([^>]*)>/gi;
        html = html.replace(imgRegex, (match, attributes) => {
            // If there's a data-src but no src, copy data-src to src
            if (attributes.includes('data-src=') && !attributes.includes('src=')) {
                const dataSrcMatch = attributes.match(/data-src="([^"]+)"/);
                if (dataSrcMatch) {
                    return `<img${attributes} src="${dataSrcMatch[1]}">`;
                }
            }
            return match;
        });

        // Add security headers to the HTML
        const csp = "default-src 'self' https://bestjointcare.com https://d39ldsmboekjvi.cloudfront.net https://go.maxweb.com https://cdn.converteai.net; img-src 'self' data: https://bestjointcare.com https://d39ldsmboekjvi.cloudfront.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://bestjointcare.com https://cdnjs.cloudflare.com; style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com https://bestjointcare.com https://cdnjs.cloudflare.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://bestjointcare.com https://cdnjs.cloudflare.com; script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' https://bestjointcare.com https://cdnjs.cloudflare.com; frame-src 'self' https://go.maxweb.com; connect-src 'self' https://bestjointcare.com https://d39ldsmboekjvi.cloudfront.net https://cdn.converteai.net; media-src 'self' https://cdn.converteai.net; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com https://bestjointcare.com;";

        html = html.replace('<head>', `<head>
            <meta http-equiv="Content-Security-Policy" content="${csp}">
        `);

        return new NextResponse(html, {
            headers: {
                'Content-Type': 'text/html',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': '*',
                'Cross-Origin-Resource-Policy': 'cross-origin',
                'Cross-Origin-Embedder-Policy': 'credentialless',
                'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
                'X-Frame-Options': 'SAMEORIGIN',
                'Content-Security-Policy': csp
            }
        });
    } catch (error) {
        console.error('Proxy error:', error);
        return new NextResponse('Error fetching content', { status: 500 });
    }
} 