import { useState,useEffect } from "react";
import axios from "axios";
import { Medal } from "lucide-react";

function Leaderboard({refreshTrigger, currentUser})
{
    const[leaders,setLeaders]=useState([]);
    useEffect(()=>
    {
        if (!currentUser) return;
        axios.get(`http://localhost:8080/students/leaderboard?userId=${currentUser.id}`)
        .then((response)=>
        {
        setLeaders(response.data);
    })
    .catch((error)=>
    {
        console.log(error);
    });
},[refreshTrigger, currentUser]);
return (
    <section className="leaderboard">
        <h1>LeaderBoard</h1>
        <div className="table-wrap">
        <table>
                <thead>
                    <tr>
                        <th>
                            Rank
                        </th>

                        <th>
                            Name
                        </th>

                        <th>
                            CGPA
                        </th>

                        <th>
                            Arrears
                        </th>
                    </tr>
                </thead>

                <tbody>

                    {leaders.map(
                        (student,index) => (

                        <tr
                            className={index < 3 ? `rank-row rank-${index + 1}` : ""}
                            key={index}
                        >

                            <td>
                                <span className={index < 3 ? `rank-badge rank-${index + 1}` : "rank-number"}>
                                    <span>{index + 1}</span>
                                    {index < 3 && (
                                        <Medal className="rank-medal" aria-hidden="true" />
                                    )}
                                </span>
                            </td>

                            <td>
                                {student.name}
                            </td>

                            <td>
                                {student.cgpa}
                            </td>

                            <td>
                                {student.arrears}
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>
            </div>

        </section>
    );
}

export default Leaderboard;
