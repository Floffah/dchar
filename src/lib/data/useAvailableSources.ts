import { useQuery } from "@tanstack/react-query";

import { getAvailableSources } from "@/actions/getAvailableSources";

export const useAvailableSources = () =>
    useQuery({
        queryKey: ["availableSources"],
        queryFn: () => getAvailableSources(),
    });
