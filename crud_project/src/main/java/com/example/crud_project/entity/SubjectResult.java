package com.example.crud_project.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class SubjectResult {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    private int semester;

    private String subjectname;

    private String grade;

    private int credits;

    @ManyToOne
    @JoinColumn(name="student_id")
    private Student student;

    public SubjectResult(){
    }
    public Long getId()
    {
        return id;
    }
    public void setSemester(int semester)
    {
        this.semester=semester;
    }
    public int getSemester()
    {
        return semester;
    }
    public void setSubjectname(String subjectname)
    {
        this.subjectname=subjectname;
    }
    public String getSubjectname()
    {
        return subjectname;
    }
    public void setGrade(String grade)
    {
        this.grade=grade;
    }    
    public String getGrade()
    {
        return grade;
    }
    public void setCredits(int credits)
    {
        this.credits=credits;
    }
    public int getCredits()
    {
        return credits;
    }

    public Student getStudent()
    {
        return student;
    }
    public void setStudent(Student student)
    {
        this.student=student;
    }
}
