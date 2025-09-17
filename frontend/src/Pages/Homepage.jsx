import React, { useEffect, useState } from 'react'
import Navbar from '../Components/PageComponent/Navbar'
import HeroSection from '@/Components/PageComponent/HeroSection'
import heroimagelow from "../assets/event2low.webp"
import ExploreCategories from '@/Components/PageComponent/ExploreCategories'
import EventCard from '@/Components/PageComponent/EventCard'
import { NavLink } from 'react-router-dom'
import Slider from '@/Components/PageComponent/Slider'
import createEvent from "../assets/createEventbanner.png"
import Footer from '@/Components/PageComponent/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEvents } from '@/Redux/EventSlice'
import axios from 'axios'
import EventCardShimmer from '@/Components/PageComponent/EventCardShimmer'

const Homepage = () => {
  const {Events,loading,error} = useSelector((state)=>state.Event)
  const dispatch = useDispatch()
  const [userCity,SetUserCity] = useState("Detecting...")

  useEffect(()=>{
    const detectLocation = async()=>{
      try {
        // get coordinates
        const {lat,lon} = await getUserLocation()
        // get city from coordiantes
        const city = await getCityFromCoords(lat,lon)
        SetUserCity(city)
        // fetch events with location filter
        dispatch(fetchEvents({location:city}))
        
      } catch (error) {
        console.log("location error",error)
        SetUserCity("Unknown")
        dispatch(fetchEvents())
      }
    }
    detectLocation()
  },[dispatch])
  // console.log("events",Events)
  return (
    <div className='w-full'>
      <Navbar />
      {/* hero section */}
      <section className='w-full md:h-screen  flex items-center md:justify-center bg-center bg-no-repeat bg-cover'  style={{
    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 70%, rgba(0,0,0,0.9)), url(${heroimagelow})`}}
      >
        <HeroSection userCity={userCity } />
      </section>
      {/* explore categories section */}
      <section className=' w-full py-[2rem]  xl:px-[6rem]'>
        <ExploreCategories />
      </section>
      {/* popular events section */}
      <section className='w-full py-[2rem] xl:px-[6rem]'>
        <div className='flex flex-col px-5 py-5 gap-3'>
          <h3 className='text-[1.8rem] md:text-[2rem] font-[700]'>Popular Events in {userCity || "india"}</h3>
          {
            loading ? (
            <div className='grid grid-cols-1  mx-auto gap-8 p-3 md:p-5 lg:grid-cols-2 2xl:grid-cols-3'>
               {[...Array(6)].map((_,index)=>{
                 return (
                  <EventCardShimmer key={index} />
                 )
               })}
          </div>
            ):Events?.length > 0 ? (
              <div className='grid grid-cols-1  mx-auto gap-8 p-3 md:p-5 lg:grid-cols-2 2xl:grid-cols-3'>
            {/* event cards */}
                {
                  Events?.slice(0,6).map((event,index)=>{
                    return (
                      <NavLink key={event?._id || index} to={`/event-details/${event?._id}`}>
                          <EventCard  event={event}  />
                      </NavLink>
                     
                    )
                  })
                }
          </div>
            ):error ? (
              <p className='text-center mt-10 text-[1.5rem] text-gray-500'>{error}</p>
            ):(
               <div className='flex justify-center items-center mt-10'>
                        <p className='text-gray-500 text-[1.5rem]'>No Events found</p>
            </div>
            )
          }
          <div className='mx-auto mt-6'>
            <NavLink to="/events" className="py-3 px-8 md:px-[8rem] hover:bg-black hover:text-white cursor-pointer rounded-md border-[1px] border-[#2D2C3C]">
              See More
            </NavLink>
          </div>
        </div>
      </section>
      {/* slider section */}
       <section className='w-full  py-[2.5rem] md:px-[7.5rem]'>
       <Slider />
      </section>
      {/* create event banner */}
      <section  className=' w-full hidden md:block py-[2.5rem] md:px-[7.5rem]'>
        <img src={createEvent} loading='lazy' alt="banner" className='rounded-md w-full h-full'  />
      </section>
      {/* footer */}
      <footer>
        <Footer />
      </footer>

    </div>
  )
}

export default Homepage


// helper functions
const getUserLocation = ()=>{
  return new Promise((resolve,reject)=>{
    if(!navigator.geolocation){
      reject("Geolocation not supported")
    }
    navigator.geolocation.getCurrentPosition((pos)=>{
      resolve({
        lat: pos.coords.latitude,
        lon:pos.coords.longitude
      })
    },
    (err)=> reject(err)
  )
  })
}
const getCityFromCoords = async(lat,lon)=>{
  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
  const data = await res.json()
  const addr = data?.address || {}
  return  addr.state || addr.state_district ||  addr.city || addr.country || "Unknown";
}