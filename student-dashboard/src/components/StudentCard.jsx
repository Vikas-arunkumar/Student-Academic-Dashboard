import { useState, useRef } from "react";

import axios from "axios";
import {
    ChevronDown,
    ChevronRight,
    Plus,
    Save,
    Trash2
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import StudentSummary from "./StudentSummary";
import SemesterPerformance from "./SemesterPerformance";
import SubjectTable from "./SubjectTable";

function StudentCard({
    student,
    onStudentSelect,
    selectedStudent,
    onDeleteStudent,
    refreshDashboard
}) {

    const [selectedSemester,setSelectedSemester]= useState(null);
    const [showAddForm,setShowAddForm]= useState(false);
    const [semester,setSemester]= useState(1);
    const [subjectname,setSubjectName]= useState("");
    const [credits,setCredits]= useState("");
    const [addError, setAddError] = useState("");
    const errorTimeoutRef = useRef(null);

    const setErrorWithTimeout = (msg) => {
        setAddError(msg);
        if (errorTimeoutRef.current) {
            clearTimeout(errorTimeoutRef.current);
        }
        if (msg) {
            errorTimeoutRef.current = setTimeout(() => {
                setAddError("");
            }, 3000);
        }
    };

    const [studentRefreshTrigger,
       setStudentRefreshTrigger]
       = useState(0);
const refreshStudent = () =>
{
    setStudentRefreshTrigger(
        prev => prev + 1
    );
     refreshDashboard();
};
const [grade,
       setGrade]
       = useState("A");

    const expanded =
        selectedStudent &&
        selectedStudent.id === student.id;

    const handleSemesterSelect = (semesterNumber) =>
    {
        setSelectedSemester(
            previousSemester =>
                previousSemester === semesterNumber
                    ? null
                    : semesterNumber
        );
    };

    const handleAddSubject = () => {
        const credNum = Number(credits);
        if (isNaN(credNum) || credNum < 1 || credNum > 4) {
            setErrorWithTimeout("Credits must be between 1 and 4.");
            return;
        }
        setErrorWithTimeout("");
        axios.post(
            `http://localhost:8080/students/${student.id}/subjects`,
            {
                studentId: student.id,
                semester: semester,
                subjectname: subjectname,
                credits: credNum,
                grade: grade
            }
        )
        .then(() => {
            setSubjectName("");
            setCredits("");
            setGrade("A");
            setSemester(1);
            setShowAddForm(false);
            setErrorWithTimeout("");
            refreshStudent();
        })
        .catch((error) => {
            console.log(error);
            if (error.response && error.response.data) {
                setErrorWithTimeout(error.response.data);
            } else {
                setErrorWithTimeout("Failed to add subject.");
            }
        });
    };

    return (
        <motion.article
            className={`student-card ${expanded ? "expanded" : ""}`}
            layout
            initial={{
                opacity: 0,
                y: 18,
                scale: 0.98
            }}
            animate={{
                opacity: 1,
                y: 0,
                scale: 1
            }}
            exit={{
                opacity: 0,
                x: -24,
                scale: 0.97
            }}
            transition={{
                type: "spring",
                stiffness: 420,
                damping: 34
            }}
        >

            <div
                className="student-card-toggle"
                onClick={() =>
                    onStudentSelect(
                        student.id
                    )
                }
            >
                <span className="toggle-icon">
                    {expanded
                        ? <ChevronDown size={18} aria-hidden="true" />
                        : <ChevronRight size={18} aria-hidden="true" />}
                </span>

                <span>{student.name} <span className="student-card-id">({student.studentId || 'N/A'} • {student.gender || 'N/A'})</span></span>
            </div>

            <AnimatePresence initial={false}>
            {expanded && (
                <motion.div
                    className="student-card-body"
                    layout
                    initial={{
                        opacity: 0,
                        height: 0
                    }}
                    animate={{
                        opacity: 1,
                        height: "auto"
                    }}
                    exit={{
                        opacity: 0,
                        height: 0
                    }}
                    transition={{
                        duration: 0.24,
                        ease: "easeOut"
                    }}
                >

                    <StudentSummary
                        student={
                            selectedStudent
                        }
                    />

                    <SemesterPerformance
                        studentId={
                            student.id
                        }
                        onSemesterSelect={
                            handleSemesterSelect
                        }
                        selectedSemester={
                            selectedSemester
                        }
                        studentRefreshTrigger={studentRefreshTrigger}
                    />

                    {selectedSemester &&
                        (
                            <SubjectTable
                                key={
                                    selectedSemester
                                }
                                studentId={
                                    student.id
                                }
                                semester={
                                    selectedSemester
                                }
                                refreshStudent={refreshStudent}
                                studentRefreshTrigger={studentRefreshTrigger}
                            />
                        )}

                    <div className="card-actions">
                        <button
                            className="danger-action delete-icon"
                            onClick={() =>
                                onDeleteStudent(
                                    student.id
                                )
                            }
                        >
                            <Trash2 className="button-icon" aria-hidden="true" />
                            Delete
                        </button>
                        <button
                            className="secondary-action add-icon"
                            onClick={() =>
                                setShowAddForm(!showAddForm)}
                        >
                            <Plus className="button-icon" aria-hidden="true" />
                            Add Subject
                        </button>
                    </div>
                    {
showAddForm && (

<motion.div
    className="add-subject-form"
    layout
    initial={{
        opacity: 0,
        y: -8
    }}
    animate={{
        opacity: 1,
        y: 0
    }}
    exit={{
        opacity: 0,
        y: -8
    }}
    transition={{
        duration: 0.2
    }}
>

    <h3>Add Subject</h3>

    <div className="field-group">
        <label>Semester</label>
        <select
            value={semester}
            onChange={(e)=>
                setSemester(
                    Number(e.target.value)
                )
            }
        >

            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
            <option value="3">Semester 3</option>
            <option value="4">Semester 4</option>
            <option value="5">Semester 5</option>
            <option value="6">Semester 6</option>
            <option value="7">Semester 7</option>
            <option value="8">Semester 8</option>

        </select>
    </div>

    <div className="field-group">
        <label>Subject Name</label>
        <input
            placeholder="Subject Name"
            value={subjectname}
            onChange={(e)=>
                setSubjectName(
                    e.target.value
                )
            }
        />
    </div>

    <div className="field-group">
        <label>Credits</label>
        <input
            placeholder="Credits"
            type="number"
            value={credits}
            onChange={(e)=>{
                setCredits(e.target.value);
                setErrorWithTimeout("");
            }}
        />
        {addError && <span className="floating-error-bubble">{addError}</span>}
    </div>

    <div className="field-group">
        <label>Grade</label>
        <select
            value={grade}
            onChange={(e)=>
                setGrade(
                    e.target.value
                )
            }
        >

            <option>O</option>
            <option>A+</option>
            <option>A</option>
            <option>B+</option>
            <option>B</option>
            <option>RA</option>

        </select>
    </div>

    <button
        className="primary-action save-icon"
        onClick={
            handleAddSubject
        }
    >
        <Save className="button-icon" aria-hidden="true" />
        Save
    </button>

</motion.div>

)}
                </motion.div>
            )}
            </AnimatePresence>

        </motion.article>
    );
}

export default StudentCard;
