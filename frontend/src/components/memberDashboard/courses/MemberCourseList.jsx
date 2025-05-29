import React, { useEffect, useState } from "react";
import { getAllCourses, getRegisteredCourses } from "../../../utils/CourseHelper";
import axios from "axios";

const MemberCourseList = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("all"); // 'all' hoặc 'registered'
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [isPaymentPopupVisible, setIsPaymentPopupVisible] = useState(false);
  const [showUnregisterPopup, setShowUnregisterPopup] = useState(false);
  const [isUnregisterPopupVisible, setIsUnregisterPopupVisible] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isUnregistering, setIsUnregistering] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterMinPrice, setFilterMinPrice] = useState("");
  const [filterMaxPrice, setFilterMaxPrice] = useState("");
  const API_PATH = import.meta.env.VITE_API_PATH;

  useEffect(() => {
    const fetchCoursesAndRegistered = async () => {
      try {
        const [all, registered] = await Promise.all([ // Thực hiện đồng thời cả 2 API
          getAllCourses(),
          getRegisteredCourses()
        ]);
        setAllCourses(all);
        setRegisteredCourses(registered.map(r => r.course).filter(Boolean)); // Lọc các course từ registration
      } catch (err) {
        alert(err.response?.data?.Message || "Failed to load courses");
      }
    };
    fetchCoursesAndRegistered();
  }, []);
  

  const fetchRegisteredCourses = async () => {
    try {
      const registrations = await getRegisteredCourses(); // là array các registration object
      const extractedCourses = (registrations || []).map(r => r.course).filter(Boolean);
      setRegisteredCourses(extractedCourses);
    } catch (err) {
      alert(err?.response?.data?.Message || "Failed to load registered courses");
    }
  };
  const handleTabClick = async (selectedView) => {
    setView(selectedView);
    if (selectedView === "registered") {
       await fetchRegisteredCourses();
    }
  };

  const handleRegister = async (course) => {
    setSelectedCourse(course);
    setShowPaymentPopup(true);
    setTimeout(() => {
      setIsPaymentPopupVisible(true);
    }, 50);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    setTimeout(() => {
      setShowPopup(false);
      setSelectedCourse(null);
    }, 300);
  };

  const handleClosePaymentPopup = () => {
    setIsPaymentPopupVisible(false);
    setTimeout(() => {
      setShowPaymentPopup(false);
      setSelectedCourse(null);
    }, 300);
  };

  const handleUnregister = (course) => {
    setSelectedCourse(course);
    setShowUnregisterPopup(true);
    setTimeout(() => {
      setIsUnregisterPopupVisible(true);
    }, 50);
  };

  const handleCloseUnregisterPopup = () => {
    setIsUnregisterPopupVisible(false);
    setTimeout(() => {
      setShowUnregisterPopup(false);
      setSelectedCourse(null);
    }, 300);
  };

  const handleConfirmUnregister = async () => {
    if (!selectedCourse || isUnregistering) return;

    try {
      setIsUnregistering(true);
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_PATH}/Course/unregister/${selectedCourse.id}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Update the registered courses list
      const registrations = await getRegisteredCourses();
      const extractedCourses = registrations.map(r => r.course).filter(Boolean);
      setRegisteredCourses(extractedCourses);

      handleCloseUnregisterPopup();
      alert('Successfully unregistered from the course');
    } catch (error) {
      alert(error.response?.data?.Message || 'Failed to unregister from the course');
    } finally {
      setIsUnregistering(false);
    }
  };

  const checkScheduleConflict = (newCourse, registeredCourses) => {
    for (const regCourse of registeredCourses) {
      // Check if training days overlap
      const newDays = newCourse.trainingDaysString.split(',');
      const regDays = regCourse.trainingDaysString.split(',');
      const hasOverlappingDays = newDays.some(day => regDays.includes(day));

      if (hasOverlappingDays) {
        // Check if time periods overlap
        const newStart = newCourse.startTime;
        const newEnd = newCourse.endTime;
        const regStart = regCourse.startTime;
        const regEnd = regCourse.endTime;

        if (
          (newStart >= regStart && newStart < regEnd) || // New course starts during existing course
          (newEnd > regStart && newEnd <= regEnd) || // New course ends during existing course
          (newStart <= regStart && newEnd >= regEnd) // New course completely contains existing course
        ) {
          return {
            hasConflict: true,
            conflictingCourse: regCourse
          };
        }
      }
    }
    return { hasConflict: false };
  };

  const handleConfirmPayment = async () => {
    if (!selectedCourse || isRegistering) return;

    // Check for schedule conflicts
    const { hasConflict, conflictingCourse } = checkScheduleConflict(selectedCourse, registeredCourses);
    if (hasConflict) {
      alert(`Cannot register for this course. Schedule conflict with "${conflictingCourse.name}" on ${conflictingCourse.trainingDaysString} at ${conflictingCourse.startTime} - ${conflictingCourse.endTime}`);
      return;
    }

    try {
      setIsRegistering(true);
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_PATH}/Course/register/${selectedCourse.id}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Update the registered courses list
      const registrations = await getRegisteredCourses();
      const extractedCourses = registrations.map(r => r.course).filter(Boolean);
      setRegisteredCourses(extractedCourses);

      handleClosePaymentPopup();
      alert('Registration successful!');
    } catch (error) {
      alert(error.response?.data?.Message || 'Failed to register for the course');
    } finally {
      setIsRegistering(false);
    }
  };

  // Đảm bảo coursesToShow luôn là mảng
  const coursesToShowRaw = view === "registered" ? registeredCourses : allCourses;
  const coursesToShow = Array.isArray(coursesToShowRaw) ? coursesToShowRaw : [];
  const displayedCourses = coursesToShow.filter(course =>
    course.name && course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  useEffect(() => {
    if (showPopup) {
      setIsPopupVisible(true);
    }
  }, [showPopup]);

  const CourseDetailsPopup = ({ course, onClose }) => {
    if (!course) return null;
    
    return (
      <div 
        className={`fixed inset-0 flex items-center justify-center bg-black/70 z-50 transition-opacity duration-500 ${isPopupVisible ? "opacity-100" : "opacity-0"}`}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className={`bg-white p-6 rounded-xl max-w-2xl w-full mx-4 relative transform transition-transform duration-500 ${isPopupVisible ? "translate-y-0" : "translate-y-[-20px]"}`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl font-bold transition duration-200"
          >
            X
          </button>
          <h2 className="text-2xl font-bold mb-4 text-red-500">{course.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 mb-2"><span className="font-semibold">Type:</span> {course.type}</p>
              <p className="text-gray-600 mb-2"><span className="font-semibold">Price:</span> ${course.price}</p>
              <p className="text-gray-600 mb-2"><span className="font-semibold">Status:</span> {course.status}</p>
              <p className="text-gray-600 mb-2"><span className="font-semibold">Training Days:</span> {course.trainingDaysString}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-2"><span className="font-semibold">Start Date:</span> {new Date(course.startDate).toLocaleDateString()}</p>
              <p className="text-gray-600 mb-2"><span className="font-semibold">End Date:</span> {new Date(course.endDate).toLocaleDateString()}</p>
              <p className="text-gray-600 mb-2"><span className="font-semibold">Time:</span> {course.startTime} - {course.endTime}</p>
              <p className="text-gray-600 mb-2"><span className="font-semibold">Room:</span> {course.room.name}</p>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Trainer:</h3>
            <p className="text-gray-600">{course.trainer.firstName} {course.trainer.lastName}</p>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Description:</h3>
            <p className="text-gray-600">{course.description}</p>
          </div>
        </div>
      </div>
    );
  };

  const PaymentPopup = ({ course, onClose }) => {
    if (!course) return null;

    const formattedStartDate = new Date(course.startDate).toLocaleDateString();
    const formattedEndDate = new Date(course.endDate).toLocaleDateString();
    
    return (
      <div 
        className={`fixed inset-0 flex items-center justify-center bg-black/70 z-50 transition-opacity duration-500 ${
          isPaymentPopupVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div 
          className={`bg-white p-6 rounded-xl max-w-md w-full mx-4 relative transform transition-transform duration-500 ${
            isPaymentPopupVisible ? "translate-y-0" : "translate-y-[-20px]"
          }`}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl font-bold transition duration-200"
          >
            X
          </button>

          <h2 className="text-2xl font-bold mb-6 text-red-500 border-b pb-2">Payment Details</h2>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-4">Course Summary</h3>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span className="text-gray-600">Course:</span>
                  <span className="font-medium">{course.name}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{course.type}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{formattedStartDate} - {formattedEndDate}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Schedule:</span>
                  <span className="font-medium">{course.startTime} - {course.endTime}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Days:</span>
                  <span className="font-medium">{course.trainingDaysString}</span>
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-4">Payment Information</h3>
              <div className="space-y-2">
                <p className="flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span className="text-red-500">${course.price}</span>
                </p>
              </div>
            </div>

            <button
              onClick={handleConfirmPayment}
              disabled={isRegistering}
              className={`w-full bg-red-500 text-white py-3 rounded-lg font-medium transition duration-200 ${
                isRegistering 
                  ? 'opacity-75 cursor-not-allowed' 
                  : 'hover:bg-red-600'
              }`}
            >
              {isRegistering ? 'Processing...' : 'Confirm Payment'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const UnregisterPopup = ({ course, onClose }) => {
    if (!course) return null;
    
    return (
      <div 
        className={`fixed inset-0 flex items-center justify-center bg-black/70 z-50 transition-opacity duration-500 ${
          isUnregisterPopupVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div 
          className={`bg-white p-6 rounded-xl max-w-md w-full mx-4 relative transform transition-transform duration-500 ${
            isUnregisterPopupVisible ? "translate-y-0" : "translate-y-[-20px]"
          }`}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl font-bold transition duration-200"
          >
            X
          </button>

          <h2 className="text-2xl font-bold mb-6 text-red-500 border-b pb-2">Unregister Confirmation</h2>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-4">
                Are you sure you want to unregister from this course?
              </p>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span className="text-gray-600">Course:</span>
                  <span className="font-medium">{course.name}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Schedule:</span>
                  <span className="font-medium">{course.startTime} - {course.endTime}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Days:</span>
                  <span className="font-medium">{course.trainingDaysString}</span>
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium transition duration-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUnregister}
                disabled={isUnregistering}
                className={`flex-1 bg-red-500 text-white py-3 rounded-lg font-medium transition duration-200 ${
                  isUnregistering 
                    ? 'opacity-75 cursor-not-allowed' 
                    : 'hover:bg-red-600'
                }`}
              >
                {isUnregistering ? 'Processing...' : 'Confirm Unregister'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCourses = (courses) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map(course => (
        <div key={course.id} className="bg-white p-4 rounded-xl shadow hover:shadow-md">
          <h3 className="text-lg font-semibold">{course.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{course.description}</p>
          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedCourse(course);
                  setShowPopup(true);
                }}
                className="text-red-400 hover:text-red-600 text-sm underline"
              >
                See Details
              </button>
              {view === "registered" && (
                <button
                  onClick={() => handleUnregister(course)}
                  className="text-gray-500 hover:text-red-600 text-sm underline"
                >
                  Unregister
                </button>
              )}
            </div>
            {view === "all" && (
              registeredCourses.some(c => c.id === course.id) ? (
                <button
                  disabled
                  className="bg-gray-400 text-white py-1 px-3 rounded cursor-not-allowed"
                >
                  Registered
                </button>
              ) : (
                <button
                  onClick={() => handleRegister(course)}
                  className="bg-red-400 hover:bg-red-600 text-white py-1 px-3 rounded"
                >
                  Register
                </button>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h3 className="text-2xl font-bold mb-6 text-gray-700">
        Courses List
      </h3>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => handleTabClick("all")}
          className={`px-4 py-2 rounded ${view === 'all' ? 'bg-red-400 text-white' : 'bg-white border'}`}
        >
          All Courses
        </button>
        <button
          onClick={() => handleTabClick("registered")}
          className={`px-4 py-2 rounded ${view === 'registered' ? 'bg-red-400 text-white' : 'bg-white border'}`}
        >
          Registered Courses
        </button>
      </div>

      {/* Search bar */}
      <div className="relative mb-6 flex items-center">
        <input
          type="text"
          placeholder="What do you want to learn?"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 pl-10 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring focus:border-red-300"
        />
        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        {/* Filter icon */}
        <button
          type="button"
          className="absolute right-3 top-2.5 text-gray-400 hover:text-red-500 text-xl"
          onClick={() => setShowFilterPopup(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h18m-16.5 6.75h15m-13.5 6.75h12" />
          </svg>
        </button>
      </div>

      {/* Filter Popup */}
      {showFilterPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50" onClick={e => e.target === e.currentTarget && setShowFilterPopup(false)}>
          <div className="bg-white p-6 rounded-xl w-full max-w-md mx-4 relative">
            <button
              onClick={() => setShowFilterPopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl font-bold transition duration-200"
            >
              X
            </button>
            <h2 className="text-xl font-bold mb-4 text-red-500">Filter Courses</h2>
            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
              {/* Type */}
              <div>
                <label className="block text-gray-700 mb-1">Type</label>
                <select className="w-full border rounded px-3 py-2" value={filterType} onChange={e => setFilterType(e.target.value)}>
                  <option value="">All</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Strength">Strength</option>
                  <option value="CrossFit">CrossFit</option>
                  <option value="Yoga">Yoga</option>
                  <option value="Pilates">Pilates</option>
                  <option value="Boxing">Boxing</option>
                  <option value="Spinning">Spinning</option>
                  <option value="Functional">Functional</option>
                  <option value="Dance">Dance</option>
                </select>
              </div>
              {/* Status */}
              <div>
                <label className="block text-gray-700 mb-1">Status</label>
                <select className="w-full border rounded px-3 py-2" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                  <option value="">All</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              {/* Date Range */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-gray-700 mb-1">From</label>
                  <input type="date" className="w-full border rounded px-3 py-2" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)} />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 mb-1">To</label>
                  <input type="date" className="w-full border rounded px-3 py-2" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)} />
                </div>
              </div>
              {/* Price Range */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-gray-700 mb-1">Min Price</label>
                  <input type="number" className="w-full border rounded px-3 py-2" min="0" value={filterMinPrice} onChange={e => setFilterMinPrice(e.target.value)} />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 mb-1">Max Price</label>
                  <input type="number" className="w-full border rounded px-3 py-2" min="0" value={filterMaxPrice} onChange={e => setFilterMaxPrice(e.target.value)} />
                </div>
              </div>
              <button type="button" className="w-full bg-red-500 text-white py-2 rounded font-medium mt-4" onClick={async () => {
                try {
                  let res = await getAllCourses();
                  let courses = [];
                  if (Array.isArray(res)) {
                    courses = res;
                  } else if (Array.isArray(res?.data?.$values)) {
                    courses = res.data.$values;
                  } else if (Array.isArray(res?.data?.data)) {
                    courses = res.data.data;
                  } else if (Array.isArray(res?.data?.courses)) {
                    courses = res.data.courses;
                  } else if (Array.isArray(res?.data)) {
                    courses = res.data;
                  }
                  // Filter trên FE
                  const filtered = courses.filter(course => {
                    let ok = true;
                    if (filterType && course.type !== filterType) ok = false;
                    if (filterStatus && course.status !== filterStatus) ok = false;
                    if (filterDateFrom && course.startDate < filterDateFrom) ok = false;
                    if (filterDateTo && course.endDate > filterDateTo) ok = false;
                    if (filterMinPrice && course.price < Number(filterMinPrice)) ok = false;
                    if (filterMaxPrice && course.price > Number(filterMaxPrice)) ok = false;
                    return ok;
                  });
                  setAllCourses(filtered);
                  setShowFilterPopup(false);
                } catch (err) {
                  alert(err?.response?.data?.Message || 'Failed to filter courses');
                }
              }}>Apply Filter</button>
            </form>
          </div>
        </div>
      )}

      {/* Course Grid */}
      <div className="my-6">
        {renderCourses(displayedCourses)}
        {displayedCourses.length === 0 && (
          <p className="text-gray-500 text-center mt-4">
            No courses found.
          </p>
        )}
      </div>

      {/* Course Details Popup */}
      {showPopup && (
        <CourseDetailsPopup
          course={selectedCourse}
          onClose={handleClosePopup}
        />
      )}

      {/* Payment Popup */}
      {showPaymentPopup && (
        <PaymentPopup
          course={selectedCourse}
          onClose={handleClosePaymentPopup}
        />
      )}

      {/* Unregister Popup */}
      {showUnregisterPopup && (
        <UnregisterPopup
          course={selectedCourse}
          onClose={handleCloseUnregisterPopup}
        />
      )}
    </div>
  );
};

export default MemberCourseList;
