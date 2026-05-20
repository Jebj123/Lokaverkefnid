import { useEffect, useState } from 'react'
import Ad from '../../assets/Ad.png'
import Ad2 from '../../assets/Ad2.png'

const ADS = [Ad, Ad2]
const INTERVAL_MS = 13000

const AdBanner = () => {
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setCurrent(i => (i + 1) % ADS.length)
        setVisible(true)
      }, 400)
    }, INTERVAL_MS)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="w-full mb-4 hidden lg:block overflow-hidden rounded-md border border-black">
      <img
        src={ADS[current]}
        alt="Ad banner"
        className="w-full transition-opacity duration-400"
        style={{ opacity: visible ? 1 : 0 }}
      />
    </div>
  )
}

export default AdBanner
