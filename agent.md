---

### 🤖 `agent.md` for Codex (React version)

```markdown
# Codex Agent Instructions

You are helping create a React-based PWA that:

1. Uses voice recognition to detect "start"/"stop"
2. Speaks seconds out loud using SpeechSynthesis
3. Records the duration of each exercise
4. Stores and displays a history log
5. Works offline as a PWA on mobile (via Service Worker)

## Tasks

- [ ] Create React app with Vite (`npm create vite@latest`)
- [ ] Setup basic layout: "Start Exercise" button, display area, history log
- [ ] Use Web Speech API to listen for commands
- [ ] Use SpeechSynthesis to count every second
- [ ] Use setInterval to track timez
- [ ] Store results in localStorage
- [ ] Display recorded times in a list
- [ ] Add manifest.json and service worker for PWA

## Constraints

- Voice recognition starts only after user click
- Audio output must use system speaker
- App must run well on Chrome mobile
- Avoid complex state management; keep React code simple

Use modern JavaScript (ES6+), React functional components, and hooks.
```
