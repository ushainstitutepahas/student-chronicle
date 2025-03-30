
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Search, FileText } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download } from "lucide-react";
import { Student, Exam } from "@/models/types";

const searchFormSchema = z.object({
  studentName: z.string().min(2, "Name must be at least 2 characters"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
});

const StudentHallTicket = () => {
  const { toast } = useToast();
  const [showHallTicket, setShowHallTicket] = useState(false);
  const [foundStudent, setFoundStudent] = useState<Student | null>(null);
  const [foundExam, setFoundExam] = useState<Exam | null>(null);
  
  const searchForm = useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      studentName: "",
      dateOfBirth: "",
    },
  });
  
  const searchStudentHallTicket = (data: z.infer<typeof searchFormSchema>) => {
    // Get students from localStorage
    const savedStudents = localStorage.getItem("students");
    const students = savedStudents ? JSON.parse(savedStudents) : [];
    
    const student = students.find(
      (s: Student) => s.studentName.toLowerCase() === data.studentName.toLowerCase() && 
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
    const savedExams = localStorage.getItem("exams");
    const exams = savedExams ? JSON.parse(savedExams) : [];
    
    const exam = exams.find((e: Exam) => e.studentIds.includes(student.id));
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
    setShowHallTicket(true);
  };
  
  const HallTicketModal = () => {
    if (!foundExam || !foundStudent) return null;
    
    return (
      <Dialog open={showHallTicket} 
              onOpenChange={(open) => {
                if (!open) {
                  setShowHallTicket(false);
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
                <p className="text-sm text-gray-600">Date: {new Date(foundExam.examDate).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-600">Student Name</p>
                <p className="font-semibold">{foundStudent.studentName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Roll Number</p>
                <p className="font-semibold">{foundStudent.rollNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Course</p>
                <p className="font-semibold">{foundStudent.courseName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Username</p>
                <p className="font-semibold">{foundStudent.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Father's Name</p>
                <p className="font-semibold">{foundStudent.fatherName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Contact</p>
                <p className="font-semibold">{foundStudent.mobileNumber}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded mb-6">
              <h3 className="font-bold mb-2">Exam Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Exam Code</p>
                  <p className="font-semibold">{foundExam.examCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Exam Date</p>
                  <p className="font-semibold">{new Date(foundExam.examDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Exam Time</p>
                  <p className="font-semibold">{foundExam.examTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Exam Center</p>
                  <p className="font-semibold">{foundExam.examCenter}</p>
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
                        <title>Hall Ticket - ${foundStudent.studentName}</title>
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
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center mb-8">
          <img 
            src="https://exam.ushainstitute.com/wp-content/uploads/2025/03/cropped-Usha-Institute-removebg-preview.png" 
            alt="Usha Institute Logo" 
            className="h-24 w-auto mb-4" 
            onError={(e) => {
              e.currentTarget.src = "https://i.ibb.co/PskvV2V/Untitled-design.png";
            }}
          />
          <h1 className="text-3xl font-bold text-usha-blue">Usha Institute</h1>
          <p className="text-xl text-gray-600">Find Your Hall Ticket</p>
        </div>
        
        <div className="max-w-xl mx-auto">
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
          
          <div className="text-center mt-4">
            <a href="http://ushainstitute.com/" className="text-usha-blue hover:underline">Back to Home at Usha Institute</a>
          </div>
        </div>
      </div>
      
      <HallTicketModal />
    </div>
  );
};

export default StudentHallTicket;
