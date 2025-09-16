📌 Eventify – MERN Stack Event Management Platform

Eventify is a full-stack event management application built using the MERN stack (MongoDB, Express.js, React.js, Node.js).
This project provides a seamless experience for users (attendees) and hosts (organizers) with role-based authentication, event booking, payments, and complete event lifecycle management.

🚀 Features
👤 User (Attendee) Features:

Role-based Authentication – Secure login and registration.

Event Booking System – Users can browse events, filter/sort with pagination, and book tickets.

Booking Restrictions:

Users cannot book the same ticket more than once.

Event capacity validation (if tickets are sold out → error message shown).

Only one ticket type (Standard, VIP, or Free) can be selected per booking.

Payment Integration – Stripe demo account integration for ticket booking payments.

Email Notifications – On successful payment, users receive booking + event details via Nodemailer.

Profile Management – Users can update their personal details.

Protected Routes – If the role = attendee, homepage opens automatically.

🎤 Host (Organizer) Features:

Host Dashboard – Displays:

✅ Total Bookings

✅ Total Events

✅ Total Revenue

Event Management:

Add, Delete, or Cancel Events.

Events have automatic status updates (using Node-Cron) → Upcoming, Ongoing, Completed.

Profile Management – Hosts can edit their profile details.

Protected Routes – If the role = host, dashboard opens automatically.

📅 Event Management

200+ Dummy Events pre-seeded with categories, dates, and locations.

Filtering, Sorting, and Pagination handled from backend for better performance.

Event Lifecycle Automation with Node-Cron (auto updates status).

💳 Payment System

Integrated Stripe Payment Gateway (Demo Account).

Complete ticket booking flow with secure payment handling.

🖼️ File & Media Handling

Multer + Cloudinary used for event image and profile uploads.

🎨 UI/UX Enhancements

Swiper.js for carousels & event sliders.

Lenis for smooth scrolling.

🛠️ Tech Stack

Frontend: React.js, Swiper.js, Lenis, CSS

Backend: Node.js, Express.js

Database: MongoDB

Authentication: JWT with role-based access

Payments: Stripe

File Uploads: Multer + Cloudinary

Email Service: Nodemailer

Scheduler: Node-Cron

🔐 Roles & Route Protection

Attendee → Homepage access, event booking & profile management.

Host → Dashboard access, event management, revenue tracking.

Live Link : [https://eventify-mern-stack-event-management-sts4.onrender.com/]
