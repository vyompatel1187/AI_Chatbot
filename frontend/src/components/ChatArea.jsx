import { useEffect, useRef } from "react";
import Message from "./Message";
import Composer from "./Composer";

export default function ChatArea({
    chat,
    onSend,
    onStream,
    isStreaming
}) {
    const messagesRef = useRef(null);

    // Auto-scroll on new messages
    useEffect(() => {
        if (!messagesRef.current) return;
        messagesRef.current.scrollTo({
            top: messagesRef.current.scrollHeight,
            behavior: "smooth"
        });
    }, [chat?.messages]);

    if (!chat) return null;

    const isEmpty = chat.messages.length === 0;

    return (
        <section className={`chat-area ${isEmpty ? "empty-chat" : ""}`}>
            {isEmpty ? (
                <div className="empty-state">
                    <h1>What can I help with?</h1>

                    <Composer
                        center
                        disabled={isStreaming}
                        onSend={(payload) => {
                            // payload = { text, file }
                            onSend(payload.text);
                            onStream(payload.text, payload.file);
                        }}
                    />
                </div>
            ) : (
                <>
                    {/* Messages */}
                    <div className="messages" ref={messagesRef}>
                        {chat.messages.map((msg, i) => (
                            <Message key={i} {...msg} />
                        ))}
                    </div>

                    {/* Composer */}
                    <div className="composer-wrapper">
                        <Composer
                            disabled={isStreaming}
                            onSend={(payload) => {
                                // payload = { text, file }
                                onSend(payload.text);
                                onStream(payload.text, payload.file);
                            }}
                        />
                    </div>
                </>
            )}
        </section>
    );
}
