const BookingForm = ({ bookingData, error, onChange, onSubmit, onCancel }) => (
    <form onSubmit={onSubmit} className="mt-6 p-4 border rounded-lg bg-gray-50 space-y-4 w-full">
      <h3 className="text-lg font-semibold text-gray-800">Booking Form</h3>
  
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
  
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">From</label>
          <input type="time" name="from" className="w-full px-3 py-2 border rounded"
            value={bookingData.from} onChange={onChange} required />
        </div>
  
        <div>
          <label className="block mb-1 font-medium">To</label>
          <input type="time" name="to" className="w-full px-3 py-2 border rounded"
            value={bookingData.to} onChange={onChange} required />
        </div>
  
        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">Booking Date</label>
          <input type="date" name="bookingDate" className="w-full px-3 py-2 border rounded"
            value={bookingData.bookingDate} onChange={onChange}
            min={new Date().toISOString().split("T")[0]} required />
        </div>
      </div>
  
      <div className="flex justify-end gap-2 mt-4">
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
          Book
        </button>
        <button type="button" onClick={onCancel}
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition">
          Cancel
        </button>
      </div>
    </form>
  );
  
  export default BookingForm;
  