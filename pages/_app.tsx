import '../styles/globals.scss'
// import variables from "../styles/globals.scss";
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  // console.log(variables);
  return <Component {...pageProps} />
}

export default MyApp
