import Hero from './components/Hero'
import TheGap from './components/TheGap'
import WhatWeAre from './components/WhatWeAre'
import HowItWorks from './components/HowItWorks'
import TheFeeling from './components/TheFeeling'
import Application from './components/Application'
import Footer from './components/Footer'
import './index.css'

export default function App() {
  return (
    <main className="bg-proof-bg">
      <Hero />
      <TheGap />
      <WhatWeAre />
      <HowItWorks />
      <TheFeeling />
      <Application />
      <Footer />
    </main>
  )
}
