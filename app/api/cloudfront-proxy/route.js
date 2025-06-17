import { NextResponse } from 'next/server';

// Cache simples em memória
const imageCache = new Map();

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const imageUrl = searchParams.get('url');

        if (!imageUrl) {
            console.error('Missing image URL in request');
            return new NextResponse('Missing image URL', { status: 400 });
        }

        // Decode the URL
        const decodedUrl = decodeURIComponent(imageUrl);
        console.log('Processing CloudFront image request:', decodedUrl);

        // Verificar se a imagem está no cache
        if (imageCache.has(decodedUrl)) {
            console.log('Serving image from cache:', decodedUrl);
            const cachedData = imageCache.get(decodedUrl);
            return new NextResponse(cachedData.data, {
                headers: {
                    'Content-Type': cachedData.contentType,
                    'Cache-Control': 'public, max-age=31536000',
                    'Access-Control-Allow-Origin': '*',
                    'Cross-Origin-Resource-Policy': 'cross-origin',
                    'Cross-Origin-Embedder-Policy': 'credentialless',
                    'Cross-Origin-Opener-Policy': 'same-origin-allow-popups'
                }
            });
        }

        // Fetch the image with specific headers
        const response = await fetch(decodedUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://bestjointcare.com/',
                'Origin': 'https://bestjointcare.com',
                'Connection': 'keep-alive',
                'Sec-Fetch-Dest': 'image',
                'Sec-Fetch-Mode': 'no-cors',
                'Sec-Fetch-Site': 'cross-site'
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            console.error(`Failed to fetch CloudFront image: ${decodedUrl}`, {
                status: response.status,
                statusText: response.statusText
            });
            return new NextResponse('Failed to fetch image', { status: response.status });
        }

        // Get the content type
        const contentType = response.headers.get('content-type') || 'image/png';
        console.log('CloudFront image content type:', contentType);

        // Get the image data
        const imageData = await response.arrayBuffer();
        console.log('CloudFront image data size:', imageData.byteLength);

        // Armazenar no cache
        imageCache.set(decodedUrl, {
            data: imageData,
            contentType: contentType,
            timestamp: Date.now()
        });

        // Limpar cache antigo (manter apenas as últimas 100 imagens)
        if (imageCache.size > 100) {
            const oldestKey = Array.from(imageCache.keys())[0];
            imageCache.delete(oldestKey);
        }

        // Return the image data
        return new NextResponse(imageData, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000',
                'Access-Control-Allow-Origin': '*',
                'Cross-Origin-Resource-Policy': 'cross-origin',
                'Cross-Origin-Embedder-Policy': 'credentialless',
                'Cross-Origin-Opener-Policy': 'same-origin-allow-popups'
            }
        });
    } catch (error) {
        console.error('CloudFront proxy error:', {
            message: error.message,
            stack: error.stack,
            url: request.url
        });
        return new NextResponse('Error fetching image', { status: 500 });
    }
} 