import React, { useEffect, useState } from "react";
import { getAllCourses } from "../../../utils/CourseHelper";
import DataTable from "react-data-table-component";
import CourseFilters from "./CourseFilters";
import CourseButtons from "./CourseButtons";
import { columns } from "./CourseColumns";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchtext, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCourseType, setSelectedCourseType] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  const onCourseDelete = () => {
    fetchCourses();
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const courses = await getAllCourses();
      if (courses) {
        let sno = 1;
        const data = courses.map((course) => ({
          id: course.id,
          sno: sno++,
          name: course.name,
          description: course.description,
          startDate: new Date(course.startDate).toISOString().split("T")[0],
          endDate: new Date(course.endDate).toISOString().split("T")[0],
          startTime: course.startTime.slice(0, 5),
          endTime: course.endTime.slice(0, 5),
          type: course.type,
          status: course.status,
          price: course.price,
          action: (
            <CourseButtons id={course.id} onCourseDelete={onCourseDelete} />
          ),
        }));
        setCourses(data);
        setFilteredCourses(data);
      }
    } catch (err) {
      if (err.response?.data?.Message) {
        alert(err.response.data.Message);
      }
    } finally {
      setLoading(false);
    }
  };

  const filterRooms = (search, type, status, sDate, eDate) => {
    const data = courses.filter((course) => {
      const matchesSearch = course.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus = status === "" || course.status === status;
      const matchesType = type === "" || course.type === type;
      const matchesStartDate =
        sDate === "" ||
        new Date(course.startDate).toISOString().split("T")[0] >= sDate;
      const matchesEndDate =
        eDate === "" ||
        new Date(course.endDate).toISOString().split("T")[0] <= eDate;
      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesStartDate &&
        matchesEndDate
      );
    });
    setFilteredCourses(data);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterRooms(
      searchtext,
      selectedCourseType,
      selectedStatus,
      filterStartDate,
      filterEndDate
    );
  }, [
    searchtext,
    selectedCourseType,
    selectedStatus,
    filterStartDate,
    filterEndDate,
  ]);

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
            <h3 className="text-2xl font-bold mb-5">Manage Courses</h3>
          </div>

          <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
            <CourseFilters
              searchtext={searchtext}
              selectedStatus={selectedStatus}
              selectedCourseType={selectedCourseType}
              filterStartDate={filterStartDate}
              filterEndDate={filterEndDate}
              onSearchChange={(e) => setSearchText(e.target.value)}
              onStatusChange={(e) => setSelectedStatus(e.target.value)}
              onTypeChange={(e) => setSelectedCourseType(e.target.value)}
              onStartDateChange={(e) => setFilterStartDate(e.target.value)}
              onEndDateChange={(e) => setFilterEndDate(e.target.value)}
            />
          </div>

          <div className="mt-5">
            <DataTable columns={columns} data={filteredCourses} pagination />
          </div>
        </div>
      )}
    </>
  );
};

export default CourseList;
