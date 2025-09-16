import React,{useState,useRef} from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import image1 from "../../assets/sliderimg1.webp"
import image2 from "../../assets/slider6.avif"
import image3 from "../../assets/sliderimg4.webp"
import image4 from "../../assets/slider5.webp"
import howitworkbanner from "../../assets/howbanner.webp"

// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

const Slider = () => {
  return (
       <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper p-10 flex justify-center"
      >
        <SwiperSlide>
            <img src={howitworkbanner} alt="image" loading='lazy' className='w-full mx-auto  md:h-[800px] h-full rounded-md block  object-cover' />
        </SwiperSlide>
        <SwiperSlide>
            <img src={image1} alt="image" loading='lazy' className='w-full mx-auto h-full md:h-[800px] rounded-md block  object-cover' />
        </SwiperSlide>
            <SwiperSlide>
            <img src={image2} alt="image" loading='lazy' className='w-full mx-auto md:h-[800px] h-full rounded-md block  object-cover' />
        </SwiperSlide>
            <SwiperSlide>
            <img src={image3} alt="image" loading='lazy' className='w-full mx-auto md:h-[800px] h-full rounded-md block  object-cover' />
        </SwiperSlide>
            <SwiperSlide>
            <img src={image4} alt="image" loading='lazy' className='w-full mx-auto md:h-[800px] h-full rounded-md block  object-cover' />
        </SwiperSlide>
          
       
      </Swiper>
  )
}

export default Slider