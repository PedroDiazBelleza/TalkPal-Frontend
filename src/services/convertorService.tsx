import api from "@/api/api";

export const convertorService = {
  communicate: async (formdata: FormData) => {
    const response = await api.post("communicate", formdata, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
  },

  synthesize: async (text: string) => {
    const response = await api.post("synthesize", { text });
    return response;
  },

  transcribe: async (formdata: FormData) => {
    const response = await api.post("transcribe", formdata, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
  },

  predictGender: async (formdata: FormData) => {
    const response = await api.post("predict-gender", formdata, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
  },
};
