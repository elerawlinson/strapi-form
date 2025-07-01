import axios from 'axios'; //axios HTTP client library to make API requests

//baseURL - all requests made start with baseURL - change this once we're using AWS?
const API = axios.create({
    baseURL: "http://localhost:1337/api",
})

//define an async function to get a survey by it's ID- fetch it's related questions and then for each question also branching rules and for each rule, next question
export const getSurvey = (id) =>
    API.get(`/surveys/${id}?populate[questions][populate]=options`);


//define async function to submit survey responses to Strapi 
export const submitResponse = async(data) => 
    API.post('/responses', {data}); 