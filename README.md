# The Thinkers' Table

![logo (2)](https://github.com/user-attachments/assets/bd9e3b38-3b80-4c93-892c-6fcd8f9745a8)

A web app that brings Socrates, Plato, and Aristotle into conversation using WebLLM and 3D avatars. Built with React, Vite, Tailwind CSS, and the MLC WebLLM engine.

---

## Live Demo

\[(https://the-thinkers-table.netlify.app/)]

_(Note: First load downloads the model; may take up to a minute on slow connections.)_

---

## **Important: Enable WebGPU in Chrome**

To run the app (locally or on the demo), **you must ensure WebGPU is enabled and hardware-accelerated**:

1. **Check GPU status:**
   - Visit: `chrome://gpu`
   - Look under **Graphics Feature Status**.
   - Confirm that **WebGPU** says *Hardware accelerated*.
   - ![image](https://github.com/user-attachments/assets/4da8dd29-370e-4736-beb7-2d2fb9676eb0)


2. **If NOT hardware accelerated:**
   - ![image](https://github.com/user-attachments/assets/849c6c6a-60c4-4649-b932-ab40544d438d)
   - Go to: `chrome://settings/system`
   - Enable:
     > **☑️ Use graphics acceleration when available**
   - Relaunch Chrome when prompted.

3. **Recheck:**
   - Visit `chrome://gpu` again to confirm WebGPU is now hardware-accelerated.
   - ![image](https://github.com/user-attachments/assets/4da8dd29-370e-4736-beb7-2d2fb9676eb0)

👉 Without GPU acceleration, the app will fail to load the model or crash unexpectedly.

---
## Features

- **Three Philosophers**: Chat with Socrates, Plato, or Aristotle, each strictly in character.
- **3D Avatars**: Rotate and inspect each head in real time.
- **Local LLM**: Runs a quantized MLC model in-browser (WebGPU) for offline‑style AI.
- **Responsive Layout**: Chat on mobile; Canvas shows on tablet/desktop.

---

## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
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

3. **Create your environment file**

   Create a file named `.env.local` in the project root (this file is git‑ignored).
   Inside it, add your own SYSTEM_PROMPT values under these variable names:

   ```dotenv
   VITE_SYSTEM_PROMPT_SOCRATES="<your Socrates prompt here>"
   VITE_SYSTEM_PROMPT_PLATO="<your Plato prompt here>"
   VITE_SYSTEM_PROMPT_ARISTOTLE="<your Aristotle prompt here>"
   ```

   Vite will inject these into the app at build time.
   Use `\n` for line breaks if your prompts span multiple lines.

4. **Download the Gemma model**

   This app uses the **`gemma-2b-it-q4f16_1-MLC`** model from Hugging Face. You can choose another supported model.

   ```bash
   mkdir -p public/models
   curl -L -o public/models/model.gguf \
     https://huggingface.co/mlc-ai/gemma-2b-it-q4f16_1-MLC/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf
   ```

   Or download via browser:

   > [https://huggingface.co/mlc-ai/gemma-2b-it-q4f16_1-MLC/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf](https://huggingface.co/mlc-ai/gemma-2b-it-q4f16_1-MLC/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf)

   Rename the file to `model.gguf` in `public/models`.

5. **Start the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:XXXX](http://localhost:XXXX) in Chrome or Edge.

---

## Known Issues & Compatibility

- **Firefox & Safari**: The WebGPU‑based engine frequently fails (context lost, out of memory). Try Chrome or Edge.
- **Mobile Performance**: Models > 1 GB may be slow on phones; consider using a smaller quantized model or switching to the ServiceWorker engine.
- **Model Limits**: Context is trimmed to the last 20 turns to avoid token‑length errors.

---

## Customization

- To change the model, update `selectedModel` in `App.jsx` and point to a different GGUF in `public/models/`.
- To force CPU mode, swap `CreateMLCEngine` with `CreateServiceWorkerMlcEngine`.

---

## Credits

- **3D Avatars**: Teacher by jeremy \[CC-BY] via Poly Pizza
- **Philosopher prompts**: Inspired by Plato’s _Meno_, Aristotle’s _Nicomachean Ethics_, and Plato’s _Apology_.
- **LLM**: Powered by MLC’s WebLLM.

---

Happy philosophizing! Feel free to open an issue or PR on GitHub if you encounter any bugs or have improvements.
