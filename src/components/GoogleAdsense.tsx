import Script from "next/script";

const ADSENSE_CLIENT_ID = "ca-pub-7577953323229534";

export default function GoogleAdsense() {
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
