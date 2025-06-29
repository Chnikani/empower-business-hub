
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
    // Generate complete website files
    const htmlContent = generateHTML(website);
    const cssContent = generateCSS(website.template);
    const jsContent = generateJS();
    const readmeContent = generateReadme(website);

    // Download each file separately
    downloadFile(htmlContent, 'index.html', 'text/html');
    
    setTimeout(() => {
      downloadFile(cssContent, 'styles.css', 'text/css');
    }, 100);
    
    setTimeout(() => {
      downloadFile(jsContent, 'script.js', 'application/javascript');
    }, 200);
    
    setTimeout(() => {
      downloadFile(readmeContent, 'README.md', 'text/markdown');
    }, 300);

    toast({
      title: "Website Files Downloaded",
      description: "All website files downloaded successfully. Check your Downloads folder and follow the README instructions to deploy on Vercel.",
    });
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateHTML = (website: Website) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${website.title}</title>
    <meta name="description" content="${website.description}">
    <meta name="keywords" content="business, services, professional, ${website.title}">
    <meta property="og:title" content="${website.title}">
    <meta property="og:description" content="${website.description}">
    <meta property="og:type" content="website">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <nav class="container">
            <div class="logo">${website.title}</div>
            <ul class="nav-links">
                <li><a href="#hero">Home</a></li>
                <li><a href="#content">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
            <button class="menu-toggle">☰</button>
        </nav>
    </header>

    <section id="hero">
        <div class="container">
            <div class="hero-content">
                <h1>${website.title}</h1>
                <p>${website.description}</p>
                <a href="#content" class="cta-button">Learn More</a>
            </div>
        </div>
    </section>

    <section id="content">
        <div class="container">
            <h2>About Us</h2>
            <p>${website.content}</p>
            
            <div class="content-grid">
                <div class="feature-card">
                    <div class="feature-icon">🚀</div>
                    <h3>Professional Service</h3>
                    <p>We deliver high-quality solutions tailored to your business needs.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">⭐</div>
                    <h3>Trusted by Many</h3>
                    <p>Our clients trust us to deliver exceptional results every time.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">💼</div>
                    <h3>Business Focused</h3>
                    <p>We understand business challenges and provide practical solutions.</p>
                </div>
            </div>
        </div>
    </section>

    <section id="services">
        <div class="container">
            <h2>Our Services</h2>
            <div class="content-grid">
                <div class="feature-card">
                    <h3>Consultation</h3>
                    <p>Expert advice to help your business grow and succeed.</p>
                </div>
                <div class="feature-card">
                    <h3>Implementation</h3>
                    <p>Professional implementation of solutions tailored to your needs.</p>
                </div>
                <div class="feature-card">
                    <h3>Support</h3>
                    <p>Ongoing support to ensure your continued success.</p>
                </div>
            </div>
        </div>
    </section>

    <footer id="contact">
        <div class="container">
            <h3>Contact Us</h3>
            <p>Ready to work with us? Get in touch today!</p>
            <p>Email: info@${website.title.toLowerCase().replace(/\s+/g, '')}.com</p>
            <p>&copy; 2024 ${website.title}. All rights reserved.</p>
        </div>
    </footer>
    
    <script src="script.js"></script>
</body>
</html>`;
  };

  const generateCSS = (template: string) => {
    const baseStyles = `
/* Reset and Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Header Styles */
header {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  padding: 1rem 0;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: #3498db;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

/* Hero Section */
#hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 10rem 2rem 8rem;
  text-align: center;
  margin-top: 80px;
}

.hero-content h1 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  opacity: 0;
  animation: fadeInUp 1s ease forwards;
}

.hero-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0;
  animation: fadeInUp 1s ease 0.3s forwards;
}

.cta-button {
  background: white;
  color: #333;
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  opacity: 0;
  animation: fadeInUp 1s ease 0.6s forwards;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

/* Content Section */
#content {
  padding: 6rem 2rem;
  background: #f8f9fa;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  margin-top: 3rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  text-align: center;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

/* Footer */
footer {
  background: #2c3e50;
  color: white;
  text-align: center;
  padding: 3rem 2rem;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }
  
  .nav-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: #2c3e50;
    flex-direction: column;
    padding: 1rem 0;
    gap: 0;
  }
  
  .nav-links.active {
    display: flex;
  }
  
  .nav-links li {
    padding: 0.5rem 2rem;
  }
  
  .hero-content h1 {
    font-size: 2.5rem;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  #hero {
    padding: 8rem 1rem 6rem;
  }
}

@media (max-width: 480px) {
  .hero-content h1 {
    font-size: 2rem;
  }
  
  .hero-content p {
    font-size: 1rem;
  }
}`;

    return baseStyles;
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

    // Simple mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks2 = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks2) {
        menuToggle.addEventListener('click', function() {
            navLinks2.classList.toggle('active');
        });
    }
});`;
  };

  const generateReadme = (website: Website) => {
    return `# ${website.title}

A modern, responsive website created with Business OS Website Builder.

## 📁 Files Included

- \`index.html\` - Main website structure
- \`styles.css\` - Complete CSS styling
- \`script.js\` - Interactive JavaScript features
- \`README.md\` - This documentation

## 🚀 How to Deploy on Vercel (FREE)

### Method 1: Drag & Drop (Easiest)

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Create a new folder on your computer
3. Put all downloaded files (index.html, styles.css, script.js) in this folder
4. Drag and drop the entire folder onto Vercel's deployment page
5. Your website will be live in seconds with a free \`.vercel.app\` domain!

### Method 2: GitHub + Vercel (Recommended)

1. Create a new repository on GitHub
2. Upload all website files to the repository
3. Connect your GitHub account to Vercel
4. Import your repository in Vercel
5. Deploy automatically - updates to GitHub will auto-deploy

### Method 3: Vercel CLI

\`\`\`bash
# Install Vercel CLI globally
npm i -g vercel

# Navigate to your website folder
cd your-website-folder

# Deploy
vercel

# Follow the prompts - your site will be live!
\`\`\`

## 🌐 Other FREE Hosting Options

- **Netlify**: Drag & drop at [netlify.com](https://netlify.com)
- **GitHub Pages**: Push to GitHub and enable Pages in repo settings
- **Surge.sh**: Install surge CLI and run \`surge\` in your folder
- **Firebase Hosting**: Use Google Firebase's free tier

## 📱 Features Included

- ✅ Fully responsive design
- ✅ Modern CSS with gradients and animations
- ✅ Smooth scrolling navigation
- ✅ Mobile-friendly hamburger menu
- ✅ SEO-optimized HTML structure
- ✅ Fast loading performance

## 🛠 Customization

Feel free to edit:
- \`index.html\` - Change content, add sections
- \`styles.css\` - Modify colors, fonts, layouts
- \`script.js\` - Add interactive features

## 💡 Tips

- Replace placeholder content with your actual business information
- Add your own images to the images/ folder (create it)
- Test your site locally by opening \`index.html\` in a web browser
- For best SEO, add meta descriptions and og:image tags

## 📞 Need Help?

Your website was created with Business OS. For support or to create more websites, return to your Business OS dashboard.

---

**Created with ❤️ using Business OS Website Builder**

Template: ${website.template}
Generated: ${new Date().toLocaleDateString()}`;
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
