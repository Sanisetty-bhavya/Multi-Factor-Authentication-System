import { commonrequest } from "./Apicall";
import {BACKEND_URL} from "./helper";


export const registerfunction = async(data)=>{
    return await commonrequest("POST",`${BACKEND_URL}/user/register`,data)
}

export const sentOtpFunction = async(data)=>{
    return await commonrequest("POST",`${BACKEND_URL}/user/sendotp`,data)
}

export const userVerify = async(data)=>{
    return await commonrequest("POST",`${BACKEND_URL}/user/login`,data)
}
export const kycRegister = async(data)=>{
    return await commonrequest("POST",`${BACKEND_URL}/dashboard`,data)
}
export const checkmobile = async(data)=>{
    return await commonrequest("POST",`${BACKEND_URL}/dashboard`,data)
}