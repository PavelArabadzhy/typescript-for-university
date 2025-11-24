import type { } from "../types"; // (типізація fetch не обов'язкова — приклад)

// Повертає масив постів із jsonplaceholder
export async function fetchPosts(start = 0, limit = 5): Promise<any[]> {
    const url = `https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${limit}`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch posts: ${res.status}`);
    }
    return res.json();
}