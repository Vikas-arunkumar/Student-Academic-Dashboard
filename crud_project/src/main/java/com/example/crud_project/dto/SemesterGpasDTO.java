package com.example.crud_project.dto;

public class SemesterGpasDTO {
    private int semester;
    private double gpa;

    public SemesterGpasDTO(int semester,double gpa)
    {
        this.semester=semester;
        this.gpa=gpa;
    }
    public int getSemester()
    {
        return semester;
    }
    public double getGpa()    
    {
        return gpa;
    }    
}
