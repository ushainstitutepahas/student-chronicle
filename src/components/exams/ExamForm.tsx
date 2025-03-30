
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Exam, Student } from "@/models/types";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";

interface ExamFormProps {
  onSave: (exam: Exam) => void;
  onCancel: () => void;
  initialData: Exam | null;
  students: Student[];
}

const ExamForm = ({ onSave, onCancel, initialData, students }: ExamFormProps) => {
  const [exam, setExam] = useState<Partial<Exam>>({
    id: initialData?.id || uuidv4(),
    examDate: initialData?.examDate || new Date().toISOString().slice(0, 10),
    examCenter: initialData?.examCenter || "",
    examTime: initialData?.examTime || "",
    studentIds: initialData?.studentIds || [],
    examCode: initialData?.examCode || generateExamCode()
  });
  
  // Generate an exam code based on date and random string
  function generateExamCode(): string {
    const now = new Date();
    const dateStr = format(now, "yyyyMMdd");
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `EX-${dateStr}-${randomStr}`;
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (exam.studentIds?.length === 0) {
      alert("Please select at least one student for the exam.");
      return;
    }
    onSave(exam as Exam);
  };
  
  const handleChange = (name: keyof Exam, value: any) => {
    setExam({ ...exam, [name]: value });
  };
  
  const handleStudentToggle = (studentId: string) => {
    const studentIds = [...(exam.studentIds || [])];
    if (studentIds.includes(studentId)) {
      handleChange("studentIds", studentIds.filter(id => id !== studentId));
    } else {
      handleChange("studentIds", [...studentIds, studentId]);
    }
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? "Edit Exam" : "Create New Exam"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="examCode">Exam Code</Label>
              <Input 
                id="examCode" 
                value={exam.examCode}
                readOnly
                className="bg-gray-100"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="examDate">Exam Date</Label>
              <Input 
                id="examDate" 
                type="date" 
                value={exam.examDate} 
                onChange={(e) => handleChange("examDate", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="examTime">Exam Time</Label>
              <Input 
                id="examTime" 
                type="time" 
                value={exam.examTime} 
                onChange={(e) => handleChange("examTime", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="examCenter">Exam Center</Label>
              <Input 
                id="examCenter" 
                value={exam.examCenter} 
                onChange={(e) => handleChange("examCenter", e.target.value)}
                required
                placeholder="e.g. Main Campus, Block A"
              />
            </div>
          </div>
          
          <div className="space-y-2 pt-4 border-t">
            <Label>Select Students</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 border rounded-md">
              {students.length > 0 ? (
                students.map((student) => (
                  <div key={student.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`student-${student.id}`}
                      checked={(exam.studentIds || []).includes(student.id)}
                      onCheckedChange={() => handleStudentToggle(student.id)}
                    />
                    <Label htmlFor={`student-${student.id}`} className="cursor-pointer text-sm">
                      {student.rollNumber} - {student.studentName}
                    </Label>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center text-gray-500 py-4">
                  No students available. Please register students first.
                </div>
              )}
            </div>
            <div className="text-sm text-gray-500">
              Selected: {(exam.studentIds || []).length} students
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-usha-blue hover:bg-usha-lightblue">
            {initialData ? "Update Exam" : "Create Exam"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ExamForm;
