import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { NavLink, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar, ClockAlert, Share, Star, Ticket, LocationEdit, Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import mapimg from "../../assets/map.png"
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import Footer from './Footer'
import axios from 'axios'
import defaultevent from "../../assets/fallbackevent.jpeg"
import defaultuser from "../../assets/unknownuser.webp"
import { EventShimmer } from './EventDetailShimmer'
import L from "leaflet"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import TicketCheckout from './TicketCheckout'
import toast from 'react-hot-toast'


// custom marker icon
const markerIcon = new L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

const EachEventDetail = () => {
  const { id } = useParams()
  const [loading, SetLoading] = useState(false)
  const [Event, SetEvent] = useState({})
  const [Coords, SetCoords] = useState(null)

  // fetch event detail
  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        SetLoading(true)
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/event/event-details/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }, withCredentials: true
        })
        if (response.data) {
          SetEvent(response?.data?.data)
        }
      } catch (error) {
        console.log("failed to fetch event details", error)
      } finally {
        SetLoading(false)
      }
    }
    if (id) {
      fetchEventDetail()
    }
  }, [id])
  // console.log("details", Event)
  useEffect(() => {
    if (Event?.location) {
      const fetchCoords = async () => {
        try {
          const query = `${Event?.location},India`
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
          );
          const data = await res.json();
          // console.log("data",data)
          if (data.length > 0) {
            SetCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
          } else if (Event?.location?.includes("Mohali")) {
            SetCoords([30.7046, 76.7179]); // Mohali coords
          } else if (Event?.location?.includes("Chandigarh")) {
            SetCoords([30.7333, 76.7794])
          } else {
            SetCoords([28.6139, 77.2090]); // Default Delhi
          }
        } catch (err) {
          console.log("Location geocoding failed", err);
          SetCoords([28.6139, 77.2090]); // Delhi fallback
        }
      };
      fetchCoords();
    }
  }, [Event?.location])

  const handleShare = (id) => {
    const eventUrl = `${window.location.origin}/event-details/${id}`;
    navigator.clipboard.writeText(eventUrl)
      .then(() => {
        toast.success("Event link copied to clipboard! Share it with your friends");
      })
      .catch(err => {
        toast.error("Failed to copy: ", err);
      });
  };
  return (
    <div className='w-full'>
      <Navbar />
      {/* event details */}
      <div className='w-full border md:px-[6rem] px-3 py-[2rem]'>
        {
          loading ? (
            <EventShimmer />
          ) : Event && Object.keys(Event).length > 0 ? (
            <>
              {/* image */}
              <div className='flex gap-3 lg:flex-row flex-col'>
                <NavLink to="/events">
                  <ArrowLeft className='text-gray-500 md:w-20 md:h-10' />
                </NavLink>
                <img src={Event?.image || defaultevent} loading='lazy' alt="event-image" className='w-full h-full md:h-[500px] rounded-md object-cover' />
              </div>
              {/* content */}
              <div className='flex mt-5 flex-col gap-5 md:flex-row justify-between'>
                <div className='flex flex-col md:px-[5.3rem] gap-3'>
                  <h2 className=' text-[1.5rem] text-[#2D2C3C] md:text-[2.5rem] font-[700]  '>{Event?.title}</h2>
                  <div className='flex flex-col mt-8 gap-3'>
                    <h5 className='font-[700] text-[1.3rem] text-[#2D2C3C]'>Date and time</h5>
                    <span className='flex gap-2 items-center text-[#2D2C3C]'>
                      <Calendar /> {new Date(Event?.date).toLocaleDateString("en-GB", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      }) || "NA"}
                    </span>
                    <span className='flex gap-2 items-center text-[#2D2C3C]'>
                      <ClockAlert /> {formatTime(Event?.starttime) || "NA"} - {formatTime(Event?.endtime) || "NA"}
                    </span>
                  </div>
                </div>
                <div className='flex flex-col md:px-3 gap-3'>
                  <div className='flex text-[#2D2C3C]
              justify-start  md:justify-end gap-3'>
                    <Star /> <Share onClick={() => handleShare(Event?._id)} className=' cursor-pointer' />
                  </div>
                  <div className='flex flex-col gap-3 md:mt-[4rem]'>
                    {/* <Button>Buy Tickets</Button> */}
                    <TicketCheckout Ticketdetails={Event} />
                    <div className='flex flex-col gap-2'>
                      <h6 className='text-[#2D2C3C]'>Ticket information</h6>
                      {
                        Event?.tickets?.map((t) => {
                          return (
                            <div className='flex gap-2 text-[#2D2C3C] items-center'>
                              <Ticket /> <span>{t?.type ?? "NA"} ₹ {t?.price ?? "NA"} each</span>
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                </div>
              </div>
              {/* location */}
              <div className='flex flex-col w-full md:w-[700px]  mt-10 md:px-[5.3rem]  gap-4'>
                <h5 className='font-[700] text-[1.3rem] text-[#2D2C3C]'>Location</h5>
                <div className='flex gap-2 '>
                  <LocationEdit className='text-gray-500 text-xl' />
                  <p className='text-[#2D2C3C]'>{Event?.location || "NA"}</p>
                </div>
                {/* map box */}
                {Coords ? (
                  <MapContainer
                    center={Coords}
                    zoom={13}
                    scrollWheelZoom={false}
                    className="w-full md:h-[400px] h-[300px] rounded-md"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                    />
                    <Marker position={Coords} icon={markerIcon}>
                      <Popup>{Event?.location}</Popup>
                    </Marker>
                  </MapContainer>
                ) : (
                  <img
                    src={mapimg}
                    alt="map"
                    loading="lazy"
                    className="w-full md:h-[400px] object-cover rounded-md"
                  />
                )}
                {/* <img src={mapimg} alt="map" loading='lazy' className='w-full md:h-[400px] object-cover rounded-md' /> */}
              </div>
              {/* hosted info */}
              <div className='md:px-[5.3rem] mt-10'>
                <h6 className='font-[700] text-[1.3rem] text-[#2D2C3C]'>Hosted by</h6>
                <div className='flex p-5  gap-3'>
                  <img
                    src={Event?.hostId?.profilepic || defaultuser}
                    alt="host"
                    className="h-10 w-10 rounded-md object-cover"
                  />
                  <span className='text-[1rem] font-[500] text-[#2D2C3C]'>{Event?.hostId?.fullname || "NA"}</span>
                </div>
              </div>
              {/* description */}
              <div className='md:px-[5.3rem]  mt-10'>
                <h6 className='font-[700] text-[1.3rem] text-[#2D2C3C]'>Description</h6>
                <p className='text-[1rem] font-[400] leading-10 text-gray-500' dangerouslySetInnerHTML={{
                  __html: (Event?.description || "NA").replace(/\n/g, "<br />"),
                }} >
                </p>
              </div>
            </>
          ) : (
            <p className='text-gray-500  mx-auto text-center text-[1.3rem]'>No Details found</p>
          )
        }

      </div>
      <Footer />
    </div>
  )
}

export default EachEventDetail

// Helper function to convert 24-hour time to 12-hour format
const formatTime = (time24) => {
  if (!time24) return ""; // if null/undefined
  const [hourStr, minuteStr] = time24.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr || "0", 10); // if minute missing so 0
  if (isNaN(hour) || isNaN(minute)) return ""; // if invalid format
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
};