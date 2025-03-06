import { useEffect, useState } from "react";
import {toast} from "@/components/core/toaster";
import {useProfileStore} from "@/stores/profile";
import { useRouter } from "next/navigation";

const urls = {};

export default function useFetch(
  url,
  method,
  options
) {
  const router = useRouter();
  const profile = useProfileStore.getState();


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (url) {
      if (urls[url] == null) urls[url] = new AbortController();

      handleFetching(url, options?.body, urls[url].signal);

      return () => {
        urls[url]?.abort();
        delete urls[url];
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, options?.body, router.route]);

  const handleFetching = (fetchUrl = url, fetchBody = options?.body, signal = null) => {
    const headers = {};

    if (!(fetchBody instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    setLoading(true);
    return fetch(fetchUrl, {
      headers: {
        ...headers,
        ...options?.headers,
      },
      method,
      body: fetchBody instanceof FormData ? fetchBody : JSON.stringify(fetchBody),
      signal,
    })
      .then((res) => {
        if (!res.ok) {
          const error= { status: res.status, message: res.statusText };
          throw new Error(JSON.stringify(error));
        }

        return options?.returnResponse === true ? res : res.json();
      })
      .then((res) => {
        setData(res);
        return res;
      })
      .catch((e) => {
        let error = null;

        try {
          error = JSON.parse(e?.message);
        } catch (e) {
          return;
        }

        setError(error);

        // if (error?.status === 401) {
        //   return profile.logOut();
        // }
        //
        // if (error?.status === 404) {
        //   return;
        // }
        toast.error(error?.message ?? null);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { data, loading, error, update: handleFetching };
}
