import React, { useEffect, useState } from "react";
import { getBookingbyUserId, getEquipmentById } from "../../../utils/EquipmentHelper";
import DataTable from "react-data-table-component";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const MemberEquipmentBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = localStorage.getItem("userId");
      const response = await getBookingbyUserId(userId);
      
      if (response) {
        const bookingsData = response || [];
        const formattedBookings = await Promise.all(bookingsData.map(async (booking, index) => {
          const equipment = await getEquipmentById(booking.deviceId);
          return {
            id: booking.id,
            sno: ++index,
            deviceName: equipment?.name || "N/A",
            bookingDate: formatDate(booking.bookingDate),
            fromTime: booking.from,
            toTime: booking.to,
            price: booking.fee?.toLocaleString() || "0",
            status: booking.status,
            createdAt: formatDate(booking.createdAt),
          };
        }));
        
        setBookings(formattedBookings);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError(error?.response?.data?.Message || "Failed to fetch bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const columns = [
    { name: "No", selector: (row) => row.sno, sortable: true, width: "70px" },
    { name: "Device Name", selector: (row) => row.deviceName, sortable: true, wrap: true, width: "150px" },
    { name: "Booking Date", selector: (row) => row.bookingDate, sortable: true, width: "160px" },
    { name: "From", selector: (row) => row.fromTime, sortable: true, width: "100px" },
    { name: "To", selector: (row) => row.toTime, sortable: true, width: "100px" },
    { name: "Price", selector: (row) => row.price, sortable: true, width: "100px" },
    { name: "Status", selector: (row) => row.status, sortable: true, width: "100px" },
    { name: "Created At", selector: (row) => row.createdAt, sortable: true, width: "120px" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-500 rounded-full animate-spin border-t-transparent mb-4"></div>
          <p className="text-lg font-semibold text-red-500 animate-pulse">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-5">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <FaArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h3 className="text-2xl font-bold">My Equipment Bookings</h3>
        <div className="w-24"></div> {/* Spacer for balance */}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="bg-white p-4 rounded shadow overflow-x-auto">
        {bookings.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No bookings found
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={bookings}
            pagination
            responsive
            highlightOnHover
            striped
          />
        )}
      </div>
    </div>
  );
};

export default MemberEquipmentBookings;