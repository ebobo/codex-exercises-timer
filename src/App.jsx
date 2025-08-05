import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const [history, setHistory] = useState(() => {
    const stored = localStorage.getItem('history')
    return stored ? JSON.parse(stored) : []
  })

  const intervalRef = useRef(null)
  const recognitionRef = useRef(null)
  const voiceRef = useRef(null)

  // ensure voices are loaded before attempting to speak
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      if (voices.length > 0) {
        voiceRef.current = voices[0]
      }
    }

    // some browsers load voices asynchronously
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices)
    loadVoices()
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices)
    }
  }, [])

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text)
    if (voiceRef.current) utterance.voice = voiceRef.current
    // make sure previous speech does not queue up
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }

  const startTimer = () => {
    setRunning(true)
    setSeconds(0)
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        const next = prev + 1
        speak(String(next))
        return next
      })
    }, 1000)
  }

  const stopTimer = () => {
    clearInterval(intervalRef.current)
    setRunning(false)
    recognitionRef.current?.stop()
    window.speechSynthesis.cancel()
    const entry = { date: new Date().toLocaleString(), duration: seconds }
    const updated = [entry, ...history]
    setHistory(updated)
    localStorage.setItem('history', JSON.stringify(updated))
    localStorage.setItem('lastDuration', String(seconds))
    setSeconds(0)
  }

  const startRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser')
      return
    }
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.continuous = true
    recognition.interimResults = false

    // limit recognition to start/stop to avoid picking up spoken numbers
    if (SpeechGrammarList) {
      const grammar = '#JSGF V1.0; grammar commands; public <command> = start | stop ;'
      const list = new SpeechGrammarList()
      list.addFromString(grammar, 1)
      recognition.grammars = list
    }

    recognition.onresult = (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim().toLowerCase()

      // ignore digits that come from the spoken timer itself
      const numberWords = [
        'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'
      ]
      if (/^\d+$/.test(transcript) || numberWords.includes(transcript)) return

      if (transcript === 'start' && !running) {
        speak('Start')
        startTimer()
      } else if (transcript === 'stop' && running) {
        stopTimer()
        speak('Stop')
      }
    }
    recognition.onerror = (e) => console.error(e)
    recognitionRef.current = recognition
    recognition.start()
  }

  return (
    <div>
      <h1>Exercise Timer</h1>
      <button onClick={startTimer} disabled={running}>Start Count</button>
      <button onClick={startRecognition} disabled={running}>Start Exercise</button>
      <button onClick={stopTimer} disabled={!running}>Stop</button>
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
