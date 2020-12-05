import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
})

//todo remove
export const insertMovie = payload => api.post(`/movie`, payload)
export const getAllMovies = () => api.get(`/movies`)
export const updateMovieById = (id, payload) => api.put(`/movie/${id}`, payload)
export const deleteMovieById = id => api.delete(`/movie/${id}`)
export const getMovieById = id => api.get(`/movie/${id}`)

export const signup = payload => api.post(`/auth/signup`, payload)
export const signin = payload => api.post(`/auth/signin`, payload)
export const verify = payload => api.get(`/auth/verify`,payload)
export const logout = payload => api.get(`/auth/logout`,payload)

const apis = {
    insertMovie,
    getAllMovies,
    updateMovieById,
    deleteMovieById,
    getMovieById,
    signup, 
    signin, 
    verify, 
    logout,
}

export default apis