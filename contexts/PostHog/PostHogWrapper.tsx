'use client';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { useEffect, useState } from 'react';

export default function PostHogProviderWrapper({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
        session_recording: {
          maskAllInputs: true,
          maskInputFn: (text, element) => {
            if (element?.classList.contains('sensitive')) {
              return '*'.repeat(text.length);
            }
            return text;
          },
          maskTextSelector: '.sensitive',
        },
        person_profiles: 'identified_only',
        loaded: ph => {
          if (process.env.NODE_ENV === 'development') ph.debug();
        },
      });
      // @ts-ignore
      setClient(posthog);
    }
  }, []);

  return client ? <PostHogProvider client={client}>{children}</PostHogProvider> : <>{children}</>;
}
