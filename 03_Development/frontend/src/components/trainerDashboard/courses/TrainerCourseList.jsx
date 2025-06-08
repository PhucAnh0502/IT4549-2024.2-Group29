import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Plus,
  Search,
  Calendar,
  Clock,
  Users,
  Edit,
  Trash2,
  Eye,
  Filter,
  DollarSign
} from "lucide-react";

const TrainerCourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const navigate = useNavigate();

  const courseData = {
    name: "Test Course",
    description: "Auto-generated test course",
    startDate: "2025-07-01",
    endDate: "2025-07-31",
    startTime: "09:00",
    endTime: "10:00",
    type: "Cardio",
    price: 500,
    roomId: "00000000-0000-0000-0000-000000000000",
    trainingDays: ["Monday", "Wednesday", "Friday"]
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const mockCourses = [
          {
            id: 1,
            name: "Course 1 - Cardio",
            description: "Auto-generated course for Cardio",
            type: "Cardio",
            price: 500,
            startDate: "2024-07-01",
            endDate: "2024-08-15",
            startTime: "09:00",
            endTime: "10:00",
            roomId: "00000000-0000-0000-0000-000000000000",
            trainingDays: ["Monday", "Wednesday", "Friday"],
            enrolledStudents: 25,
            maxStudents: 30,
            status: "Upcoming"
          },
          {
            id: 2,
            name: "Course 2 - Boxing",
            description: "Auto-generated course for Boxing",
            type: "Boxing",
            price: 650,
            startDate: "2024-07-15",
            endDate: "2024-08-25",
            startTime: "14:00",
            endTime: "15:00",
            roomId: "00000000-0000-0000-0000-000000000001",
            trainingDays: ["Tuesday", "Thursday"],
            enrolledStudents: 18,
            maxStudents: 30,
            status: "Upcoming"
          }
        ];
        setTimeout(() => {
          setCourses(mockCourses);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);
      }
    };
    fetchCourses();
  }, []);

  const handleCreateCourse = async (courseData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_PATH}/Course/create`,
        courseData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert(response.data.message || "Course created successfully");
      navigate("/trainer-dashboard/my-courses");
    } catch (error) {
      console.error("Create course error:", error.response?.data || error);
      alert(error.response?.data?.message || "Failed to create course");
    }
  };

  const handleViewCourse = async (courseId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_PATH}/course/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const courseData = response.data;
      const role = localStorage.getItem("accountRole")?.toLowerCase() || "trainer";
      navigate(`/${role}-dashboard/course-details/${courseId}`, {
        state: { course: courseData },
      });
    } catch (error) {
      console.error("Failed to fetch course details:", error);
      alert("Could not load course details.");
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_PATH}/course/${courseId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCourses((prevCourses) =>
          prevCourses.filter((course) => course.id !== courseId)
        );
        alert("Course deleted successfully!");
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "Failed to delete course");
      }
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || course.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-red-500 p-3 rounded-lg">
                <BookOpen className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
                <p className="text-gray-600">Manage your training courses</p>
              </div>
            </div>
            <button
              onClick={() => handleCreateCourse(courseData)}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center space-x-2 shadow-lg"
            >
              <Plus className="text-sm" />
              <span>Create Course</span>
            </button>
          </div>
        </div>

        {/* You can now safely continue rendering the rest of your UI/UX here, including search, table, etc. */}
      </div>
    </div>
  );
};

export default TrainerCourseList;
