import { useEffect, useState } from 'react'
import diceIcon from './assets/icon-dice.svg'
import dividerDesktop from './assets/pattern-divider-desktop.svg'
import dividerMobile from './assets/pattern-divider-mobile.svg'


interface Advice {
  id: number
  advice: string
}

function isAdvice(data: unknown): data is Advice {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    typeof data.id === 'number' &&
    'advice' in data &&
    typeof data.advice === 'string'
  )
}

function isSlip(data: unknown): data is { slip: Advice } {
  return (
    typeof data === 'object' &&
    data !== null &&
    'slip' in data &&
    isAdvice(data.slip)
  )
}

const random = (): number => Math.floor(Math.random() * 220) + 1



function App() {
  const [advices, setAdvices] = useState<Advice | null>(null)
  const [isLoading, setIsLoading] = useState(false)


  const loadData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`https://api.adviceslip.com/advice/${random()}`)

      if (!response.ok) {
        throw new Error(`${response.status}`)
      }

      const data: unknown = await response.json()

      if (isSlip(data)) {
        setAdvices(data.slip);
      }

    }
    catch (error) {
      console.log(error)
    }
    finally {

      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])



  return (
    <main className="flex min-h-screen items-center justify-center bg-blue950 px-6">
      <div className="relative w-full max-w-85.75 rounded-xl bg-blue900 px-6 pt-10 pb-14 text-center md:max-w-135 md:px-10 md:pt-12 md:pb-16">
        <p className="text-preset3 uppercase text-green300">Advice #{advices?.id}</p>

        <h1 className="text-preset1 mt-4 text-blue200 md:text-preset2 md:mt-6">
          {advices?.advice}
        </h1>

        <img
          src={dividerMobile}
          alt=""
          className="mx-auto my-8 w-full max-w-73.75 md:hidden"
        />
        <img
          src={dividerDesktop}
          alt=""
          className="mx-auto my-8 hidden w-full max-w-111 md:block"
        />

        <button
          onClick={() => loadData()}
          type="button"
          disabled={isLoading}

          aria-label="Get new advice"
          className="absolute -bottom-8 left-1/2 flex size-16 -translate-x-1/2 items-center justify-center rounded-full bg-green300 disabled:opacity-50 transition-shadow hover:shadow-[0_0_30px_rgba(83,255,170,0.5)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green300"
        >
          <img src={diceIcon} alt="" className="size-6" />
        </button>
      </div>
    </main>
  )
}

export default App
