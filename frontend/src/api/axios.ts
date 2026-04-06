import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://ema-api.aranax.tech"
});
api.interceptors.request.use((config)=>{
    const params = new URLSearchParams(window.location.search);    
    const token = params.get("token") || localStorage.getItem("token");
    if(token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});
api.interceptors.response.use(
    (response)=>response,
    (error) => {
        if(error.response?.status === 401){
            alert("Your session has expired, please open the billing page from the app again to continue.");
        }
        return Promise.reject(error);
    }
);

export default api;