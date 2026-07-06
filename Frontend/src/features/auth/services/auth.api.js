//we package called axios for communicate between frontend to Backend
import { api } from "../../../lib/api"

const AUTH_SESSION_KEY="careerly-authenticated"

export function hasAuthSession(){
    return localStorage.getItem(AUTH_SESSION_KEY)==="true"
}

function rememberAuthSession(){
    localStorage.setItem(AUTH_SESSION_KEY,"true")
}

function forgetAuthSession(){
    localStorage.removeItem(AUTH_SESSION_KEY)
}

export async function register({username,email,password}){
    const response=await api.post('/auth/register',{
        username,email,password
    })
    rememberAuthSession()
    return response.data
}

export async function login({email,password}){
    const response=await api.post("/auth/login",{
        email,password
    })
    rememberAuthSession()
    return response.data
}

export async function logout(){
    try{
        const response=await api.post("/auth/logout")
        return response.data
    }finally{
        forgetAuthSession()
    }
}

export async function getme() {
    try{
        const response = await api.get("/auth/get-me");
        return response.data;
    }catch(error){
        if(error.response?.status===401) forgetAuthSession()
        throw error
    }
}
