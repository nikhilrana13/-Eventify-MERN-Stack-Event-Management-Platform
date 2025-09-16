import mongoose from "mongoose";
import { Event } from "../Models/EventModel.js";
import dotenv from "dotenv"
import path from "path";
import { fileURLToPath } from "url";


// dotenv.config({path:"../.env"})
// console.log ("db url",process.env.MONGO_URL)
// dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env load 
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected");
  } catch (err) {
    console.log("failed to connect db",err);
    process.exit(1);
  }
};
// Random location list
const locations = [
  "Delhi, India",
  "Mumbai, India",
  "Bangalore, India",
  "Chennai, India",
  "Kolkata, India",
  "Hyderabad, India",
  "Pune, India",
  "Chandigarh, India",
  "Jaipur, India",
  "Lucknow, India",
];
// Helper function to get random location
const getRandomLocation = () => {
  return locations[Math.floor(Math.random() * locations.length)];
};

// Helper function to generate random date after October 2025
const getRandomDate = () => {
  // Start date: 1st October 2025
  const start = new Date(2025, 9, 1); // month index 9 = October
  // End date: 31st December 2025
  const end = new Date(2025, 11, 31); // month index 11 = December

  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const seedEvents = async () => {
  await connectDB();

    const hostId = "68aad1032548e005b2af9cd5"
  const dummyEvents = []

  for (let i = 201; i <= 300; i++) {
    dummyEvents.push({
  hostId,
  title: `Test Event ${i}`,
  category: "Entertainment",
  description: `This is a test description for event number ${i}`,
  image: "https://media.istockphoto.com/id/479977238/photo/table-setting-for-an-event-party-or-wedding-reception.jpg?s=612x612&w=0&k=20&c=yIKLzW7wMydqmuItTTtUGS5cYTmrRGy0rXk81AltdTA=", 
  location: getRandomLocation(),
  date: getRandomDate(), // random dates
  starttime: "10:00 AM",
  endtime: "02:00 PM",
  capacity: 200 + i,
  tickets: [
    { type: "Standard", price: 100, quantity: 50 },
    { type: "Vip", price: 500, quantity: 20 },
    { type: "free", price: 0, quantity: 30 },
  ],
  status: "Upcoming",
    });
  }

  await Event.insertMany(dummyEvents);
  console.log(" 100 Dummy Events Inserted");
  process.exit();
};

seedEvents();
