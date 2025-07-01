import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useProfileStore = create()(
  persist(
    (set, get) => ({
      cookie: null,
      userData: null,
      osmToken: null,
      getCookie: () => {
        return get().cookie
      },
      getUserData: () => {
        return get().userData
      },
      getOsmToken: () => {
        return get().osmToken
      },
      logIn: async (credentials) => {
        let cookie = null

        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        })

        if (!response.ok) return

        const setCookie = response.headers.get('cookie')
        if (setCookie == null) return

        cookie = setCookie

        set(() => ({ cookie }))
        await get().loadOsmToken()
        await get().loadUserData()
      },
      logInEsi: async (code) => {
        let cookie = null
        let user = null

        const response = await fetch(`/api/auth/esi-login?code=${code}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })

        if (!response.ok) return

        const setCookie = response.headers.get('cookie')
        if (setCookie == null) return

        cookie = setCookie
        user = await response.json()
        if (user?.username == null) return

        set(() => ({ cookie, user }))
        await get().loadUserData()
        await get().loadOsmToken()
      },
      loadUserData: async (user) => {
        const cookie = get().cookie
        if (cookie == null) return

        const response = await fetch('/api/auth/user-data', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'server-cookie': cookie,
          },
        })

        if (!response.ok) return

        const userData = await response.json()

        if (userData == null) return

        set(() => ({ userData }))
      },
      loadOsmToken: async () => {
        const cookie = get().cookie
        if (cookie == null) return

        const response = await fetch('/api/auth/osm/get-token', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'server-cookie': cookie,
          },
        })

        if (!response.ok) return

        const osmToken = await response.json()

        if (osmToken == null || osmToken.data == null) return

        set(() => ({ osmToken }))
      },
      logOut: () => {
        set(() => ({
          cookie: null,
          userData: null,
          osmToken: null,
        }))
      },
    }),
    {
      name: 'agromapProfile',
    }
  )
)
