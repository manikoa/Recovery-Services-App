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
    <footer className="sticky bottom-0 z-50 w-full bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Crisis Support */}
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-primary" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 font-medium">Crisis Support:</span>
              <a
                href="tel:988"
                className="text-base font-bold text-primary hover:text-blue-700 transition-colors"
              >
                988
              </a>
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="flex items-center gap-5">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-primary transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-primary transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-primary transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} <a href="https://www.wwcommunitychangeteam.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Community Change Team</a>
          </p>
        </div>
      </div>
    </footer>
  );
}