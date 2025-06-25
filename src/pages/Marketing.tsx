
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Megaphone, Calendar, Mail, Target } from "lucide-react";

const Marketing = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Marketing</h1>
        <p className="text-muted-foreground">
          Plan, execute, and track your marketing campaigns across all channels.
        </p>
      </div>

      {/* Coming Soon Card */}
      <Card className="text-center py-12">
        <CardContent>
          <Megaphone className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <CardTitle className="mb-4">Marketing Suite Coming Soon</CardTitle>
          <CardDescription className="mb-6 max-w-md mx-auto">
            We're developing comprehensive marketing tools including:
          </CardDescription>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto mb-8">
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Calendar className="h-8 w-8 text-primary mb-2" />
              <h4 className="font-medium">Content Calendar</h4>
              <p className="text-sm text-muted-foreground text-center">Plan and schedule your content</p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Mail className="h-8 w-8 text-primary mb-2" />
              <h4 className="font-medium">Email Campaigns</h4>
              <p className="text-sm text-muted-foreground text-center">Create and send email marketing</p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Target className="h-8 w-8 text-primary mb-2" />
              <h4 className="font-medium">Campaign Tracking</h4>
              <p className="text-sm text-muted-foreground text-center">Monitor campaign performance</p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Megaphone className="h-8 w-8 text-primary mb-2" />
              <h4 className="font-medium">Social Media</h4>
              <p className="text-sm text-muted-foreground text-center">Manage social media presence</p>
            </div>
          </div>
          <Button>
            Get Notified at Launch
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Marketing;
