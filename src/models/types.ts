
export interface Student {
  id: string;
  rollNumber: number;
  studentName: string;
  fatherName: string;
  joinDate: string;
  mobileNumber: string;
  courseName: "ADCA" | "DCA";
  dateOfBirth: string;
  username: string;
  email: string;
}

export interface Exam {
  id: string;
  examCode: string;
  examDate: string;
  examCenter: string;
  examTime: string;
  studentIds: string[];
}

export interface ExamWithStudents extends Exam {
  students: Student[];
}
