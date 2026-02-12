import { useRef, useState, useEffect } from "react";

const MAX_LINES = 5;
const LINE_HEIGHT = 22;

export default function Composer({ onSend, disabled }) {
    const [text, setText] = useState("");
    const [file, setFile] = useState(null);

    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);

    // Auto-grow textarea (up to 5 lines)
    useEffect(() => {
        const ta = textareaRef.current;
        if (!ta) return;

        ta.style.height = "auto";
        const maxHeight = LINE_HEIGHT * MAX_LINES;
        ta.style.height = Math.min(ta.scrollHeight, maxHeight) + "px";
        ta.style.overflowY = ta.scrollHeight > maxHeight ? "auto" : "hidden";
    }, [text]);

    const send = () => {
        if ((!text.trim() && !file) || disabled) return;

        onSend({ text, file });
        setText("");
        setFile(null);
    };

    return (
        <div className="composer-pill">

            {/* PLUS BUTTON */}
            <button
                className="composer-icon left"
                type="button"
                disabled={disabled}
                onClick={() => fileInputRef.current.click()}
            >
                +
            </button>

            <input
                ref={fileInputRef}
                type="file"
                hidden
                onChange={(e) => setFile(e.target.files[0])}
            />

            {/* TEXT INPUT */}
            <textarea
                ref={textareaRef}
                rows={1}
                placeholder="Send a message"
                value={text}
                disabled={disabled}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        send();
                    }
                }}
            />

            {/* SEND BUTTON */}
            <button
                className="composer-icon right"
                disabled={disabled}
                onClick={send}
            >
                ➤
            </button>

            {/* FILE PREVIEW */}
            {file && (
                <div className="composer-file">
                    📎 {file.name}
                </div>
            )}
        </div>
    );
}
