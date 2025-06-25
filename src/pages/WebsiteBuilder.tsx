
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Monitor, Download, Plus, Edit, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Website {
  id: string;
  name: string;
  template: string;
  title: string;
  description: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const WebsiteBuilder = () => {
  const [websites, setWebsites] = useState<Website[]>([
    {
      id: '1',
      name: 'Business Landing Page',
      template: 'business',
      title: 'Your Business Name',
      description: 'Professional services for modern businesses',
      content: 'Welcome to our company...',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
    }
  ]);

  const [newWebsite, setNewWebsite] = useState({
    name: '',
    template: 'business',
    title: '',
    description: '',
    content: '',
  });

  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { toast } = useToast();

  const templates = [
    { id: 'business', name: 'Business', description: 'Professional business website' },
    { id: 'portfolio', name: 'Portfolio', description: 'Showcase your work' },
    { id: 'restaurant', name: 'Restaurant', description: 'Perfect for food businesses' },
    { id: 'ecommerce', name: 'E-commerce', description: 'Online store template' },
  ];

  const handleCreateWebsite = () => {
    if (!newWebsite.name || !newWebsite.title) {
      toast({
        title: "Error",
        description: "Please fill in website name and title",
        variant: "destructive",
      });
      return;
    }

    const website: Website = {
      id: Date.now().toString(),
      name: newWebsite.name,
      template: newWebsite.template,
      title: newWebsite.title,
      description: newWebsite.description,
      content: newWebsite.content || 'Welcome to our website. We provide excellent services...',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setWebsites([website, ...websites]);
    setNewWebsite({ name: '', template: 'business', title: '', description: '', content: '' });
    setIsDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Website created successfully",
    });
  };

  const handleDownloadWebsite = (website: Website) => {
    // Generate HTML content
    const htmlContent = generateHTML(website);
    const cssContent = generateCSS(website.template);
    const jsContent = generateJS();

    // Create a simple download simulation
    // In a real app, this would create a proper zip file
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${website.name.replace(/\s+/g, '-').toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: "Your website files are being downloaded. In a full version, this would be a complete .zip package.",
    });
  };

  const generateHTML = (website: Website) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${website.title}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <nav>
            <div class="logo">${website.title}</div>
            <ul class="nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section id="hero">
            <div class="hero-content">
                <h1>${website.title}</h1>
                <p>${website.description}</p>
                <button class="cta-button">Get Started</button>
            </div>
        </section>
        
        <section id="content">
            <div class="container">
                <h2>About Us</h2>
                <p>${website.content}</p>
            </div>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2024 ${website.title}. All rights reserved.</p>
    </footer>
    
    <script src="script.js"></script>
</body>
</html>`;
  };

  const generateCSS = (template: string) => {
    // Return different CSS based on template
    return `/* Website Styles */
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: Arial, sans-serif; line-height: 1.6; }
header { background: #333; color: white; padding: 1rem 0; }
nav { display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
.nav-links { display: flex; list-style: none; gap: 2rem; }
.nav-links a { color: white; text-decoration: none; }
#hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 8rem 2rem; text-align: center; }
.hero-content h1 { font-size: 3rem; margin-bottom: 1rem; }
.cta-button { background: white; color: #333; padding: 1rem 2rem; border: none; border-radius: 5px; font-size: 1.1rem; cursor: pointer; margin-top: 2rem; }
#content { padding: 4rem 2rem; }
.container { max-width: 1200px; margin: 0 auto; }
footer { background: #333; color: white; text-align: center; padding: 2rem; }`;
  };

  const generateJS = () => {
    return `// Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Website loaded successfully');
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});`;
  };

  const previewHTML = selectedWebsite ? generateHTML(selectedWebsite) : '';

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Website Builder</h1>
          <p className="text-muted-foreground">
            Create professional websites with our no-code builder. Export as complete HTML/CSS/JS packages.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Website
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Website</DialogTitle>
              <DialogDescription>
                Choose a template and customize your website content.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Website name (e.g., 'My Business Site')"
                  value={newWebsite.name}
                  onChange={(e) => setNewWebsite({ ...newWebsite, name: e.target.value })}
                />
              </div>
              <div>
                <Select value={newWebsite.template} onValueChange={(value) => setNewWebsite({ ...newWebsite, template: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name} - {template.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Input
                  placeholder="Website title (appears in browser tab)"
                  value={newWebsite.title}
                  onChange={(e) => setNewWebsite({ ...newWebsite, title: e.target.value })}
                />
              </div>
              <div>
                <Input
                  placeholder="Short description/tagline"
                  value={newWebsite.description}
                  onChange={(e) => setNewWebsite({ ...newWebsite, description: e.target.value })}
                />
              </div>
              <div>
                <Textarea
                  placeholder="Main content (optional - we'll provide defaults)"
                  value={newWebsite.content}
                  onChange={(e) => setNewWebsite({ ...newWebsite, content: e.target.value })}
                  rows={4}
                />
              </div>
              <Button onClick={handleCreateWebsite} className="w-full">
                Create Website
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Templates Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Available Templates</CardTitle>
          <CardDescription>Choose from our professionally designed templates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {templates.map((template) => (
              <div key={template.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded mb-2 flex items-center justify-center">
                  <Monitor className="h-8 w-8 text-gray-400" />
                </div>
                <h4 className="font-medium">{template.name}</h4>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Websites List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Websites</CardTitle>
          <CardDescription>Manage and download your created websites</CardDescription>
        </CardHeader>
        <CardContent>
          {websites.length === 0 ? (
            <div className="text-center py-12">
              <Monitor className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No websites yet</h3>
              <p className="text-muted-foreground">Create your first website to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {websites.map((website) => (
                <div key={website.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{website.name}</h4>
                    <p className="text-sm text-muted-foreground">{website.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Template: {templates.find(t => t.id === website.template)?.name} | 
                      Updated: {website.updatedAt}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedWebsite(website);
                        setIsPreviewOpen(true);
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDownloadWebsite(website)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Website Preview</DialogTitle>
            <DialogDescription>
              Preview of {selectedWebsite?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="h-[70vh] border rounded-lg overflow-hidden">
            <iframe
              srcDoc={previewHTML}
              className="w-full h-full"
              title="Website Preview"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Deployment Guide Card */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help Deploying?</CardTitle>
          <CardDescription>
            We'll provide you with a complete deployment guide for hosting your website on Vercel for free.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Once you download your website files, you'll receive detailed instructions on how to:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 mb-4">
            <li>• Set up a free Vercel account</li>
            <li>• Upload your website files</li>
            <li>• Configure your custom domain</li>
            <li>• Go live in minutes</li>
          </ul>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Deployment Guide
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebsiteBuilder;
