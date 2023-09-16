import axios from "axios"
export const api = axios.create({
  baseURL : "https://crudcrud.com/api/7e0a696715c84c428fa9708045d06740",
  timeout : 10000,
})
