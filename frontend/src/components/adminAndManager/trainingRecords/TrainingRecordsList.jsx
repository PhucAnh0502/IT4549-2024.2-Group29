import React, { useEffect, useState } from "react";
import { getAllTrainingRecords } from "../../../utils/TrainingRecordHelper";
import ProgressBar from "./ProgressBar";
import DataTable from "react-data-table-component";
import TrainingRecordButtons from "./TrainingRecordButtons";
import {columns} from "./TrainingRecordColumns"

const TrainingRecordsList = () => {

  const [loading, setLoading] = useState(false);
  const [trainingRecords, setTrainingRecords] = useState([]);

  const onTrainingRecordDelete = () => {
    fetchTrainingRecords()
  }

  const fetchTrainingRecords = async () => {
    setLoading(true);
    try {
      const trainingRecords = await getAllTrainingRecords();
      if (trainingRecords) {
        let sno = 1;
        const data = await trainingRecords.map((record) => ({
          id: record.id,
          sno: sno++,
          progress : <ProgressBar progress={record.progress} width={700}/>,
          action: <TrainingRecordButtons id={record.id} onTrainingRecordDelete={onTrainingRecordDelete}/>
        }));
        setTrainingRecords(data)
      }
    } catch (err) {
      console.log(err);
      alert("Cannot get training records data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainingRecords()
  },[])
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
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-5">Manage Training Records</h3>
          </div>

          <div className="mt-5">
            <DataTable columns={columns} data={trainingRecords} pagination />
          </div>
        </div>
      )}
    </>
  );
};

export default TrainingRecordsList;
