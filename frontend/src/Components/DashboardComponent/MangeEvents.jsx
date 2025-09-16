import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Cross, DeleteIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table.jsx"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar.jsx"
import { Button } from '../ui/button.jsx';
import { NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';

const ManageEvents = () => {
  const [Events, SetEvents] = useState([])
  const [loading, setloading] = useState(false)
  const [page, setpage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 })

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setloading(true)
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/event/host-events?page=${page}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }, withCredentials: true
        })
        if (response.data) {
          SetEvents(response?.data?.data?.events)
          setPagination(response?.data?.data?.pagination)
        }
      } catch (error) {
        console.log("failed to get events",error)
      } finally {
          setloading(false)
      }
    }
    fetchEvents()
  }, [page])
  // console.log("events", Events)
  // handle delete event 
  const handleDeleteEvent = async(id)=>{
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/event/delete/${id}`,{
        headers:{
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },withCredentials:true
      })
      if(response.data){
        toast.success(response?.data?.message)
        SetEvents(Events.filter((event)=> event._id !== id))
      }      
    } catch (error) {
      console.log("failed to delete event",error)
      toast.error(error?.data?.response?.message || "Something went wrong")   
    }
  }
  // handle Cancel event 
  const HandleCancelEvent = async(id)=>{
    try {
        const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/event/cancel-event/${id}`,{},{
          headers:{
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },withCredentials:true
        })
        if(response.data){
          toast.success(response?.data?.message)
        }
      
    } catch (error) {
      console.log("failed to cancel event",error)
      toast.error(error?.response?.data?.message || "Something went wrong")
    }
  }
  return (
    <div className='flex w-full p-3 md:p-10 flex-col gap-4'>
      <div className='flex flex-col gap-3'>
        <h3 className='text-[1.4rem] font-[600]'>Manage Events</h3>
        <p className='text-gray-500 font-[400]'>View all listed events,update their details, or remove them from the booking platform</p>
      </div>
      {/* table of bookings */}
      <>
        {loading ? (
          <div className='mt-5 border rounded-md'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Events</TableHead>
                  <TableHead className="w-[150px]">Category</TableHead>
                  <TableHead className="w-[120px]">Date</TableHead>
                  <TableHead className="w-[200px]">Timing</TableHead>
                  <TableHead className="w-[150px]">Update Details</TableHead>
                  <TableHead className="w-[100px]">Delete</TableHead>
                  <TableHead className="w-[100px]">Cancel</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3, 4, 5,6,7,8,9,10].map((i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="h-20 w-27 bg-gray-300 rounded-md" />
                        <div className="h-4 w-40 bg-gray-300 rounded" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-20 bg-gray-300 rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-20 bg-gray-300 rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-8 w-28 bg-gray-300 rounded-md" />
                    </TableCell>
                    <TableCell>
                      <div className="h-8 w-28 bg-gray-300 rounded-md" />
                    </TableCell>
                    <TableCell>
                      <div className="h-8 w-10 bg-gray-300 rounded-md" />
                    </TableCell>
                       <TableCell>
                      <div className="h-8 w-10 bg-gray-300 rounded-md" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : Events?.length > 0 ? (
          <>
            <div className='mt-5 border rounded-md'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Events</TableHead>
                    <TableHead className="w-[150px]">Category</TableHead>
                    <TableHead className="w-[120px]">Date</TableHead>
                    <TableHead className="w-[200px]">Timing</TableHead>
                    <TableHead className="w-[150px]">Update Details</TableHead>
                    <TableHead className="w-[100px]">Delete</TableHead>
                    <TableHead className="w-[100px]">Cancel</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Events?.map((event) => {
                    return (
                      <TableRow key={event._id}>
                        <TableCell className="font-medium">
                          <div className='flex w-full gap-4 items-center'>
                            <Avatar className='hidden md:block'>
                              <AvatarImage
                                className="h-20 w-30 object-cover rounded-md"
                                src={event?.image || "/default-avatar.png"}
                              />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <span className='flex w-[180px] truncate text-gray-500'>{event?.title}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-500">
                          {event?.category}
                        </TableCell>
                        <TableCell className="text-gray-500">
                          {new Date(event?.date).toLocaleDateString("en-GB")}
                        </TableCell>
                        <TableCell className=" text-gray-500 ">{event?.starttime} To {event?.endtime}</TableCell>
                        <TableCell>
                          <NavLink to={`/Host-dashboard/update-event-details/${event?._id}`}>
                            <Button>Update</Button>
                          </NavLink>
                        </TableCell>
                        <TableCell>
                          <DeleteIcon onClick={()=>handleDeleteEvent(event?._id)} className='cursor-pointer' />
                        </TableCell>
                           <TableCell>
                          <button onClick={()=> HandleCancelEvent(event?._id)}  className='cursor-pointer bg-red-500 rounded-md text-white px-2 py-1'>Cancel</button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-center items-center gap-4 mt-6">
              <Button
                disabled={page === 1}
                onClick={() => setpage(prev => prev - 1)}
              >
                Previous
              </Button>
              <span>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>

              <Button
                disabled={page === pagination.totalPages}
                onClick={() => setpage(prev => prev + 1)}
              >
                Next
              </Button>
            </div>
          </>

        ) : (
          <p className='text-center mt-12 text-gray-500'>No Events found</p>
        )}
      </>
      {/* update form */}
      <div>
        <Outlet />
      </div>
    </div>
  )
}

export default ManageEvents