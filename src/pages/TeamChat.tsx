
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users, Hash, Bell } from "lucide-react";

const TeamChat = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team Chat</h1>
        <p className="text-muted-foreground">
          Real-time messaging and collaboration for your team.
        </p>
      </div>

      {/* Coming Soon Card */}
      <Card className="text-center py-12">
        <CardContent>
          <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <CardTitle className="mb-4">Team Chat Coming Soon</CardTitle>
          <CardDescription className="mb-6 max-w-md mx-auto">
            We're building a powerful team communication platform with:
          </CardDescription>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto mb-8">
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Hash className="h-8 w-8 text-primary mb-2" />
              <h4 className="font-medium">Channels</h4>
              <p className="text-sm text-muted-foreground text-center">Organize conversations by topic</p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Users className="h-8 w-8 text-primary mb-2" />
              <h4 className="font-medium">Direct Messages</h4>
              <p className="text-sm text-muted-foreground text-center">Private conversations with team members</p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Bell className="h-8 w-8 text-primary mb-2" />
              <h4 className="font-medium">Notifications</h4>
              <p className="text-sm text-muted-foreground text-center">Stay updated on important messages</p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <MessageSquare className="h-8 w-8 text-primary mb-2" />
              <h4 className="font-medium">File Sharing</h4>
              <p className="text-sm text-muted-foreground text-center">Share documents and media easily</p>
            </div>
          </div>
          <Button>
            Request Early Access
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamChat;
