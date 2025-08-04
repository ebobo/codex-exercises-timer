import { useState, useRef } from 'react'
import './App.css'

function App() {
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const [history, setHistory] = useState(() => {
    const stored = localStorage.getItem('history')
    return stored ? JSON.parse(stored) : []
  })

  const intervalRef = useRef(null)

  const startTimer = () => {
    setRunning(true)
    setSeconds(0)
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        const next = prev + 1
        window.speechSynthesis.cancel()
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(String(next)))
        return next
      })
    }, 1000)
  }

  const stopTimer = () => {
    clearInterval(intervalRef.current)
    setRunning(false)
    const entry = { date: new Date().toLocaleString(), duration: seconds }
    const updated = [entry, ...history]
    setHistory(updated)
    localStorage.setItem('history', JSON.stringify(updated))
    setSeconds(0)
  }

  const startRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser')
      return
    }
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.continuous = true
    recognition.interimResults = false
    recognition.onresult = (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim().toLowerCase()
      if (transcript.includes('start') && !running) {
        startTimer()
      } else if (transcript.includes('stop') && running) {
        stopTimer()
        recognition.stop()
      }
    }
    recognition.onerror = (e) => console.error(e)
    recognition.start()
  }

  return (
    <div>
      <h1>Exercise Timer</h1>
      <button onClick={startRecognition}>Start Exercise</button>
      <div>Time: {seconds}s</div>
      <h2>History</h2>
      <ul>
        {history.map((item, idx) => (
          <li key={idx}>{item.date}: {item.duration}s</li>
        ))}
      </ul>
    </div>
  )
}

export default App
