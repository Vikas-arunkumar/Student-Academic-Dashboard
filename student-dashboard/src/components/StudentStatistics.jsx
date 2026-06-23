import { useState, useEffect } from "react";
import axios from "axios";
import { Users, AlertTriangle, TrendingUp, BarChart3, Info } from "lucide-react";

export default function StudentStatistics({ currentUser, refreshTrigger }) {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [hoveredPoint, setHoveredPoint] = useState(null); // { index, name, cgpa, x, y }
    const [hoveredBar, setHoveredBar] = useState(null); // semester

    useEffect(() => {
        if (!currentUser) return;
        setLoading(true);
        setError("");

        axios.get(`http://localhost:8080/students/stats?userId=${currentUser.id}`)
            .then(response => {
                setStats(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("Failed to fetch statistics. Please check if your backend is running.");
                setLoading(false);
            });
    }, [currentUser, refreshTrigger]);

    if (loading) {
        return (
            <div className="stats-loading">
                <div className="spinner"></div>
                <p>Analyzing academic data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="stats-error">
                <AlertTriangle className="error-icon" size={48} />
                <p>{error}</p>
            </div>
        );
    }

    if (!stats || stats.totalStudents === 0) {
        return (
            <div className="stats-empty">
                <Info className="info-icon" size={48} />
                <h2>No Statistics Available</h2>
                <p>Add students and their subjects to see CGPA and performance metrics here.</p>
            </div>
        );
    }

    const { totalStudents, totalArrears, studentCgpas, semesterGpas } = stats;

    // Filter and compute gender performance highlights
    const maleStudents = studentCgpas.filter(s => s.gender && s.gender.toLowerCase() === "male");
    const femaleStudents = studentCgpas.filter(s => s.gender && s.gender.toLowerCase() === "female");

    const sortedMales = [...maleStudents].sort((a, b) => b.cgpa - a.cgpa);
    const highestMale = sortedMales.length > 0 ? sortedMales[0] : null;
    const lowestMale = sortedMales.length > 0 ? sortedMales[sortedMales.length - 1] : null;

    const sortedFemales = [...femaleStudents].sort((a, b) => b.cgpa - a.cgpa);
    const highestFemale = sortedFemales.length > 0 ? sortedFemales[0] : null;
    const lowestFemale = sortedFemales.length > 0 ? sortedFemales[sortedFemales.length - 1] : null;

    // Line Chart Dimensions
    const lineW = 600;
    const lineH = 260;
    const padding = 40;

    // Convert Semester GPAs map to array
    const semesterData = Object.keys(semesterGpas).map(sem => ({
        semester: Number(sem),
        gpa: semesterGpas[sem]
    })).sort((a, b) => a.semester - b.semester);

    // Sort students by CGPA to show distribution/trend line
    const sortedCgpaData = [...studentCgpas].sort((a, b) => a.cgpa - b.cgpa);

    // Map student CGPAs to line chart coordinates
    const getLineCoords = () => {
        if (sortedCgpaData.length === 0) return [];
        return sortedCgpaData.map((d, index) => {
            const x = padding + (index * (lineW - 2 * padding)) / Math.max(1, sortedCgpaData.length - 1);
            // Y inverted in SVG, 10.0 CGPA maps to top of graph, 0.0 to bottom
            const y = lineH - padding - (d.cgpa * (lineH - 2 * padding)) / 10;
            return { x, y, name: d.name, cgpa: d.cgpa };
        });
    };

    const points = getLineCoords();
    
    // Construct SVG path for line
    let pathD = "";
    if (points.length > 0) {
        pathD = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            pathD += ` L ${points[i].x} ${points[i].y}`;
        }
    }

    // Construct SVG path for gradient area below line
    let areaD = "";
    if (points.length > 0) {
        areaD = `${pathD} L ${points[points.length - 1].x} ${lineH - padding} L ${points[0].x} ${lineH - padding} Z`;
    }

    // Bar Chart Dimensions
    const barW = 600;
    const barH = 260;
    const barPadding = 50;
    const maxBarHeight = barH - 2 * barPadding;

    return (
        <div className="statistics-view">
            <div className="page-header">
                <p className="eyebrow">Academic analytics</p>
                <h1>Student Statistics</h1>
            </div>

            {/* Stat Cards Row */}
            <div className="stats-summary-row">
                <div className="stat-summary-card">
                    <div className="stat-card-icon-wrap students-blue">
                        <Users size={24} />
                    </div>
                    <div className="stat-card-info">
                        <span>Total Students</span>
                        <h2>{totalStudents}</h2>
                    </div>
                </div>

                <div className="stat-summary-card">
                    <div className="stat-card-icon-wrap arrears-red">
                        <AlertTriangle size={24} />
                    </div>
                    <div className="stat-card-info">
                        <span>Total Arrears</span>
                        <h2>{totalArrears}</h2>
                    </div>
                </div>

                <div className="stat-summary-card">
                    <div className="stat-card-icon-wrap cgpa-teal">
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-card-info">
                        <span>Class Avg CGPA</span>
                        <h2>
                            {(
                                sortedCgpaData.reduce((acc, curr) => acc + curr.cgpa, 0) / 
                                Math.max(1, totalStudents)
                            ).toFixed(2)}
                        </h2>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="stats-charts-grid">
                
                {/* CGPA Trend Line Graph */}
                <div className="chart-card">
                    <div className="chart-header">
                        <TrendingUp className="chart-title-icon" />
                        <h2>Overall CGPA Trends (Distribution)</h2>
                    </div>
                    <div className="chart-container">
                        <svg viewBox={`0 0 ${lineW} ${lineH}`} className="stats-svg">
                            <defs>
                                <linearGradient id="cgpaGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#14b8a6" stopOpacity="1" />
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="1" />
                                </linearGradient>
                                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.25" />
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                                </linearGradient>
                                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="4" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>
                            </defs>
                            
                            {/* Horizontal Grid Lines */}
                            {[0, 2.5, 5, 7.5, 10].map((val, idx) => {
                                const y = lineH - padding - (val * (lineH - 2 * padding)) / 10;
                                return (
                                    <g key={idx} className="grid-group">
                                        <line x1={padding} y1={y} x2={lineW - padding} y2={y} stroke="rgba(255, 255, 255, 0.05)" strokeWidth={1} />
                                        <text x={padding - 10} y={y + 4} fill="var(--muted)" fontSize={10} textAnchor="end">{val}</text>
                                    </g>
                                );
                            })}

                            {/* Line Path Area */}
                            {areaD && <path d={areaD} fill="url(#areaGrad)" />}
                            
                            {/* Trend Line */}
                            {pathD && <path d={pathD} fill="none" stroke="url(#cgpaGrad)" strokeWidth={3} filter="url(#glow)" />}

                            {/* Data points (circles) */}
                            {points.map((pt, idx) => (
                                <circle 
                                    key={idx} 
                                    cx={pt.x} 
                                    cy={pt.y} 
                                    r={hoveredPoint?.index === idx ? 7 : 4} 
                                    fill={hoveredPoint?.index === idx ? "#ffffff" : "#14b8a6"} 
                                    stroke="var(--paper-solid)" 
                                    strokeWidth={2}
                                    style={{ transition: "all 0.15s ease", cursor: "pointer" }}
                                    onMouseEnter={() => setHoveredPoint({ index: idx, ...pt })}
                                    onMouseLeave={() => setHoveredPoint(null)}
                                />
                            ))}

                            {/* X-Axis labels for students */}
                            <line x1={padding} y1={lineH - padding} x2={lineW - padding} y2={lineH - padding} stroke="rgba(255, 255, 255, 0.15)" strokeWidth={1} />
                            <text x={lineW / 2} y={lineH - 5} fill="var(--muted)" fontSize={11} textAnchor="middle">
                                Students (Sorted by Performance)
                            </text>
                        </svg>

                        {/* Interactive Line Chart Tooltip */}
                        {hoveredPoint && (
                            <div 
                                className="chart-tooltip"
                                style={{
                                    left: `${(hoveredPoint.x / lineW) * 100}%`,
                                    top: `${(hoveredPoint.y / lineH) * 100 - 15}%`
                                }}
                            >
                                <span className="tooltip-name">{hoveredPoint.name}</span>
                                <span className="tooltip-value">CGPA: {hoveredPoint.cgpa.toFixed(2)}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Average GPA per Semester Bar Chart */}
                <div className="chart-card">
                    <div className="chart-header">
                        <BarChart3 className="chart-title-icon" />
                        <h2>Average GPA per Semester</h2>
                    </div>
                    <div className="chart-container">
                        <svg viewBox={`0 0 ${barW} ${barH}`} className="stats-svg">
                            <defs>
                                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="1" />
                                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
                                </linearGradient>
                                <filter id="glow-bar" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="3" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>
                            </defs>

                            {/* Horizontal Grid Lines */}
                            {[0, 2.5, 5, 7.5, 10].map((val, idx) => {
                                const y = barH - barPadding - (val * maxBarHeight) / 10;
                                return (
                                    <g key={idx} className="grid-group">
                                        <line x1={barPadding} y1={y} x2={barW - barPadding} y2={y} stroke="rgba(255, 255, 255, 0.05)" strokeWidth={1} />
                                        <text x={barPadding - 10} y={y + 4} fill="var(--muted)" fontSize={10} textAnchor="end">{val}</text>
                                    </g>
                                );
                            })}

                            {/* Render Bars */}
                            {semesterData.map((d, idx) => {
                                const barWidth = 34;
                                const totalAvailableWidth = barW - 2 * barPadding;
                                const spacing = totalAvailableWidth / 8; // For semesters 1 to 8
                                const x = barPadding + (d.semester - 1) * spacing + (spacing - barWidth) / 2;
                                
                                const valHeight = (d.gpa * maxBarHeight) / 10;
                                const y = barH - barPadding - valHeight;

                                const isHovered = hoveredBar === d.semester;

                                return (
                                    <g key={idx}>
                                        {/* Background hover guide */}
                                        <rect 
                                            x={x - 6} 
                                            y={barPadding} 
                                            width={barWidth + 12} 
                                            height={maxBarHeight} 
                                            fill="rgba(255, 255, 255, 0.01)" 
                                            style={{ cursor: "pointer" }}
                                            onMouseEnter={() => setHoveredBar(d.semester)}
                                            onMouseLeave={() => setHoveredBar(null)}
                                        />

                                        {/* Value Label above bar */}
                                        {d.gpa > 0 && (
                                            <text 
                                                x={x + barWidth / 2} 
                                                y={y - 8} 
                                                fill={isHovered ? "#ffffff" : "var(--muted)"}
                                                fontSize={10} 
                                                fontWeight="bold"
                                                textAnchor="middle"
                                                style={{ transition: "all 0.2s" }}
                                            >
                                                {d.gpa.toFixed(2)}
                                            </text>
                                        )}

                                        {/* Interactive Bar */}
                                        <rect 
                                            x={x} 
                                            y={y} 
                                            width={barWidth} 
                                            height={Math.max(2, valHeight)} 
                                            rx={5} 
                                            ry={5}
                                            fill="url(#barGrad)" 
                                            filter={isHovered ? "url(#glow-bar)" : "none"}
                                            style={{ transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)", cursor: "pointer" }}
                                            onMouseEnter={() => setHoveredBar(d.semester)}
                                            onMouseLeave={() => setHoveredBar(null)}
                                        />

                                        {/* X Axis Label */}
                                        <text 
                                            x={x + barWidth / 2} 
                                            y={barH - barPadding + 20} 
                                            fill={isHovered ? "var(--teal)" : "var(--muted)"}
                                            fontSize={10} 
                                            fontWeight={isHovered ? "bold" : "normal"}
                                            textAnchor="middle"
                                        >
                                            Sem {d.semester}
                                        </text>
                                    </g>
                                );
                            })}

                            <line x1={barPadding} y1={barH - barPadding} x2={barW - barPadding} y2={barH - barPadding} stroke="rgba(255, 255, 255, 0.15)" strokeWidth={1} />
                        </svg>
                    </div>
                </div>

            </div>

            {/* Gender-sorted CGPA Highs and Lows */}
            <div className="gender-breakdown-section">
                <h2>Gender Performance Breakdown</h2>
                <div className="gender-stats-grid">
                    
                    {/* Highest Male CGPA */}
                    <div className="gender-stat-box male-box">
                        <span className="box-title">Highest CGPA (Male)</span>
                        {highestMale ? (
                            <div className="box-content">
                                <h3 className="box-value">{highestMale.cgpa.toFixed(2)}</h3>
                                <span className="box-student-name">{highestMale.name}</span>
                            </div>
                        ) : (
                            <p className="box-empty">N/A</p>
                        )}
                    </div>

                    {/* Lowest Male CGPA */}
                    <div className="gender-stat-box male-box">
                        <span className="box-title">Lowest CGPA (Male)</span>
                        {lowestMale ? (
                            <div className="box-content">
                                <h3 className="box-value">{lowestMale.cgpa.toFixed(2)}</h3>
                                <span className="box-student-name">{lowestMale.name}</span>
                            </div>
                        ) : (
                            <p className="box-empty">N/A</p>
                        )}
                    </div>

                    {/* Highest Female CGPA */}
                    <div className="gender-stat-box female-box">
                        <span className="box-title">Highest CGPA (Female)</span>
                        {highestFemale ? (
                            <div className="box-content">
                                <h3 className="box-value">{highestFemale.cgpa.toFixed(2)}</h3>
                                <span className="box-student-name">{highestFemale.name}</span>
                            </div>
                        ) : (
                            <p className="box-empty">N/A</p>
                        )}
                    </div>

                    {/* Lowest Female CGPA */}
                    <div className="gender-stat-box female-box">
                        <span className="box-title">Lowest CGPA (Female)</span>
                        {lowestFemale ? (
                            <div className="box-content">
                                <h3 className="box-value">{lowestFemale.cgpa.toFixed(2)}</h3>
                                <span className="box-student-name">{lowestFemale.name}</span>
                            </div>
                        ) : (
                            <p className="box-empty">N/A</p>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
