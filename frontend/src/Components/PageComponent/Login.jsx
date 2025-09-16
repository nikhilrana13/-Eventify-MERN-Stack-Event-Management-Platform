import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { SetUser } from '../../Redux/AuthSlice'

const Login = () => {
    const dispatch = useDispatch()
      const {register,handleSubmit,formState:{errors}} = useForm()
    const [Loading,setLoading] = useState(false)
    const navigate = useNavigate()

    const onSubmit = async(data)=>{
        try {
            setLoading(true)
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/sign-in`,data,{withCredentials:true})
            if(response.data){
                toast.success(response?.data?.message)
                dispatch(SetUser(response?.data?.data.user))
                localStorage.setItem("token",response?.data?.data?.token)
                const user = response.data?.data?.user
                if(user?.role === "Attendee"){
                    navigate("/")
                }
                if(user?.role === "Host"){
                    navigate("/Host-dashboard/Dashboard")
                }
            }
        } catch (error) {
            console.log("failed to sign in",error)
            setLoading(false)
            toast.error(error?.response?.data?.message || "Something went wrong")
        }
    }
  return (
     <div className='' >
            <div className='flex  flex-col  md:flex-row  justify-center  '>   
                <div className='w-full md:w-1/2 bg-[#2D2C3C]  flex  flex-col'>
                   <NavLink to="/">
                   <div className=' py-5 md:py-[3rem] px-3 md:px-[3rem]'>
                    <h3 className='text-[2rem]  sm:text-3xl  text-[#FFE047] font-[800]'>Eventify</h3>
                   </div>
                   </NavLink>
                   <div className=' py-[3rem] px-3 md:px-[3rem]'>
                    <p className='text-[2rem] md:text-[3rem] text-white font-[700]'>
                        Discover tailored <br/>events.<br/>Sign In for personalized<br/>recommendations <br /> today!
                    </p>
                   </div>
                </div>
                {/* form */}
                <div className='w-full md:w-1/2 '>
                        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                        Login
                                    </h1>
                                    <form onSubmit={handleSubmit(onSubmit)}  className="space-y-4 md:space-y-6" action="#">
                                        <div>
                                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email Address</label>
                                            <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" {...register("email",{required:true})} />
                                        </div>
                                         {errors.email && <span className='text-red-500'>Email is required</span>}
                                        <div>
                                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                            <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register("password",{required:true})}  />
                                        </div>
                                         {errors.password && <span className='text-red-500'>password is required</span>}
                                        <button type="submit" className="px-5 w-full py-2.5 rounded-full text-white bg-black ">{Loading ? "Please wait...":"Login"}</button> 
                                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                            Dont't have an account? <NavLink to="/sign-up" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</NavLink>
                                        </p>
                                    </form>
                                </div>
                            </div>
                        </div>
                </div>
                
            </div>
        </div>
  )
}

export default Login