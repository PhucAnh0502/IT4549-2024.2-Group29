import React, { useEffect, useState } from "react";
import { getAllReports } from "../../../utils/ReportHelper";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReportFilters from "./ReportFilters";
import ReportButtons from "./ReportButtons";
import { columns } from "./ReportColumns";
import DataTable from "react-data-table-component";

const ReportList = () => {
  const navigate = useNavigate();
  const API_PATH = import.meta.env.VITE_API_PATH;

  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedReportType, setSelectedReportType] = useState("");

  const role = localStorage.getItem('accountRole').toLowerCase()

  const onReportRefresh = () => fetchReports();

  const getUserName = async (userId) => {
    try {
      const response = await axios.get(`${API_PATH}/User/user/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response) {
        const user = response.data;
        return `${user.firstName} ${user.lastName}`;
      }
    } catch (err) {
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      }
    }
    return "Unknown";
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const reports = await getAllReports();
      if (reports) {
        let sno = 1;
        const data = await Promise.all(
          reports.map(async (report) => {
            let createdBy = "N/A";
            if (report.createdBy) {
              createdBy = await getUserName(report.createdBy);
            }
            return {
              id: report.id,
              sno: sno++,
              title: report.title,
              reportType: report.reportType,
              status: report.status,
              createdAt: new Date(report.createdAt).toLocaleDateString(),
              createdBy,
              action: (
                <ReportButtons
                  id={report.id}
                  onReportRefresh={onReportRefresh}
                  createdUserId={report.createdByUser.id}
                />
              ),
            };
          })
        );
        setReports(data);
        setFilteredReports(data);
      }
    } catch (err) {
      console.error(err);
      alert("Cannot get reports data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "status") {
      setSelectedStatus(value);
    } else if (name === "reportType") {
      setSelectedReportType(value);
    }
  };

  const filterReports = (searchText, status, type) => {
    const filtered = reports.filter((report) => {
      const matchesSearch = report.title
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const matchesStatus = !status || report.status.toString() === status;
      const matchesType = !type || report.reportType.toString() === type;
      return matchesSearch && matchesStatus && matchesType;
    });
    setFilteredReports(filtered);
  };

  useEffect(() => {
    filterReports(searchText, selectedStatus, selectedReportType);
  }, [searchText, selectedStatus, selectedReportType, reports]);

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
          <div className="text-center mb-5">
            <h3 className="text-2xl font-bold">Manage Reports</h3>
          </div>

          <ReportFilters
            searchText={searchText}
            selectedStatus={selectedStatus}
            selectedReportType={selectedReportType}
            handleSearchChange={handleSearchChange}
            handleFilterChange={handleFilterChange}
            onAddReport={() => navigate(`/${role}-dashboard/reports/add-report`)}
          />

          <div className="mt-5">
            <DataTable columns={columns} data={filteredReports} pagination />
          </div>
        </div>
      )}
    </>
  );
};

export default ReportList;
