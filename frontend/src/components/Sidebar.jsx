import { useState } from "react";

export default function Sidebar({
    chats,
    activeChatId,
    onNewChat,
    onSelectChat,
    onRenameChat,
    onDeleteChat,
    searchTerm,
    onSearch
}) {

    const [editingId, setEditingId] = useState(null);
    const [menuId, setMenuId] = useState(null);

    return (
        <div className="sidebar">

            {/* Header */}
            <div className="sidebar-header">
                <button className="new-chat-btn" onClick={onNewChat}>
                    + New chat
                </button>

                <input
                    type="text"
                    placeholder="Search chats..."
                    value={searchTerm}
                    onChange={(e) => onSearch(e.target.value)}
                    style={{
                        width: "100%",
                        marginTop: "10px",
                        padding: "8px 10px",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        background: "var(--composer-bg)",
                        color: "var(--text-primary)"
                    }}
                />
            </div>

            {/* Chat list */}
            <div className="chat-list-scroll">
                <div className="chat-list">
                    {chats.map(chat => (
                        <div
                            key={chat.id}
                            className={`chat-row ${chat.id === activeChatId ? "active" : ""}`}
                            onClick={() => onSelectChat(chat.id)}
                        >
                            {editingId === chat.id ? (
                                <input
                                    className="chat-rename-input"
                                    autoFocus
                                    value={chat.title}
                                    onChange={(e) => onRenameChat(chat.id, e.target.value)}
                                    onBlur={() => setEditingId(null)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") setEditingId(null);
                                    }}
                                />
                            ) : (
                                <span className="chat-title">{chat.title}</span>
                            )}

                            <button
                                className="dots-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setMenuId(menuId === chat.id ? null : chat.id);
                                }}
                            >
                                ⋮
                            </button>

                            {menuId === chat.id && (
                                <div className="chat-menu">
                                    <button onClick={() => {
                                        setEditingId(chat.id);
                                        setMenuId(null);
                                    }}>
                                        Rename
                                    </button>
                                    <button
                                        className="danger"
                                        onClick={() => {
                                            onDeleteChat(chat.id);
                                            setMenuId(null);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
