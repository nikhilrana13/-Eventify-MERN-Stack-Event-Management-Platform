import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import eventpagehero from "../../assets/heroeventpage.webp"
import EventPageHeroSection from './EventPageHeroSection'
import EventCard2 from './EventCard2'
import {
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext,
  PaginationPrevious,
}
  from "../ui/pagination"
import Footer from './Footer'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEvents } from '@/Redux/EventSlice'
import { NavLink, useFetcher } from 'react-router-dom'
import EventCard2Shimmer from './EventCard2Shimmer'
import useDebounce from '../../CustomHook/useDebounce.jsx'
import PaginationShimmer from './PaginationShimmer'

const AllEvents = ({lenis}) => {
  const { Events, loading, error, pagination } = useSelector((state) => state.Event)
  const dispatch = useDispatch()
  const [selectedCategory, setSelectedCategory] = useState([])
  const [page, SetPage] = useState(1)
  const [searchInput, SetSearchInput] = useState("")
  const [Location, setLocation] = useState("")
  const [selectedDate,setSelectedDate] = useState([])
  const [selectedSortby,setSelectedSort] = useState("")
  // debounce version for search and location
  const debouncedSearchInput = useDebounce(searchInput,500)
  const debouncedlocation = useDebounce(Location,500)
  //  console.log("search", searchInput)
  // console.log("pagination", pagination)
  // console.log("selectedcategory", selectedCategory)

  // handle select category checkbox
  const handleSelectCategory = (e) => {
    const value = e.target.value
    setSelectedCategory((prev) => {
      if (prev.includes(value)) {
        return prev.filter((category) => category !== value)
      } else {
        return [...prev, value]
      }
    })
  }
  // handle select date checkbox
   const handleSelectDate=(e) => {
    const value = e.target.value
    setSelectedDate((prev) => {
      if (prev.includes(value)) {
        return prev.filter((date) => date !== value)
      } else {
        return [...prev, value]
      }
    })
  }
   // Fetch events from backend whenever filters, search, sort, location or page change
  useEffect(() => {
    const query = {page}
    if(debouncedlocation) query.location = debouncedlocation
    if(selectedCategory.length > 0 ){
      query.category = selectedCategory.join(",");
    }
    if(debouncedSearchInput) query.title = debouncedSearchInput
    if(selectedDate.length > 0){
      query.date = selectedDate.join(",")
    }
    if(selectedSortby) query.sortby = selectedSortby
    dispatch(fetchEvents(query))
  }, [dispatch, page, debouncedlocation,selectedCategory,debouncedSearchInput,selectedDate,selectedSortby])

  // console.log("fetchevents", Events)

  // Scroll to top whenever filters, search, sort or location change
  useEffect(()=>{
    setTimeout(() => {
       if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    }, 50);
  },[selectedCategory, selectedDate, debouncedSearchInput, debouncedlocation, selectedSortby, lenis])

  // handle page change for pagination
  const handlePageChange = (newPage) => {
  SetPage(newPage);
  if (lenis) {
    lenis.scrollTo(0, { immediate: true });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

  return (
    <div className='w-full'>
      <Navbar />
      {/* hero section of all events page */}
      <section className='w-full  md:h-[500px]  flex items-center md:justify-center bg-center bg-cover bg-no-repeat' style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 70%, rgba(0,0,0,0.9)), url(${eventpagehero})` }}>
        <EventPageHeroSection searchInput={searchInput} Location={Location} SetSearchInput={SetSearchInput} setLocation={setLocation} />
      </section>
      {/* filter section */}
      <section className='w-full min-h-screen py-[2rem] gap-3 flex flex-col md:flex-row  md:px-[4rem] border'>
        {/* left side */}
        <div className='w-full flex flex-col border-r md:px-5  md:w-[30%]'>
          <div className='flex flex-col border-b px-8 py-4'>
            <p className='my-2 text-[1.5rem]  font-[700]'>
              Filters
            </p>
            <div className=' border-gray-300 py-5  mt-3 text-black'>
              <h4 className='mb-3 text-[1.4rem] font-[600]'>Category</h4>
              <div className='flex flex-col gap-4 text-sm font-light text-black'>
                <p className='flex gap-2'>
                  <input onChange={handleSelectCategory} type="checkbox" value="Cultural&Arts" />
                  <span className='text-[1rem]  font-[500]'>Cultural & Arts</span>
                </p>
                <p className='flex gap-2'>
                  <input type="checkbox" onChange={handleSelectCategory} value="Educational&Business" />
                  <span className='text-[1rem]  font-[500]'>Educational & Business</span>
                </p>
                <p className='flex gap-2'>
                  <input type="checkbox" onChange={handleSelectCategory} value="Food&Drink" />
                  <span className='text-[1rem]  font-[500]'>Food & Drink</span>
                </p>
                <p className='flex gap-2'>
                  <input type="checkbox" onChange={handleSelectCategory} value="Sports&fitness" />
                  <span className='text-[1rem]  font-[500]'>Sports & fitness</span>
                </p>
                <p className='flex gap-2'>
                  <input type="checkbox" onChange={handleSelectCategory} value="Technology&Innovation" />
                  <span className='text-[1rem] font-[500]'>Technology & Innovation</span>
                </p>
                <p className='flex gap-2'>
                  <input type="checkbox" onChange={handleSelectCategory} value="Travel&Adventure" />
                  <span className='text-[1rem] font-[500]'>Travel & Adventure</span>
                </p>
                <p className='flex gap-2'>
                  <input type="checkbox" onChange={handleSelectCategory} value="Entertainment" />
                  <span className='text-[1rem]  font-[500]'>Entertainment</span>
                </p>
              </div>
            </div>
          </div>
          <div className=' border-gray-300 border-b px-8 py-4 text-black'>
            <h4 className='mb-3 text-[1.4rem] font-[600]'>Date</h4>
            <div className='flex flex-col gap-4 text-sm font-light text-black'>
              <p className='flex gap-2'>
                <input type="checkbox" onChange={handleSelectDate} value="Today" />
                <span className='text-[1rem]  font-[500]'>Today</span>
              </p>
              <p className='flex gap-2'>
                <input type="checkbox" onChange={handleSelectDate} value="Tomorrow" />
                <span className='text-[1rem]  font-[500]'>Tomorrow</span>
              </p>
              <p className='flex gap-2'>
                <input type="checkbox" onChange={handleSelectDate} value="ThisWeek" />
                <span className='text-[1rem]  font-[500]'>This Week</span>
              </p>
              <p className='flex gap-2'>
                <input type="checkbox" onChange={handleSelectDate} value="ThisMonth" />
                <span className='text-[1rem]  font-[500]'>This Month</span>
              </p>
            </div>
          </div>
          <div className=' border-gray-300 hidden md:block  h-[300px] px-8 py-4 text-black'>
          </div>
        </div>
        {/* right side */}
        <div className='w-full  flex-1 p-3 md:w-[80%]'>
          <div className='flex justify-end'>
            <select onChange={(e)=>setSelectedSort(e.target.value)} name="Sort" className=' text-[1rem] font-[500] rounded-md border py-3 px-3'>
              <option value='relevant'>Sort by : Relevant</option>
              <option value='lowtohigh'>Sort by : Low to High</option>
              <option value='hightolow'> Sort by : High to Low</option>
            </select>
          </div>
          {/* events card */}
          {
            loading ? (
              <>
              <div className='grid grid-cols-1 gap-5  mt-8 mx-auto 2xl:grid-cols-2'>
                {[...Array(20)].map((_, index) => {
                  return (
                    <EventCard2Shimmer key={index} />
                  )
                })}
              </div>
              <PaginationShimmer />
                </>
            ) : Events?.length > 0 ? (
              <>
                <div className='grid grid-cols-1 gap-5  mt-8 mx-auto 2xl:grid-cols-2 '>
                  {
                    Events?.map((event) => {
                      return (
                        <NavLink to={`/event-details/${event?._id}`} key={event?._id}>
                          <EventCard2 eventdetail={event} />
                        </NavLink>
                      )
                    })
                  }
                </div>
                {
                  pagination?.totalPages > 1 && (
                    <div className='p-5 mt-5'>
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem className="cursor-pointer">
                            <PaginationPrevious
                              className={`${page === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                              disabled={page === 1}
                              onClick={() => handlePageChange(page - 1) }
                            />
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink>
                              {pagination?.currentPage} of {pagination?.totalPages}
                            </PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                          <PaginationItem className="cursor-pointer">
                            <PaginationNext
                              className={`${page === pagination?.totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
                              disabled={page === pagination?.totalPages}
                              onClick={() => handlePageChange(page + 1)}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )
                }
              </>
            ) : error ? (
              <p className='text-center mt-10 text-[1.5rem] text-gray-500'>{error}</p>
            ) : (
              <div className='flex mx-auto justify-center items-center mt-10'>
                <p className='text-gray-500 text-[1.5rem]'>No Events found</p>
              </div>
            )
          }
        </div>
      </section>
      {/* footer */}
      <Footer />

    </div>
  )
}

export default AllEvents


