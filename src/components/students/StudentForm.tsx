
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Student } from "@/models/types";
import { v4 as uuidv4 } from "uuid";

interface StudentFormProps {
  onSave: (student: Student) => void;
  onCancel: () => void;
  initialData: Student | null;
  students: Student[];
}

const StudentForm = ({ onSave, onCancel, initialData, students }: StudentFormProps) => {
  const [student, setStudent] = useState<Partial<Student>>({
    id: initialData?.id || uuidv4(),
    studentName: initialData?.studentName || "",
    fatherName: initialData?.fatherName || "",
    joinDate: initialData?.joinDate || new Date().toISOString().slice(0, 10),
    mobileNumber: initialData?.mobileNumber || "",
    courseName: initialData?.courseName || "DCA",
    dateOfBirth: initialData?.dateOfBirth || "",
    rollNumber: initialData?.rollNumber || getNextRollNumber(students),
    username: initialData?.username || "",
    email: initialData?.email || ""
  });
  
  // Get next available roll number
  function getNextRollNumber(students: Student[]): number {
    if (students.length === 0) return 1;
    return Math.max(...students.map(s => s.rollNumber)) + 1;
  }
  
  // Generate username and email when required fields change
  useEffect(() => {
    if (student.studentName && student.dateOfBirth && student.courseName && student.rollNumber) {
      // Generate username (UI-{Course}-{1000 + Roll Number})
      const username = `UI-${student.courseName}-${1000 + student.rollNumber}`;
      
      // Generate email ({First 4 letters of Student Name}{Year of DOB}@examui.com)
      const name = student.studentName.replace(/\s+/g, "").slice(0, 4);
      const year = new Date(student.dateOfBirth).getFullYear();
      const email = `${name}${year}@examui.com`;
      
      setStudent(prev => ({ ...prev, username, email }));
    }
  }, [student.studentName, student.dateOfBirth, student.courseName, student.rollNumber]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(student as Student);
  };
  
  const handleChange = (name: keyof Student, value: string) => {
    setStudent({ ...student, [name]: value });
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? "Edit Student" : "Register New Student"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rollNumber">Roll Number</Label>
              <Input 
                id="rollNumber" 
                value={student.rollNumber}
                disabled
                className="bg-gray-100"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="courseName">Course Name</Label>
              <Select 
                value={student.courseName} 
                onValueChange={(value) => handleChange("courseName", value as "ADCA" | "DCA")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADCA">ADCA</SelectItem>
                  <SelectItem value="DCA">DCA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="studentName">Student Name</Label>
              <Input 
                id="studentName" 
                value={student.studentName} 
                onChange={(e) => handleChange("studentName", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fatherName">Father's Name</Label>
              <Input 
                id="fatherName" 
                value={student.fatherName} 
                onChange={(e) => handleChange("fatherName", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="joinDate">Join Date</Label>
              <Input 
                id="joinDate" 
                type="date" 
                value={student.joinDate} 
                onChange={(e) => handleChange("joinDate", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input 
                id="dateOfBirth" 
                type="date" 
                value={student.dateOfBirth} 
                onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mobileNumber">Mobile Number</Label>
              <Input 
                id="mobileNumber" 
                value={student.mobileNumber} 
                onChange={(e) => handleChange("mobileNumber", e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="username">Username (Auto-generated)</Label>
              <Input 
                id="username" 
                value={student.username} 
                readOnly 
                className="bg-gray-100"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email (Auto-generated)</Label>
              <Input 
                id="email" 
                value={student.email} 
                readOnly 
                className="bg-gray-100"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-usha-blue hover:bg-usha-lightblue">
            {initialData ? "Update Student" : "Register Student"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default StudentForm;
