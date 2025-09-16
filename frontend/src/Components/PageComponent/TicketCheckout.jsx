import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogOverlay
} from "../ui/dialog.jsx"
import { Button } from '../ui/button.jsx'
import { Loader2, Minus, Plus, TicketCheck } from 'lucide-react'
import { useRef } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const TicketCheckout = ({ Ticketdetails = {} }) => {
  const [Loading,SetLoading] = useState(false)
  const [Quantities, SetQuantities] = useState({})
  const [SelectedType, SetSelectedType] = useState("")
  const [ErrorMsg, SetErrorMsg] = useState("")
  const errTimeoutRef = useRef(null)
  const navigate = useNavigate()
  const user = useSelector((state)=>state.Auth.user)
  // console.log("ticketdetails",Ticketdetails)
  useEffect(() => {
    return () => {
      if (errTimeoutRef.current) clearTimeout(errTimeoutRef.current)
    }
  }, [])
  const showError = (msg) => {
    SetErrorMsg(msg)
    if (errTimeoutRef.current) clearTimeout(errTimeoutRef.current)
    errTimeoutRef.current = setTimeout(() => SetErrorMsg(""), 3000)
  }
  if (!Ticketdetails || Object.keys(Ticketdetails).length === 0) return null;
  const { tickets, _id: eventId } = Ticketdetails
  // console.log("tickets", tickets)
  // helper check function
const canSelectType = (type) => {
  if (SelectedType && SelectedType !== type) {
    showError("You cannot select multiple types — only one at a time.")
    return false
  }
  return true
}
  // increase quantity
  const IncreaseQuantity = (type) => {
    // if different type already selected => show error
    if(!canSelectType(type)) return
    SetSelectedType(type)
    SetQuantities((prev) => ({
      ...prev, [type]: (prev[type] || 0) + 1
    }))
    SetErrorMsg("") // clear any previous msg
  }
  // decrease quantity
  const DecreaseQuantity = (type) => {
    // if trying to decrease a not-selected type -> ignore
    if (SelectedType !== type) {
      showError("You cannot modify a type that isn't selected.")
      return
    } // prevent multiple types
    SetQuantities((prev) => {
      const newQty = Math.max((prev[type] || 0) - 1, 0)
      if (newQty === 0) {
        // reset selected type when quantity goes to zero
        SetSelectedType("");
      }
      return { ...prev, [type]: newQty }
    })
  }
  // function  for handling type selection
  const HandleSelectType = (type) => {
    if(!canSelectType(type)) return
    SetSelectedType(type)
    SetErrorMsg("")
  }
  // selected ticket details
  const selectedTicket = tickets.find((t) => t.type === SelectedType)
  const selectedQty = Quantities[SelectedType] || 0;
  const totalPrice = (Number(selectedTicket?.price) || 0) * selectedQty

  // handle proceed
  const HandleProceed = async () => {
    
    if (!eventId || !SelectedType || selectedQty <= 0) {
      SetErrorMsg("Please select a ticket and quantity first")
      return
    }
    SetErrorMsg("")
    if(!user){
      return toast.error("Please Login to Book a Event")
    }
    try {
      SetLoading(true)
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/Booking/book-event`,{
        eventId:eventId,
        tickettype:SelectedType,
        quantity:selectedQty,
      },{
        headers:{
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },withCredentials:true
      })
      console.log("response",response.data)
      // free ticket case
      if(SelectedType.toLowerCase() === "free"){
      toast.success("Free ticket booked successfully!");
      navigate(`/payment-success?bookingId=${response?.data?.data?._id}`)
         return
      }
      if(response?.data?.data?.url){
        window.location.href = response?.data?.data?.url
      }
    } catch (error) {
      console.log("failed to booking",error)
      toast.error(error?.response?.data?.message) 
    }finally{
      SetLoading(false)
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className='flex gap-3 px-3 py-2 text-sm mx-auto cursor-pointer rounded-md bg-black text-white'>
  <TicketCheck />Buy Tickets
        </div>
      
      </DialogTrigger>
      {/* Overlay (background dim) */}
      <DialogOverlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998]" />
      <DialogContent className="z-[9999] bg-[#F1F3F6]">
        <div className=' flex flex-col gap-3 mt-10'>
          <h6 className='bg-white rounded-md font-[500] text-[#2D2C3C] p-5'>Tickets</h6>
          {/* ticket types and quantity */}
          <div className='flex flex-col gap-2'>
            <div className='flex  p-3 justify-between text-[#2D2C3C]'>
              <span>Ticket Types</span>
              <span>Quantity</span>
            </div>
            {
              tickets?.map((ticket) => {
                return (
                  <div key={ticket?._id} className='flex border gap-1 md:gap-4 rounded-md bg-white'>
                    <div className='bg-green-800 w-3'></div>
                    <div className='flex flex-1 p-1 md:p-2 justify-between'>
                      <div className='flex flex-col gap-2'>
                        <span onClick={() => HandleSelectType(ticket?.type)} className='text-[1.3rem] text-[##2D2C3C] font-[600]'>{ticket?.type || "NA"}</span>
                        <span className='text-[##2D2C3C]'>₹ {ticket?.price || 0} </span>
                      </div>
                      <div className='flex items-center gap-3'>
                        <span onClick={() => DecreaseQuantity(ticket?.type)} className='p-1 rounded-full cursor-pointer text-gray-500 border'> <Minus /> </span>
                        <span className='text-[1.3rem] text-[##2D2C3C] font-[600]'>{Quantities[ticket?.type] || 0}</span>
                        <span onClick={() => IncreaseQuantity(ticket?.type)} className='p-1 rounded-full cursor-pointer text-gray-500 border'> <Plus /> </span>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
          {/* errors */}
          {
            ErrorMsg && (
              <div className="text-red-600 text-center mt-2 font-medium">
                {ErrorMsg}
              </div>
            )
          }
          {/* total details */}
          <div className='flex flex-col mt-[5rem] p-4 gap-3 border rounded-md bg-white'>
            <div className='flex justify-center gap-2'>
              <span className='text-[#2D2C3C] text-[1.2rem]'>Qty: <span className='text-[#287921]'>{selectedQty}</span></span>
              <span className='text-[#2D2C3C] text-[1.2rem]'>Total: <span className='text-[#287921]'>
                ₹  {totalPrice}
              </span>
              </span>
            </div>
            <Button onClick={HandleProceed} disabled={selectedQty === 0}  className="text-white">
              {
                Loading ? <Loader2 className='animate-spin w-5 h-5 mx-auto' />:"Proceed"
              }
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default TicketCheckout