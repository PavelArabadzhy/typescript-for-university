"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const openBtn = document.getElementById('openModalBtn');
const closeBtn = document.getElementById('closeModalBtn');
const modal = document.getElementById('modal');
const hero = document.querySelector('.hero');
const postsContainer = document.getElementById('postsContainer');
const loadMoreBtn = document.getElementById('loadMoreBtn');
let page = 1;
const limit = 5;
// Modal
openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
modal.addEventListener('click', (e) => {
    if (e.target === modal)
        modal.classList.add('hidden');
});
// Scroll animation
window.addEventListener('scroll', () => {
    if (window.scrollY > 20)
        hero.classList.add('scrolled');
    else
        hero.classList.remove('scrolled');
});
// Fetch posts
function fetchPosts() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`);
        return res.json();
    });
}
function renderPosts(posts) {
    posts.forEach((p) => {
        const div = document.createElement('div');
        div.className = 'post';
        div.innerHTML = `<h3>${p.id}. ${p.title}</h3><p>${p.body}</p>`;
        postsContainer.appendChild(div);
    });
}
// Initial load
(() => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield fetchPosts();
    renderPosts(posts);
}))();
// Load More
loadMoreBtn.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    page++;
    const posts = yield fetchPosts();
    renderPosts(posts);
}));
