import { useEffect,useState } from "react";
import axios from "axios";
import { BarChart3 } from "lucide-react";

function SemesterPerformance({studentId,onSemesterSelect,selectedSemester,studentRefreshTrigger})
{
    const [semesterGpas,setSemesterGpas]=useState([]);
    useEffect(()=>
    {
        if(!studentId)
        {
            return;
        }
    axios.get(`http://localhost:8080/students/${studentId}/semester-gpas`)
    .then((response)=>
    {
        setSemesterGpas(response.data);
    }).catch((error)=>
    {
        console.log(error);
    });
},[studentId,studentRefreshTrigger]);

return(
    <section className="semester-performance">
        <h2>Semester Wise Performance</h2>
        <div className="semester-buttons">
        {semesterGpas.map((sem=>
            (
                <button
                    className={`semester-chip ${selectedSemester === sem.semester ? "active" : ""}`}
                    key={sem.semester}
                    onClick={()=>onSemesterSelect(sem.semester)}
                >
                    <BarChart3 className="button-icon" aria-hidden="true" />
                    Semester {sem.semester}{" | GPA:"}{sem.gpa.toFixed(3)}
                </button>
            )
        ))}
        </div>
    </section>
);
}

export default SemesterPerformance
