export const API_URL = process.env.API_URL || 'http://localhost:3000';

export async function throwIfError(response: Response) {
    if (!response.ok) {
        const error = await response.text();

        throw new Error(error);
    }
}

export async function deserialize<T>(response: Response): Promise<T> {
    await throwIfError(response);

    const data: T = await response.json();
    return data;
}

export * as auth from './auth';
