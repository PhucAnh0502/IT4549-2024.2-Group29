import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTrainingRecordById } from "../../../utils/TrainingRecordHelper";
import ProgressBar from "./ProgressBar";

const TrainerRecordDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getTrainingRecordById(id);
        if (res) setRecord(res);
      } catch (err) {
        console.error("Failed to load training record:", err);
        alert("You do not have permission to view this record.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="p-5 flex justify-center items-center h-40">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="p-5 text-red-600 font-semibold">
        Record not found or access denied.
      </div>
    );
  }

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Training Record Detail</h2>
      <p>
        <div className="P-2"><strong>Progress:</strong>{" "}</div>
        <ProgressBar progress={record.progress} width={700} />
      </p>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Training Days</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300 mt-2">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Day</th>
                <th className="border px-4 py-2 text-left">Status</th>
                <th className="border px-4 py-2 text-left">Note</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(record.status || {}).map(([day, detail]) => (
                <tr key={day}>
                  <td className="border px-4 py-2">{day}</td>
                  <td className="border px-4 py-2">{detail.status}</td>
                  <td className="border px-4 py-2">{detail.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => navigate("/trainer-dashboard/training-records")}
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
        >
          Back to Dashboard
        </button>
        <button
          onClick={() =>
            navigate(`/trainer-dashboard/training-records/edit/${record.id}`)
          }
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Edit Record
        </button>
      </div>
    </div>
  );
};

export default TrainerRecordDetail;
