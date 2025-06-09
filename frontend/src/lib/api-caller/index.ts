interface ApiError {
    message: string;
}

export async function throwIfError(response: Response) {
    if (!response.ok) {
        const error: ApiError = await response.json();

        throw Error(error.message);
    }
}

export async function deserialize<T>(response: Response): Promise<T> {
    await throwIfError(response);

    const data: T = await response.json();
    return data;
}

export * as auth from './auth';
