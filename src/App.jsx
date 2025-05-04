import { Canvas } from "@react-three/fiber";
import Avatar from "./components/Avatar";
import * as webllm from "@mlc-ai/web-llm";
import { useState, useEffect } from "react";
import ChatBox from "./components/ChatBox";

export default function App() {
  const [persona, setPersona] = useState("socrates");
  const [generator, setGenerator] = useState(null);
  const [loadingLLM, setLoadingLLM] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState("");
  const [convo, setConvo] = useState({
    socrates: [],
    plato: [],
    aristotle: [],
  });
  const selectedModel = "Llama-3-8B-Instruct-q4f32_1-MLC";
  const SYSTEM_PROMPT = {
    socrates: "You are Socrates. Ask two questions, then answer.",
    plato: "You are Plato. Use the Theory of Forms.",
    aristotle: "You are Aristotle. Relate to the Golden Mean.",
  };

  function handleSend(msg) {
    let updatedMsg = [];
    setConvo(prev => {
      updatedMsg = [
        ...prev[persona],
        { role: "user", content: msg }
      ];

      return {
        ...prev,
        [persona]: updatedMsg
      }


    });
    const messages = [{ role: "system", content: SYSTEM_PROMPT[persona] }, ...updatedMsg]

    async function replies() {
      const reply = await generator.chat.completions.create({
        messages,
      });
      console.log(reply.choices[0].message)
    }
    replies();

  }

  useEffect(() => {
    async function init() {
      const initProgressCallback = (report) => {
        setLoadingProgress(report.text);
        console.log(report.text);
      };

      try {
        const eng = await webllm.CreateMLCEngine(selectedModel, {
          initProgressCallback: initProgressCallback,
        });

        setGenerator(eng);
        console.log("ENG ENG ENG", eng);
        setLoadingLLM(false);
        setLoadingProgress("Model loaded successfully!");
      } catch (error) {
        console.error("Failed to load WebLLM engine:", error);
        setLoadingProgress(`Failed to load model: ${error.message}`);
      }
    }
    init();
  }, []);

  useEffect(() => {
    console.log(convo);
  }, [convo])

  if (loadingLLM) {
    return (
      <div className="text-center mt-10 content-center w-screen text-xl">
        Loading model... {loadingProgress}
      </div>
    );
  }

  return (
    <>
      <div className="justify-center w-screen">
        <header className="text-white text-center py-3">
          <h1 className="text-2xl font-bold">The Thinkers' Table</h1>
        </header>

        <div className="flex justify-center gap-4 my-4">
          {["socrates", "plato", "aristotle"].map((p) => (
            <button
              key={p}
              className={`px-4 py-1 rounded ${persona === p ? "bg-amber-500 text-white" : "bg-gray-200"
                }`}
              onClick={() => setPersona(p)}
            >
              {p[0].toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        <div className="h-96">
          <Canvas camera={{ position: [0, 1, 6] }}>
            <ambientLight intensity={0.8} />
            <directionalLight position={[2, 5, 2]} intensity={0.8} />
            <Avatar meshPath={`/${persona}.glb`} position={[0, -2, 0]} />
          </Canvas>
        </div>
        <div>
          <ChatBox onSend={handleSend} />
        </div>
      </div>
    </>
  );
}