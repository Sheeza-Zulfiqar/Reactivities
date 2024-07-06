import axios, { AxiosResponse } from "axios";
import { Activity } from "../layout/models/activity";

axios.defaults.baseURL='http://localhost:5000/api';

const sleep=(delay: number)=>{
    return new Promise((resolve)=>{
        setTimeout(resolve,delay)
    })
}
const responseBody=<T>(response: AxiosResponse<T>) =>response.data;

axios.interceptors.response.use(async response=>{
    return sleep(1000).then(()=>{
        return response;
    }).catch((error)=>{
        console.log(error);
        return Promise.reject(error);
    })
})

const requests={
    get:<T>(url:string) =>axios.get<T>(url).then(responseBody),
    post:<T>(url:string, body:{}) =>axios.post<T>(url, body).then(responseBody),
    put:<T>(url:string, body:{}) =>axios.put<T>(url, body).then(responseBody),
    del:<T>(url:string) =>axios.delete<T>(url).then(responseBody),
}

const Activities={
    list:()=> requests.get<Activity[]>('/activities'),
    details:(id:string) => requests.get<Activity>(`/activities/${id}`),
    create:(activity:Activity)=> requests.post<void>('/activities',activity),
    update:(activity:Activity)=> requests.put<void>(`/activities/${activity.id}`, activity),
    delete:(id:string)=> requests.del<void>(`/activities/${id}`)

}

const agent={
    Activities
}

export default agent