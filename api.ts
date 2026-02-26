import 'dotenv/config';

const cache = new Map();

export const api = {
  get: async (url: string): Promise<any> => {
    if (cache.has(url)) {
      return cache.get(url);
    }

    const response = await fetch(`${process.env.API_URL}/${url}`);

    if (!response.ok) {
      throw new Error(`Could not fetch server response from ${url}`);
    }

    const json = await response.json();

    cache.set(url, json);

    return json;
  },
};
