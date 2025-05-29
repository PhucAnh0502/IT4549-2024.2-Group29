import React from "react";
import { motion } from "framer-motion";
import room1 from "../../assets/room1.jpg";
import room2 from "../../assets/room2.jpg";
import room3 from "../../assets/room3.jpg";
import room4 from "../../assets/room4.jpg";
import room5 from "../../assets/room5.jpg";

const Room = () => {
  const rooms = [room1, room2, room3, room4, room5];

  return (
    <div className="py-16 text-center bg-gray-100" id="Facilities">
      <h2 className="text-4xl font-bold text-red-500 mb-6">Facilities</h2>
      <p className="text-gray-600 max-w-2xl mx-auto mb-10">
        Discover our top-notch facilities designed to enhance your fitness
        experience and help you achieve your goals.{" "}
      </p>

      <div className="flex gap-6 justify-center flex-wrap">
        {rooms.map((room, index) => (
          <motion.div
            key={index}
            className="relative w-60 h-60 rounded-lg overflow-hidden shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: false }}
          >
            <img
              src={room}
              alt={`Room ${index + 1}`}
              className="w-full h-full object-cover transition hover:brightness-110"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Room;
