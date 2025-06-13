import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTrainingRecordsForMember } from "../../../utils/TrainingRecordHelper";
import { getRegisteredCourses } from "../../../utils/CourseHelper";
import ProgressBar from "../../trainerDashboard/trainingRecords/ProgressBar";
import DataTable from "react-data-table-component";

const MemberRecordsList = () => {
  const [loading, setLoading] = useState(false);
  const [trainingRecords, setTrainingRecords] = useState([]);
  const userId = localStorage.getItem("userId");

  const columns = [
    {
      name: "S.No",
      selector: (row) => row.sno,
      sortable: true,
      width: "80px",
    },
    {
      name: "Course Name",
      selector: (row) => row.courseName,
      sortable: true,
      width: "200px",
    },
    {
      name: "Progress",
      selector: (row) => row.progress,
      sortable: true,
    },
  ];

  const ExpandableComponent = ({ data }) => {
    const statusData = data.status || {};
    const rows = Object.entries(statusData).map(([day, info]) => (
      <tr key={day}>
        <td className="border px-4 py-2">{day}</td>
        <td className="border px-4 py-2">{info.status}</td>
        <td className="border px-4 py-2">{info.note}</td>
      </tr>
    ));

    return (
      <div className="p-4 bg-gray-50 rounded-lg mt-2">
        <h4 className="font-semibold mb-2 text-gray-700">Course Status</h4>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2 text-left">Day</th>
              <th className="border px-4 py-2 text-left">Status</th>
              <th className="border px-4 py-2 text-left">Note</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  };

  const fetchTrainingRecords = async () => {
    setLoading(true);
    try {
      const [records, registeredCourses] = await Promise.all([
        getTrainingRecordsForMember(userId),
        getRegisteredCourses()
      ]);

      if (records && Array.isArray(records)) {
        let sno = 1;
        const formatted = records.map((record) => {
          const registeredCourse = registeredCourses.find(
            (course) => course.id === record.registeredCourseId
          );
          console.log(registeredCourse);
          return {
            ...record,
            sno: sno++,
            courseName: registeredCourse?.course?.name || "Unknown Course",
            progress: <ProgressBar progress={record.progress} width={700} />,
          };
        });
        setTrainingRecords(formatted);
      }
    } catch (error) {
      console.error("Error loading training records:", error);
      alert("Cannot fetch training records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainingRecords();
  }, []);

  return (
    <div className="p-5">
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
        <>
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-2xl font-bold">My Training Records</h3>
          </div>

          <DataTable
            columns={columns}
            data={trainingRecords}
            pagination
            expandableRows
            expandableRowsComponent={ExpandableComponent}
          />
        </>
      )}
    </div>
  );
};

export default MemberRecordsList;
