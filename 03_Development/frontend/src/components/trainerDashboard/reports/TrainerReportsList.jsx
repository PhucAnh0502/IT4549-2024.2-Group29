import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { FaEye, FaPlus, FaFilter, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const TrainerReportsList = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [deleteLoading, setDeleteLoading] = useState(null);
  
  const API_PATH = import.meta.env.VITE_API_PATH;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");




  // Enum values matching backend
  const REPORT_TYPES = {
    0: "Equipment",
    1: "User", 
    2: "TrainingRecord",
    3: "Course",
    4: "Room",
    5: "Environment",
    6: "Other"
  };

  const REPORT_STATUS = {
    0: "Pending",
    1: "Resolved", 
    2: "Rejected"
  };

  const fetchMyReports = async () => {
    setLoading(true);
    try {
      const decoded = jwtDecode(token);
      const userId = decoded.userId;
      const response = await axios.get(`${API_PATH}/Report/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let sno = 1;
      const formatted = response.data.map((report) => ({
        id: report.id,
        sno: sno++,
        title: report.title,
        reportType: REPORT_TYPES[report.reportType] || report.reportType,
        reportTypeCode: report.reportType,
        status: REPORT_STATUS[report.status] || report.status,
        statusCode: report.status,
        content: report.content,
        createdAt: new Date(report.createdAt).toLocaleDateString(),
        createdBy: report.createdBy,
        action: (
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/trainer-dashboard/reports/${report.id}`)}
              className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 flex items-center gap-1 text-sm transition-colors"
              title="View Report"
            >
              <FaEye />
            </button>
            <button
              onClick={() => navigate(`/trainer-dashboard/reports/edit/${report.id}`)}
              className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 flex items-center gap-1 text-sm transition-colors"
              title="Edit Report"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => handleDeleteReport(report.id)}
              disabled={deleteLoading === report.id}
              className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 flex items-center gap-1 text-sm transition-colors disabled:opacity-50"
              title="Delete Report"
            >
              {deleteLoading === report.id ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
              ) : (
                <FaTrash />
              )}
            </button>
          </div>
        ),
      }));

      setReports(formatted);
      setFilteredReports(formatted);
    } catch (error) {
      console.error("Error fetching reports:", error);
      if (error.response?.status === 401) {
        alert("Your session has expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else if (error.response?.status === 403) {
        alert("You don't have permission to access these reports.");
      } else {
        alert("Failed to load your reports. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this report? This action cannot be undone.")) {
      return;
    }

    setDeleteLoading(reportId);
    try {
      await axios.delete(`${API_PATH}/Report/delete/${reportId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Remove the deleted report from state
      setReports(prev => prev.filter(report => report.id !== reportId));
      setFilteredReports(prev => prev.filter(report => report.id !== reportId));
      
      alert("Report deleted successfully!");
    } catch (error) {
      console.error("Error deleting report:", error);
      if (error.response?.status === 401) {
        alert("Your session has expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else if (error.response?.status === 403) {
        alert("You don't have permission to delete this report.");
      } else {
        alert("Failed to delete report. Please try again.");
      }
    } finally {
      setDeleteLoading(null);
    }
  };

  const applyFilters = () => {
    let filtered = [...reports];

    if (filterStatus !== "All") {
      filtered = filtered.filter(report => REPORT_STATUS[report.statusCode] === filterStatus);
    }

    if (filterType !== "All") {
      filtered = filtered.filter(report => REPORT_TYPES[report.reportTypeCode] === filterType);
    }

    setFilteredReports(filtered);
  };

  useEffect(() => {
    fetchMyReports();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filterStatus, filterType, reports]);

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Resolved': 'bg-green-100 text-green-800 border-green-200',
      'Rejected': 'bg-red-100 text-red-800 border-red-200',
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusClasses[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {status}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const typeClasses = {
      'Equipment': 'bg-blue-100 text-blue-800 border-blue-200',
      'User': 'bg-purple-100 text-purple-800 border-purple-200',
      'TrainingRecord': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Course': 'bg-teal-100 text-teal-800 border-teal-200',
      'Room': 'bg-orange-100 text-orange-800 border-orange-200',
      'Environment': 'bg-green-100 text-green-800 border-green-200',
      'Other': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${typeClasses[type] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {type}
      </span>
    );
  };

  const columns = [
    { 
      name: "No.", 
      selector: (row) => row.sno, 
      width: "60px",
      sortable: false 
    },
    { 
      name: "Title", 
      selector: (row) => row.title, 
      sortable: true,
      wrap: true,
      width: "200px"
    },
    { 
      name: "Type", 
      selector: (row) => row.reportType,
      cell: (row) => getTypeBadge(row.reportType),
      sortable: true,
      width: "140px"
    },
    { 
      name: "Status", 
      selector: (row) => row.status,
      cell: (row) => getStatusBadge(row.status),
      sortable: true,
      width: "120px"
    },
    { 
      name: "Created At", 
      selector: (row) => row.createdAt,
      sortable: true,
      width: "120px"
    },
    {
      name: "Actions",
      cell: (row) => row.action,
      ignoreRowClick: true,
      //allowOverflow: true,
      //button: true,
      width: "150px"
    },
  ];

  const customStyles = {
    header: {
      style: {
        minHeight: '56px',
      },
    },
    headRow: {
      style: {
        borderTopStyle: 'solid',
        borderTopWidth: '1px',
        borderTopColor: '#e5e7eb',
      },
    },
    headCells: {
      style: {
        '&:not(:last-of-type)': {
          borderRightStyle: 'solid',
          borderRightWidth: '1px',
          borderRightColor: '#e5e7eb',
        },
        fontWeight: '600',
        backgroundColor: '#f9fafb',
      },
    },
    cells: {
      style: {
        '&:not(:last-of-type)': {
          borderRightStyle: 'solid',
          borderRightWidth: '1px',
          borderRightColor: '#e5e7eb',
        },
      },
    },
  };

  // Get unique statuses and types for filter options
  const uniqueStatuses = [...new Set(reports.map(report => report.status))];
  const uniqueTypes = [...new Set(reports.map(report => report.reportType))];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">My Reports</h2>
            <p className="text-gray-600 text-sm mt-1">Manage your submitted reports</p>
          </div>
          <button
            onClick={() => navigate("/trainer-dashboard/reports/create")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors shadow-sm"
          >
            <FaPlus />
            Create New Report
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-500" />
              <span className="font-medium text-gray-700">Filters:</span>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-600">Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Statuses</option>
                {uniqueStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-600">Type:</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Types</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="ml-auto text-sm text-gray-500">
              Showing {filteredReports.length} of {reports.length} reports
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-blue-600 text-sm font-medium">Total Reports</div>
              <div className="text-2xl font-bold text-blue-800">{reports.length}</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="text-yellow-600 text-sm font-medium">Pending</div>
              <div className="text-2xl font-bold text-yellow-800">
                {reports.filter(r => r.status === 'Pending').length}
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-green-600 text-sm font-medium">Resolved</div>
              <div className="text-2xl font-bold text-green-800">
                {reports.filter(r => r.status === 'Resolved').length}
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-red-600 text-sm font-medium">Rejected</div>
              <div className="text-2xl font-bold text-red-800">
                {reports.filter(r => r.status === 'Rejected').length}
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-gray-600 font-medium">Loading your reports...</span>
              </div>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📄</div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">No reports found</h3>
              <p className="text-gray-500 mb-4">
                {reports.length === 0 
                  ? "You haven't created any reports yet. Start by creating your first report!" 
                  : "No reports match your current filters. Try adjusting the filter criteria."
                }
              </p>
              {reports.length === 0 && (
                <button
                  onClick={() => navigate("/trainer-dashboard/reports/create")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Your First Report
                </button>
              )}
            </div>
          ) : (
            <DataTable 
              columns={columns} 
              data={filteredReports} 
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[5, 10, 20, 50]}
              customStyles={customStyles}
              highlightOnHover
              striped
              responsive
              noHeader
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerReportsList;
