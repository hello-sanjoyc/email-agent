import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.API_URL || "http://localhost:3000"
});
api.interceptors.request.use((config)=>{
    // const params = new URLSearchParams(window.location.search);
    //we will remove this once it is properly integrated with flutter TODO:
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2M2ZiMzkyNy0xZDVmLTRkMzQtYTllZC00NzcyNWQ3NzEzZTkiLCJ1c2VyRW1haWwiOiJ0cmlwYXRoeTAxNEBnbWFpbC5jb20iLCJ1c2VyUGhvbmUiOiI2Mjk0MTk5MTgxIiwiaWF0IjoxNzc1MDI2MTI5LCJleHAiOjE3NzUwODAxMjl9.JBI_MqT84rmr4IeS0sg11g4HUfrA4HMPwP0sykceJHg"; //params.get("token") || localStorage.getItem("token");
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