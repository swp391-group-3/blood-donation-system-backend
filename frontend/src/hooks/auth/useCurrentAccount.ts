import { deserialize, fetchWrapper } from '@/lib/api';
import { Account } from '@/lib/api/dto/account';
import { useQuery } from '@tanstack/react-query';

export const useCurrentAccount = () => {
    return useQuery({
        queryFn: async () => {
            const response = await fetchWrapper('/auth/me');

            return deserialize<Account>(response);
        },
        queryKey: ['auth', 'me'],
    });
};
