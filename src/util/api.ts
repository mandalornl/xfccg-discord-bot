import 'dotenv/config';

export const api = {
  get: async (url: string): Promise<any> => {
    const response = await fetch(`${process.env.BASE_URL}/api/${url}`);

    if (!response.ok) {
      throw new Error(`Could not fetch server response from ${url}`);
    }

    return await response.json();
  },
};
