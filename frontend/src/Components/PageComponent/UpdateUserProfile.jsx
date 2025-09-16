import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import unknownuser from "../../assets/unknownuser.webp"
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { SetUser } from '@/Redux/AuthSlice'
import Navbar from './Navbar'
import { useNavigate } from 'react-router-dom'

const UpdateUserProfile = () => {
  const {handleSubmit,register,watch,setValue}=useForm()
  const [loading,setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const profilepic = watch("profilepic")
  const user = useSelector((state)=>state.Auth.user)
  // console.log(user)
  const profileimage = user?.profilepic || unknownuser
  useEffect(()=>{
    if(user){
      setValue("fullname",user?.fullname)
    }
  },[user,setValue])

  const onSubmit = async(data)=>{
    const formdata = new FormData()
    for(let key in data){
      if(key === "profilepic" && data[key]?.[0]){
        formdata.append("profilepic",data[key][0])
      }else{
        formdata.append(key,data[key])
      }
    }      
      try {
          setLoading(true)
       const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/v1/attendee/update-profile`,formdata,{
               headers:{
                Authorization: `Bearer ${localStorage.getItem("token")}`
               },withCredentials:true
       })
      //  console.log("response",response.data)
       if(response.data){
         toast.success(response?.data?.message)
         dispatch(SetUser(response?.data?.data))
         navigate('/')
       }
    } catch (error) {
      console.log("failed to update profile",error)
      toast.error(error?.response?.data?.message)
    }finally{
      setLoading(false)
    }
  }
  return (
     <div className='w-full'>
        <Navbar />
        <div className='md:px-[6rem] flex justify-center px-3 py-[2rem]'>
           <div className=" w-full rounded-2xl max-w-[500px] mt-10 bg-white p-10 font-normal leading-relaxed text-gray-900 shadow-xl">
      <div className="flex flex-col">
        <div className="flex flex-col md:flex-row justify-between mb-5 items-start">
          <h2 className="mb-5 text-4xl font-bold text-[#012047]">Update Profile</h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="text-center">
            <div className='flex flex-col items-center gap-4 justify-center'>
                {profilepic && profilepic[0] instanceof File ? (
                        <img
                            src={URL.createObjectURL(profilepic[0])} // temporary preview
                            alt="Preview"
                            className="mt-2 w-32 h-32 object-cover rounded-full"
                        />
                    ) : profileimage ? (
                        <img
                            src={profileimage} // existing image from backend
                            alt="Preview"
                            className="mt-2 w-32 h-32 object-cover rounded-full"
                        />
                    ) : null}
              <input
                type="file"
                name="profilepic"
                id="profilepic"
                hidden
                accept="image/*"
                {...register("profilepic")}
              />
              <label htmlFor="profilepic" className="inline-flex cursor-pointer items-center">
                <svg
                  data-slot="icon"
                  className="w-5 h-5 text-blue-700"
                  fill="none"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                  ></path>
                </svg>
              </label>
            </div>
          </div>
            <div>
            <label
              htmlFor="fullname"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullname"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              {...register("fullname")}
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-800 text-white rounded-lg hover:bg-indigo-700"
            >
              {
                loading ? (
                  <Loader2 className="animate-spin mx-auto w-5 h-5 text-white" />
                ) : (
                  "Save changes"
                )
              }

            </button>
          </div>
        </form>
      </div>
    </div>

        </div>
     </div>
    
  )
}

export default UpdateUserProfile