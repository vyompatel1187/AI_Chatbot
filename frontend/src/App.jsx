import { useState, useContext, useEffect } from "react";
import { ThemeProvider, ThemeContext } from "./context/ThemeContext";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import ChatArea from "./components/ChatArea";

export default function App() {

    /* ======================
       AUTH STATE (NEW)
    ====================== */

    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    /* ======================
       LOAD FROM LOCAL STORAGE
    ====================== */

    const [chats, setChats] = useState(() => {
        const saved = localStorage.getItem("chats");
        return saved ? JSON.parse(saved) : [
            { id: Date.now(), title: "New chat", messages: [] }
        ];
    });

    const [activeChatId, setActiveChatId] = useState(() => {
        return localStorage.getItem("activeChatId");
    });

    /* ======================
       PERSIST TO LOCAL STORAGE
    ====================== */

    useEffect(() => {
        localStorage.setItem("chats", JSON.stringify(chats));
    }, [chats]);

    useEffect(() => {
        if (activeChatId) {
            localStorage.setItem("activeChatId", activeChatId);
        }
    }, [activeChatId]);

    /* ======================
       FIX ACTIVE CHAT ON LOAD
    ====================== */

    useEffect(() => {
        if (!activeChatId && chats.length > 0) {
            setActiveChatId(chats[0].id);
        }
    }, [chats, activeChatId]);

    const activeChat = chats.find(c => c.id === activeChatId);

    /* ======================
       CREATE NEW CHAT
    ====================== */

    const newChat = () => {
        const chat = {
            id: Date.now(),
            title: "New chat",
            messages: []
        };

        setChats(prev => [chat, ...prev]);
        setActiveChatId(chat.id);
    };

    /* ======================
       RENAME CHAT
    ====================== */

    const renameChat = (id, newTitle) => {
        setChats(prev =>
            prev.map(chat =>
                chat.id === id ? { ...chat, title: newTitle } : chat
            )
        );
    };

    /* ======================
       DELETE CHAT
    ====================== */

    const deleteChat = (id) => {
        setChats(prev => {
            const updated = prev.filter(chat => chat.id !== id);

            if (updated.length === 0) {
                const fresh = {
                    id: Date.now(),
                    title: "New chat",
                    messages: []
                };
                setActiveChatId(fresh.id);
                return [fresh];
            }

            if (id === activeChatId) {
                setActiveChatId(updated[0].id);
            }

            return updated;
        });
    };

    /* ======================
       ADD USER MESSAGE
    ====================== */

    const addUserMessage = (text) => {
        setChats(prev =>
            prev.map(chat =>
                chat.id === activeChatId
                    ? {
                        ...chat,
                        title:
                            chat.messages.length === 0
                                ? text.slice(0, 30)
                                : chat.title,
                        messages: [...chat.messages, { role: "user", text }]
                    }
                    : chat
            )
        );
    };

    /* ======================
       STREAM AI RESPONSE
    ====================== */

    const streamAIResponse = async (text) => {
        const token = localStorage.getItem("token"); // ADD TOKEN

        setChats(prev =>
            prev.map(chat =>
                chat.id === activeChatId
                    ? { ...chat, messages: [...chat.messages, { role: "ai", text: "" }] }
                    : chat
            )
        );

        const res = await fetch("http://127.0.0.1:8000/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // SEND TOKEN
            },
            body: JSON.stringify({ message: text })
        });

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);

            setChats(prev =>
                prev.map(chat => {
                    if (chat.id !== activeChatId) return chat;

                    const updatedMessages = [...chat.messages];
                    const lastIndex = updatedMessages.length - 1;

                    updatedMessages[lastIndex] = {
                        ...updatedMessages[lastIndex],
                        text: updatedMessages[lastIndex].text + chunk
                    };

                    return { ...chat, messages: updatedMessages };
                })
            );
        }
    };

    /* ======================
       RENDER
    ====================== */

    return (
        <ThemeProvider>
            <ThemedAppWrapper>
                <Sidebar
                    chats={chats}
                    activeChatId={activeChatId}
                    onNewChat={newChat}
                    onSelectChat={setActiveChatId}
                    onRenameChat={renameChat}
                    onDeleteChat={deleteChat}
                />

                <div className="main-wrapper">
                    <TopBar user={user} setUser={setUser} />
                    <ChatArea
                        chat={activeChat}
                        onSend={addUserMessage}
                        onStream={streamAIResponse}
                    />
                </div>
            </ThemedAppWrapper>
        </ThemeProvider>
    );
}

/* ======================
   THEME WRAPPER
====================== */

function ThemedAppWrapper({ children }) {
    const { theme } = useContext(ThemeContext);
    return <div className={`app ${theme}`}>{children}</div>;
}
