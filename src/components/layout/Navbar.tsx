
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-usha-blue text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="h-10 w-auto mr-2 font-bold text-xl">
                Usha Institute
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-usha-lightblue">
              Dashboard
            </Link>
            <Link to="/students" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-usha-lightblue">
              Students
            </Link>
            <Link to="/exams" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-usha-lightblue">
              Exams
            </Link>
            <Link to="/export" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-usha-lightblue">
              Export Data
            </Link>
          </div>
          
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-usha-lightblue focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-usha-lightblue"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/students"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-usha-lightblue"
              onClick={() => setMobileMenuOpen(false)}
            >
              Students
            </Link>
            <Link 
              to="/exams"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-usha-lightblue"
              onClick={() => setMobileMenuOpen(false)}
            >
              Exams
            </Link>
            <Link 
              to="/export"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-usha-lightblue"
              onClick={() => setMobileMenuOpen(false)}
            >
              Export Data
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
