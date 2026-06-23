import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
    Pencil,
    Save,
    Trash2,
    X
} from "lucide-react";
import CustomDialog from "./ui/CustomDialog";

function SubjectTable({studentId,semester,refreshStudent,studentRefreshTrigger})
{
    const[subjects,setsubjects]=useState([]);
    const [editingSubject,
       setEditingSubject]
       = useState(null);
    const [editError, setEditError] = useState("");
    const errorTimeoutRef = useRef(null);

    const setErrorWithTimeout = (msg) => {
        setEditError(msg);
        if (errorTimeoutRef.current) {
            clearTimeout(errorTimeoutRef.current);
        }
        if (msg) {
            errorTimeoutRef.current = setTimeout(() => {
                setEditError("");
            }, 3000);
        }
    };

    const [dialogConfig, setDialogConfig] = useState({
        isOpen: false,
        title: "",
        message: "",
        confirmText: "Confirm",
        onConfirm: () => {},
        onCancel: () => {}
    });
    useEffect(()=>
    {
        if(!studentId||!semester)
        {
            return ;
        }

        axios
            .get(
                `http://localhost:8080/students/${studentId}/subjects/${semester}`
            )
            .then((response)=>
            {
                setsubjects(response.data);
            })
            .catch((error)=>
            {
                console.log(error);
            });
    },[studentId,semester,studentRefreshTrigger]);
    const handleDeleteSubject = (id) => {
        setDialogConfig({
            isOpen: true,
            title: "Delete Subject",
            message: "Are you sure you want to delete this subject? This will recalculate the student's GPA and CGPA.",
            confirmText: "Delete",
            onConfirm: () => {
                axios.delete(`http://localhost:8080/subjects/${id}`)
                    .then(() => {
                        console.log("Delete successful");
                        refreshStudent();
                        setDialogConfig(prev => ({ ...prev, isOpen: false }));
                    })
                    .catch((error) => {
                        console.log(error);
                        setDialogConfig(prev => ({ ...prev, isOpen: false }));
                    });
            },
            onCancel: () => setDialogConfig(prev => ({ ...prev, isOpen: false }))
        });
    };

    const handleUpdateSubject = () => {
        const credNum = Number(editingSubject.credits);
        if (isNaN(credNum) || credNum < 1 || credNum > 4) {
            setErrorWithTimeout("Credits must be between 1 and 4.");
            return;
        }
        setErrorWithTimeout("");
        axios.put(
            `http://localhost:8080/subjects/${editingSubject.id}`,
            editingSubject
        )
        .then(() => {
            setEditingSubject(null);
            refreshStudent();
        })
        .catch((error) => {
            console.log(error);
            if (error.response && error.response.data) {
                setErrorWithTimeout(error.response.data);
            } else {
                setErrorWithTimeout("Failed to update subject.");
            }
        });
    };
    if(subjects.length === 0)
    {
        return null;
    }

    return(
        <section className="subject-table">
            <h2>Semester {semester} Subjects:</h2>
            <div className="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>Subject </th>
                        <th>Credits</th>
                        <th>Grade</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
    {subjects.map((subject)=>(
        <tr key={subject.id}>

            {
            editingSubject &&
            editingSubject.id === subject.id

            ?

            <>

                <td>
                    <input
                        value={
                            editingSubject.subjectname
                        }
                        onChange={(e)=>
                            setEditingSubject({
                                ...editingSubject,
                                subjectname:
                                    e.target.value
                            })
                        }
                    />
                </td>

                <td>
                    <div style={{ position: "relative" }}>
                        <input
                            type="number"
                            value={
                                editingSubject.credits
                            }
                            onChange={(e)=>{
                                setEditingSubject({
                                    ...editingSubject,
                                    credits:
                                        Number(
                                            e.target.value
                                        )
                                });
                                setErrorWithTimeout("");
                            }}
                        />
                        {editError && <span className="floating-error-bubble table-error">{editError}</span>}
                    </div>
                </td>

                <td>
                    <select
                        value={
                            editingSubject.grade
                        }
                        onChange={(e)=>
                            setEditingSubject({
                                ...editingSubject,
                                grade:
                                    e.target.value
                            })
                        }
                    >
                        <option>O</option>
                        <option>A+</option>
                        <option>A</option>
                        <option>B+</option>
                        <option>B</option>
                        <option>RA</option>
                    </select>
                </td>

                <td>
                    <button
                        className="primary-action save-icon"
                        onClick={
                            handleUpdateSubject
                        }
                    >
                        <Save className="button-icon" aria-hidden="true" />
                        Save
                    </button>

                    <button
                        className="secondary-action cancel-icon"
                        onClick={()=>
                            setEditingSubject(
                                null
                            )
                        }
                    >
                        <X className="button-icon" aria-hidden="true" />
                        Cancel
                    </button>
                </td>

            </>

            :

            <>

                <td>
                    {subject.subjectname}
                </td>

                <td>
                    {subject.credits}
                </td>

                <td>
                    {subject.grade}
                </td>

                <td>

                    <button
                        className="secondary-action edit-icon"
                        onClick={() =>
                            setEditingSubject(
                                {...subject}
                            )
                        }
                    >
                        <Pencil className="button-icon" aria-hidden="true" />
                        Edit
                    </button>

                    <button
                        className="danger-action delete-icon"
                        onClick={() =>
                            handleDeleteSubject(
                                subject.id
                            )
                        }
                    >
                        <Trash2 className="button-icon" aria-hidden="true" />
                        Delete
                    </button>

                </td>

            </>

            }

        </tr>
    ))}
</tbody>
            </table>
            </div>
            <CustomDialog {...dialogConfig} onCancel={() => setDialogConfig(prev => ({ ...prev, isOpen: false }))} />
        </section>
    );
}
export default SubjectTable;
