import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export interface IAuthToken {
    ".expires": string,
    "issued": string,
    "access_token": string
}
class apiClient {
    private axiosInstance: AxiosInstance;
    private token: IAuthToken | null = null;
    constructor(baseURL: string) {
        this.axiosInstance = axios.create({
            baseURL,
            headers: {
                "Content-Type": "application/json"
            }
        })

        this.axiosInstance.interceptors.request.use((config) => {
            const authToken = localStorage.getItem("auth_token") as string
            if (authToken) {
                const access_token = authToken ? JSON.parse(authToken) : null
                config.headers["Authorization"] = `Bearer ${access_token.access_token}`
            }
            return config
        },
            (error) => Promise.reject(error)
        );

        this.axiosInstance.interceptors.response.use((response) => response,
            (error) => {
                console.log("API Error:", error)
                //return Promise.reject(error)
                return error 
            }
        );
    }

    async authentication(username: string, apikey: string): Promise<IAuthToken> {
        try {
            const response = await this.axiosInstance.post<{ token: IAuthToken }>("/token", { username, apikey })
            this.token = response.data as unknown as IAuthToken;
            localStorage.setItem("auth_token", JSON.stringify(this.token));
            return this.token
        } catch (error) {
            console.log("Failed to generate accesstoken", error)
            throw error
        }
    }

    getToken(): IAuthToken | null | any {
        return this.token || JSON.parse(localStorage.getItem("auth_token") as string)
    }
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.axiosInstance.get(url, config);
        return response.data
    }

    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.axiosInstance.post(url, data, config)
        return response.data
    }

}

export default apiClient;