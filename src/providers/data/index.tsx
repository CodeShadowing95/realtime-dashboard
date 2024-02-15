import graphqlDataProvider, { GraphQLClient, liveProvider as graphqlLiveProvider } from "@refinedev/nestjs-query";
import { createClient } from "graphql-ws";

import { fetchWrapper } from "./fetch-wrapper";


export const API_BASE_URL = 'https://api.crm.refine.dev';
export const API_URL = 'https://api.crm.refine.dev';
export const WS_URL = 'wss://api.crm.refine.dev/graphql';

/* The code is creating a new instance of the `GraphQLClient` class and assigning it to the `client`
constant. The `GraphQLClient` is a client for making GraphQL requests to a specified API URL. */
export const client = new GraphQLClient(API_URL, {
    fetch: (url: string, options: RequestInit) => {
        try {
            return fetchWrapper(url, options);
        } catch (error) {
            return Promise.reject(error as Error);
        }
    }
})

/* The `wsClient` constant is exporting a WebSocket client object. */
export const wsClient = typeof window !== "undefined"
    ? createClient({
        url: WS_URL,
        connectionParams: () => {
            const accessToken = localStorage.getItem("access_token");

            // Handle Authorization
            return {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            }
        },
    })
    : undefined
;

export const dataProvider = graphqlDataProvider(client);
export const liveProvider = wsClient ? graphqlLiveProvider(wsClient) : undefined;