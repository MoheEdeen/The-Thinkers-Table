import { useState } from "react";

export default function ChatBox({ onSend = () => { }, disabled = false }) {
    const [input, setInput] = useState("");


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        onSend(input);
        setInput("");
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto my-4">
            <input
                disabled={disabled}
                className={`w-full border rounded p-2 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={disabled ? "Thinking..." : "Ask a question…"}
            />
        </form>
    );
}