import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { getUnixTime } from "../util";

let client: AxiosInstance | undefined;

const engine: Engine = {
    id: "mail",
    init: ({
        origin,
        token
    }: {
        origin: string;
        token?: string;
    }) => {
        const config: AxiosRequestConfig = { baseURL: origin };
        if (token) {
            config.headers = {
                Authorization: `Bearer ${token}`
            };
        }
        client = axios.create(config);
    },
    isSnippetLarge: true,
    name: "Mail",
    search: async queryString => {
        if (!(client)) {
            throw Error("Engine not initialized");
        }
        const requestBody = {
            requests: [
                {
                    entityTypes: ["message"],
                    query: {
                        queryString
                    },
                    from: 0,
                    size: 25
                }
            ]
        };
        const data = (
            await client.post("/query", requestBody)
        ).data.value;
        return data[0].hitsContainers[0].hits.map((result: any) => ({
            modified: getUnixTime(result.resource.lastModifiedDateTime),
            snippet: result.resource.sender.emailAddress.name + ": " + result.resource.bodyPreview,
            title: result.resource.subject,
            url: result.resource.webLink,
        }));
    }
}

export default engine;
