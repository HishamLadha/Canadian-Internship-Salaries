import React from 'react'
import { Github, Info, Heart } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-50 to-blue-50/30 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center gap-6">
          {/* Main Links */}
          <div className="flex gap-8 flex-wrap items-center justify-center">
            <a
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
              href="https://github.com/HishamLadha/Canadian-Internship-Salaries"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-4 h-4" />
              Source Code 
            </a>
            <a
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
              href="/about"
            >
              <Info className="w-4 h-4" />
              About
            </a>
          </div>
          
          {/* Made with love */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span>for Canadian students</span>
          </div>
          
          {/* Copyright */}
          <div className="text-xs text-gray-400 text-center">
            © 2025 Scoper. All data is anonymized and community-contributed.
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer