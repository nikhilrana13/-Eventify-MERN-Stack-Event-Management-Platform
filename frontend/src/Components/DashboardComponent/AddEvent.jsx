import React from 'react'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const AddEvent = () => {
    const [image, setImage] = useState(null);
    const [startTime, setStartTime] = useState("10:00")
    const [endTime, setEndTime] = useState("12:00");
    const [error,setError] = useState("")
    const [Ticketerror, setTicketError] = useState("");
    const [tickets,setTickets] = useState([
        {type:"",price:"",quantity:""}
    ])
    const [loading,setLoading] = useState(false)
     const {register,handleSubmit,reset,formState:{errors}} = useForm()
    // handle ticket input 
    const handleChange = (index,field,value)=>{
        const updatedTickets = [...tickets]
        updatedTickets[index][field] = value;
        setTickets(updatedTickets)
    }
    // add ticket 
    const handleAddTicket = (e)=>{
        e.preventDefault()
        setTickets([...tickets,{type:"",price:"",quantity:""}])
    }
    // remove ticket 
    const handleRemoveTicket = (index)=>{
        if(tickets.length === 1){
            setTicketError("At least one ticket type is required!")
            return
        }
        setTicketError("")
      setTickets(tickets.filter((_,i)=> i !== index))
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

//   handle form submit
  const onSubmit = async(data)=>{
    // check ticket validation
    const isInvalidTicket = tickets.some(
        (t)=> !t.type || !t.price || !t.quantity
    )
    if(isInvalidTicket){
        setTicketError("All ticket fields are required")
        return;
    }
    setTicketError(" ")
    const formattedType = tickets.map(t=>({
        type: t.type,
        price: Number(t.price),
        quantity: Number(t.quantity)
    }))
    // console.log("formated",formattedType)
       const formdata = new FormData();
       formdata.append("title",data.title)
       formdata.append("description",data.description)
       formdata.append("date",data.date)
       formdata.append("starttime",startTime)
       formdata.append("endtime",endTime)
       formdata.append("capacity",Number(data.capacity))
       formdata.append("category",data.category)
       formdata.append("location",data.location)
       formdata.append("tickets",JSON.stringify(formattedType))
       if(data.image && data.image[0]){
         formdata.append("image",data.image[0])
       }
    //    for(let pair of formdata.entries()){
    //     console.log(pair[0] + " " +pair[1])
    //    }
    //    console.log("formdata",formdata)
  try {
    setLoading(true)
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/event/create-event`,formdata,{
        headers:{
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },withCredentials:true
    })
    if(response.data){
        toast.success(response?.data?.message)
        reset()
        setTickets([{type:"",price:"",quantity:""}])
        setImage(null)
    }
  } catch (error) {
    console.log("failed to create event",error)
    toast.error(error?.response?.data?.message || "Something went wrong")
  }finally{
    setLoading(false)
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
                     {...register("image",{required:true, onChange: (e) => handleImageChange(e),})}
                    />
                    {image && (
                        <img
                            src={image}
                            alt="Preview"
                            className="mt-2 w-32 h-32 object-cover rounded-lg"
                        />
                    )}
                </div>
                {/* title */}
                <div className='flex flex-col gap-2'>
                    <label className="block font-medium">Title</label>
                    <input
                        type="text"
                        placeholder="e.g Entertainment..."
                        className="w-full border rounded-lg p-2"
                        {...register("title",{required:true})}
                    />
                </div>
                  {errors.title && <span className='text-red-500'>title is required</span>}        
                {/* location */}
                <div className='flex flex-col gap-2'>
                    <label className="block font-medium">location</label>
                    <input
                        type="text"
                        placeholder="e.g Delhi,mumbai..."
                        className="w-full border rounded-lg p-2"
                        {...register("location",{required:true})}
                    />
                </div>
                {errors.location && <span className='text-red-500'>location is required</span>}
                {/* capacity */}
                <div className='flex flex-col gap-2'>
                    <label className="block font-medium">Capacity</label>
                    <input
                        type="number"
                        placeholder="e.g 300.."
                        className="w-full border rounded-lg p-2"
                        {...register("capacity",{required:true})}
                    />
                </div>
                {errors.capacity && <span className='text-red-500'>capacity is required</span>}
                {/* Category */}
                <div className='flex flex-col gap-2'>
                    <label className="block font-medium">Category</label>
                    <select {...register("category",{required:true})} className="w-full border rounded-lg p-2">
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
                {errors.category && <span className='text-red-500'>category is required</span>}
                {/* Date of event */}
                <label className="block font-medium">Date of event</label>
                <input
                    type="date"
                    placeholder=""
                    min={today}
                    className="w-full border rounded-lg p-2"
                    {...register("date",{required:true})}
                />
                {errors.date && <span className='text-red-500'>date is required</span>}
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
            {/* Error Message */}
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
                        {...register("description",{required:true})}
                    ></textarea>
                </div>
                {errors.description && <span className='text-red-500'>description is required</span>}
                {/* Submit Button */}
                <button
                    type="submit"
                     disabled={!!error} // disable when invalid
          className={`py-2 px-4 rounded-lg text-white ${
            error ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
                >
                  {
                    loading ? <Loader2 className='animate-spin w-5 h-5 mx-auto' /> : "   Create a Event"
                  }
                </button>
            </form>
        </div>
    )
}

export default AddEvent