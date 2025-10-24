/**
 * User Profile Component
 * 
 * This component displays information about the authenticated user
 * and provides options to manage their account or sign out.
 * 
 * Expected features:
 * 1. Display user information (email, last sign in)
 * 2. Provide sign out functionality
 * 3. Link to resource management
 * 
 * Implementation notes:
 * - Use the useAuth hook to access user information and sign out function
 * - Handle loading and error states
 * - Implement conditional rendering based on authentication state
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Uncomment when implementing authentication
// import { useAuth } from "@/hooks/useAuth";

export default function UserProfile() {
  // Uncomment when implementing authentication
  // const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Add your user profile implementation here
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
        <CardDescription>Manage your account and resources</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add user information here */}
        <div>
          <p className="text-sm font-medium">Email</p>
          <p className="text-sm text-muted-foreground">user@example.com</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">
          Manage Resources
        </Button>
        <Button variant="destructive" disabled={loading}>
          {loading ? "Signing out..." : "Sign Out"}
        </Button>
      </CardFooter>
    </Card>
  );
}