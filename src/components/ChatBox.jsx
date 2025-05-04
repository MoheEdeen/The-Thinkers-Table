import { useState } from "react";

export default function ChatBox({ onSend = () => { } }) {
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
                className="w-full border rounded p-2"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question…"
            />
        </form>
    );
}