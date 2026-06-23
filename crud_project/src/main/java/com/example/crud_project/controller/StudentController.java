package com.example.crud_project.controller;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.TreeMap;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;


import com.example.crud_project.dto.StudentSummaryDTO;
import com.example.crud_project.entity.Student;
import com.example.crud_project.repository.StudentRepository;
import com.example.crud_project.service.AcademicService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController 
public class StudentController {
    @Autowired
    private StudentRepository repo;
    
    @PostMapping("/students")
    public ResponseEntity<?> addStudent(@RequestBody Student student)
    {
        if (student.getStudentId() != null && repo.existsByStudentId(student.getStudentId())) {
            return ResponseEntity.badRequest().body("Student ID already exists.");
        }
        return ResponseEntity.ok(repo.save(student));
    }
    @GetMapping("/students")
    public List<Student> getStudents(@RequestParam Long userId)
    {
        return repo.findByUserId(userId);
    }
    @GetMapping("/students/{id}")
    public Student getStudentById(@PathVariable Long id)
    {
        return repo.findById(id).orElse(null);
    }
    @DeleteMapping("/students/{id}")
    public String deleteStudent(@PathVariable long id)
    {
        repo.deleteById(id);
        return "student deleted";
    }
    @PutMapping("/students/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable long id, @RequestBody Student updatedstudent)
    {
        Student student=repo.findById(id).orElse(null);
        if(student==null)
        {
            return ResponseEntity.notFound().build();
        }
        if (updatedstudent.getStudentId() != null && !updatedstudent.getStudentId().equals(student.getStudentId())) {
            if (repo.existsByStudentId(updatedstudent.getStudentId())) {
                return ResponseEntity.badRequest().body("Student ID already exists.");
            }
        }
        student.setName(updatedstudent.getName());
        student.setDepartment(updatedstudent.getDepartment());
        student.setStudentId(updatedstudent.getStudentId());
        student.setGender(updatedstudent.getGender());

        return ResponseEntity.ok(repo.save(student));
    }
    @Autowired
    private AcademicService academicservice;

    @GetMapping("/students/{id}/summary")
    public StudentSummaryDTO getStudentSummary(@PathVariable long id)
    {
        Student student=repo.findById(id).orElse(null);
        StudentSummaryDTO dto=new StudentSummaryDTO();
        dto.setId(student.getId());
        dto.setStudentId(student.getStudentId());
        dto.setName(student.getName());
        dto.setDepartment(student.getDepartment());
        dto.setCgpa(academicservice.calculateCgpa(id));
        dto.setArrears(academicservice.getArrears(id));
        dto.setGender(student.getGender());
        return dto;
    }
    @GetMapping("/students/department/{department}")
    public List<Student> getStudentByDepartment(@PathVariable String department)
    {
        return repo.findByDepartment(department);
    }
    @GetMapping("/students/search/{studentId}")
    public List<Student> searchStudentsByStudentId(@PathVariable String studentId, @RequestParam Long userId)
    {
        return repo.findByUserIdAndStudentIdContaining(userId, studentId);
    }
    @GetMapping("/students/stats")
    public Map<String, Object> getTeacherStats(@RequestParam Long userId) {
        List<Student> students = repo.findByUserId(userId);
        int totalStudents = students.size();
        int totalArrears = 0;
        
        List<Map<String, Object>> studentCgpas = new ArrayList<>();
        Map<Integer, Double> semesterGpas = new TreeMap<>();
        
        // Initialize semester sums
        Map<Integer, Double> totalGpaInSem = new HashMap<>();
        Map<Integer, Integer> studentCountInSem = new HashMap<>();
        for (int sem = 1; sem <= 8; sem++) {
            totalGpaInSem.put(sem, 0.0);
            studentCountInSem.put(sem, 0);
        }
        
        for (Student student : students) {
            totalArrears += academicservice.getArrears(student.getId());
            double cgpa = academicservice.calculateCgpa(student.getId());
            Map<String, Object> scMap = new HashMap<>();
            scMap.put("name", student.getName());
            scMap.put("cgpa", cgpa);
            scMap.put("gender", student.getGender());
            studentCgpas.add(scMap);
            
            for (int sem = 1; sem <= 8; sem++) {
                double gpa = academicservice.calculateGpa(student.getId(), sem);
                if (gpa > 0) {
                    totalGpaInSem.put(sem, totalGpaInSem.get(sem) + gpa);
                    studentCountInSem.put(sem, studentCountInSem.get(sem) + 1);
                }
            }
        }
        
        for (int sem = 1; sem <= 8; sem++) {
            int count = studentCountInSem.get(sem);
            double avgGpa = count == 0 ? 0.0 : totalGpaInSem.get(sem) / count;
            semesterGpas.put(sem, Math.round(avgGpa * 100.0) / 100.0);
        }
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStudents", totalStudents);
        stats.put("totalArrears", totalArrears);
        stats.put("studentCgpas", studentCgpas);
        stats.put("semesterGpas", semesterGpas);
        
        return stats;
    }
}
