import Navbar from '@/components/ui/Navbar';
import './globals.css';
import './prismjs-theme.css';
import { Inter } from 'next/font/google';
import Script from 'next/script';

import SupabaseListener from '@/components/supabase/listener';
import SupabaseProvider from '@/components/supabase/provider';
import { createServerClient } from '@/utils/supabase/server';
import type { Database, Profile } from '@/utils/supabase/types';
import type { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import Footer from '@/components/ui/Footer/Footer';
import ProfileService from '@/utils/supabase/services/profile';
import ChatWindow from '@/components/ui/ChatWindow';
import Banner from '@/components/ui/Banner';
import ProgressBarClient from '@/components/ui/ProgressBarClient';
import ModalBannerCodeClient from '@/components/ui/ModalBannerCode/ModalBannerCodeClient';

export type TypedSupabaseClient = SupabaseClient<Database>;

declare global {
  interface Window {
    usermavenQ: any; // Replace 'any' with the appropriate type of 'usermavenQ'
  }
}

const inter = Inter({ subsets: ['latin'] });

// do not cache this layout
export const revalidate = 0;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;
  const profileService = new ProfileService(createServerClient());
  const profile = user ? await profileService.getById(user?.id) : null;

  return (
    <html lang="en" className="bg-slate-900">
      <head>
        {process.env.USER_MAVEN_KEY && (
          <>
            <Script
              strategy="afterInteractive"
              src="https://t.usermaven.com/lib.js"
              data-key={process.env.USER_MAVEN_KEY}
              data-tracking-host="https://events.usermaven.com"
              data-autocapture="true"
              data-privacy-policy="strict"
              defer
            ></Script>
            <Script
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
            window.usermaven = window.usermaven || (function()
            {(window.usermavenQ = window.usermavenQ || []).push(arguments)})
          `,
              }}
            />
            <Script
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "ic87ytbm3p");
`,
              }}
            />
          </>
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=0" />
      </head>
      <body className={inter.className}>
        <main>
          <ChatWindow />
          <SupabaseProvider user={profile as Profile} session={session}>
            <SupabaseListener serverAccessToken={session?.access_token} />
            <Banner />
            <Navbar />
            <ModalBannerCodeClient />
            {children}
            {/* <ProgressBarClient /> */}
            <Footer />
          </SupabaseProvider>
        </main>
      </body>
    </html>
  );
}
