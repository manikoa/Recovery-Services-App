/**
 * Header Component
 * 
 * This component represents the main navigation header of the application.
 * It should include the logo, navigation menu, and authentication controls.
 * 
 * Expected features:
 * 1. Site logo/name linking to home page
 * 2. Navigation menu with links to main sections
 * 3. Authentication controls (login/register or user profile)
 * 4. Mobile-responsive design
 * 
 * Implementation notes:
 * - Use NavigationMenu component for the main navigation
 * - Use Sheet component for mobile navigation and auth forms
 * - Implement conditional rendering based on authentication state
 * - Use the useAuth hook to access authentication state
 */

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">
          Walla Walla Recovery Resources
        </h1>
        <p className="text-blue-100 text-lg">
          Find support and services for your recovery journey
        </p>
      </div>
    </header>
  );
}