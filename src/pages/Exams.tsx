
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2, Plus, Calendar } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { Exam, Student } from "@/models/types";
import ExamForm from "@/components/exams/ExamForm";

const Exams = () => {
  const { toast } = useToast();
  const [exams, setExams] = useState<Exam[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  
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
  
  // Save exams to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("exams", JSON.stringify(exams));
  }, [exams]);
  
  const handleAddExam = (exam: Exam) => {
    if (editingExam) {
      // Update existing exam
      setExams(exams.map(e => e.id === exam.id ? exam : e));
      toast({
        title: "Exam Updated",
        description: `Exam ${exam.examCode} has been updated.`
      });
    } else {
      // Add new exam
      setExams([...exams, exam]);
      toast({
        title: "Exam Added",
        description: `Exam ${exam.examCode} has been created with ${exam.studentIds.length} assigned students.`
      });
    }
    setShowForm(false);
    setEditingExam(null);
  };
  
  const handleEditExam = (exam: Exam) => {
    setEditingExam(exam);
    setShowForm(true);
  };
  
  const handleDeleteExam = (id: string) => {
    if (confirm("Are you sure you want to delete this exam?")) {
      const examToDelete = exams.find(e => e.id === id);
      setExams(exams.filter(e => e.id !== id));
      toast({
        title: "Exam Deleted",
        description: `Exam ${examToDelete?.examCode} has been removed.`,
        variant: "destructive"
      });
    }
  };
  
  // Helper function to get student names for an exam
  const getStudentNames = (studentIds: string[]) => {
    const assignedStudents = students.filter(student => studentIds.includes(student.id));
    if (assignedStudents.length <= 2) {
      return assignedStudents.map(student => student.studentName).join(", ");
    } else {
      return `${assignedStudents[0].studentName}, ${assignedStudents[1].studentName}, and ${assignedStudents.length - 2} more`;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-usha-blue">Exam Management</h1>
          <Button 
            onClick={() => {
              setEditingExam(null);
              setShowForm(true);
            }}
            className="bg-usha-blue hover:bg-usha-lightblue"
            disabled={students.length === 0}
          >
            <Plus className="mr-2 h-4 w-4" /> Create New Exam
          </Button>
        </div>
        
        {students.length === 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  You need to register students before creating exams. 
                  <Button variant="link" className="p-0 h-auto text-yellow-700 underline" onClick={() => window.location.href = "/students"}>
                    Go to Student Registration
                  </Button>
                </p>
              </div>
            </div>
          </div>
        )}
        
        {showForm ? (
          <ExamForm 
            onSave={handleAddExam}
            onCancel={() => {
              setShowForm(false);
              setEditingExam(null);
            }}
            initialData={editingExam}
            students={students}
          />
        ) : (
          <>
            {exams.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-usha-blue" />
                      Scheduled Exams ({exams.length})
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Exam Code</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Center</TableHead>
                          <TableHead>Assigned Students</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {exams.map((exam) => (
                          <TableRow key={exam.id}>
                            <TableCell className="font-medium">{exam.examCode}</TableCell>
                            <TableCell>{new Date(exam.examDate).toLocaleDateString()}</TableCell>
                            <TableCell>{exam.examTime}</TableCell>
                            <TableCell>{exam.examCenter}</TableCell>
                            <TableCell>
                              {exam.studentIds.length > 0 
                                ? getStudentNames(exam.studentIds)
                                : "No students assigned"}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditExam(exam)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteExam(exam.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No exams scheduled</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new exam.</p>
                <div className="mt-6">
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="bg-usha-blue hover:bg-usha-lightblue"
                    disabled={students.length === 0}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Create New Exam
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Exams;
