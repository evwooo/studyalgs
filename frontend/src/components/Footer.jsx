import React from 'react';
import { BookOpen, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-primary-400" />
              <span className="text-xl font-bold">StudyAlgs</span>
            </div>
            <p className="text-gray-300 mb-4">
              Master algorithms and data structures for technical interviews with interactive coding practice.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Study */}
          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase mb-4">
              Study
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/algorithms" className="text-gray-300 hover:text-white transition-colors">
                  All Algorithms
                </a>
              </li>
              <li>
                <a href="/algorithms?difficulty=Easy" className="text-gray-300 hover:text-white transition-colors">
                  Easy Problems
                </a>
              </li>
              <li>
                <a href="/algorithms?difficulty=Medium" className="text-gray-300 hover:text-white transition-colors">
                  Medium Problems
                </a>
              </li>
              <li>
                <a href="/algorithms?difficulty=Hard" className="text-gray-300 hover:text-white transition-colors">
                  Hard Problems
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Interview Tips
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Time Complexity Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Data Structures
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  System Design
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} StudyAlgs. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
