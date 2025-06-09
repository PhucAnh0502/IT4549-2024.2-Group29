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

  Filter,
  DollarSign
} from "lucide-react";

const TrainerCourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
  fetchTrainerCourses();
}, []);

  const fetchTrainerCourses = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token not found. Please login again.");
      return; 
    }

    const payloadBase64 = token.split('.')[1]; 
    const payloadJson = atob(payloadBase64); 
    const payload = JSON.parse(payloadJson); 

    const trainerId = payload.userId;
    const API_PATH = import.meta.env.VITE_API_PATH;

    const response = await axios.get(`${API_PATH}/Course/trainer/${trainerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setCourses(Array.isArray(response.data) ? response.data : response.data.$values || []);
    setLoading(false);
  } catch (error) {
    console.error("Error fetching trainer courses:", error);
    alert("Không thể tải danh sách khóa học.");
  } finally {
      setLoading(false);
    }
}; 

  const handleCreateCourse = () => {
    navigate("/trainer-dashboard/create-course");
  };

  const handleEditCourse = (courseId) => {
    navigate(`/trainer-dashboard/courses/edit/${courseId}`);
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khóa học này không?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_PATH}/course/${courseId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCourses((prevCourses) =>
          prevCourses.filter((course) => course.id !== courseId)
        );
        alert("Đã xóa khóa học thành công!");
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "Không thể xóa khóa học");
      }
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || course.type?.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'đang diễn ra':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
      case 'sắp tới':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
      case 'đã hoàn thành':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const courseTypes = [...new Set(courses.map(course => course.type).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải danh sách khóa học...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-red-500 p-3 rounded-lg">
                <BookOpen className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Khóa học của tôi</h1>
                <p className="text-gray-600">Quản lý các khóa học đào tạo</p>
              </div>
            </div>
            <button
              onClick={handleCreateCourse}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center space-x-2 shadow-lg"
            >
              <Plus className="text-sm" />
              <span>Tạo khóa học</span>
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Tìm kiếm khóa học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400 text-sm" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">Tất cả loại</option>
                {courseTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Courses Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Khóa học
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Loại
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Giá
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Học viên
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <BookOpen className="text-gray-300 text-4xl mb-4" />
                        <p className="text-lg">Không có khóa học nào</p>
                        <p className="text-sm">Hãy tạo khóa học đầu tiên của bạn</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {course.name || "Không có tên"}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-2">
                            {course.description || "Không có mô tả"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {course.type || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="text-gray-400 mr-1 text-xs" />
                          <span>{formatDate(course.startDate)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="text-gray-400 mr-1 text-xs" />
                          <span>{course.startTime || "N/A"} - {course.endTime || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm font-medium text-gray-900">
                          <DollarSign className="text-gray-400 mr-1 text-xs" />
                          {formatCurrency(course.price)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-900">
                          <Users className="text-gray-400 mr-1 text-xs" />
                          <span>
                            {course.enrolledStudents || 0}/{course.maxStudents || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                          {course.status || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditCourse(course.id)}
                            className="text-green-600 hover:text-green-800 transition-colors p-1 rounded hover:bg-green-50"
                            title="Chỉnh sửa"
                          >
                            <Edit className="text-sm" />
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            className="text-red-600 hover:text-red-800 transition-colors p-1 rounded hover:bg-red-50"
                            title="Xóa"
                          >
                            <Trash2 className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        {filteredCourses.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Tổng cộng: {filteredCourses.length} khóa học</span>
              <span>
                {searchTerm && `Kết quả tìm kiếm cho "${searchTerm}"`}
                {filterType !== "all" && ` | Loại: ${filterType}`}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerCourseList;
