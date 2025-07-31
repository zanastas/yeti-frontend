import Head from 'next/head';
import TradingInterface from '../components/TradingInterface';

export default function Home() {
  return (
    <>
      <Head>
        <title>Yeti - DEX Trading Automation</title>
        <meta name="description" content="Automate TradingView indicators for DEX limit orders" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TradingInterface />
    </>
  );
}