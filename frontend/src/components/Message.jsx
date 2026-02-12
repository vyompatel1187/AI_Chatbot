import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Message({ role, text }) {
    const { theme } = useContext(ThemeContext);

    // USER MESSAGE → plain text
    if (role === "user") {
        return (
            <div className="message-row user">
                <div className="message-content">{text}</div>
            </div>
        );
    }

    // AI MESSAGE → Markdown + code + copy
    return (
        <div className="message-row ai">
            <div className="message-content ai-markdown">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        code({ inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || "");

                            if (!inline && match) {
                                return (
                                    <CodeBlock
                                        language={match[1]}
                                        value={String(children).replace(/\n$/, "")}
                                        theme={theme}
                                    />
                                );
                            }

                            return (
                                <code className="inline-code" {...props}>
                                    {children}
                                </code>
                            );
                        }
                    }}
                >
                    {text}
                </ReactMarkdown>
            </div>
        </div>
    );
}

/* ------------------------------
   Code Block with Copy Button
-------------------------------- */
function CodeBlock({ language, value, theme }) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="code-block-wrapper">
            <button className="copy-btn" onClick={copy}>
                {copied ? "Copied ✓" : "Copy"}
            </button>

            <SyntaxHighlighter
                language={language}
                style={theme === "dark" ? oneDark : oneLight}
                PreTag="div"
            >
                {value}
            </SyntaxHighlighter>
        </div>
    );
}
