import {
  SplashTableData,
  SplashTableUpdateData,
} from "@/pages/app/splash/(container)/columns";
import { FormSchemaType } from "@/pages/app/splash";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000/api/splash";
axios.defaults.headers.post["Content-Type"] = "application/json";

const splashApi = {
  getSplash: async (query: FormSchemaType) => {
    const res = await axios({
      method: "GET",
      params: query,
    });
    return res.data;
  },
  createSplash: async (data: SplashTableData) => {
    const res = await axios({
      method: "POST",
      data: { data },
    });
    return res.data;
  },
  updateSplash: async (id: string, data: SplashTableUpdateData) => {
    const res = await axios({
      method: "PUT",
      data: { id, data },
    });
    return res.data;
  },
  deleteSplash: async (id: string) => {
    const res = await axios({
      method: "DELETE",
      data: { id },
    });

    return res.data;
  },
  searchSplash: async (data: FormSchemaType) => {
    const queryString = new URLSearchParams(data).toString();
    const res = await fetch(`http://localhost:3000/api/splash?${queryString}`);
    return res.json();
  },
};

export { splashApi };
