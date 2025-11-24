import { addProfessor } from "./schedule/professors";
import { addClassroom, listClassroomNumbers } from "./schedule/classrooms";
import { addLesson, schedule, findAvailableClassrooms, getProfessorSchedule, getClassroomUtilization, getMostPopularCourseType, reassignClassroom, cancelLesson } from "./schedule/timetable";
import { openModal, closeModal } from "./ui/modal";
import { fetchPosts } from "./api/posts";
import { getEl, renderPosts } from "./ui/dom";
import type { Lesson } from "./types";

console.log("Main init");

// --- seed data ---
addProfessor({ id: 1, name: "Dr. Olena Ivanova", department: "Computer Science" });
addProfessor({ id: 2, name: "Dr. Petro Shevchenko", department: "Mathematics" });

addClassroom({ number: "101", capacity: 40, hasProjector: true });
addClassroom({ number: "102", capacity: 25, hasProjector: false });
addClassroom({ number: "201", capacity: 30, hasProjector: true });


// add lessons via addLesson (it will validate conflicts)
const l1: Lesson = { courseId: 1, professorId: 1, classroomNumber: "101", dayOfWeek: "Monday", timeSlot: "8:30-10:00" };
const l2: Lesson = { courseId: 2, professorId: 2, classroomNumber: "102", dayOfWeek: "Monday", timeSlot: "8:30-10:00" };

console.log("Add lesson 1:", addLesson(l1));
console.log("Add lesson 2:", addLesson(l2));

// UI: modal
try {
    const modalEl = getEl("#modal");
    const openBtn = getEl("#openModalBtn");
    const closeBtn = getEl("#closeModalBtn");

    openBtn.addEventListener("click", () => openModal(modalEl));
    closeBtn.addEventListener("click", () => closeModal(modalEl));
} catch (err) {
    // Якщо немає DOM (наприклад запуск у node), то просто ігноруємо
    console.warn("UI elements not found (maybe running in node).", err);
}

// Fetch example (posts) and render if DOM exists
(async () => {
    try {
        const posts = await fetchPosts(0, 5);
        try {
            const container = getEl("#postsContainer");
            renderPosts(container, posts.map((p: any) => ({ title: p.title, body: p.body })));
        } catch (err) {
            // no DOM
        }
    } catch (err) {
        console.error("Failed to fetch posts", err);
    }
})();

// Examples of other API usage
console.log("Available rooms Monday 10:15-11:45:", findAvailableClassrooms("10:15-11:45", "Monday", listClassroomNumbers()));
console.log("Professor 1 schedule:", getProfessorSchedule(1));
console.log("Room 101 utilization:", getClassroomUtilization("101"), "%");
console.log("Most popular course type:", getMostPopularCourseType());

// modify schedule
const reassignOk = reassignClassroom(0, "102");
console.log("Reassign OK:", reassignOk);

cancelLesson(1); // cancel second
console.log("Schedule after cancel:", schedule);