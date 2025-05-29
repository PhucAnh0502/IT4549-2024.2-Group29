import React from "react";
import Card from "./Card";
import img1 from "../../assets/black.jpg";
import img2 from "../../assets/blue.jpg";
import img3 from "../../assets/green.jpg";
import img4 from "../../assets/red.jpg";
import img5 from "../../assets/yellow.jpg";

const AboutUs = () => {
  return (
    <div id="AboutUs" className="py-16 bg-gray-100 text-center">
      <h2 className="text-4xl font-bold text-red-500 mb-6">About Us</h2>
      <p className="text-gray-600 max-w-2xl mx-auto mb-10">
        We are a passionate team of developers dedicated to building powerful and efficient applications.
      </p>

      <div className="grid grid-cols-5 gap-6 max-w-7xl mx-auto">
        <Card image={img1} name="Lê Đồng Cảnh Phú" role="FE Dev" description="Expert in UI/UX and front-end frameworks." />
        <Card image={img2} name="Đàm Thanh Bách" role="BE Dev" description="Focused on security, performance, and scalability." />
        <Card image={img3} name="Đỗ Mạnh Phương" role="BE Dev" description="Specialist in backend architecture and API development." />
        <Card image={img4} name="Nguyễn Phúc Anh" role="FE Dev" description="Dedicated to modern web technologies and performance optimization." />
        <Card image={img5} name="Lê Thị Ngọc Thảo" role="FE Dev" description="Passionate about responsive design and user experience." />
      </div>
    </div>
  );
};

export default AboutUs;
