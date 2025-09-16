import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import TimePicker from 'react-time-picker';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const UpdateEventsDetails = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [Ticketerror, setTicketError] = useState("");
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("");
  const [eventDetails, setEventDetails] = useState({})
  const [tickets, setTickets] = useState([
    { type: "", price: "", quantity: "" }
  ])
  const navigate = useNavigate()
  const { id } = useParams()
  const { handleSubmit, register, setValue, formState: { errors } } = useForm()


  // handle ticket input 
  const handleChange = (index, field, value) => {
    const updatedTickets = [...tickets]
    updatedTickets[index][field] = value;
    setTickets(updatedTickets)
  }
  // add ticket 
  const handleAddTicket = (e) => {
    e.preventDefault()
    setTickets([...tickets, { type: "", price: "", quantity: "" }])
  }
  // remove ticket 
  const handleRemoveTicket = (index) => {
    if (tickets.length === 1) {
      setTicketError("At least one ticket type is required!")
      return
    }
    setTicketError("")
    setTickets(tickets.filter((_, i) => i !== index))
  }
  //  for image preview
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]))
    }
  };
  // helper → convert hh:mm (string) into minutes for comparison
  const convertToMinutes = (time) => {
    if (!time) return 0;
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };
  // validate times whenever they change
  const validateTimes = (sTime, eTime) => {
    if (convertToMinutes(sTime) >= convertToMinutes(eTime)) {
      setError("End time must be later than start time!");
    } else {
      setError("");
    }
  };
  const handleStartTimeChange = (value) => {
    setStartTime(value);
    validateTimes(value, endTime);
  };
  const handleEndTimeChange = (value) => {
    setEndTime(value);
    validateTimes(startTime, value);
  };
  const today = new Date().toISOString().split("T")[0];
  // fetch event details
  useEffect(() => {
    const getEventDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/event/event-details/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }, withCredentials: true
        })
        if (response.data) {
          const event = response?.data?.data
          setEventDetails(event)
          setValue("title", event?.title)
          setValue("description", event?.description)
          setValue("capacity", event?.capacity)
          setValue("tickets", event?.tickets)
          setValue("starttime", event?.starttime)
          setValue("endtime", event.endtime)
          setValue("date", new Date(event?.date).toISOString().split("T")[0]);
          setValue("category", event?.category)
          setValue("location", event?.location)
          setStartTime(event?.starttime || "")
          setEndTime(event?.endtime || 0)
          setTickets(event?.tickets)
        }

      } catch (error) {
        console.log("failed to get event details", error)
      }
    }
    getEventDetails()
  }, [id, setValue])

  // handle form to update event details
  const onSubmit = async (data) => {
    const formattedType = tickets.map(t => ({
      type: t.type,
      price: Number(t.price),
      quantity: Number(t.quantity)
    }))
    const formdata = new FormData();
    formdata.append("title", data.title)
    formdata.append("description", data.description)
    formdata.append("date", data.date)
    formdata.append("starttime", startTime)
    formdata.append("endtime", endTime)
    formdata.append("capacity", Number(data.capacity))
    formdata.append("category", data.category)
    formdata.append("location", data.location)
    formdata.append("tickets", JSON.stringify(formattedType))
    if (data.image && data.image[0]) {
      formdata.append("image", data.image[0])
    }
    try {
      setLoading(true)
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/v1/event/update-event/${id}`, formdata, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data"
        }, withCredentials: true
      })
      if (response.data) {
        toast.success(response?.data?.message)
        navigate("/Host-dashboard/manage-events")
      }
    } catch (error) {
      console.log("failed to update event details", error)
      toast.error(error?.response?.data?.message || "Something went wrong")
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 1000);
    }
  }






  return (
    <div className="max-w-2xl mx-5  bg-white shadow-lg rounded-2xl border p-10 mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Add Event</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1  gap-4">
        {/* Upload Image */}
        <div className='flex flex-col gap-2'>
          <label className="block font-medium">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            className="w-full border rounded-lg p-2"
            {...register("image", { onChange: (e) => handleImageChange(e), })}
          />
          {image ? (
            <img
              src={image}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded-lg"
            />
          ) : eventDetails?.image ? (
            <img
              src={eventDetails?.image}
              alt="image"
              className="mt-2 w-32 h-32 object-cover rounded-lg"
            />

          ) : null}
        </div>
        {/* title */}
        <div className='flex flex-col gap-2'>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            placeholder="e.g Entertainment..."
            className="w-full border rounded-lg p-2"
            {...register("title")}
          />
        </div>
        {/* location */}
        <div className='flex flex-col gap-2'>
          <label className="block font-medium">location</label>
          <input
            type="text"
            placeholder="e.g Delhi,mumbai..."
            className="w-full border rounded-lg p-2"
            {...register("location")}
          />
        </div>
        
        {/* capacity */}
        <div className='flex flex-col gap-2'>
          <label className="block font-medium">Capacity</label>
          <input
            type="number"
            placeholder="e.g 300.."
            className="w-full border rounded-lg p-2"
            {...register("capacity")}
          />
        </div>
        {/* Category */}
        <div className='flex flex-col gap-2'>
          <label className="block font-medium">Category</label>
          <select {...register("category")} className="w-full border rounded-lg p-2">
            <option value="">Select Category</option>
            <option value="Cultural&Arts">Cultural & Arts</option>
            <option value="Educational&Business">Educational & Business</option>
            <option value="Food&Drink">Food & Drink</option>
            <option value="Sports&fitness">Sports & fitness</option>
            <option value="Technology&Innovation">Technology&Innovation</option>
            <option value="Travel&Adventure">Travel & Adventure</option>
            <option value="Entertainment">Entertainment</option>
          </select>
        </div>
        {/* Date of event */}
        <label className="block font-medium">Date of event</label>
        <input
          type="date"
          placeholder=""
          min={today}
          className="w-full border rounded-lg p-2"
          {...register("date")}
        />
        {/* Start Time */}
        <div className="flex flex-col gap-2">
          <label className="block font-medium">Start Time</label>
          <TimePicker
            value={startTime}
            onChange={handleStartTimeChange}
            disableClock={true}
            format="hh:mm a"
          />
          <p className="mt-3">Selected Time: {startTime}</p>
        </div>
        {/* End Time */}
        <div className="flex flex-col gap-2">
          <label className="block font-medium">End Time</label>
          <TimePicker
            onChange={handleEndTimeChange}
            value={endTime}
            disableClock={true}
            format="hh:mm a"
          />
          <p className="mt-3">Selected Time: {endTime}</p>

        </div>
        {error && (
          <p className="text-red-600 text-sm font-medium">{error}</p>
        )}

        {/* select ticket type */}
        <div className="p-4 bg-gray-100 rounded-md">
          <h2 className="text-xl font-bold mb-4">Tickets</h2>
          {tickets.map((ticket, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Type (Standard / VIP)"
                value={ticket.type}
                onChange={(e) => handleChange(index, "type", e.target.value)}
                className="border p-2 rounded-md w-1/3"
              />
              <input
                type="number"
                placeholder="Price"
                value={ticket.price}
                onChange={(e) => handleChange(index, "price", e.target.value)}
                className="border p-2 rounded-md w-1/3"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={ticket.quantity}
                onChange={(e) => handleChange(index, "quantity", e.target.value)}
                className="border p-2 rounded-md w-1/3"
              />

              <button
                type="button"
                onClick={() => handleRemoveTicket(index)}
                className="bg-red-500 text-white px-2 rounded"
              >
                X
              </button>
            </div>
          ))}
          {Ticketerror && <p className="text-red-500 mb-2">{Ticketerror}</p>}
          <button
            type='button'
            onClick={handleAddTicket}
            className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
          >
            + Add Ticket
          </button>
        </div>

        {/* Description */}
        <div className='flex flex-col gap-2'>
          <label className="block font-medium">Description</label>
          <textarea
            placeholder="Enter description"
            rows={5}
            className="w-full border rounded-lg p-2"
            {...register("description")}
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 py-2 px-3 rounded-md text-white hover:bg-blue-700"
        >
          {
            loading ? (
              <Loader2 className='animate-spin w-6 h-6 mx-auto' />
            ) : "Update Event"
          }

        </button>
      </form>
    </div>
  )
}

export default UpdateEventsDetails
