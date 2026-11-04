
import { Send } from "lucide-react";

export default function ChatInput({
  value,
  onChange,
  onSend,
  disabled = false,
}) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (value.trim() && !disabled) {
        onSend();
      }
    }
  };

  const handlePaste = (event) => {
    if (disabled) return;

    event.preventDefault();

    const pastedText = event.clipboardData.getData("text/plain");

    if (!pastedText) return;

    const textarea = event.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const updatedValue =
      value.slice(0, start) + pastedText + value.slice(end);

    onChange(updatedValue);

    requestAnimationFrame(() => {
      const cursorPosition = start + pastedText.length;
      textarea.setSelectionRange(cursorPosition, cursorPosition);
    });
  };

  return (
    <div className="sv-chat-input-area">
      <textarea
        className="sv-chat-textarea"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        placeholder="Ask about products or orders..."
        rows={1}
        disabled={disabled}
        aria-label="Type your message"
      />

      <button
        type="button"
        className="sv-chat-send"
        onClick={onSend}
        disabled={disabled || !value.trim()}
        aria-label="Send message"
      >
        <Send size={18} />
      </button>
    </div>
  );
}
