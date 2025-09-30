import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary rounded-lg mx-auto flex items-center justify-center">
            <i className="fas fa-bolt text-primary-foreground text-2xl"></i>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">VTU Admin Panel</CardTitle>
            <CardDescription>
              Secure admin access required
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Gain access to a powerful VTU administration dashboard equipped with user management, financial tracking, and transaction monitoring features.
          </p>
          <Button 
            className="w-full" 
            onClick={() => window.location.href = '/api/login'}
            data-testid="button-login"
          >
            <i className="fas fa-sign-in-alt mr-2"></i>
            Sign In to Admin Panel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
