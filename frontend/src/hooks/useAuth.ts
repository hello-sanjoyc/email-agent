export const isAuthenticated = ():boolean => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token") || localStorage.getItem("token")
    return !!token;
}