import { useAxios } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export const useAuthCallback = () => {
    const api = useAxios();

    const mutation = useMutation({
        mutationFn: async () => {
            const {data} = await api.post('/auth/callback');
            return data;
        },
    });
    return mutation;
}