package com.example.crud_project.service;


import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.crud_project.dto.LeaderboardDTO;
import com.example.crud_project.dto.SemesterGpasDTO;
import com.example.crud_project.entity.Student;
import com.example.crud_project.entity.SubjectResult;
import com.example.crud_project.repository.StudentRepository;
import com.example.crud_project.repository.SubjectResultRepository;

@Service
public class AcademicService {
    @Autowired
    private StudentRepository studentrepo;
    @Autowired
    private SubjectResultRepository subjectrepo;
    public int GradeToPoint(String grade)
    {
        switch(grade.toUpperCase())
        {
            case "O":
            case "S":
                return 10;
            case "A+":
                return 9;
            case "A":
                return 8;
            case "B+":
                return 7;
            case "B":
                return 6;
            case "C":
                return 5;
            default:
                return 0;
        }
    }
  public double calculateGpa(@PathVariable long id,@PathVariable int semester)
    {            
        List<SubjectResult> subjects=subjectrepo.findByStudentIdAndSemester(id,semester);
        double totalpoints=0;
        int totalcredits=0;

        for(SubjectResult subject:subjects)
        {
            if(subject.getGrade().equalsIgnoreCase("RA"))
        {
            continue;
        }
            int gradepoint=GradeToPoint(subject.getGrade());
            totalpoints +=gradepoint*subject.getCredits();
            totalcredits +=subject.getCredits();
        }
        if(totalcredits==0)
        {
            return 0;
        }
    return (totalpoints/totalcredits);
    }
    public double calculateCgpa(@PathVariable long id)
    {
        List<SubjectResult> subjects=subjectrepo.findByStudentId(id);
        Set<Integer> semesters=new HashSet<>();
        
        if(subjects.isEmpty())
        {
            return 0;
        }
        for (SubjectResult subject:subjects)
        {
            semesters.add(subject.getSemester());
        }
        double totalGpa=0;
        for (int semester:semesters)
        {
            totalGpa+=calculateGpa(id,semester);
        }
        double cgpa=totalGpa/semesters.size();
        return (Math.round(1000.0*cgpa)/1000.0);
    }
    public int getArrears(@PathVariable long id)
    {
        List<SubjectResult> subjects=subjectrepo.findByStudentId(id);
        int arrear=0;
        for (SubjectResult subject:subjects)
        {
            if(GradeToPoint(subject.getGrade())==0)
            {
                arrear++;
            }
        }
        return arrear;
    }
    public List<SemesterGpasDTO> getSemesterGpas(long studentId)
    {
        List<SubjectResult> subjects=subjectrepo.findByStudentId(studentId);
        TreeSet<Integer> semesters=new TreeSet<>();
        for (SubjectResult subject:subjects)
        {
            semesters.add(subject.getSemester());
        }
        List<SemesterGpasDTO> result=new ArrayList<>();
        for(int semester:semesters)
        {
            double gpa=calculateGpa(studentId, semester);
            result.add(new SemesterGpasDTO(semester,gpa));
        }
    return result;
    }
    public List<LeaderboardDTO> getLeaderboard(long userId)
    {
        List<Student> students =studentrepo.findByUserId(userId);
        List<LeaderboardDTO> leaderboard =new ArrayList<>();
    for(Student student : students)
    {
        double cgpa = calculateCgpa(student.getId());
        int arrears =getArrears(student.getId());
        leaderboard.add(
                new LeaderboardDTO(
                        student.getName(),
                        cgpa,
                        arrears));
    }
    leaderboard.sort(
        Comparator
            .comparingInt(
                LeaderboardDTO::getArrears)
            .thenComparing(
                LeaderboardDTO::getCgpa,
                Comparator.reverseOrder())
    );

    return leaderboard;
    }
}
