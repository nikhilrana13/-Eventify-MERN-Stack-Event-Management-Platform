import React from 'react'

const ExploreCategoryCard = ({image,name}) => {
  return (
    <div className='flex flex-col gap-4'>
        <img src={image} alt="image" loading='lazy' className='rounded-full object-cover w-32 h-32 mx-auto '  />
        <span className='font-[500] text-center'>{name}</span>
    </div>
  )
}

export default ExploreCategoryCard