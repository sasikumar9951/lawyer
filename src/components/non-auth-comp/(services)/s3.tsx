export default function S3() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 font-['Lora']">
          Recommended Products
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Limited Liability Partnership */}
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-400">
            <h3 className="text-lg font-semibold text-blue-600 mb-4 text-center font-['Lora']">
              Limited Liability Partnership
            </h3>
            <div className="text-center mb-6">
              <span className="text-2xl font-bold text-gray-900">₹ 12999</span>
            </div>
            <div className="text-center">
              <button className="border border-gray-400 text-gray-700 px-6 py-2 rounded hover:bg-black hover:text-white hover:border-black transition-colors font-medium">
                KNOW MORE
              </button>
            </div>
          </div>

          {/* One Person Company */}
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-400">
            <h3 className="text-lg font-semibold text-green-600 mb-4 text-center font-['Lora']">
              One Person Company
            </h3>
            <div className="text-center mb-6">
              <span className="text-2xl font-bold text-gray-900">₹ 12999</span>
            </div>
            <div className="text-center">
              <button className="border border-gray-400 text-gray-700 px-6 py-2 rounded hover:bg-black hover:text-white hover:border-black transition-colors font-medium">
                KNOW MORE
              </button>
            </div>
          </div>

          {/* Private Limited Company */}
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-400">
            <h3 className="text-lg font-semibold text-purple-600 mb-4 text-center font-['Lora']">
              Private Limited Company
            </h3>
            <div className="text-center mb-6">
              <span className="text-2xl font-bold text-gray-900">₹ 15999</span>
            </div>
            <div className="text-center">
              <button className="border border-gray-400 text-gray-700 px-6 py-2 rounded hover:bg-black hover:text-white hover:border-black transition-colors font-medium">
                KNOW MORE
              </button>
            </div>
          </div>

          {/* Trademark */}
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-yellow-400">
            <h3 className="text-lg font-semibold text-yellow-600 mb-4 text-center font-['Lora']">
              Trademark
            </h3>
            <div className="text-center mb-6">
              <span className="text-2xl font-bold text-gray-900">₹ 10500</span>
            </div>
            <div className="text-center">
              <button className="border border-gray-400 text-gray-700 px-6 py-2 rounded hover:bg-black hover:text-white hover:border-black transition-colors font-medium">
                KNOW MORE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}