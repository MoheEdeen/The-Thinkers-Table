import { Canvas } from "@react-three/fiber";
import Avatar from "./components/Avatar";
import * as webllm from "@mlc-ai/web-llm";
import { useState, useEffect, useRef } from "react";
import ChatBox from "./components/ChatBox";

export default function App() {
  const [persona, setPersona] = useState("socrates");
  const [generator, setGenerator] = useState(null);
  const [loadingLLM, setLoadingLLM] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [convo, setConvo] = useState({
    socrates: [],
    plato: [],
    aristotle: [],
  });
  const selectedModel = "gemma-2b-it-q4f16_1-MLC";
  const SYSTEM_PROMPT = {
    socrates: import.meta.env.VITE_SYSTEM_PROMPT_SOCRATES,
    plato: import.meta.env.VITE_SYSTEM_PROMPT_PLATO,
    aristotle: import.meta.env.VITE_SYSTEM_PROMPT_ARISTOTLE,
  }
  const colorMap = {
    user: "bg-slate-100 text-slate-900",
    socrates: "bg-indigo-200 text-indigo-900",
    plato: "bg-emerald-200 text-emerald-900",
    aristotle: "bg-rose-200 text-rose-900",
  };

  const chatRef = useRef(null);

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  function handleSend(msg) {
    if (!msg.trim() || streaming) return;

    setStreaming(true);

    const MAX_HISTORY_LENGTH = 20;

    const currentHistory = convo[persona];
    const truncatedHistory = currentHistory.slice(-MAX_HISTORY_LENGTH);

    const newHistory = [
      ...truncatedHistory,
      { role: "user", content: msg }
    ];

    setConvo(prev => ({
      ...prev,
      [persona]: newHistory
    }));

    setTimeout(scrollToBottom, 0);

    const mlcMessages = [
      { role: "system", content: SYSTEM_PROMPT[persona] },
      ...newHistory.map(t => ({ role: t.role, content: t.content }))
    ];

    (async () => {
      try {
        const result = await generator.chat.completions.create({ messages: mlcMessages });
        const replyText = result.choices[0].message.content;

        setConvo(prev => ({
          ...prev,
          [persona]: [
            ...prev[persona],
            { role: "assistant", speaker: persona, content: replyText }
          ]
        }));

        setTimeout(scrollToBottom, 0);

      } catch (error) {
        console.error("Error generating response:", error);

        setConvo(prev => ({
          ...prev,
          [persona]: [
            ...prev[persona],
            { role: "assistant", speaker: "system", content: `Error: Could not get response. ${error.message}` }
          ]
        }));
        setTimeout(scrollToBottom, 0);
      } finally {
        setStreaming(false);
      }
    })();
  }

  useEffect(() => {
    const onResize = () => scrollToBottom();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    async function init() {
      const initProgressCallback = (report) => {
        setLoadingProgress(report.text);
        // console.log(report.text);
      };

      try {
        const eng = await webllm.CreateMLCEngine(selectedModel, {
          initProgressCallback: initProgressCallback,
        });

        setGenerator(eng);
        // console.log("WebLLM Engine created:", eng);
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
    scrollToBottom();
  }, [convo, persona]);

  if (loadingLLM) {
    return (
      <div className="flex items-center justify-center-safe h-screen text-center text-xl w-screen">
        Loading model... {loadingProgress}
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-screen w-screen">
        <header className="bg-gray-800 text-white text-center py-3">
          <h1 className="text-2xl font-bold">The Thinkers' Table</h1>
          <div className="text-lg mt-2">
            Talking to {persona[0].toUpperCase() + persona.slice(1)}
          </div>
        </header>

        <div className="flex justify-center-safe gap-4 my-4 px-4">
          {["socrates", "plato", "aristotle"].map((p) => (
            <button
              key={p}
              className={`px-4 py-1 rounded transition-colors duration-200
                ${persona === p ? "bg-amber-500 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}
                ${streaming ? "opacity-50 cursor-not-allowed" : "hover:bg-amber-600"}
              `}
              onClick={() => setPersona(p)}
              disabled={streaming}
            >
              {p[0].toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>


        <div className="flex flex-col md:flex-row flex-1 overflow-hidden px-4 pb-4">
          <div className="flex flex-col items-center justify-start flex-1">
            <div className="w-full max-w-xl mx-auto flex-1 overflow-y-auto hide-scrollbar p-2 rounded-lg shadow-inner ">
              {convo[persona].map((msg, index) => (
                <div key={index} className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"} mb-2`}>
                  <div className={`px-3 py-2 max-w-[70%] ${colorMap[msg.speaker || msg.role]} rounded-2xl shadow-sm`}>
                    <p>{msg.content}</p>
                  </div>
                </div>
              ))}

              {streaming && (
                <div className="flex justify-end mb-2">
                  <div className="px-3 py-2 max-w-[70%] bg-gray-300 text-gray-700 rounded-2xl shadow-sm italic">
                    ...
                  </div>
                </div>
              )}

            </div>
          </div>


          <div className="hidden md:flex md:w-1/3 h-full items-center justify-end">
            <div className="w-full h-full max-w-sm">
              <Canvas camera={{ position: [0, 1, 6] }}>
                <ambientLight intensity={0.8} />
                <directionalLight position={[2, 5, 2]} intensity={0.8} />
                <Avatar meshPath={`/${persona}.glb`} position={[0, -2, 0]} />
              </Canvas>
            </div>
          </div>
        </div>


        <div className="p-4 bg-gray-800">
          <ChatBox disabled={streaming} onSend={handleSend} />
        </div>
      </div>
    </>
  );
}
