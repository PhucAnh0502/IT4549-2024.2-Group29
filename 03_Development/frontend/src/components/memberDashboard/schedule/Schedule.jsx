import React, { useState, useEffect } from "react";
import { format, getDaysInMonth, startOfMonth, getDay, addDays, parse } from "date-fns"; // Import parse for time formatting
import { Card } from "./Card";
import { CardContent } from "./CardContent";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axios from "axios";

const CalendarSchedule = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(format(today, "yyyy-MM-dd"));
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [schedule, setSchedule] = useState({}); // Schedule data from API
  const API_PATH = import.meta.env.VITE_API_PATH;

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const startYear = today.getFullYear() - 50;
  const years = Array.from({ length: 100 }, (_, i) => startYear + i);

  const daysInMonth = getDaysInMonth(new Date(currentYear, currentMonth));
  const firstDayOfWeek = getDay(startOfMonth(new Date(currentYear, currentMonth)));

  const sortScheduleByTime = (scheduleEntries) => {
    return [...scheduleEntries].sort((a, b) => {
      // Convert time strings to minutes for easier comparison
      const getMinutes = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
      };
      
      const timeA = getMinutes(a.startTime);
      const timeB = getMinutes(b.startTime);
      return timeA - timeB;
    });
  };

  // Fetch schedule data from API
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get(`${API_PATH}/Course/registered`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // Transform API response into a schedule object
        const scheduleData = {};
        console.log(response.data)
        response.data.forEach((item) => {
          const startDate = new Date(item.course.startDate);
          const endDate = new Date(item.course.endDate);
          const trainingDays = item.course.trainingDays; // Array of training days (e.g., [1, 3, 5])

          // Iterate through each day from startDate to endDate
          for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
            const dayOfWeek = date.getDay(); // Get the day of the week (0 = Sunday, 1 = Monday, etc.)
            if (trainingDays.includes(dayOfWeek)) {
              const dateStr = format(date, "yyyy-MM-dd");
              if (!scheduleData[dateStr]) {
                scheduleData[dateStr] = [];
              }
              scheduleData[dateStr].push({
                courseName: item.course.name,
                roomName: item.course.room.name,
                trainerName: `${item.course.trainer.firstName} ${item.course.trainer.lastName}`,
                startTime: item.course.startTime,
                endTime: item.course.endTime,
              });
            }
          }
        });

        // Sort schedule for each date
        Object.keys(scheduleData).forEach(date => {
          scheduleData[date] = sortScheduleByTime(scheduleData[date]);
        });

        setSchedule(scheduleData);
      } catch (error) {
        console.error("Failed to fetch schedule:", error);
      }
    };

    fetchSchedule();
  }, []);

  const handleMonthChange = (offset) => {
    let newMonth = currentMonth + offset;
    let newYear = currentYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const formatTime = (time) => {
    const parsedTime = parse(time, "HH:mm:ss", new Date());
    return format(parsedTime, "HH:mm"); // Format to show only hours and minutes
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardContent>
          {/* Header with arrows and dropdowns */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => handleMonthChange(-1)} className="p-2 hover:bg-gray-100 rounded">
              <FaChevronLeft />
            </button>

            <div className="flex gap-4">
              <select
                value={currentMonth}
                onChange={(e) => setCurrentMonth(Number(e.target.value))}
                className="border rounded p-2"
              >
                {monthNames.map((name, idx) => (
                  <option key={idx} value={idx}>{name}</option>
                ))}
              </select>

              <select
                value={currentYear}
                onChange={(e) => setCurrentYear(Number(e.target.value))}
                className="border rounded p-2"
              >
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <button onClick={() => handleMonthChange(1)} className="p-2 hover:bg-gray-100 rounded">
              <FaChevronRight />
            </button>
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2 text-center">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
              <div key={index} className="text-sm font-medium text-gray-500">{day}</div>
            ))}

            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const hasSchedule = !!schedule[dateStr];

              return (
                <div key={day} className="flex flex-col items-center justify-between h-12">
                  <div className="h-2 flex items-center justify-center">
                    {hasSchedule && (
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                    )}
                  </div>
                  <button
                    className={`rounded-full w-8 h-8 flex items-center justify-center mt-1 ${
                      selectedDate === dateStr ? "bg-black text-white" : "hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedDate(dateStr)}
                  >
                    {day}
                  </button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Schedule section */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold mb-4">
            Schedule for {format(new Date(selectedDate), "MMMM d, yyyy")}
          </h2>
          {schedule[selectedDate] ? (
            <div className="space-y-4">
              {schedule[selectedDate].map((entry, idx) => (
                <div 
                  key={idx} 
                  className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start">
                    <div className="w-20 text-sm font-medium text-red-500">
                      <p>{formatTime(entry.startTime)}</p>
                      <p className="text-gray-400">to</p>
                      <p>{formatTime(entry.endTime)}</p>
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-semibold text-gray-800">{entry.courseName}</p>
                      <div className="mt-1 text-sm text-gray-600 space-y-1">
                        <p className="flex items-center">
                          <span className="w-16 text-gray-500">Room:</span>
                          {entry.roomName}
                        </p>
                        <p className="flex items-center">
                          <span className="w-16 text-gray-500">Trainer:</span>
                          {entry.trainerName}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No schedule available for this date.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarSchedule;
