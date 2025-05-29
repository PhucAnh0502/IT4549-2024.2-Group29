const DepositForm = ({ isDeposit, setIsDeposit, amount, setAmount, handleDeposit }) => (
    isDeposit && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 transition-opacity duration-500 opacity-100">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
          <h3 className="text-xl font-semibold mb-6 text-center text-gray-800">Deposit</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (VND)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount"
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setIsDeposit(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-600 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleDeposit();
                setIsDeposit(false);
                setAmount(0);
              }}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    )
  );
  
  export default DepositForm;
  