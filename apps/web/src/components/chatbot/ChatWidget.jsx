import "./ChatWidget.css";
import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Minus } from "lucide-react";

import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import {
  sendCustomerMessage,
  fetchMyOrders,
} from "./chatbotApi";

const WELCOME_MESSAGE =
  "Namaste! 🙏 Welcome to Sattviva Naturals. How can I help you today? You can ask me about our products, prices, or your order.";

const SUGGESTIONS = [
  "Show me your products",
  "What is the price of mustard oil?",
  "How can I track my order?",
];

function isOrderTrackingRequest(message) {
  return /\b(track|tracking|my orders|order status|order update|where is my order|where's my order|recent orders|order details)\b/i.test(
    message
  );
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: WELCOME_MESSAGE,
    },
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading, isOpen, minimized]);

  const handleSend = async (messageText = input) => {
    const message = messageText.trim();

    if (!message || loading) return;

    setInput("");

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: message,
      },
    ]);

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // Authenticated customer order tracking
      if (token && isOrderTrackingRequest(message)) {
        const rawOrders = await fetchMyOrders();

        // Only select fields needed for customer-facing order tracking.
        const orders = rawOrders.map((order) => ({
          order_id: order.orderId,
          order_status: order.orderStatus,
          payment_status: order.paymentStatus,
          total_amount: order.totalAmount,
          tracking_number: order.trackingNumber,
          awb_code: order.awbCode,
          created_at: order.createdAt,
        }));

        // If the customer mentions a specific order ID,
        // show only that order.
        const requestedOrder = orders.find(
          (order) =>
            order.order_id &&
            message
              .toLowerCase()
              .includes(order.order_id.toLowerCase())
        );

        const filteredOrders = requestedOrder
          ? [requestedOrder]
          : orders;

        let response;

        if (filteredOrders.length === 0) {
          response =
            "You currently don't have any orders linked to your account.";
        } else if (requestedOrder) {
          response = `Here are the details for your order **${requestedOrder.order_id}**.`;
        } else {
          response =
            "Here are your recent orders. You can ask me about any specific order using its order ID.";
        }

        setMessages((previous) => [
          ...previous,
          {
            role: "assistant",
            content: response,
            orders: filteredOrders,
          },
        ]);

        return;
      }

      // Keep only the latest conversational turns. Product IDs are used by
      // the backend to re-fetch trusted product details from MongoDB.
      // Never send order details or verification information in history.
      const history = messages
        .filter((entry) => !entry.order && !entry.orders)
        .slice(-10)
        .map((entry) => ({
          role: entry.role,
          content: String(entry.content || "").slice(0, 1200),
          productIds: Array.isArray(entry.products)
            ? entry.products.slice(0, 10).map((product) => product.id || product._id).filter(Boolean)
            : [],
        }));
      const data = await sendCustomerMessage(message, history);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            data.response ||
            "I couldn't generate a response. Please try again.",
          products: Array.isArray(data.products)
            ? data.products
            : [],
          order: data.order || null,
        },
      ]);
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            error.message ||
            "Sorry, I'm unable to connect right now. Please try again shortly.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setMinimized(false);
  };

  return (
    <div className="sattviva-chatbot">
      {isOpen && !minimized && (
        <section
          className="sv-chat-window"
          aria-label="Sattviva customer support"
        >
          <header className="sv-chat-header">
            <div className="sv-chat-header-info">
              <div className="sv-chat-avatar">S</div>

              <div>
                <h3>Sattviva Assistant</h3>
                <span>Online · Here to help</span>
              </div>
            </div>

            <div className="sv-chat-header-actions">
              <button
                type="button"
                onClick={() => setMinimized(true)}
                aria-label="Minimize chatbot"
              >
                <Minus size={19} />
              </button>

              <button
                type="button"
                onClick={handleClose}
                aria-label="Close chatbot"
              >
                <X size={20} />
              </button>
            </div>
          </header>

          <div className="sv-chat-messages">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                role={message.role}
                content={message.content}
                products={message.products}
                order={message.order}
                orders={message.orders}
              />
            ))}

            {loading && (
              <div
                className="sv-chat-typing"
                role="status"
              >
                <span />
                <span />
                <span />
                <small>Assistant is typing...</small>
              </div>
            )}

            {messages.length === 1 && !loading && (
              <div className="sv-chat-suggestions">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    type="button"
                    key={suggestion}
                    onClick={() => handleSend(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <ChatInput
            value={input}
            onChange={setInput}
            onSend={() => handleSend()}
            disabled={loading}
          />

          <div className="sv-chat-footer">
            Powered by Sattviva Naturals
          </div>
        </section>
      )}

      {isOpen && minimized && (
        <button
          type="button"
          className="sv-chat-minimized"
          onClick={() => setMinimized(false)}
        >
          <MessageCircle size={19} />
          Sattviva Assistant
        </button>
      )}

      <button
        type="button"
        className={`sv-chat-launcher ${
          isOpen ? "active" : ""
        }`}
        onClick={() => {
          if (isOpen) {
            handleClose();
          } else {
            setIsOpen(true);
          }
        }}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X size={25} />
        ) : (
          <MessageCircle size={26} />
        )}
      </button>
    </div>
  );
}