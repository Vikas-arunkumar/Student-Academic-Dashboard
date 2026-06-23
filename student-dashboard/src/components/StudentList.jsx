import StudentCard
from "./StudentCard";
import { AnimatePresence, motion } from "motion/react";

function StudentList({
    students,
    onStudentSelect,
    selectedStudent,
    onDeleteStudent,
    refreshDashboard
}) {

    return (
        <section className="student-list">

            <h2>Students</h2>

            <motion.div
                className="animated-student-list"
                layout
            >
            <AnimatePresence initial={false}>
            {
                students.map(
                    student =>
                    (
                        <StudentCard
                            key={
                                student.id
                            }

                            student={
                                student
                            }

                            onStudentSelect={
                                onStudentSelect
                            }

                            selectedStudent={
                                selectedStudent
                            }

                            onDeleteStudent={
                                onDeleteStudent
                            }
                            refreshDashboard={refreshDashboard}
                        />
                    )
                )
            }
            </AnimatePresence>
            </motion.div>

        </section>
    );
}

export default StudentList;
