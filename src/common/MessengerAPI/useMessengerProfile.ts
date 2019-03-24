import fetch from "node-fetch";

export interface MessengerProfile {
  first_name: string;
  last_name: string;
  profile_pic: string;
  locale: string;
  timezone: any;
  gender: string;
}

export default function useMessengerProfile(token) {
  function jsonFetch(url: string) {
    return fetch(url).then(r => r.json());
  }

  return {
    getProfile: (id): Promise<MessengerProfile> => {
      return jsonFetch(
        `https://graph.facebook.com/${id}?fields=first_name,last_name,profile_pic&access_token=${token}`
      );
    }
  };
}
