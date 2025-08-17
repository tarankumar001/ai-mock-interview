import { Github, Heart, Mail, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left side - Copyright and Name */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-sm text-gray-300">
              © {currentYear} <span className="font-semibold text-white">P.Tarankumar</span>. All rights reserved.
            </p>
            <p className="text-xs text-gray-400">
              Made with <Heart className="inline w-3 h-3 text-red-500" /> for better interviews
            </p>
          </div>

          {/* Center - Brand */}
          <div className="text-center">
            <Link to="/" className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 transition-all duration-300">
              Echohire
            </Link>
            <p className="text-xs text-gray-400 mt-1">AI-Powered Interview Platform</p>
          </div>

          {/* Right side - Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/tarankumar001"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 group"
              title="Visit GitHub Profile"
            >
              <Github className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-sm">GitHub</span>
            </a>
            
            <a
              href="https://www.linkedin.com/in/tarankumar-p-954948257/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 group"
              title="Visit LinkedIn Profile"
            >
              <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-sm">LinkedIn</span>
            </a>
            
            <a
              href="mailto:ptarankumar@gmail.com"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 group"
              title="Send Email"
            >
              <Mail className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-sm">Email</span>
            </a>
          </div>
        </div>

        {/* Bottom border */}
        <div className="border-t border-gray-800 mt-6 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p className="text-xs text-gray-400">
              Built with React, TypeScript, and Tailwind CSS by <span className="font-medium text-white">P.Tarankumar</span>
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <Link to="/about" className="hover:text-white transition-colors">About</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
