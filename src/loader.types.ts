export type LoadMicrofrontendInfo= {
  url: string
  name: string
  isProd?: boolean
  onComplete: () => void
}

export type LoadScriptProps = {
  src: string
  name: string
  isDev: boolean
}
