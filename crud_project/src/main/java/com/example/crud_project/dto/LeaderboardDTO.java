package com.example.crud_project.dto;

public class LeaderboardDTO {
    private String name;
    private double cgpa;
    private int arrears;

    public LeaderboardDTO(
            String name,
            double cgpa,
            int arrears)
    {
        this.name = name;
        this.cgpa = cgpa;
        this.arrears = arrears;
    }

    public String getName()
    {
        return name;
    }

    public double getCgpa()
    {
        return cgpa;
    }

    public int getArrears()
    {
        return arrears;
    }
}