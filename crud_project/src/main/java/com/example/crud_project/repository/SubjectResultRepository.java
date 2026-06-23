package com.example.crud_project.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.crud_project.entity.SubjectResult;

public interface SubjectResultRepository
        extends JpaRepository<SubjectResult, Long> {
            List<SubjectResult> findByStudentId(long StudentId);
            List<SubjectResult> findByStudentIdAndSemester(long StudentId,int semester);
}