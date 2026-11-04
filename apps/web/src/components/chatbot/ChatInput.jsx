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

  return (
    <div className="sv-chat-input-area">
      <textarea
        className="sv-chat-textarea"
        value={value}
        onChange={(event) => onChange(event.target.value)}
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
