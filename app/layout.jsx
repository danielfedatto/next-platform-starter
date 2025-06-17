import '../styles/globals.css';

export const metadata = {
    title: {
        template: '%s | Be more Healthy',
        default: 'Be more Healthy'
    }
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.svg" sizes="any" />
            </head>
            <body className="antialiased text-white bg-white">
                <div className="flex flex-col min-h-screen">
                    <div className="flex flex-col w-full grow">
                        <main className="grow">{children}</main>
                    </div>
                </div>
            </body>
        </html>
    );
}
