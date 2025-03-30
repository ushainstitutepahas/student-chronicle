
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FileDown, FileJson, Download, FileText, Search } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { Exam, Student, ExamWithStudents } from "@/models/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const searchFormSchema = z.object({
  studentName: z.string().min(2, "Name must be at least 2 characters"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
});

const Export = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>("");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [showHallTicket, setShowHallTicket] = useState(false);
  const [showHallTicketSearch, setShowHallTicketSearch] = useState(false);
  const [foundStudent, setFoundStudent] = useState<Student | null>(null);
  const [foundExam, setFoundExam] = useState<Exam | null>(null);
  
  const searchForm = useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      studentName: "",
      dateOfBirth: "",
    },
  });
  
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
    
    const examStudents = students.filter(student => 
      selectedExam.studentIds.includes(student.id)
    );
    
    const csvHeader = "Student Name,Roll Number,Class,Section,Phone Number,Address,Father's Name,Father's Phone,Login Email,Username,Password\n";
    
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
    
    const csvContent = csvHeader + csvRows;
    
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
  
  const viewJSONData = () => {
    navigate("/json");
    
    toast({
      title: "JSON Data Viewer",
      description: "Showing JSON data for all students."
    });
  };
  
  const generateHallTicket = () => {
    if (!selectedExamId || !selectedStudentId) {
      toast({
        title: "Error",
        description: "Please select both an exam and a student.",
        variant: "destructive"
      });
      return;
    }
    
    setShowHallTicket(true);
  };
  
  const searchStudentHallTicket = (data: z.infer<typeof searchFormSchema>) => {
    const student = students.find(
      s => s.studentName.toLowerCase() === data.studentName.toLowerCase() && 
           s.dateOfBirth === data.dateOfBirth
    );
    
    if (!student) {
      toast({
        title: "Student Not Found",
        description: "No student matches the provided name and date of birth.",
        variant: "destructive"
      });
      return;
    }
    
    // Find an exam that includes this student
    const exam = exams.find(e => e.studentIds.includes(student.id));
    if (!exam) {
      toast({
        title: "No Exam Assigned",
        description: "This student has not been assigned to any exam yet.",
        variant: "destructive"
      });
      return;
    }
    
    setFoundStudent(student);
    setFoundExam(exam);
    setShowHallTicketSearch(true);
  };
  
  const HallTicketModal = ({ student = null, exam = null }: { student?: Student | null, exam?: Exam | null }) => {
    const selectedExam = exam || exams.find(e => e.id === selectedExamId);
    const selectedStudent = student || students.find(s => s.id === selectedStudentId);
    
    if (!selectedExam || !selectedStudent) return null;
    
    return (
      <Dialog open={showHallTicket || showHallTicketSearch} 
              onOpenChange={(open) => {
                if (!open) {
                  setShowHallTicket(false);
                  setShowHallTicketSearch(false);
                }
              }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Hall Ticket</DialogTitle>
          </DialogHeader>
          
          <div id="hall-ticket" className="p-4 bg-white border rounded-lg">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <div className="flex items-center gap-3">
                <img 
                  src="https://exam.ushainstitute.com/wp-content/uploads/2025/03/cropped-Usha-Institute-removebg-preview.png" 
                  alt="Usha Institute Logo" 
                  className="h-16 w-auto" 
                  onError={(e) => {
                    e.currentTarget.src = "https://i.ibb.co/PskvV2V/Untitled-design.png";
                  }}
                />
                <div>
                  <h1 className="text-xl font-bold text-usha-blue">Usha Institute</h1>
                  <p className="text-sm text-gray-600">Excellence in Education</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">Exam Hall Ticket</p>
                <p className="text-sm text-gray-600">Date: {new Date(selectedExam.examDate).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-600">Student Name</p>
                <p className="font-semibold">{selectedStudent.studentName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Roll Number</p>
                <p className="font-semibold">{selectedStudent.rollNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Course</p>
                <p className="font-semibold">{selectedStudent.courseName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Username</p>
                <p className="font-semibold">{selectedStudent.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Father's Name</p>
                <p className="font-semibold">{selectedStudent.fatherName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Contact</p>
                <p className="font-semibold">{selectedStudent.mobileNumber}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded mb-6">
              <h3 className="font-bold mb-2">Exam Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Exam Code</p>
                  <p className="font-semibold">{selectedExam.examCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Exam Date</p>
                  <p className="font-semibold">{new Date(selectedExam.examDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Exam Time</p>
                  <p className="font-semibold">{selectedExam.examTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Exam Center</p>
                  <p className="font-semibold">{selectedExam.examCenter}</p>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4 flex justify-between">
              <div>
                <p className="font-bold mb-1">Instructions:</p>
                <ul className="text-sm text-gray-700 list-disc pl-5">
                  <li>Please arrive 30 minutes before the exam time</li>
                  <li>Bring your ID proof along with this hall ticket</li>
                  <li>No electronic devices are allowed in the exam hall</li>
                </ul>
              </div>
              <div className="text-center">
                <div className="h-20 w-32 border-b border-black mx-auto mb-1"></div>
                <p className="text-sm">Authorized Signature</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button onClick={() => {
              const content = document.getElementById('hall-ticket');
              if (content) {
                const printWindow = window.open('', '_blank');
                if (printWindow) {
                  printWindow.document.write(`
                    <html>
                      <head>
                        <title>Hall Ticket - ${selectedStudent.studentName}</title>
                        <style>
                          body { font-family: Arial, sans-serif; }
                          .container { max-width: 800px; margin: 0 auto; padding: 20px; }
                          .header { display: flex; justify-content: space-between; border-bottom: 1px solid #ccc; padding-bottom: 15px; margin-bottom: 20px; }
                          .logo-section { display: flex; align-items: center; gap: 10px; }
                          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
                          .exam-details { background: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
                          .footer { border-top: 1px solid #ccc; padding-top: 15px; display: flex; justify-content: space-between; }
                          .signature { text-align: center; }
                          .signature-line { height: 20px; width: 120px; border-bottom: 1px solid black; margin: 0 auto 5px; }
                          .instructions { margin-bottom: 0; }
                          .instructions ul { padding-left: 20px; }
                        </style>
                      </head>
                      <body>
                        <div class="container">
                          ${content.innerHTML}
                        </div>
                      </body>
                    </html>
                  `);
                  printWindow.document.close();
                  printWindow.focus();
                  printWindow.print();
                }
              }
            }}>
              <Download className="mr-2 h-4 w-4" />
              Print Hall Ticket
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  
  const StudentSearchForm = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="mr-2 h-5 w-5 text-usha-blue" />
            Find Your Hall Ticket
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...searchForm}>
            <form onSubmit={searchForm.handleSubmit(searchStudentHallTicket)} className="space-y-4">
              <FormField
                control={searchForm.control}
                name="studentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={searchForm.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-usha-blue hover:bg-usha-lightblue"
              >
                <Search className="mr-2 h-4 w-4" />
                Search Hall Ticket
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-usha-blue mb-6">Data Export</h1>
        
        <Tabs defaultValue="admin">
          <TabsList className="mb-6">
            <TabsTrigger value="admin">Administrator</TabsTrigger>
            <TabsTrigger value="student">Student</TabsTrigger>
          </TabsList>
          
          <TabsContent value="admin">
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
                    Student Data (JSON)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      View JSON data containing all registered students' information in a dedicated viewer page.
                    </p>
                    
                    <Button 
                      onClick={viewJSONData} 
                      className="w-full bg-usha-blue hover:bg-usha-lightblue"
                      disabled={students.length === 0}
                    >
                      <FileJson className="mr-2 h-4 w-4" />
                      View JSON Data
                    </Button>
                    
                    {students.length === 0 && (
                      <p className="text-sm text-gray-500 mt-2">
                        No students available. Register students first.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-usha-blue" />
                    Generate Hall Ticket
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="examSelectHall">Select Exam</Label>
                        <Select value={selectedExamId} onValueChange={setSelectedExamId}>
                          <SelectTrigger id="examSelectHall">
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
                      
                      <div className="space-y-2">
                        <Label htmlFor="studentSelect">Select Student</Label>
                        <Select 
                          value={selectedStudentId} 
                          onValueChange={setSelectedStudentId}
                          disabled={!selectedExamId}
                        >
                          <SelectTrigger id="studentSelect">
                            <SelectValue placeholder="Choose a student" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedExamId && exams.find(e => e.id === selectedExamId)?.studentIds.length > 0 ? (
                              students
                                .filter(student => exams.find(e => e.id === selectedExamId)?.studentIds.includes(student.id))
                                .map(student => (
                                  <SelectItem key={student.id} value={student.id}>
                                    {student.rollNumber} - {student.studentName}
                                  </SelectItem>
                                ))
                            ) : (
                              <SelectItem value="none" disabled>
                                {!selectedExamId ? "Select an exam first" : "No students assigned to this exam"}
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={generateHallTicket} 
                      className="w-full bg-usha-blue hover:bg-usha-lightblue"
                      disabled={!selectedExamId || !selectedStudentId}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Hall Ticket
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="student">
            <div className="max-w-xl mx-auto">
              <StudentSearchForm />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <HallTicketModal student={foundStudent} exam={foundExam} />
    </div>
  );
};

export default Export;
