function StudentSummary({ student }) {

    console.log("StudentSummary got:", student);

    if (!student) {
        return null;
    }

    return (
        <section className="summary-card">
            <h2>Student Summary</h2>

            <div className="summary-grid">
            <p><span>Name</span> {student.name}</p>
            <p><span>Student ID</span> {student.studentId || 'N/A'}</p>

            <p>
                <span>Department</span> {student.department}
            </p>

            <p><span>CGPA</span> {student.cgpa}</p>

            <p>
                <span>Arrears</span> {student.arrears}
            </p>
            </div>
        </section>
    );
}

export default StudentSummary;
