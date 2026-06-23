package com.example.crud_project.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.crud_project.entity.Student;
public interface StudentRepository
        extends JpaRepository<Student, Long> {
        List<Student> findByDepartment(String department);
        List<Student> findByUserId(Long userId);
        List<Student> findByUserIdAndStudentIdContaining(Long userId, String studentId);
        boolean existsByStudentId(String studentId);
}
