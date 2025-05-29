import React from "react";
import { motion } from "framer-motion";
import course1 from "../../assets/course1.jpg";
import course2 from "../../assets/course2.jpg";
import course3 from "../../assets/course3.jpg";
import course4 from "../../assets/course4.jpg";
import course5 from "../../assets/course5.jpg";

const Course = () => {
  const courses = [course1, course2, course3, course4, course5];

  return (
    <div className="py-16 text-center bg-gray-100" id="Courses">
      <h2 className="text-4xl font-bold text-red-500 mb-6">Courses</h2>
      <p className="text-gray-600 max-w-2xl mx-auto mb-10">
        Explore our courses designed to help you achieve your fitness goals.
      </p>

      <div className="flex gap-6 justify-center flex-wrap">
        {courses.map((course, index) => (
          <motion.div
            key={index}
            className="relative w-60 h-60 rounded-lg overflow-hidden shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: false }} 
          >
            <img
              src={course}
              alt={`Course ${index + 1}`}
              className="w-full h-full object-cover transition hover:brightness-110"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Course;
