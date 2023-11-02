// fetchBaseQuery allow us to make request to backend api
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

const baseQuery = fetchBaseQuery({baseUrl: BASE_URL})

export const apiSlice = createApi({
    baseQuery,
    // Use to define the type of data fetching from API
    tagTypes: ['Product', 'Order', 'User'],
    endpoints: (builder) => ({}),
})