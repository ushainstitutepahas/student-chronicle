
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FileDown, FileJson } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { Exam, Student, ExamWithStudents } from "@/models/types";

const Export = () => {
  const { toast } = useToast();
  const [exams, setExams] = useState<Exam[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>("");
  
  // Load exams and students from localStorage
  useEffect(() => {
    const savedExams = localStorage.getItem("exams");
    if (savedExams) {
      setExams(JSON.parse(savedExams));
    }
    
    const savedStudents = localStorage.getItem("students");
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }
  }, []);
  
  const generateCSV = () => {
    if (!selectedExamId) {
      toast({
        title: "Error",
        description: "Please select an exam first.",
        variant: "destructive"
      });
      return;
    }
    
    const selectedExam = exams.find(exam => exam.id === selectedExamId);
    if (!selectedExam) return;
    
    // Get students for the selected exam
    const examStudents = students.filter(student => 
      selectedExam.studentIds.includes(student.id)
    );
    
    // CSV Header
    const csvHeader = "Student Name,Roll Number,Class,Section,Phone Number,Address,Father's Name,Father's Phone,Login Email,Username,Password\n";
    
    // CSV Rows
    const csvRows = examStudents.map(student => {
      return [
        student.studentName,
        student.rollNumber,
        student.courseName,
        "A", // Default section
        student.mobileNumber,
        "N/A", // Address not collected
        student.fatherName,
        "N/A", // Father's phone not collected
        student.email,
        student.username,
        "changeme123" // Default password
      ].join(",");
    }).join("\n");
    
    // Complete CSV Content
    const csvContent = csvHeader + csvRows;
    
    // Create and download the CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Students_${selectedExam.examCode}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: `${examStudents.length} student records exported for ${selectedExam.examCode}.`
    });
  };
  
  const generateJSON = () => {
    // Format students data for JSON
    const jsonData = {
      students: students.map(student => ({
        "Roll Number": student.rollNumber.toString(),
        "Student Name": student.studentName,
        "Username": student.username
      }))
    };
    
    // Create and download the JSON file
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "all_students.json");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "JSON Export Successful",
      description: `JSON data for ${students.length} students has been exported.`
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-usha-blue mb-6">Data Export</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileDown className="mr-2 h-5 w-5 text-usha-blue" />
                Export Student Data (CSV)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="examSelect">Select Exam</Label>
                  <Select value={selectedExamId} onValueChange={setSelectedExamId}>
                    <SelectTrigger id="examSelect">
                      <SelectValue placeholder="Choose an exam" />
                    </SelectTrigger>
                    <SelectContent>
                      {exams.length > 0 ? (
                        exams.map(exam => (
                          <SelectItem key={exam.id} value={exam.id}>
                            {exam.examCode} ({new Date(exam.examDate).toLocaleDateString()})
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>No exams available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={generateCSV} 
                  className="w-full bg-usha-blue hover:bg-usha-lightblue"
                  disabled={!selectedExamId || exams.length === 0}
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  Download CSV
                </Button>
                
                {exams.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    No exams available. Create an exam with assigned students first.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileJson className="mr-2 h-5 w-5 text-usha-blue" />
                Export All Students (JSON)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Generate a JSON file containing all registered students' information. 
                  This file can be used for viewing student data via a dedicated URL.
                </p>
                
                <Button 
                  onClick={generateJSON} 
                  className="w-full bg-usha-blue hover:bg-usha-lightblue"
                  disabled={students.length === 0}
                >
                  <FileJson className="mr-2 h-4 w-4" />
                  Download JSON
                </Button>
                
                {students.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    No students available. Register students first.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Export;
