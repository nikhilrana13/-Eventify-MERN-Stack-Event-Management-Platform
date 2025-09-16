import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table.jsx"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

const ManageBookings = () => {
    const [Loading,setLoading] = useState(false)
     const [Bookings,setBookings] = useState([])

     useEffect(()=>{
        const fetchBookings = async()=>{
          try {
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/Booking/host-bookings`,{
              headers:{
                Authorization: `Bearer ${localStorage.getItem("token")}`
              },withCredentials:true
            })
            if(response.data){
              setBookings(response?.data?.data)
            }
          } catch (error) {
            console.log("failed to get bookings",error)
          }finally{
              setLoading(false)
            }
          }
        fetchBookings()
     },[])
    //  console.log("Bookings",Bookings)
  return (
      <div className='flex w-full p-3 md:p-10 flex-col gap-4'>
      <div className='flex flex-col gap-3'>
        <h3 className='text-[1.4rem] font-[600]'>Manage Bookings</h3>
        <p className='text-gray-500 font-[400]'>Track all bookings</p>
      </div>
      {/* table of bookings */}
      <>
        {Loading ? (
          <div className='mt-5 border overflow-x-auto rounded-md'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Event</TableHead>
                  <TableHead>Timing</TableHead>
                  <TableHead>Total Price</TableHead>
                   <TableHead>Quantity</TableHead>
                  <TableHead>Payment Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3,4,5].map((i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-24 bg-gray-300 rounded-md" />
                        <div className="h-4 w-32 bg-gray-300 rounded" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-40 bg-gray-300 rounded" />
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : Bookings?.length > 0 ? (
          <div className='mt-5 border rounded-md'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Event</TableHead>
                  <TableHead>Timing</TableHead>
                  <TableHead className="">Total Price</TableHead>
                    <TableHead>Quantity</TableHead>
                  <TableHead className="">Payment Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Bookings.map((Booking) => (
                  <TableRow key={Booking._id}>
                    <TableCell className="font-medium">
                      <div className='flex w-full gap-4 items-center'>
                        <Avatar className='hidden md:block'>
                          <AvatarImage
                            className="h-20 w-32 rounded-md object-cover"
                            src={Booking?.eventId?.image || "/default-avatar.png"}
                          />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <span className='flex w-[180px] truncate text-gray-500'>{Booking?.eventId?.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {Booking?.eventId?.starttime} To {Booking?.eventId?.endtime}
                    </TableCell>
                    <TableCell className=" text-gray-500 ">₹{Booking?.amount?.toLocaleString() || 0}</TableCell>
                       <TableCell className=" text-gray-500 ">{Booking?.quantity || 0}</TableCell>
                    <TableCell>
                        <span
                          className={`px-8 py-2 rounded-md text-white font-medium ${Booking.paymentStatus === "Success"
                            ? "bg-green-500"
                            : Booking.paymentStatus === "Failed"
                              ? "bg-red-500"
                              : "bg-gray-400"
                            }`}
                        >
                          {Booking.paymentStatus}
                        </span>
                    

                    </TableCell>
                  
                  </TableRow>
                ))}
              </TableBody>
            </Table>

          </div>

        ) : (
          <p className='text-center mt-12 text-gray-500'>No Bookings found</p>
        )}
      </>

    </div>
  )
}

export default ManageBookings