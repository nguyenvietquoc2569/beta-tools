// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to social-tools!</title>
        <script async defer crossOrigin="anonymous" src="/fullstory.js"></script>
        
      </Head>
      <main className="app">
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default CustomApp;
