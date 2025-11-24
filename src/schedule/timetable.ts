import type {
    Lesson,
    ScheduleConflict,
    TimeSlot,
    DayOfWeek,
} from "../types";
export const schedule: Lesson[] = [];

/**
 * validateLesson: перевіряє на конфлікти (по професору та по аудиторії)
 */
export function validateLesson(lesson: Lesson): ScheduleConflict | null {
    // перевірка конфлікту по професору
    const profConflict = schedule.find(
        (l) =>
            l.professorId === lesson.professorId &&
            l.dayOfWeek === lesson.dayOfWeek &&
            l.timeSlot === lesson.timeSlot
    );
    if (profConflict) {
        return { type: "ProfessorConflict", lessonDetails: profConflict };
    }

    // перевірка конфлікту по аудиторії
    const roomConflict = schedule.find(
        (l) =>
            l.classroomNumber === lesson.classroomNumber &&
            l.dayOfWeek === lesson.dayOfWeek &&
            l.timeSlot === lesson.timeSlot
    );
    if (roomConflict) {
        return { type: "ClassroomConflict", lessonDetails: roomConflict };
    }

    return null;
}

/**
 * addLesson: додає lesson якщо validateLesson повернув null
 */
export function addLesson(lesson: Lesson): boolean {
    const conflict = validateLesson(lesson);
    if (conflict) {
        console.error("Cannot add lesson:", conflict.type, conflict.lessonDetails);
        return false;
    }
    schedule.push(lesson);
    return true;
}

/**
 * findAvailableClassrooms: повертає номери вільних аудиторій у вказаний час
 */
export function findAvailableClassrooms(timeSlot: TimeSlot, dayOfWeek: DayOfWeek, allClassrooms: string[]): string[] {
    const occupied = schedule
        .filter((l) => l.timeSlot === timeSlot && l.dayOfWeek === dayOfWeek)
        .map((l) => l.classroomNumber);
    return allClassrooms.filter((n) => !occupied.includes(n));
}

/**
 * getProfessorSchedule: повертає розклад конкретного професора
 */
export function getProfessorSchedule(professorId: number): Lesson[] {
    return schedule.filter((l) => l.professorId === professorId);
}

/**
 * getClassroomUtilization: % використання аудиторії
 */
export function getClassroomUtilization(classroomNumber: string): number {
    const TOTAL_SLOTS = 5 * 5; // 5 днів * 5 слотів
    if (TOTAL_SLOTS === 0) return 0;
    const occupied = schedule.filter((l) => l.classroomNumber === classroomNumber).length;
    return Math.round(((occupied / TOTAL_SLOTS) * 100) * 10) / 10;
}

/**
 * getMostPopularCourseType: повертає CourseType який найчастіше зустрічається у schedule
 */
export function getMostPopularCourseType(): null {
    console.warn("Course types are not used in this project.");
    return null;
}

/**
 * reassignClassroom: змінює аудиторію для уроку за його індексом у масиві schedule
 */
export function reassignClassroom(lessonIndex: number, newClassroomNumber: string): boolean {
    if (lessonIndex < 0 || lessonIndex >= schedule.length) return false;
    const lesson = schedule[lessonIndex];
    const conflict = schedule.find(
        (l, idx) =>
            idx !== lessonIndex &&
            l.classroomNumber === newClassroomNumber &&
            l.dayOfWeek === lesson.dayOfWeek &&
            l.timeSlot === lesson.timeSlot
    );
    if (conflict) return false;
    schedule[lessonIndex] = { ...lesson, classroomNumber: newClassroomNumber };
    return true;
}

/**
 * cancelLesson: видаляє lesson за індексом
 */
export function cancelLesson(lessonIndex: number): void {
    if (lessonIndex < 0 || lessonIndex >= schedule.length) {
        throw new Error("Invalid lesson index");
    }
    schedule.splice(lessonIndex, 1);
}