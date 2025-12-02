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

export default function Footer() {
  return (
    <footer className="bg-white mt-16 border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600 mb-2">24/7 Crisis Support</p>
          <a 
            href="tel:988" 
            className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Call or Text 988
          </a>
          <p className="text-sm text-gray-500 mt-4">
            If you or someone you know is in crisis, help is available.
          </p>
        </div>
      {/* Copyright section */}
      <div className="mt-8 border-t border-gray-500 pt-6 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Community Change Team. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}