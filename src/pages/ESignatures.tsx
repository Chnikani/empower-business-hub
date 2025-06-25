
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileCheck, Upload, Send, Clock } from "lucide-react";

const ESignatures = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">E-Signatures</h1>
        <p className="text-muted-foreground">
          Send documents for electronic signatures and manage your signing workflows.
        </p>
      </div>

      {/* Coming Soon Card */}
      <Card className="text-center py-12">
        <CardContent>
          <FileCheck className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <CardTitle className="mb-4">E-Signatures Coming Soon</CardTitle>
          <CardDescription className="mb-6 max-w-md mx-auto">
            We're building a comprehensive e-signature solution that will allow you to:
          </CardDescription>
          <div className="grid gap-4 md:grid-cols-3 max-w-2xl mx-auto mb-8">
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Upload className="h-8 w-8 text-primary mb-2" />
              <h4 className="font-medium">Upload Documents</h4>
              <p className="text-sm text-muted-foreground text-center">Upload PDFs and add signature fields</p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Send className="h-8 w-8 text-primary mb-2" />
              <h4 className="font-medium">Send for Signing</h4>
              <p className="text-sm text-muted-foreground text-center">Send to clients and partners</p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Clock className="h-8 w-8 text-primary mb-2" />
              <h4 className="font-medium">Track Progress</h4>
              <p className="text-sm text-muted-foreground text-center">Monitor signing status in real-time</p>
            </div>
          </div>
          <Button>
            Notify Me When Available
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ESignatures;
