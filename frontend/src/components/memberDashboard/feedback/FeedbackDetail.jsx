import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import EditForm from "./EditForm";
import FeedbackDetailActions from "./FeedbackDetailActions";
import FeedbackInfo from "./FeedbackInfo";

const FeedbackDetail = () => {
  const { feedbackId } = useParams();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState({});
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const API_PATH = import.meta.env.VITE_API_PATH;

  const getFeedback = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_PATH}/Report/${feedbackId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Feedback response:", res.data); // Debug log
      setFeedback(res.data);
    } catch (err) {
      console.error("Error fetching feedback:", err); // Debug log
      alert(err.response?.data?.Message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    try {
      const response = await axios.put(
        `${API_PATH}/Report/update`,
        {
          title: feedback.title,
          reportType: parseInt(feedback.reportType),
          content: feedback.content,
          id: feedbackId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert(response.data.message);
      setIsEditing(false);
      getFeedback();
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        const response = await axios.delete(`${API_PATH}/Report/delete/${feedbackId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        alert(response.data.message);
        navigate("/member-dashboard/feedback");
      } catch (err) {
        alert(err.response.data.message);
      }
    }
  };

  useEffect(() => {
    getFeedback();
  }, [feedbackId]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-red-500 rounded-full animate-spin border-t-transparent mb-4"></div>
        <p className="text-lg font-semibold text-red-500 animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );

  // Convert string status to number
  const getStatusNumber = (status) => {
    switch(status) {
      case "Pending":
        return 0;
      case "Resolved":
        return 1;
      case "Rejected":
        return 2;
      default:
        return 0;
    }
  };

  const feedbackStatus = getStatusNumber(feedback.status);
  const canEdit = feedbackStatus === 0; // Only allow edit if status is pending (0)

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-20">
      <div className="flex items-center justify-between mb-6 relative">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-2"
        >
          <span className="text-lg">←</span> Back
        </button>
        <div className="w-full text-center">
          <h2 className="text-3xl font-bold text-red-600">{feedback.title}</h2>
        </div>
      </div>

      <div className="space-y-4 text-gray-700">
        {isEditing ? (
          <EditForm feedback={feedback} setFeedback={setFeedback} />
        ) : (
          <FeedbackInfo feedback={{...feedback, status: feedbackStatus}} />
        )}
      </div>

      <FeedbackDetailActions
        isEditing={isEditing}
        onSave={handleEdit}
        onEdit={() => setIsEditing(true)}
        onDelete={handleDelete}
        canEdit={canEdit}
      />
    </div>
  );
};

export default FeedbackDetail;
