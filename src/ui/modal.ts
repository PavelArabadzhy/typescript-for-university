/**
 * Відкриває модальне вікно (видаляє клас 'hidden').
 */
export function openModal(modalEl: HTMLElement): void {
    modalEl.classList.remove("hidden");
}

/**
 * Закриває модальне вікно (додає клас 'hidden').
 */
export function closeModal(modalEl: HTMLElement): void {
    modalEl.classList.add("hidden");
}