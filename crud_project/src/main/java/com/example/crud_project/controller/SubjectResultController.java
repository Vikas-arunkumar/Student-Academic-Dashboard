package com.example.crud_project.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.http.ResponseEntity;

import com.example.crud_project.dto.LeaderboardDTO;
import com.example.crud_project.dto.SemesterGpasDTO;
import com.example.crud_project.entity.Student;
import com.example.crud_project.entity.SubjectResult;
import com.example.crud_project.repository.StudentRepository;
import com.example.crud_project.repository.SubjectResultRepository;
import com.example.crud_project.service.AcademicService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class SubjectResultController {
    @Autowired
    private SubjectResultRepository subjectrepo;

    @Autowired
    private StudentRepository studentrepo;

    @Autowired
    private AcademicService academicservice;

    @PostMapping("/students/{id}/subjects")
    public ResponseEntity<?> addSubject(@PathVariable long id, @RequestBody SubjectResult subject)
    {
        if (subject.getCredits() < 1 || subject.getCredits() > 4) {
            return ResponseEntity.badRequest().body("Credits must be between 1 and 4.");
        }
        Student student=studentrepo.findById(id).orElse(null);
        if (student == null)
        {
            return ResponseEntity.notFound().build();
        }
        subject.setStudent(student);
        return ResponseEntity.ok(subjectrepo.save(subject));
    }
    @GetMapping("/students/{id}/subjects")
    public List<SubjectResult> getSubjects(@PathVariable long id)
    {
        return subjectrepo.findByStudentId(id);
    }
    @DeleteMapping("/subjects/{id}")
    public String deleteSubject(@PathVariable long id)
    {
        subjectrepo.deleteById(id);
        return "Subject Deleted";
    }
    @GetMapping("/students/{id}/gpa/{semester}")
    public double getGpa(@PathVariable long id,@PathVariable int semester)
    {
        return academicservice.calculateGpa(id,semester);
    }
    @GetMapping("/students/{id}/cgpa")
    public double getCgpa(@PathVariable long id)
    {
        return academicservice.calculateCgpa(id);
    }
    @GetMapping("/students/{id}/arrears")
    public int calcArrears(@PathVariable long id)
    {
        return academicservice.getArrears(id);
    }
    @PutMapping("/subjects/{id}")
    public ResponseEntity<?> updateSubject(@PathVariable long id,@RequestBody SubjectResult updatedbody)
    {
        if (updatedbody.getCredits() < 1 || updatedbody.getCredits() > 4) {
            return ResponseEntity.badRequest().body("Credits must be between 1 and 4.");
        }
        SubjectResult subject=subjectrepo.findById(id).orElse(null);
        if(subject==null)
        {
            return ResponseEntity.notFound().build();
        }
        subject.setSubjectname(updatedbody.getSubjectname());
        subject.setGrade(updatedbody.getGrade());
        subject.setCredits(updatedbody.getCredits());
        subject.setSemester(updatedbody.getSemester());
        return ResponseEntity.ok(subjectrepo.save(subject));
    }
    @GetMapping("/students/{id}/semester-gpas")
    public List<SemesterGpasDTO>
    getSemesterGpas(@PathVariable long id)
    {
        return academicservice.getSemesterGpas(id);
    }
    @GetMapping("/students/{id}/subjects/{semester}")
    public List<SubjectResult>getSubjectsBySemester(
        @PathVariable long id,
        @PathVariable int semester)
    {
    return subjectrepo
            .findByStudentIdAndSemester(
                    id,
                    semester);
    }   
    @GetMapping("/students/leaderboard")
    public List<LeaderboardDTO> getLeaderboard(@RequestParam Long userId)
    {
    return academicservice
            .getLeaderboard(userId);
    }
}
