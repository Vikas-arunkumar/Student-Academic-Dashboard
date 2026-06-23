import { useState,useEffect } from "react";
import axios from "axios";
import {
  LogOut,
  Trophy,
  UserPlus,
  Users,
  BarChart3
} from "lucide-react";

import "./App.css";
import StudentList from "./components/StudentList";
import Leaderboard from "./components/Leaderboard";
import StudentForm from "./components/StudentForm";
import LoginPage from "./components/LoginPage";
import StudentStatistics from "./components/StudentStatistics";
import Aurora from "./components/ui/Aurora";
import ShinyText from "./components/ui/ShinyText";
import CustomDialog from "./components/ui/CustomDialog";

function App() {
  const [isLoggedIn,
       setIsLoggedIn]
       = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const[selectedstudent,setselectedstudent]=useState(null);
  const [,
       setSelectedSemester]
       = useState(null);
  const[students,setStudents]=useState([]);
  const [page,
       setPage]
       = useState("students");
  const [refreshTrigger,
       setRefreshTrigger]
       = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogConfig, setDialogConfig] = useState({
      isOpen: false,
      title: "",
      message: "",
      confirmText: "Confirm",
      onConfirm: () => {},
      onCancel: () => {}
  });
  const refreshDashboard =() =>
  {
    setRefreshTrigger(
        prev => prev + 1
    );
  };
  function fetchStudents(query = "")
  {
    if (!currentUser) return;
    const base = query.trim()
        ? `http://localhost:8080/students/search/${encodeURIComponent(query.trim())}`
        : "http://localhost:8080/students";
    const url = `${base}?userId=${currentUser.id}`;
    axios
        .get(url)
        .then((response) =>
        {
            setStudents(
                response.data
            );
        })
        .catch((error) =>
        {
            console.error(error);
        });
  }
  useEffect(() =>
  {
    if (currentUser) {
      fetchStudents(searchQuery);
    }
  }, [currentUser]);
  const handleStudentSelect = (id) =>
{
    if(
        selectedstudent &&
        selectedstudent.id === id
    )
    {
        setselectedstudent(null);
        setSelectedSemester(null);
        return;
    }

    setSelectedSemester(null);

    axios.get(
        `http://localhost:8080/students/${id}/summary`
    )
    .then(response =>
    {
        setselectedstudent(response.data);
    })
    .catch(error =>
    {
        console.error(error);
    });
};
  const handleDeleteStudent = (id) => {
    setDialogConfig({
      isOpen: true,
      title: "Delete Student",
      message: "Are you sure you want to delete this student? All their academic records will be permanently removed.",
      confirmText: "Delete",
      onConfirm: () => {
        axios.delete(`http://localhost:8080/students/${id}`)
          .then(() => {
            fetchStudents(searchQuery);
            refreshDashboard();
            if (selectedstudent && selectedstudent.id === id) {
              setSelectedSemester(null);
              setselectedstudent(null);
            }
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
  useEffect(() =>
{
    if(!selectedstudent)
    {
        return;
    }

    axios
        .get(
            `http://localhost:8080/students/${selectedstudent.id}/summary`
        )
        .then((response)=>
        {
            setselectedstudent(
                response.data
            );
        });

},[refreshTrigger]);

  return (
    <>
      <Aurora colorStops={['#0a192f', '#14b8a6', '#0070f3']} amplitude={1.5} blend={0.65} speed={0.5} />
      {!isLoggedIn ? (
        <LoginPage
          onLogin={(userData) => {
            setCurrentUser(userData);
            setIsLoggedIn(true);
          }}
        />
      ) : (
        <div className="dashboard-shell">
          {/* Sidebar */}
          <div className="sidebar">
            <h2>Student Hub</h2>
            <div className="sidebar-teacher-info">
              <span className="teacher-label">Teacher</span>
              <span className="teacher-name">{currentUser?.username}</span>
            </div>
            <button className={`menu-btn students-icon ${page === "students" ? "active" : ""}`}
              onClick={() => {
                setselectedstudent(null);
                setSearchQuery("");
                fetchStudents("");
                setPage("students");
              }}
            >
              <Users className="button-icon" aria-hidden="true" />
              Students
            </button>
            <br />
            <br />
            <button className={`menu-btn add-icon ${page === "addStudent" ? "active" : ""}`}
              onClick={() => {
                setselectedstudent(null);
                setPage("addStudent");
              }}
            >
              <UserPlus className="button-icon" aria-hidden="true" />
              Add Student
            </button>
            <br />
            <br />
            <button className={`menu-btn leaderboard-icon ${page === "leaderboard" ? "active" : ""}`}
              onClick={() => {
                setselectedstudent(null);
                setPage("leaderboard");
              }}
            >
              <Trophy className="button-icon" aria-hidden="true" />
              Leaderboard
            </button>
            <br />
            <br />
            <button className={`menu-btn statistics-icon ${page === "statistics" ? "active" : ""}`}
              onClick={() => {
                setselectedstudent(null);
                setPage("statistics");
              }}
            >
              <BarChart3 className="button-icon" aria-hidden="true" />
              Statistics
            </button>
            <br />
            <br />
            <button className="menu-btn logout-icon"
              onClick={() => {
                setDialogConfig({
                  isOpen: true,
                  title: "Logout Confirmation",
                  message: "Are you sure you want to log out of your teacher account?",
                  confirmText: "Logout",
                  onConfirm: () => {
                    setCurrentUser(null);
                    setIsLoggedIn(false);
                    setselectedstudent(null);
                    setSearchQuery("");
                    setPage("students");
                    setDialogConfig(prev => ({ ...prev, isOpen: false }));
                  },
                  onCancel: () => setDialogConfig(prev => ({ ...prev, isOpen: false }))
                });
              }}
            >
              <LogOut className="button-icon" aria-hidden="true" />
              Logout
            </button>
          </div>

          {page === "students" && (
            <main className="content-panel">
              <div className="page-header">
                <p className="eyebrow">Academic command center</p>
                <h1>
                  <ShinyText text="Student Academic Dashboard" />
                </h1>
              </div>
              <div className="search-bar-container">
                <input
                  type="text"
                  placeholder="Search students by Student ID..."
                  value={searchQuery}
                  onChange={(e) => {
                    const val = e.target.value.toUpperCase();
                    setSearchQuery(val);
                    fetchStudents(val);
                  }}
                  style={{ textTransform: "uppercase" }}
                  className="search-input"
                />
              </div>
              <StudentList
                students={students}
                onStudentSelect={handleStudentSelect}
                onDeleteStudent={handleDeleteStudent}
                selectedStudent={selectedstudent}
                refreshDashboard={refreshDashboard}
              />
            </main>
          )}

          {page === "addStudent" && (
            <main className="content-panel">
              <StudentForm
                currentUser={currentUser}
                onStudentAdded={() => {
                  setSearchQuery("");
                  fetchStudents("");
                  refreshDashboard();
                  setselectedstudent(null);
                  setPage("students");
                }}
              />
            </main>
          )}

          {page === "leaderboard" && (
            <main className="content-panel">
              <Leaderboard
                currentUser={currentUser}
                refreshTrigger={refreshTrigger}
              />
            </main>
          )}

          {page === "statistics" && (
            <main className="content-panel">
              <StudentStatistics
                currentUser={currentUser}
                refreshTrigger={refreshTrigger}
              />
            </main>
          )}
        </div>
      )}
      <CustomDialog {...dialogConfig} onCancel={() => setDialogConfig(prev => ({ ...prev, isOpen: false }))} />
    </>
  );
}

export default App;
