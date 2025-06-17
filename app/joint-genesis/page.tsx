'use client';

import CookieConsent from '../../components/cookie-consent';

export default function Page() {
    return (
        <div className="w-full h-screen">
            <iframe
                src="/api/proxy"
                className="w-full h-full border-0"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                referrerPolicy="no-referrer"
                title="Genious Wave"
            />
            <CookieConsent policyLink="https://03c3112-2eu8ncbbz2ssi0xld3.hop.clickbank.net" />
        </div>
    );
} 