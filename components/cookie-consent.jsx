'use client';

import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { sendGTMEvent } from '@next/third-parties/google';

const CookieConsent = ({ policyLink }) => {

    useEffect(() => {
        document.body.style.overflow = 'hidden';
    }, []);

    return (
        <>
            {/* Dark overlay */}
            <div className="fixed inset-0 bg-black/50 z-40" />

            {/* Cookie consent modal */}
            <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 z-50">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex-1">
                        <p className="text-gray-700 text-sm sm:text-base">
                            We use cookies to enhance your experience. By continuing to visit this site you agree to our
                            use of cookies.{' '}
                            {policyLink && (
                                <a
                                    href={policyLink}
                                    target="_self"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 underline"
                                    onClick={() => sendGTMEvent({
                                        event: 'conversion',
                                        send_to: 'AW-17215624479/IWMOCK-KrtwaEJ-qhpFA',
                                        value: 1.0,
                                        currency: 'BRL',
                                        transaction_id: '',
                                    })}
                                >
                                    Learn more
                                </a>
                            )}
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <a
                            href={policyLink}
                            target="_self"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors no-underline"
                            onClick={() => sendGTMEvent({
                                event: 'conversion',
                                send_to: 'AW-17215624479/IWMOCK-KrtwaEJ-qhpFA',
                                value: 1.0,
                                currency: 'BRL',
                                transaction_id: '',
                            })}
                        >
                            Accept
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

CookieConsent.propTypes = {
    policyLink: PropTypes.string.isRequired
};

export default CookieConsent;
