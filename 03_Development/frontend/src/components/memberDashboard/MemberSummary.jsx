import React, { useEffect, useState } from "react";
import { CgGym } from "react-icons/cg";
import SummaryCard from "../adminAndManager/SummaryCard";
import Schedule from "./schedule/Schedule";
import { getRegisteredCourses } from "../../utils/CourseHelper"; // Import the helper function

const MemberSummary = () => {
  const [registered, setRegistered] = useState([]);

  useEffect(() => {
    const fetchRegistered = async () => {
      try {
        // Call the helper function to fetch registered courses
        const courses = await getRegisteredCourses();
        setRegistered(courses); // Update the state with the fetched courses
      } catch (error) {
        console.error("Failed to fetch registered courses:", error);
      }
    };

    fetchRegistered();
  }, []);

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-6 text-gray-700">
        Dashboard Overview
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SummaryCard
          icon={<CgGym className="text-white text-4xl" />}
          text="Registered Courses"
          number={registered.length}
          color="bg-red-400"
        />
      </div>

      {/* Schedule Section */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4 text-gray-700">Your Schedule</h3>
        <Schedule /> {/* Render the Schedule component */}
      </div>
    </div>
  );
};

export default MemberSummary;
