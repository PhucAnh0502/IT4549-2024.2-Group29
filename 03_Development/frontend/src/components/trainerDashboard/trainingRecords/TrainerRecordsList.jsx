import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTrainingRecordsForTrainer, // ✅ Đã sửa: dùng helper mới
  deleteTrainingRecord
} from "../../../utils/TrainingRecordHelper";
import ProgressBar from "./ProgressBar";
import DataTable from "react-data-table-component";
import TrainingRecordButtons from "./TrainerRecordButtons";
import { columns as baseColumns } from "./TrainerRecordColumns";

const TrainerRecordsList = () => {
  const [loading, setLoading] = useState(false);
  const [trainingRecords, setTrainingRecords] = useState([]);
  const navigate = useNavigate();
  const role = localStorage.getItem("accountRole")?.toLowerCase();

  const fetchTrainingRecords = async () => {
    setLoading(true);
    try {
      const records = await getTrainingRecordsForTrainer(); // ✅ Gọi helper mới
      if (records && Array.isArray(records)) {
        let sno = 1;
        const formatted = records.map((record) => ({
          id: record.id,
          sno: sno++,
          progress: <ProgressBar progress={record.progress} width={700} />,
          action: (
            <TrainingRecordButtons
              id={record.id}
              onTrainingRecordDelete={fetchTrainingRecords}
            />
          ),
        }));
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

  const handleAdd = () => {
    navigate(`/${role}-dashboard/training-records/create`);
  };

  return (
    <div className="p-5">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-red-500 rounded-full animate-spin border-t-transparent mb-4"></div>
            <p className="text-lg font-semibold text-red-500 animate-pulse">Loading...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-2xl font-bold">Manage Training Records</h3>
            <button
              onClick={handleAdd}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              + Add Training Record
            </button>
          </div>

          <DataTable columns={baseColumns} data={trainingRecords} pagination />
        </>
      )}
    </div>
  );
};

export default TrainerRecordsList;
