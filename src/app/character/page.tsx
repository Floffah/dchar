"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CharacterPage() {
    const router = useRouter();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        if (!params.has("data")) {
            router.replace("/");
        }
    }, []);

    return <></>;
}
