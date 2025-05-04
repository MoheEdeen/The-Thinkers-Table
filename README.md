# The Thinkers' Table

![logo (2)](https://github.com/user-attachments/assets/c1d754fc-86f5-4a23-89f3-1cdafa1dd613)

A web app that brings Socrates, Plato, and Aristotle into conversation using WebLLM and 3D avatars. Built with React, Vite, Tailwind CSS, and the MLC WebLLM engine.

---

## Live Demo

\[Drag‑and‑drop Netlify Preview URL here]

_(Note: First load downloads the model; may take up to a minute on slow connections.)_

---

## Features

- **Three Philosophers**: Chat with Socrates, Plato, or Aristotle, each strictly in character.
- **3D Avatars**: Rotate and inspect each head in real time.
- **Local LLM**: Runs a quantized MLC model in-browser (WebGPU) for offline‑style AI.
- **Responsive Layout**: Chat on mobile; Canvas shows on tablet/desktop.

---

## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- A modern Chromium‑based browser (Chrome, Edge, Opera). **WebGPU engine does not work reliably on Firefox or Safari.**

---

## Setup & Run Locally

1. **Clone the repo**

   ```bash
   git clone https://github.com/<your‑username>/thinkers-table.git
   cd thinkers-table
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Download the Gemma model**

   This app uses the **`gemma-2b-it-q4f16_1-MLC`** model from Hugging Face. You can choose another supported model if you like.

   ```bash
   mkdir -p public/models
   curl -L -o public/models/model.gguf \
     https://huggingface.co/mlc-ai/gemma-2b-it-q4f16_1-MLC/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf
   ```

   Or download via browser:

   > [https://huggingface.co/mlc-ai/gemma-2b-it-q4f16_1-MLC/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf](https://huggingface.co/mlc-ai/gemma-2b-it-q4f16_1-MLC/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf)

   (Rename the file to `model.gguf` in `public/models`.)

4. **Start the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in Chrome or Edge.

---

## Known Issues & Compatibility

- **Firefox & Safari**: The WebGPU‑based engine frequently fails (context lost, out of memory). Try Chrome or Edge.
- **Mobile Performance**: Models > 1 GB may be slow on phones; consider using a smaller quantized model or switching to the ServiceWorker engine.
- **Model Limits**: Context is trimmed to the last 20 turns to avoid token‑length errors.

---

## Customization

- To change the model, update `selectedModel` in `App.jsx` and point to a different GGUF in `public/models/`.
- To force CPU mode, swap `CreateMLCEngine` with `CreateServiceWorkerMlcEngine`.

---

## Credits

- **3D Avatars**: Teacher by jeremy [CC-BY] via Poly Pizza
- **Philosopher prompts**: Inspired by Plato’s _Meno_, Aristotle’s _Nicomachean Ethics_, and Plato’s _Apology_.
- **LLM**: Powered by MLC’s WebLLM.

---

Happy philosophizing! Feel free to open an issue or PR on GitHub if you encounter any bugs or have improvements.
