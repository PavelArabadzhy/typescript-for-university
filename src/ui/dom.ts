import type { Lesson } from "../types";

/**
 * Безпечний querySelector з приведенням типу HTMLElement.
 * Якщо елемент не знайдено — викидає помилку.
 */
export function getEl(selector: string): HTMLElement {
    const el = document.querySelector(selector);
    if (!el) throw new Error(`Element not found: ${selector}`);
    return el as HTMLElement;
}

/**
 * Рендер масиву постів у контейнер (отримує масив об'єктів з полями title/body).
 */
export function renderPosts(container: HTMLElement, posts: { title: string; body: string }[]): void {
    container.innerHTML = "";
    posts.forEach((p) => {
        const div = document.createElement("div");
        div.className = "post";
        div.innerHTML = `<h4>${escapeHtml(p.title)}</h4><p>${escapeHtml(p.body)}</p>`;
        container.appendChild(div);
    });
}

/**
 * Рендер одного уроку у простому форматі.
 */
export function renderLessonItem(lesson: Lesson): string {
    return `Course ${lesson.courseId} — Prof ${lesson.professorId} — Room ${lesson.classroomNumber} — ${lesson.dayOfWeek} ${lesson.timeSlot}`;
}

function escapeHtml(s: string): string {
    return s.replace(/[&<>"']/g, (m) => {
        switch (m) {
            case "&": return "&amp;";
            case "<": return "&lt;";
            case ">": return "&gt;";
            case '"': return "&quot;";
            case "'": return "&#39;";
            default: return m;
        }
    });
}