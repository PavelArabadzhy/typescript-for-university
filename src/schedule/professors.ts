import type { Professor } from "../types";

export const professors: Professor[] = [];

/**
 * Додає нового професора.
 */
export function addProfessor(prof: Professor): void {
    if (professors.some((p) => p.id === prof.id)) {
        console.warn(`Professor with id=${prof.id} already exists`);
        return;
    }
    professors.push(prof);
}

/**
 * Повертає професора по id або null.
 */
export function findProfessor(id: number): Professor | null {
    return professors.find((p) => p.id === id) ?? null;
}