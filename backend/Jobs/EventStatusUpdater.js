import cron from "node-cron";
import { Event } from "../Models/EventModel.js";
import moment from "moment-timezone";


// Function to automatically update event statuses (Upcoming, Ongoing, Completed)
// based on current date & time in IST timezone.
// Host can manually cancel events; this function will not overwrite "Cancelled" status.
export const StartEventStatusUpdater = () => {
  cron.schedule("* * * * *", async () => {
    console.log("Running event status updater");
    try {
      // Get current date & time in IST
      const now = moment().tz("Asia/Kolkata").toDate();
      // get all non-cancelled events
      const events = await Event.find({ status: { $ne: "Cancelled" } });
      for (let event of events) {
        const eventDateStr = moment(event.date).format("YYYY-MM-DD");
        // convert starttime & endtime string to Date objects
        const startDateTime = moment.tz(`${eventDateStr} ${event.starttime}`, "YYYY-MM-DD hh:mm A", "Asia/Kolkata").toDate();
        const endDateTime = moment.tz(`${eventDateStr} ${event.endtime}`, "YYYY-MM-DD hh:mm A", "Asia/Kolkata").toDate();

        if (now >= startDateTime && now <= endDateTime) {
          // Ongoing
          if (event.status !== "Ongoing") {
            event.status = "Ongoing";
            await event.save();
          }
        } else if (now > endDateTime) {
          // Completed
          if (event.status !== "Completed") {
            event.status = "Completed";
            await event.save();
          }
        } else if (now < startDateTime) {
          // Upcoming
          if (event.status !== "Upcoming") {
            event.status = "Upcoming";
            await event.save();
          }
        }
      }
      console.log("Event status update successfully");
    } catch (error) {
      console.error("Failed to update event statuses:", error.message);
    }
  }, { timezone: "Asia/Kolkata" });
};



// import cron from "node-cron"
// import { Event } from "../Models/EventModel.js"
// import moment from "moment-timezone"


// // Function to automatically update event statuses (Upcoming, Ongoing, Completed) based on current date & time
// export const StartEventStatusUpdater = ()=>{
//     cron.schedule("* * * * *",async()=>{
//         // run every hour
//         console.log("Running event status updater")
//     try {
//          // Get current IST date & time
//         const now = moment().tz("Asia/Kolkata").startOf("day").toDate()
//         // Start of today (00:00:00)
//         const todayStart = moment(now).startOf("day").toDate()
//            // End of today (23:59:59)
//         const todayEnd = moment(now).endOf("day").toDate()
        
//        // Events happening today where current time is within event's start and end time
//         await Event.updateMany(
//             {status:{$ne:"Cancelled"},date:{$gte:todayStart,$lte:todayEnd},starttime:{$lte:now},endtime:{$gte:now}},
//             {$set:{status:"Ongoing"}}
//         )
//        // Completed events  (a) Events before today OR b) Events today that have already ended
//       await Event.updateMany(
//         { status: { $ne: "Cancelled" },$or:[
//           {date:{$lt:todayStart}},
//           {date:{$gte:todayStart,$lte:todayEnd},endtime:{$lt:now}},
//         ] },
//         { $set: { status: "Completed" } }
//       );

//       // Upcoming events (a) Events after today OR  b) Events today that haven't started yet
//       await Event.updateMany(
//         { status: { $ne: "Cancelled" },$or:[
//           {date:{$gt:todayStart}},
//           {date:{$gte:todayStart,$lte:todayEnd},starttime:{$gt:now}}
//         ]},
//         { $set: { status: "Upcoming" } }
//       );
//         console.log("Event status update successfully")       
//     } catch (error) {
//           console.error("Failed to update event statuses:", error.message);
//     }
//         },{
//             timezone:"Asia/Kolkata"
//          }
//     )
// }