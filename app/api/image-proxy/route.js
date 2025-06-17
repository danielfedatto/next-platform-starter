import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const url = request.nextUrl.searchParams.get('url');
        if (!url) {
            return new NextResponse('Missing URL parameter', { status: 400 });
        }

        // Decode the URL
        const decodedUrl = decodeURIComponent(url);
        console.log('Processing image request:', { originalUrl: url, decodedUrl });

        // Fix the URL if needed
        let fixedUrl = decodedUrl;
        if (fixedUrl.includes('bestjointcare.com/img/')) {
            fixedUrl = fixedUrl.replace('bestjointcare.com/img/', 'bestjointcare.com/cb/img/');
            console.log('Fixed URL:', { original: decodedUrl, fixed: fixedUrl });
        }

        // Validate URL is from allowed domains
        if (!fixedUrl.startsWith('https://bestjointcare.com/') && 
            !fixedUrl.startsWith('https://d39ldsmboekjvi.cloudfront.net/')) {
            console.error('Invalid URL domain:', fixedUrl);
            return new NextResponse('Invalid URL domain', { status: 400 });
        }

        // Fetch the image with exact same headers as browser
        const response = await fetch(fixedUrl, {
            headers: {
                'accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                'accept-encoding': 'gzip, deflate, br, zstd',
                'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                'cache-control': 'no-cache',
                'pragma': 'no-cache',
                'referer': 'https://bestjointcare.com/cb/?',
                'sec-ch-ua': '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'image',
                'sec-fetch-mode': 'no-cors',
                'sec-fetch-site': 'same-origin',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36'
            }
        });

        if (!response.ok) {
            console.error('Failed to fetch image:', {
                url: fixedUrl,
                status: response.status,
                statusText: response.statusText
            });
            return new NextResponse('Failed to fetch image', { status: response.status });
        }

        // Get the content type
        const contentType = response.headers.get('content-type') || 'image/png';
        console.log('Image content type:', contentType);

        // Get the image data
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Return the image directly
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': '*',
                'Cross-Origin-Resource-Policy': 'cross-origin',
                'Cross-Origin-Embedder-Policy': 'credentialless',
                'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
                'Cache-Control': 'public, max-age=31536000'
            }
        });
    } catch (error) {
        console.error('Image proxy error:', error);
        return new NextResponse('Error processing image', { status: 500 });
    }
} 