
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CalendarCheck, Download, FileText, Search } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <img 
            src="https://exam.ushainstitute.com/wp-content/uploads/2025/03/cropped-Usha-Institute-removebg-preview.png" 
            alt="Usha Institute Logo" 
            className="h-24 w-auto mx-auto mb-4" 
            onError={(e) => {
              e.currentTarget.src = "https://i.ibb.co/PskvV2V/Untitled-design.png";
            }}
          />
          <h1 className="text-3xl font-bold text-usha-blue">Exam Management – Usha Institute</h1>
          <p className="mt-2 text-usha-darkgray">Manage students, exams, and reporting in one platform</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/students" className="transition-transform hover:scale-105">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="bg-usha-blue text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-6 w-6" />
                  Student Registration
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p>Register new students, manage existing student records, and generate automatic usernames and emails.</p>
              </CardContent>
              <CardFooter className="text-usha-blue font-medium">
                View Students →
              </CardFooter>
            </Card>
          </Link>
          
          <Link to="/exams" className="transition-transform hover:scale-105">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="bg-usha-blue text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <CalendarCheck className="mr-2 h-6 w-6" />
                  Exam Assignment
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p>Assign students to exams, set exam dates, centers, and times with auto-generated exam codes.</p>
              </CardContent>
              <CardFooter className="text-usha-blue font-medium">
                Manage Exams →
              </CardFooter>
            </Card>
          </Link>
          
          <Link to="/export" className="transition-transform hover:scale-105">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="bg-usha-blue text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <Download className="mr-2 h-6 w-6" />
                  Data Export
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p>Export student data in CSV format, access JSON data for all students, and generate reports.</p>
              </CardContent>
              <CardFooter className="text-usha-blue font-medium">
                Export Data →
              </CardFooter>
            </Card>
          </Link>
          
          <Link to="/hall-ticket" className="transition-transform hover:scale-105">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="bg-usha-accent text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <Search className="mr-2 h-6 w-6" />
                  Find Hall Ticket
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p>Students can find and print their hall tickets by entering their name and date of birth.</p>
              </CardContent>
              <CardFooter className="text-usha-blue font-medium">
                Get Hall Ticket →
              </CardFooter>
            </Card>
          </Link>
        </div>
        
        <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-usha-blue mb-4">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border border-gray-200 rounded-md p-4 text-center">
              <p className="text-2xl font-bold text-usha-blue">0</p>
              <p className="text-sm text-gray-600">Total Students</p>
            </div>
            <div className="border border-gray-200 rounded-md p-4 text-center">
              <p className="text-2xl font-bold text-usha-blue">0</p>
              <p className="text-sm text-gray-600">Assigned to Exams</p>
            </div>
            <div className="border border-gray-200 rounded-md p-4 text-center">
              <p className="text-2xl font-bold text-usha-blue">0</p>
              <p className="text-sm text-gray-600">Upcoming Exams</p>
            </div>
            <div className="border border-gray-200 rounded-md p-4 text-center">
              <p className="text-2xl font-bold text-usha-blue">0</p>
              <p className="text-sm text-gray-600">Data Exports</p>
            </div>
          </div>
        </div>
        
        <div className="mt-12">
          <Link to="/json" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-usha-accent hover:bg-orange-600">
            <FileText className="mr-2 h-4 w-4" />
            View JSON Data
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
