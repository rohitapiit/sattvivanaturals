import { useNavigate } from "react-router-dom";

const ComingSoonPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-white">
      <div className="text-center">

        <img
          src="images/coming-soon.png"
          alt="Coming Soon"
          className="w-72 mx-auto mb-8"
        />

        <h1 className="text-5xl font-bold text-green-700">
          Coming Soon
        </h1>

        <p className="mt-4 text-gray-600 text-lg max-w-xl mx-auto">
          We're working hard to bring our premium
          <strong> Dry Fruits</strong>,
          <strong> Spices</strong> and
          <strong> Health Punch</strong> collection.
        </p>

        <p className="mt-2 text-gray-500">
          Stay tuned for something healthy and exciting!
        </p>

        <button
          onClick={() => navigate("/products")}
          className="mt-8 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg"
        >
          Continue Shopping
        </button>

      </div>
    </div>
  );
};

export default ComingSoonPage;