import Head from 'next/head'
import Pet from "../components/Pet";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Neko Sekai</title>
        <meta name="description" content="Neko Sekai" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <Pet />
    </div>
  );
}
