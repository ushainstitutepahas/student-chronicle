
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileJson } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { Student } from "@/models/types";

const JsonViewer = () => {
  const [students, setStudents] = useState<Student[]>([]);
  
  // Load students from localStorage
  useEffect(() => {
    const savedStudents = localStorage.getItem("students");
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }
  }, []);
  
  // Format JSON data for display
  const jsonData = {
    students: students.map(student => ({
      "Roll Number": student.rollNumber.toString(),
      "Student Name": student.studentName,
      "Username": student.username
    }))
  };
  
  const jsonString = JSON.stringify(jsonData, null, 2);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <FileJson className="h-6 w-6 text-usha-blue mr-2" />
          <h1 className="text-2xl font-bold text-usha-blue">JSON Student Data</h1>
        </div>
        
        {students.length > 0 ? (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Students Table View</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Roll Number</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Username</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>{student.rollNumber}</TableCell>
                          <TableCell>{student.studentName}</TableCell>
                          <TableCell>{student.username}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>JSON Data</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-sm">
                  {jsonString}
                </pre>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <FileJson className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No student data available</h3>
            <p className="mt-1 text-sm text-gray-500">Register students to view the JSON data.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JsonViewer;
