import React from 'react'
import ExploreCategoryCard from './ExploreCategoryCard.jsx'
// Import images
import category1 from "../../assets/category1.png";
import category2 from "../../assets/category2.png";
import category3 from "../../assets/category3.png";
import category4 from "../../assets/category4.png";
import category5 from "../../assets/category5.png";
import category6 from "../../assets/category6.png";


const Categories =[
    {
        id:0,
        image:category1,
        name:"Entertainment"
    },
     {
        id:1,
        image:category2,
        name:"Educational & Business"
    },
     {
        id:2,
        image:category3,
        name:"Cultural & Arts"
    },
     {
        id:3,
        image:category4,
        name:"Sports & Fitness"
    },
     {
        id:4,
        image:category5,
        name:"Technology & Innovation"
    },
     {
        id:5,
        image:category6,
        name:"Travel & Adventure"
    },
]
const ExploreCategories = () => {

  return (
    <div className='flex flex-col px-5 py-5 gap-3'>
        <h3 className='text-[1.8rem] md:text-[2rem] font-[700]'>Explore Categories</h3>
        <div className='grid grid-cols-1 gap-4 p-5 md:grid-cols-6'>
            {
                Categories?.map((category)=>{
                    return (
                        <ExploreCategoryCard key={category?.id} image={category?.image} name={category?.name} />
                    )
                })
            }
        </div>
    </div>
  )
}

export default ExploreCategories