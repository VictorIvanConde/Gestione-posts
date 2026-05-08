const BASE_URL = "https://jsonplaceholder.typicode.com";
async function fetchApi(endpoint) {
    const res = await fetch(`${BASE_URL}${endpoint}`);
    if (!res.ok)
        throw new Error(`Errore API: ${res.statusText}`);
    return res.json();
}
export const DataService = {
    async getPosts() {
        return fetchApi("/posts");
    },
    async getUsers() {
        return fetchApi("/users");
    },
    async getPostById(id) {
        return fetchApi(`/posts/${id}`);
    },
    async getCommentsByPostId(id) {
        return fetchApi(`/comments?postId=${id}`);
    }
};
//# sourceMappingURL=data.service.js.map