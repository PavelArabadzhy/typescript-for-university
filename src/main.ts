const openBtn = document.getElementById('openModalBtn') as HTMLButtonElement;
const closeBtn = document.getElementById('closeModalBtn') as HTMLButtonElement;
const modal = document.getElementById('modal') as HTMLDivElement;
const hero = document.querySelector('.hero') as HTMLElement;
const postsContainer = document.getElementById('postsContainer') as HTMLDivElement;
const loadMoreBtn = document.getElementById('loadMoreBtn') as HTMLButtonElement;

let page: number = 1;
const limit: number = 5;

// Modal
openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
closeBtn.addEventListener('click', () => modal.classList.add('hidden'));

modal.addEventListener('click', (e: Event) => {
    if (e.target === modal) modal.classList.add('hidden');
});

// Scroll animation
window.addEventListener('scroll', () => {
    if (window.scrollY > 20) hero.classList.add('scrolled');
    else hero.classList.remove('scrolled');
});

// Types
type Post = {
    id: number;
    title: string;
    body: string;
};

// Fetch posts
async function fetchPosts(): Promise<Post[]> {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`);
    return res.json();
}

function renderPosts(posts: Post[]): void {
    posts.forEach((p: Post) => {
        const div = document.createElement('div');
        div.className = 'post';
        div.innerHTML = `<h3>${p.id}. ${p.title}</h3><p>${p.body}</p>`;
        postsContainer.appendChild(div);
    });
}

// Initial load
(async () => {
    const posts = await fetchPosts();
    renderPosts(posts);
})();

// Load More
loadMoreBtn.addEventListener('click', async () => {
    page++;
    const posts = await fetchPosts();
    renderPosts(posts);
});