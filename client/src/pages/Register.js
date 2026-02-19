import React, { useState } from 'react'
import "../styles/mix.css"
import { ToastContainer, toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom'
import { registerfunction } from "../services/Apis";


const Register = () => {
 
 const[passshow,setpasshow]=useState(false);
 const[ inputdata,setInputdata ]=useState({
  fname:"",
  email:"",
  password:"",
 });
 const navigate=useNavigate();
 const handleChange =(e)=>{
  const {name,value}=e.target;
  setInputdata({...inputdata,[name]:value})
 }
 const handleSubmit=async(e)=>{
  e.preventDefault();
  const {fname,email,password}=inputdata;

  if (fname === ""){
    toast.error("Enter Your Name")
    }else if(email === ""){
    toast.error("Enter Your Email")
    }else if(!email.includes ("@")){
    toast.error("Enter Valid Email")
    }else if(password === ""){
    toast.error("Enter Your Password")
    }else if(password.length <6) {
    toast.error("password length minimum 6 character")
    }else{
   const response=await registerfunction(inputdata);
   if(response.status===200){
    setInputdata({...inputdata,fname:"",email:"",password:""});
    navigate("/")
   }else{
    toast.error(response.response.data.error)
   }
   
    }
 }
  return (
    <>
    
    <section>
                <div className="form_data">
                    <div className="form_heading">
                        <h1>Register</h1>
                        <p style={{textAlign:'center'}}>To Access the website you need to create a account</p>
                    </div>
                    <form >
                        <div className="form_input">
                            <label htmlFor="fname">Name</label>
                            <input type="text" name="fname" id='' onChange={handleChange} placeholder='Enter your name'></input>
                        </div>
                        <div className="form_input">
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" id='' onChange={handleChange} placeholder='Enter your email address'></input>
                        </div>
                        <div className="form_input">
                            <label htmlFor="password">Password</label>
                           <div className='two'>
                           <input type={!passshow ? "password":"text"} name="password" id='' onChange={handleChange} placeholder='Enter your password'></input>
                           <div className='showpass' onClick={()=>setpasshow(!passshow)}>
                           {!passshow ? "Show":"Hide"}
                           
                           </div>
                           </div>

                        </div>
                        <button className='btn' onClick={handleSubmit}>
                            Register
                        </button>
                        
                    </form>
                </div>
                <ToastContainer />
            </section>
    </>
  )
}

export default Register