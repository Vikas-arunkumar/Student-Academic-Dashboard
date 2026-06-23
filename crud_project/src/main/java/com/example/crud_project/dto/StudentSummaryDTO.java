package com.example.crud_project.dto;

public class StudentSummaryDTO {
    private long id;
    private String studentId;
    private String name;
    private String department;
    private double cgpa;
    private int arrears;

    public StudentSummaryDTO(){

    }
    public long getId()
    {
        return id;
    }
    public void setId(long id)
    {
        this.id=id;
    }
    public String getStudentId()
    {
        return studentId;
    }
    public void setStudentId(String studentId)
    {
        this.studentId=studentId;
    }
    public String getName()
    {
        return name;
    }
    public void setName(String name)
    {
        this.name=name;
    }
    public String getDepartment()
    {
        return department;
    }
    public void setDepartment(String department)
    {
        this.department=department;
    }
    public double getCgpa()
    {
        return cgpa;
    }
    public void setCgpa(double cgpa)
    {
        this.cgpa=cgpa;
    }
    public int getArrears()
    {
        return arrears;
    }
    public void setArrears(int arrears)
    {
        this.arrears=arrears;
    }
    private String gender;
    public String getGender()
    {
        return gender;
    }
    public void setGender(String gender)
    {
        this.gender=gender;
    }
}

