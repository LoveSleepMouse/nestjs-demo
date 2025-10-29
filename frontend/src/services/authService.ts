import { httpMiddleware } from "../utils/httpMiddleware";

export const authService = {
  async login(username: string, password: string) {
    const response = await httpMiddleware.post("/auth/login", {
      username,
      password,
    });

    return response.data;
  },

  async getProfile() {
    const response = await httpMiddleware.get("/auth/profile");
    return response.data;
  },
};
