/**
 * Footer Component
 * 
 * This component represents the footer section of the application.
 * It should include links to important pages, contact information, and copyright notice.
 * 
 * Expected sections:
 * 1. Site information and mission statement
 * 2. Resource category links
 * 3. About/Contact links
 * 4. Provider section links
 * 5. Copyright and acknowledgments
 * 
 * Implementation notes:
 * - Organize content in a responsive grid layout
 * - Include links to all major sections of the site
 * - Include copyright information and acknowledgments
 */

import { Phone, Instagram, Linkedin, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Crisis Support */}
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-blue-600" />
            <div>
              <p className="text-xs text-gray-500">24/7 Crisis Support</p>
              <a 
                href="tel:988" 
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Call or Text 988
              </a>
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="flex items-center gap-4">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-600 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-600 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-600 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-600 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Community Change Team
          </p>
        </div>
      </div>
    </footer>
  );
}