
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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2, Plus, User } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { Student } from "@/models/types";
import StudentForm from "@/components/students/StudentForm";

const Students = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  
  // Load students from localStorage
  useEffect(() => {
    const savedStudents = localStorage.getItem("students");
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }
  }, []);
  
  // Save students to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);
  
  const handleAddStudent = (student: Student) => {
    if (editingStudent) {
      // Update existing student
      setStudents(students.map(s => s.id === student.id ? student : s));
      toast({
        title: "Student Updated",
        description: `${student.studentName}'s information has been updated.`
      });
    } else {
      // Add new student
      setStudents([...students, student]);
      toast({
        title: "Student Added",
        description: `${student.studentName} has been successfully registered.`
      });
    }
    setShowForm(false);
    setEditingStudent(null);
  };
  
  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setShowForm(true);
  };
  
  const handleDeleteStudent = (id: string) => {
    if (confirm("Are you sure you want to delete this student?")) {
      const studentToDelete = students.find(s => s.id === id);
      setStudents(students.filter(s => s.id !== id));
      toast({
        title: "Student Deleted",
        description: `${studentToDelete?.studentName} has been removed.`,
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-usha-blue">Student Management</h1>
          <Button 
            onClick={() => {
              setEditingStudent(null);
              setShowForm(true);
            }}
            className="bg-usha-blue hover:bg-usha-lightblue"
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Student
          </Button>
        </div>
        
        {showForm ? (
          <StudentForm 
            onSave={handleAddStudent}
            onCancel={() => {
              setShowForm(false);
              setEditingStudent(null);
            }}
            initialData={editingStudent}
            students={students}
          />
        ) : (
          <>
            {students.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">
                    <div className="flex items-center">
                      <User className="mr-2 h-5 w-5 text-usha-blue" />
                      Registered Students ({students.length})
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Roll Number</TableHead>
                          <TableHead>Student Name</TableHead>
                          <TableHead>Father's Name</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Mobile</TableHead>
                          <TableHead>Username</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell>{student.rollNumber}</TableCell>
                            <TableCell className="font-medium">{student.studentName}</TableCell>
                            <TableCell>{student.fatherName}</TableCell>
                            <TableCell>{student.courseName}</TableCell>
                            <TableCell>{student.mobileNumber}</TableCell>
                            <TableCell>{student.username}</TableCell>
                            <TableCell>{student.email}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditStudent(student)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteStudent(student.id)}
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
                <User className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No students registered</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding a new student.</p>
                <div className="mt-6">
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="bg-usha-blue hover:bg-usha-lightblue"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add New Student
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

export default Students;
