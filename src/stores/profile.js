import { create } from "zustand";
import { persist } from "zustand/middleware";


export const useProfileStore = create()(
  persist(
    (set, get) => ({
      cookie: null,
      authToken: null,
      user: null,
      userData: null,
      getCookie: () => {
        return get().cookie;
      },
      getUser: () => {
        return get().user;
      },
      getToken: () => {
        return get().authToken;
      },
      logIn: async (credentials) => {
        let cookie = null;
        let user = null;

        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        if (!response.ok) return;

        const setCookie = response.headers.get("cookie");
        if (setCookie == null) return;

        cookie = setCookie;
        user = await response.json();
        if (user?.username == null) return;

        set(() => ({ cookie, user }));
        await get().getAuthToken();
      },
      logInEsi: async (code) => {
        let cookie= null;
        let user= null;

        const response = await fetch(`/api/auth/esi-login?code=${code}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) return;

        const setCookie = response.headers.get("cookie");
        if (setCookie == null) return;

        cookie = setCookie;
        user = await response.json();
        if (user?.username == null) return;

        set(() => ({ cookie, user }));
        await get().loadUserData();
      },
      getAuthToken: async () => {
        const cookie = get().cookie;
        if (cookie == null) return;

        const response = await fetch("/api/auth/get-token", {
          method: "GET",
          headers: { "Content-Type": "application/json", "server-cookie": cookie },
        });

        if (!response.ok) return;

        const authToken = await response.json();

        if (authToken == null || authToken.data == null) return;

        set(() => ({ authToken }));
      },
      loadUserData: async (user) => {
        const cookie = get().cookie;
        if (cookie == null) return;

        const response = await fetch("/api/auth/user-data", {
          method: "POST",
          headers: { "Content-Type": "application/json", "server-cookie": cookie },
          body: JSON.stringify(user),
        });

        if (!response.ok) return;

        const userData = await response.json();

        if (userData == null || userData.data == null) return;

        set(() => ({ userData: userData.data[0] }));
      },
    }),
    {
      name: "agromapProfile",
    }
  )
);
