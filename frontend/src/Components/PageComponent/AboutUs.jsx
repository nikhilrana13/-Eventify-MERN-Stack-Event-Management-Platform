import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import aboutimg from "../../assets/aboutus.webp"; // apna image rakh lena
import officeimg from "../../assets/office.webp"

const AboutUs = () => {
  return (
    <div className="w-full">
      <Navbar />
      {/* Hero Section */}
      <div className="relative w-full h-[300px] md:h-[400px]">
        <img
          src={aboutimg}
          alt="About Us"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white">About Us</h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-5 py-[3rem] space-y-12">
        {/* Who we are */}
        <section className="text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-[#2D2C3C]">
            Who We Are
          </h2>
          <p className="text-gray-600 text-lg leading-7">
            We are passionate event lovers who believe in bringing people together
            through memorable experiences. Our platform makes it easy for you to
            explore, book, and enjoy events happening around you.
          </p>
        </section>

        {/* Mission */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#2D2C3C] mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 leading-7">
              Our mission is to create a community where discovering events is
              simple and fun. Whether it’s concerts, workshops, or local meetups,
              we want to connect people with the right experiences at the right time.
            </p>
          </div>
          <img
            src={officeimg}
            alt="Mission"
            className="rounded-lg shadow-md"
          />
        </section>

        {/* Team Section */}
        <section className="text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-[#2D2C3C]">
            Meet Our Team
          </h2>
          <p className="text-gray-600 mb-6">
            A small but passionate team working to make your event experience better.
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              {
                name: "Kapil singh",
                role: "Founder & CEO",
                img: "https://randomuser.me/api/portraits/men/32.jpg",
              },
              {
                name: "Priya Sharma",
                role: "Designer",
                img: "https://randomuser.me/api/portraits/women/44.jpg",
              },
              {
                name: "Arjun Singh",
                role: "Developer",
                img: "https://randomuser.me/api/portraits/men/76.jpg",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg p-5 flex flex-col items-center"
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover mb-4"
                />
                <h3 className="text-lg font-semibold text-[#2D2C3C]">
                  {member.name}
                </h3>
                <p className="text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;
