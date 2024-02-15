import { GraphQLFormattedError } from "graphql";

type Error = {
    message: string;
    statusCode: string;
}

/**
 * The function `customFetch` is an asynchronous function that adds authorization headers and content
 * type headers to a fetch request.
 * @param {string} url - The `url` parameter is a string that represents the URL of the resource you
 * want to fetch.
 * @param {RequestInit} options - The `options` parameter is an object that contains various properties
 * for configuring the fetch request. Some common properties include `method` (the HTTP method to use),
 * `headers` (an object containing the request headers), `body` (the request body), and `credentials`
 * (whether to include cookies
 * @returns The function `customFetch` returns a Promise that resolves to the response of the `fetch`
 * function.
 */
const customFetch = async (url: string, options: RequestInit) => {
    const accessToken = localStorage.getItem('access_token');

    const headers = options.headers as Record<string, string>;

    return await fetch(url, {
        ...options,
        headers: {
            ...headers,
            Authorization: headers?.Authorization || `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "Apollo-Require-Preflight": "true",
        }
    })
}

/**
 * The function `getGraphQLErrors` takes a GraphQL response body and returns an error object if there
 * are any GraphQL errors present, otherwise it returns null.
 * @param body - The `body` parameter is an object that contains the response body from a GraphQL API
 * request. It should have a property called "errors" which is an array of GraphQLFormattedError
 * objects.
 * @returns The function `getGraphQLErrors` returns an `Error` object or `null`.
 */
const getGraphQLErrors = (body: Record<"errors", GraphQLFormattedError[] | undefined>): Error | null => {
    if(!body) {
        return {
            message: 'Unknown error',
            statusCode: 'INTERNAL_SERVER_ERROR'
        }
    }

    if("errors" in body) {
        const errors = body?.errors;

        const messages = errors?.map((error) => error?.message)?.join("");
        const code = errors?.[0]?.extensions?.code;

        return {
            message: messages || JSON.stringify(errors),
            statusCode: code || 500
        }
    }

    return null;
}

/**
 * The `fetchWrapper` function is an asynchronous function that wraps the `fetch` function and handles
 * GraphQL errors in the response.
 * @param {string} url - The `url` parameter is a string that represents the URL of the API endpoint
 * you want to fetch data from. It typically starts with `http://` or `https://`.
 * @param {RequestInit} options - The `options` parameter is an object that contains various options
 * for the HTTP request. Some common options include:
 * @returns the response object.
 */
export const fetchWrapper = async (url: string, options: RequestInit) => {
    const response = await customFetch(url, options);

    const responseClone = response.clone();
    const body = await responseClone.json();

    const error = getGraphQLErrors(body);

    if(error) {
        throw error;
    }

    return response;
}