import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "react-router-dom";
import { getProductPath } from "@/lib/productUrls.js";
function ProductCard({ product }) {
  const variant = product.variants?.[0] || {};
  const price = variant.price ?? product.price;
  const mrp = variant.cutPrice ?? product.cutPrice;
  const image = product.images?.[0];
  const productUrl = getProductPath(product);

  return (
    <article className="sv-chat-product">
      <Link
        to={productUrl}
        className="sv-chat-product-image-link"
        aria-label={`View ${product.title}`}
      >
        {image ? (
          <img
            className="sv-chat-product-image"
            src={image}
            alt={product.title || "Product"}
            loading="lazy"
          />
        ) : (
          <div className="sv-chat-product-placeholder">
            Product
          </div>
        )}
      </Link>

      <div className="sv-chat-product-info">
        <Link to={productUrl} className="sv-chat-product-title">
          {product.title || "Product"}
        </Link>

        {variant.size && (
          <span className="sv-chat-product-size">
            {variant.size}
          </span>
        )}

        <div className="sv-chat-product-prices">
          {price != null && (
            <strong>₹{Number(price).toLocaleString("en-IN")}</strong>
          )}

          {mrp != null && Number(mrp) > Number(price) && (
            <del>₹{Number(mrp).toLocaleString("en-IN")}</del>
          )}
        </div>

        {product.stock != null && (
          <p className="sv-chat-product-stock">
            {Number(product.stock) > 0
              ? "In stock"
              : "Currently unavailable"}
          </p>
        )}

        <Link to={productUrl} className="sv-chat-product-view">
          View product <span>→</span>
        </Link>
      </div>
    </article>
  );
}

function OrderTracking({ order }) {
  if (!order) return null;

  const status = String(
    order.order_status || "Processing"
  ).toLowerCase();

  const steps = [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
  ];

  const isCancelled = status.includes("cancel");
  const currentStep = steps.findIndex((step) =>
    status.includes(step)
  );

  return (
    <div className="sv-chat-order">
      <h4>Order details</h4>

      <p>
        <strong>Order ID:</strong>{" "}
        {order.order_id || "N/A"}
      </p>

      <p>
        <strong>Order status:</strong>{" "}
        {order.order_status || "Processing"}
      </p>

      <p>
        <strong>Payment status:</strong>{" "}
        {order.payment_status || "N/A"}
      </p>

      {order.total_amount != null && (
        <p>
          <strong>Total:</strong>{" "}
          ₹{Number(order.total_amount).toLocaleString("en-IN")}
        </p>
      )}

      {order.tracking_number && (
        <p>
          <strong>Tracking number:</strong>{" "}
          {order.tracking_number}
        </p>
      )}

      {order.awb_code && (
        <p>
          <strong>AWB:</strong>{" "}
          {order.awb_code}
        </p>
      )}

      {order.created_at && (
        <p>
          <strong>Order date:</strong>{" "}
          {new Date(order.created_at).toLocaleDateString("en-IN")}
        </p>
      )}

      {isCancelled && (
        <p className="sv-chat-order-cancelled">
          This order has been cancelled.
        </p>
      )}

      {!isCancelled && currentStep >= 0 && (
        <div className="sv-chat-order-progress">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`sv-chat-order-step ${
                index <= currentStep ? "completed" : ""
              }`}
            >
              <span>
                {index < currentStep ? "✓" : index + 1}
              </span>

              <small>{step}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ChatMessage({
  role,
  content,
  products = [],
  order = null,
  orders = [],
}) {
  const isAssistant = role === "assistant";

  return (
    <div
      className={`sv-chat-message ${
        isAssistant ? "assistant" : "user"
      }`}
    >
      <div className="sv-chat-message-content">
        {isAssistant ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ href, children, ...props }) => {
                const safeHref =
                  href && /^https?:\/\//i.test(href)
                    ? href
                    : undefined;

                return safeHref ? (
                  <a
                    href={safeHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  >
                    {children}
                  </a>
                ) : (
                  <span>{children}</span>
                );
              },
            }}
          >
            {content || ""}
          </ReactMarkdown>
        ) : (
          <p>{content}</p>
        )}

        {/* Existing product cards */}
        {isAssistant && products.length > 0 && (
          <div className="sv-chat-products">
            {products.map((product, index) => (
              <ProductCard
                key={product._id || product.id || index}
                product={product}
              />
            ))}
          </div>
        )}

        {/* Existing guest order tracking */}
        {isAssistant && order && (
          <OrderTracking order={order} />
        )}

        {/* Authenticated customer's multiple orders */}
        {isAssistant && orders.length > 0 && (
          <div className="sv-chat-orders">
            {orders.map((item, index) => (
              <OrderTracking
                key={item.order_id || index}
                order={item}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}