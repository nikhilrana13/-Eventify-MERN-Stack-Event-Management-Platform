import React from 'react'
import { useState,useEffect, } from 'react'
import { useSelector } from 'react-redux'
import { Car, ChartArea, ChartBarIcon,DollarSign } from 'lucide-react'
import { Card, CardContent } from "../ui/card.jsx";
import axios from 'axios';

const Dashboard = () => {
    const [loading,setloading] = useState(false)
  const [states,setStats] = useState({
    revenue:0,
    bookings:0,
    totalEvents:0,
  })
    // fetch revenue and total events and totalbookings 
    useEffect(()=>{
        const fetchTotalRevenue = async()=>{
            try {
                setloading(true)
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/Booking/total-revenue`,{
                    headers:{
                        Authorization : `Bearer ${localStorage.getItem("token")}`
                    },withCredentials:true
                })
                if(response.data){
                   setStats({
                    revenue:response.data?.data?.totalRevenue,
                    bookings:response?.data?.data?.totalBookings,
                    events:response?.data?.data?.totalEvents
                   })
                }
            } catch (error) {
                console.log("failed to get total revenue",error)
            }finally{
                 setTimeout(()=>{
                    setloading(false)
                 },1000)
            }
        }
        fetchTotalRevenue()
    },[])

  return (
      <div className='w-full flex p-10 flex-col  gap-5'>
      <div className='flex flex-col gap-3'>
        <h3 className='text-[1.4rem] font-[600]'>Host Dashboard</h3>
        <p className='text-gray-500 font-[400]'>Monitor overall platform performance including total Events,bookings,revenue</p>
      </div>
       <div className="grid  grid-cols-1 md:grid-cols-3 gap-4">
      <MetricCard
        title="Total Events"
        value= {states?.events || 0 }
        icon="🎫"
        color="bg-blue-50"
        loading={loading}
      />
      <MetricCard
        title="Total Bookings"
        value= {states?.bookings || 0}
        icon={<ChartBarIcon className="h-8 w-8 text-green-500" />}
        color="bg-green-50"
        loading={loading}
      />
      <MetricCard
        title="Total Revenue"
        value= {states.revenue || 0}
        icon={<DollarSign className="h-8 w-8 text-purple-500" />}
        color="bg-purple-50"
        loading={loading}
      />
    </div>
    </div>
  )
}

export default Dashboard

function MetricCard({ title, value, icon, color,loading }) {
  return (
    <Card className="overflow-hidden border-none shadow-md transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
      <CardContent className={`p-0 ${color}`}>
        <div className="p-6 flex items-center justify-between">
            {loading ? (
            <div className="flex justify-between w-full animate-pulse">
              <div className="flex flex-col gap-2">
                <div className="h-4 w-24 bg-gray-300 rounded"></div>
                <div className="h-8 w-16 bg-gray-300 rounded"></div>
              </div>
              <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
            </div>
          ) : (
            <>
              <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <h3 className="text-2xl font-bold mt-1">{value}</h3>
              </div>
              <div className="rounded-full p-3 bg-white/80 shadow-sm">{icon}</div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}