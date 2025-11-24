import type { Classroom } from "../types";

export const classrooms: Classroom[] = [];

/**
 * Додає аудиторію (якщо номер унікальний).
 */
export function addClassroom(room: Classroom): void {
    if (classrooms.some((r) => r.number === room.number)) {
        console.warn(`Classroom ${room.number} already exists`);
        return;
    }
    classrooms.push(room);
}

/**
 * Повертає список номерів аудиторій
 */
export function listClassroomNumbers(): string[] {
    return classrooms.map((c) => c.number);
}