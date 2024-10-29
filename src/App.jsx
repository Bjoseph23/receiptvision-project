import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css' // Ensure that Tailwind directives are added in the CSS file

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="flex justify-center gap-8 mt-10">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="w-20 h-20" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="w-20 h-20" alt="React logo" />
        </a>
      </div>

      <h1 className="text-3xl font-bold text-center mt-8">Vite + React</h1>

      <div className="card flex flex-col items-center mt-5">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          count is {count} + 1
        </button>
        <p className="mt-4 text-gray-500">
          Edit <code className="font-mono text-purple-500">src/App.jsx</code> and save to test HMR
        </p>
      </div>

      <p className="text-center text-gray-600 mt-8">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
