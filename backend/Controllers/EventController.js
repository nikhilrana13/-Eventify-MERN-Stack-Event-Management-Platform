import { Host } from "../Models/UserModel.js";
import { Response } from "../utils/ResponseHandler.js";
import cloudinary from "../Config/Cloudinary.js";
import { Event } from "../Models/EventModel.js";
import { normalizeCity } from "../utils/normalizeCity.js";
import mongoose from "mongoose";
import { response } from "express";

export const CreateAEvent = async (req, res) => {
  try {
    const hostId = req.user;
    let {
      title,
      description,
      category,
      location,
      date,
      starttime,
      endtime,
      tickets,
      capacity,
    } = req.body;
    console.log("req.body", req.body);
    const image = req.file;

    // parse tickets if coming as string
    if (typeof tickets === "string") {
      tickets = JSON.parse(tickets);
    }
    if (
      !title ||
      !description ||
      !category ||
      !location ||
      !starttime ||
      !endtime ||
      tickets === undefined ||
      !date ||
      !capacity
    ) {
      return Response(res, 404, "All fields is required");
    }
    if (!image) {
      return Response(res, 404, "Image is required");
    }
    // check host exists or not
    const host = await Host.findById(hostId);
    if (!host) {
      return Response(res, 404, "Host not found");
    }
    // convert image into base64
    const imagebase64 = `data:${image.mimetype};base64,${image.buffer.toString(
      "base64"
    )}`;
    // upload to cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(imagebase64, {
      folder: "eventify-website",
      resource_type: "image",
    });
    // get the secure url
    const imageUrl = cloudinaryResponse.secure_url;
    // create event
    const event = await Event.create({
      hostId,
      title,
      description,
      category,
      location,
      date,
      starttime,
      endtime,
      tickets,
      image: imageUrl,
      capacity,
    });
    host.MyEvents.push(event._id);
    await host.save();
    return Response(res, 200, "Event Created Successfully", event);
  } catch (error) {
    console.log("failed to create event", error);
    return Response(res, 500, "Internal Server error");
  }
};

export const GetEachEventDetail = async (req, res) => {
  try {
    const eventId = req.params.id;
    console.log("eventId",eventId)
      if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
      return Response(res, 400, "Invalid Event ID");
    }
    const event = await Event.findById(eventId).populate(
      "hostId",
      "fullname email profilepic PhoneNumber"
    );
    if (!event) {
      return Response(res, 404, "Event not found");
    }
    return Response(res, 200, "Event Found Successfully", event);
  } catch (error) {
    console.log("failed to get event details", error);
    return Response(res, 500, "Internal Server error");
  }
};

export const EachHostEvents = async (req, res) => {
  try {
    const hostId = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const host = await Host.findById(hostId);
    if (!host) {
      return Response(res, 404, "host not found");
    }
    const events = await Event.find({ hostId: hostId })
      .sort({ title: 1 })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (events.length === 0) {
      return Response(res, 404, "No Events found");
    }
    const total = await Event.countDocuments({ hostId });

    return Response(res, 200, "Events found", {
      pagination: {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
      events,
    });
  } catch (error) {
    console.log("failed to get events", error);
    return Response(res, 500, "Internal Server error");
  }
};

export const UpdateEventDetails = async (req, res) => {
  try {
    const hostId = req.user;
    // console.log("req.user",hostId)
    const eventId = req.params.id;
    let {
      title,
      description,
      category,
      location,
      date,
      starttime,
      endtime,
      tickets,
      capacity,
    } = req.body;
    let image = req.file;
    // parse tickets if coming as string
    if (typeof tickets === "string") {
      tickets = JSON.parse(tickets);
    }
    // check host exists or not
    const host = await Host.findById(hostId);
    if (!host) {
      return Response(res, 404, "Host not found");
    }
    // check event exists or not
    const Existingevent = await Event.findById(eventId);
    if (!Existingevent) {
      return Response(res, 404, "Event not found");
    }
    if (Existingevent.hostId.toString() !== hostId) {
      return Response(
        res,
        404,
        "You are not authorizated to update this event"
      );
    }
    let imageUrl = Existingevent.image;
    if (image) {
      // convert image into base64
      const imagebase64 = `data:${
        image.mimetype
      };base64,${image.buffer.toString("base64")}`;
      // upload to cloudinary
      const cloudinaryResponse = await cloudinary.uploader.upload(imagebase64, {
        folder: "eventify-website",
        resource_type: "image",
      });
      imageUrl = cloudinaryResponse.secure_url;
    }
    const UpdatedEvent = await Event.findByIdAndUpdate(
      eventId,
      {
        title,
        description,
        location,
        capacity,
        tickets,
        date,
        starttime,
        endtime,
        category,
        image: imageUrl,
      },
      { new: true }
    );
    return Response(res, 200, "Event Updated Successfully", UpdatedEvent);
  } catch (error) {
    console.log("failed to Update Event", error);
    return Response(res, 500, "Internal Server error");
  }
};
export const DeleteEvent = async (req, res) => {
  try {
    const hostId = req.user;
    const eventId = req.params.id;
    // check host exists or not
    const host = await Host.findById(hostId);
    if (!host) {
      return Response(res, 404, "Host not found");
    }
    // check host exists or not
    const event = await Event.findById(eventId);
    if (!event) {
      return Response(res, 404, "Event not found");
    }
    // Authorization check
    if (event.hostId.toString() !== hostId) {
      return Response(
        res,
        403,
        "You are not authorizated to delete this event"
      );
    }
    // delete event
    const deletedEvent = await Event.findByIdAndDelete(eventId);
    // Remove event reference from host's myEvents array
    await Host.findByIdAndUpdate(
      hostId,
      { $pull: { MyEvents: event._id } },
      { new: true }
    );
    return Response(res, 200, "Event deleted Successfully");
  } catch (error) {
    console.log("failed to delete Event", error);
    return Response(res, 500, "Internal Server error");
  }
};

export const GetAllevents = async (req, res) => {
  try {
    const { location, category,title,date,sortby, page = 1, limit = 20 } = req.query;
    // convert page & limit to numbers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;
    // console.log("Selected Categories from FE:", category);
    let filter = {status:"Upcoming"};
      // Category filter
    if (category) {
      // for filter multiple categories
      const categories = category.split(",").map((c) => c.trim());
      filter.$or = categories.map((c) => ({
        category: { $regex: new RegExp(c, "i") },
      }));
    }
      // location filter
    if (location) {
      const normalized = normalizeCity(location);
      //  console.log("User query:", location, " | Normalized:", normalized);
      filter.location = { $regex: new RegExp(normalized, "i") };
    }
      // title filter
    if(title){
      filter.title = {$regex: new RegExp(title,"i")}
    }
    // date filter 
    if(date){
      const today = new Date();
      today.setHours(0, 0, 0, 0); // midnight reset
      let startDate, endDate;
      if (date === "Today") {
        startDate = today;
        endDate = new Date(today);
        endDate.setHours(23, 59, 59, 999);
      } else if (date === "Tomorrow") {
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() + 1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setHours(23, 59, 59, 999);
      } else if (date === "ThisWeek") {
        const dayOfWeek = today.getDay(); // Sunday = 0
        startDate = new Date(today);
        startDate.setDate(today.getDate() - dayOfWeek); // week start
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6); // week end
        endDate.setHours(23, 59, 59, 999);
      } else if (date === "ThisMonth") {
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);
      }
       if (startDate && endDate) {
        filter.date = { $gte: startDate, $lte: endDate };
      }
    }
     const stages= [
      {$match:filter},
      {
        $addFields :{minTicketPrice:{$min:"$tickets.price"}}
      }
    ]
     // handle sorting
    // Only add $sort stage if sorting is valid
    if(sortby?.toLowerCase() === "lowtohigh"){
       stages.push({ $sort:{minTicketPrice:1}})
    }else if(sortby?.toLowerCase() === "hightolow"){
      stages.push({$sort:{minTicketPrice:-1}})
    }
    //  pagination
    stages.push({$skip:skip})
    stages.push({$limit:limitNumber})
    // find events with filter + pagination + sorting
    // const events = await Event.find(filter).sort(sortOption).skip(skip).limit(limitNumber);
    const events = await Event.aggregate(stages)
    const totalEvents = await Event.countDocuments(filter);
    const totalPages = Math.ceil(totalEvents / limitNumber);
    return Response(res, 200, "events found", {
      events,
      pagination: {
        totalEvents,
        totalPages,
        currentPage: pageNumber,
        limit: limitNumber,
      },
    });
  } catch (error) {
    console.log("failed to get Events", error);
    return Response(res, 500, "Internal Server error");
  }
};


export const CancelEvent = async(req,res)=>{
  try {
       const hostId = req.user 
       const eventId = req.params.id 
       const event = await Event.findById(eventId)
       if(!event){
        return Response(res,404,"Event not found")
       }

       if(event.hostId.toString() !== hostId){
        return Response(res,403,"You are not authorized to cancel this event")
       }
       if(event.status === "Cancelled"){
         return Response(res,400,"Event already Cancelled")
       }
       const cancelledEvent = await Event.findByIdAndUpdate(eventId,{status:"Cancelled"},{new:true})
       if(cancelledEvent){
         return Response(res,200,"Event cancelled",cancelledEvent)
       }
    
  } catch (error) {
    console.log("failed to cancel event",error)
    return Response(res,500,"Internal Server error")
  }
}