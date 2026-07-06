import Hero from './components/Hero'
import TheConnection from './components/TheConnection'
import WhatWeAre from './components/WhatWeAre'
import HowItWorks from './components/HowItWorks'
import TheFeeling from './components/TheFeeling'
import WhatWeMake from './components/WhatWeMake'
import Application from './components/Application'
import Footer from './components/Footer'
import './index.css'

export default function App() {
  return (
    <main className="bg-proof-bg">
      <Hero />
      <TheConnection />
      <WhatWeAre />
      <HowItWorks />
      <TheFeeling />
      <WhatWeMake />
      <Application />
      <Footer />
    </main>
  )
}
