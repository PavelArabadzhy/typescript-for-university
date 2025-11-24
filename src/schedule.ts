// src/schedule.ts
// Розробка системи управління розкладом в університеті
// Усі типи і функції реалізовані відповідно до завдання.
// Примітка: lessonId в функціях reassignClassroom і cancelLesson
// інтерпретується як індекс в масиві `schedule`, бо тип Lesson у ТЗ не містить поля id.

// =========================
//  1. БАЗОВІ ТИПИ
// =========================

type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";

type TimeSlot =
    | "8:30-10:00"
    | "10:15-11:45"
    | "12:15-13:45"
    | "14:00-15:30"
    | "15:45-17:15";

type CourseType = "Lecture" | "Seminar" | "Lab" | "Practice";

// =========================
//  2. ОСНОВНІ СТРУКТУРИ
// =========================

type Professor = {
    id: number;
    name: string;
    department: string;
};

type Classroom = {
    number: string; // номер аудиторії як рядок
    capacity: number;
    hasProjector: boolean;
};

type Course = {
    id: number;
    name: string;
    type: CourseType;
};

type Lesson = {
    courseId: number;
    professorId: number;
    classroomNumber: string;
    dayOfWeek: DayOfWeek;
    timeSlot: TimeSlot;
};

// =========================
//  3. ОБРОБКА КОНФЛІКТІВ
// =========================

type ScheduleConflict = {
    type: "ProfessorConflict" | "ClassroomConflict";
    lessonDetails: Lesson;
};

// =========================
//  4. МАСИВИ (СХОВИЩЕ)
// =========================

let professors: Professor[] = [];
let classrooms: Classroom[] = [];
let courses: Course[] = [];
let schedule: Lesson[] = [];

// =========================
//  5. ФУНКЦІЇ ДЛЯ РОБОТИ З ДАНИМИ
// =========================

/**
 * Додає нового професора у масив professors.
 */
function addProfessor(professor: Professor): void {
    // Перевірка на унікальність id (необов'язково, але корисно)
    if (professors.some((p) => p.id === professor.id)) {
        console.warn(`Professor with id=${professor.id} already exists. Skipping add.`);
        return;
    }
    professors.push(professor);
    console.log(`Added professor: ${professor.name} (id=${professor.id})`);
}

/**
 * Перевіряє, чи новий lesson не створює конфліктів.
 * Повертає ScheduleConflict або null.
 */
function validateLesson(lesson: Lesson): ScheduleConflict | null {
    // Перевірка конфлікту по професору
    const professorConflict = schedule.find(
        (l) =>
            l.professorId === lesson.professorId &&
            l.dayOfWeek === lesson.dayOfWeek &&
            l.timeSlot === lesson.timeSlot
    );

    if (professorConflict) {
        return {
            type: "ProfessorConflict",
            lessonDetails: professorConflict,
        };
    }

    // Перевірка конфлікту по аудиторії
    const classroomConflict = schedule.find(
        (l) =>
            l.classroomNumber === lesson.classroomNumber &&
            l.dayOfWeek === lesson.dayOfWeek &&
            l.timeSlot === lesson.timeSlot
    );

    if (classroomConflict) {
        return {
            type: "ClassroomConflict",
            lessonDetails: classroomConflict,
        };
    }

    return null;
}

/**
 * Додає заняття в schedule якщо validateLesson повертає null.
 * Повертає true, якщо додано; false при конфлікті.
 */
function addLesson(lesson: Lesson): boolean {
    const conflict = validateLesson(lesson);
    if (conflict) {
        console.error(`Cannot add lesson — conflict: ${conflict.type}`, conflict.lessonDetails);
        return false;
    }
    schedule.push(lesson);
    console.log(
        `Lesson added: courseId=${lesson.courseId}, profId=${lesson.professorId}, room=${lesson.classroomNumber}, ${lesson.dayOfWeek} ${lesson.timeSlot}`
    );
    return true;
}

/**
 * Повертає масив номерів аудиторій, що вільні у вказаний timeSlot і dayOfWeek.
 */
function findAvailableClassrooms(timeSlot: TimeSlot, dayOfWeek: DayOfWeek): string[] {
    const occupied = schedule
        .filter((l) => l.timeSlot === timeSlot && l.dayOfWeek === dayOfWeek)
        .map((l) => l.classroomNumber);

    return classrooms.filter((c) => !occupied.includes(c.number)).map((c) => c.number);
}

/**
 * Повертає розклад (масив Lesson) для конкретного професора.
 */
function getProfessorSchedule(professorId: number): Lesson[] {
    return schedule.filter((l) => l.professorId === professorId);
}

/**
 * Повертає відсоток використання аудиторії: (occupiedSlots / totalPossibleSlots) * 100
 * Ми вважаємо робочий тиждень як 5 днів (Mon-Fri) і 5 слотів на день → 25 можливих слотів.
 * Повертає число (0..100). Якщо потрібно округлення — тут повертаємо число з одним знаком після коми.
 */
function getClassroomUtilization(classroomNumber: string): number {
    const totalSlots = 5 * 5; // 5 днів * 5 слотів
    if (totalSlots === 0) return 0;

    const occupiedSlots = schedule.filter((l) => l.classroomNumber === classroomNumber).length;
    const percent = (occupiedSlots / totalSlots) * 100;
    return Math.round(percent * 10) / 10; // округлюємо до 0.1 %
}

/**
 * Повертає CourseType, який зустрічається найчастіше у розкладі.
 * Якщо є кілька з однаковою кількістю — повертається один з них (детерміновано).
 */
function getMostPopularCourseType(): CourseType {
    const counts: { [K in CourseType]: number } = {
        Lecture: 0,
        Seminar: 0,
        Lab: 0,
        Practice: 0,
    };

    for (const lesson of schedule) {
        const course = courses.find((c) => c.id === lesson.courseId);
        if (course) {
            counts[course.type] = (counts[course.type] || 0) + 1;
        }
    }

    // знайти максимальний
    let best: CourseType = "Lecture";
    let bestCount = -1;
    (["Lecture", "Seminar", "Lab", "Practice"] as CourseType[]).forEach((t) => {
        if (counts[t] > bestCount) {
            bestCount = counts[t];
            best = t;
        }
    });

    return best;
}

/**
 * Змінює аудиторію для уроку з індексом lessonId в масиві schedule на newClassroomNumber,
 * якщо в newClassroomNumber немає конфлікту в той же dayOfWeek/timeSlot.
 * lessonId тут — ІНДЕКС у масиві schedule (0..schedule.length-1).
 * Повертає true якщо успішно, false якщо помилка/конфлікт.
 */
function reassignClassroom(lessonId: number, newClassroomNumber: string): boolean {
    if (lessonId < 0 || lessonId >= schedule.length) {
        console.error("reassignClassroom: lessonId out of range");
        return false;
    }

    const lesson = schedule[lessonId];

    // перевірка на конфлікт у новій аудиторії
    const conflict = schedule.find(
        (l, idx) =>
            idx !== lessonId &&
            l.classroomNumber === newClassroomNumber &&
            l.dayOfWeek === lesson.dayOfWeek &&
            l.timeSlot === lesson.timeSlot
    );

    if (conflict) {
        console.error("reassignClassroom: new classroom is occupied at that time", conflict);
        return false;
    }

    schedule[lessonId] = { ...lesson, classroomNumber: newClassroomNumber };
    console.log(`Reassigned lesson at index ${lessonId} to classroom ${newClassroomNumber}`);
    return true;
}

/**
 * Видаляє урок з розкладу за індексом lessonId (index в масиві schedule).
 * Якщо lessonId не знайдено — виводиться помилка.
 */
function cancelLesson(lessonId: number): void {
    if (lessonId < 0 || lessonId >= schedule.length) {
        console.error("cancelLesson: lessonId out of range");
        return;
    }
    schedule.splice(lessonId, 1);
    console.log(`Cancelled lesson at index ${lessonId}`);
}

// =========================
//  6. ПРИКЛАД ВИКОРИСТАННЯ / ТЕСТИ
// =========================

console.log("--- Seeding sample data ---");

// Professors
addProfessor({ id: 1, name: "Dr. Olena Ivanova", department: "Computer Science" });
addProfessor({ id: 2, name: "Dr. Petro Shevchenko", department: "Mathematics" });

// Classrooms
classrooms.push({ number: "101", capacity: 40, hasProjector: true });
classrooms.push({ number: "102", capacity: 25, hasProjector: false });
classrooms.push({ number: "201", capacity: 30, hasProjector: true });

// Courses
courses.push({ id: 1, name: "Algorithms", type: "Lecture" });
courses.push({ id: 2, name: "Linear Algebra", type: "Seminar" });
courses.push({ id: 3, name: "Physics Lab", type: "Lab" });

// Add lessons (by using addLesson -> it will validate conflicts)
console.log("\n--- Adding lessons ---");
addLesson({ courseId: 1, professorId: 1, classroomNumber: "101", dayOfWeek: "Monday", timeSlot: "8:30-10:00" });
addLesson({ courseId: 2, professorId: 2, classroomNumber: "102", dayOfWeek: "Monday", timeSlot: "8:30-10:00" });

// try adding conflict professor (same prof/time)
console.log("\n--- Trying to add conflicting lesson (professor) ---");
addLesson({ courseId: 3, professorId: 1, classroomNumber: "201", dayOfWeek: "Monday", timeSlot: "8:30-10:00" });

// try adding conflict classroom
console.log("\n--- Trying to add conflicting lesson (classroom) ---");
addLesson({ courseId: 3, professorId: 2, classroomNumber: "101", dayOfWeek: "Monday", timeSlot: "8:30-10:00" });

// Find available classrooms
console.log("\n--- Query available classrooms ---");
console.log("Available on Monday 10:15-11:45:", findAvailableClassrooms("10:15-11:45", "Monday"));

// Professor schedule
console.log("\n--- Professor schedule ---");
console.log("Professor 1 schedule:", getProfessorSchedule(1));

// Classroom utilization
console.log("\n--- Classroom utilization ---");
console.log("101 utilization:", getClassroomUtilization("101"), "%");

// Most popular course type
console.log("\n--- Most popular course type ---");
console.log("Most popular:", getMostPopularCourseType());

// Reassign classroom and cancel
console.log("\n--- Modify schedule ---");
console.log("Current schedule (before):", JSON.stringify(schedule, null, 2));
const successReassign = reassignClassroom(0, "102"); // try move first lesson to "102" (may conflict)
console.log("Reassign success:", successReassign);
console.log("Schedule after reassign attempt:", JSON.stringify(schedule, null, 2));

// Cancel a lesson
cancelLesson(1); // remove second lesson by index (if exists)
console.log("Schedule after cancel:", JSON.stringify(schedule, null, 2));

// Final reports
console.log("\n--- Final reports ---");
console.log("Available on Monday 8:30-10:00:", findAvailableClassrooms("8:30-10:00", "Monday"));
console.log("Professor 2 schedule:", getProfessorSchedule(2));
console.log("Room 101 utilization:", getClassroomUtilization("101"), "%");
console.log("Most popular course type:", getMostPopularCourseType());