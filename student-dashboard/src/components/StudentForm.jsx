import { useState } from "react";
import axios from "axios";
import { UserPlus } from "lucide-react";

function StudentForm({onStudentAdded, currentUser})
{
    const[name,setName]=useState("");
    const[studentId,setStudentId]=useState("");
    const[department,setDepartment]=useState("");
    const[gender,setGender]=useState("Male");
    const[error,setError]=useState("");

    const handleSubmit =(e)=>
    {
        e.preventDefault();
        setError("");

        if (!studentId.startsWith("STU") || studentId.length !== 7) {
            setError("Student ID must be exactly 7 characters and start with 'STU' (e.g. STU0001)");
            return;
        }

        axios.post("http://localhost:8080/students",
            {
                name,
                studentId,
                department,
                gender,
                user: { id: currentUser?.id }
            }
        ).then(()=>
        {
            setName("");
            setStudentId("");
            setDepartment("");
            setGender("Male");
            setError("");
            onStudentAdded();
        }).catch((err)=>
        {
            console.log(err);
            if (err.response && err.response.data) {
                setError(err.response.data);
            } else {
                setError("Failed to add student. The Student ID may already exist.");
            }
        });
    };

    return (
        <form className="student-form" onSubmit={handleSubmit}>
            <h2>Add Student</h2>
            <div className="field-group">
                <label>Student Name</label>
                <input type="text" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} required />
            </div>
            <div className="field-group">
                <label>Student ID</label>
                <input 
                    type="text" 
                    placeholder="e.g. STU0001" 
                    value={studentId} 
                    onChange={(e) => {
                        setStudentId(e.target.value.toUpperCase());
                        setError("");
                    }} 
                    style={{ textTransform: "uppercase" }}
                    required 
                />
                {error && <p style={{ color: "var(--coral)", fontWeight: "700", marginTop: "0.5rem", fontSize: "0.85rem" }}>{error}</p>}
            </div>
            <div className="field-group">
                <label>Student Department</label>
                <input type="text" placeholder="Department" value={department} onChange={(e)=>setDepartment(e.target.value)} required />
            </div>
            <div className="field-group">
                <label>Gender</label>
                <select value={gender} onChange={(e)=>setGender(e.target.value)} required>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
            </div>
            <button className="primary-action add-icon" type="submit">
                <UserPlus className="button-icon" aria-hidden="true" />
                Add Student
            </button>
        </form>
    );
}

export default StudentForm;
