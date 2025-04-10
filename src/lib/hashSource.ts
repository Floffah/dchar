import { JSONSource } from "@/types/JSONSource";

export async function hashSource(source: JSONSource) {
    const msgBuffer = new TextEncoder().encode(JSON.stringify(source));

    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);

    return Buffer.from(hashBuffer).toString("hex");
}
