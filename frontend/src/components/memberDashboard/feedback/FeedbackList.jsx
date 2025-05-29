import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import axios from "axios";
import FeedbackFilters from "./FeedbackFilters";

const API_PATH = import.meta.env.VITE_API_PATH;

const FeedbackList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const columns = [
    { name: "No", selector: (row) => row.sno, sortable: true, width: "70px" },
    { name: "Title", selector: (row) => row.title, sortable: true, wrap: true, width: "200px" },
    { name: "Content", selector: (row) => row.content, sortable: true, wrap: true, width: "300px" },
    { name: "Status", selector: (row) => row.status, sortable: true, width: "120px" },
    { name: "Created At", selector: (row) => row.createdAt, sortable: true, width: "120px" },
    {
      name: "Action",
      selector: (row) => row.action,
      width: "120px",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleViewFeedback(row.id)}
            className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            View
          </button>
        </div>
      ),
    },
  ];

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.get(`${API_PATH}/Report/user/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      
      if (response.data) {
        const feedbacksData = response.data.$values || [];
        const formattedFeedbacks = feedbacksData.map((feedback, index) => ({
          id: feedback.id,
          sno: index + 1,
          title: feedback.title,
          content: feedback.content,
          status: feedback.status,
          createdAt: new Date(feedback.createdAt).toLocaleDateString(),
        }));
        setFeedbacks(formattedFeedbacks);
        setFilteredFeedbacks(formattedFeedbacks);
      }
    } catch (err) {
      console.error(err);
      alert("Cannot get feedbacks data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "status") {
      setSelectedStatus(value);
    }
  };

  const filterFeedbacks = (searchText, status) => {
    const filtered = feedbacks.filter((feedback) => {
      const matchesSearch = feedback.title.toLowerCase().includes(searchText.toLowerCase()) ||
                          feedback.content.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = !status || feedback.status === status;
      return matchesSearch && matchesStatus;
    });
    setFilteredFeedbacks(filtered);
  };

  useEffect(() => {
    filterFeedbacks(searchText, selectedStatus);
  }, [searchText, selectedStatus, feedbacks]);

  const handleViewFeedback = (id) => {
    navigate(`/member-dashboard/feedback/${id}`);
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-red-500 rounded-full animate-spin border-t-transparent mb-4"></div>
            <p className="text-lg font-semibold text-red-500 animate-pulse">
              Loading...
            </p>
          </div>
        </div>
      ) : (
        <div className="p-5">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-2xl font-bold mb-6 text-gray-700">My Feedbacks</h3>
            <div className="w-24"></div>
          </div>

          <FeedbackFilters
            searchText={searchText}
            selectedStatus={selectedStatus}
            handleSearchChange={handleSearchChange}
            handleFilterChange={handleFilterChange}
            onAddFeedback={() => navigate("/member-dashboard/feedback/add-feedback")}
          />

          <div className="bg-white p-4 rounded shadow overflow-x-auto">
            {filteredFeedbacks.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No feedbacks found
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={filteredFeedbacks}
                pagination
                responsive
                highlightOnHover
                striped
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackList;
