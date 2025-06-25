
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Palette, Image, Download, Plus, Sparkles, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useBusiness } from "@/contexts/BusinessContext";
import { generateImage, getBusinessImages, downloadImage, GeneratedImage } from "@/services/imageService";

const CreativeStudio = () => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { toast } = useToast();
  const { currentBusiness } = useBusiness();

  const loadImages = async () => {
    if (!currentBusiness) return;
    
    try {
      const businessImages = await getBusinessImages(currentBusiness.id);
      setImages(businessImages);
    } catch (error) {
      console.error('Error loading images:', error);
      toast({
        title: "Error Loading Images",
        description: "Failed to load your generated images",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, [currentBusiness]);

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please describe what you want to create",
        variant: "destructive",
      });
      return;
    }

    if (!currentBusiness) {
      toast({
        title: "No Business Selected",
        description: "Please select a business account first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const newImage = await generateImage(prompt, style, currentBusiness.id);
      setImages([newImage, ...images]);
      setPrompt('');
      
      toast({
        title: "Image Generated! ✨",
        description: "Your AI-generated image is ready to download",
      });
    } catch (error) {
      console.error('Image generation failed:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (image: GeneratedImage) => {
    try {
      const filename = `${image.prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}_${image.style}.png`;
      await downloadImage(image.image_url, filename);
      
      toast({
        title: "Download Started",
        description: "Your image is being downloaded",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download image. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!currentBusiness) {
    return (
      <div className="space-y-8">
        <Card className="modern-card">
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">No Business Selected</h3>
            <p className="text-muted-foreground">Please select or create a business account to use the Creative Studio.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl -z-10" />
        <div className="p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
              <Palette className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gradient">Creative Studio</h1>
              <p className="text-muted-foreground">
                Generate stunning visuals with AI-powered image creation
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Powered
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                <Wand2 className="h-3 w-3 mr-1" />
                High Quality
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Image Generator */}
      <Card className="modern-card hover-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Wand2 className="h-4 w-4 text-white" />
            </div>
            AI Image Generator
          </CardTitle>
          <CardDescription>
            Describe your vision and watch our AI bring it to life with professional-quality images.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Image Description</label>
            <Textarea
              placeholder="Describe the image you want to generate... (e.g., 'Modern business logo with blue and green colors', 'Professional team photo for website header', 'Abstract background for social media')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="resize-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Art Style</label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realistic">🎯 Realistic</SelectItem>
                  <SelectItem value="illustration">🎨 Illustration</SelectItem>
                  <SelectItem value="abstract">🌟 Abstract</SelectItem>
                  <SelectItem value="minimalist">⚪ Minimalist</SelectItem>
                  <SelectItem value="vintage">📸 Vintage</SelectItem>
                  <SelectItem value="modern">💎 Modern</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={handleGenerateImage} 
                disabled={isGenerating || !prompt.trim()}
                className="btn-gradient w-full hover-lift"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Generate Image
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated Images Gallery */}
      <Card className="modern-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center">
              <Image className="h-4 w-4 text-white" />
            </div>
            Your Gallery
            <Badge variant="secondary" className="ml-auto">
              {images.length} images
            </Badge>
          </CardTitle>
          <CardDescription>
            Browse, download, and manage your AI-generated masterpieces
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your images...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-16">
              <div className="h-20 w-20 bg-gradient-to-br from-muted to-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Image className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No images yet</h3>
              <p className="text-muted-foreground mb-4">Create your first AI-generated image to get started</p>
              <Button variant="outline" className="hover-lift">
                <Plus className="mr-2 h-4 w-4" />
                Generate Your First Image
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {images.map((image) => (
                <div key={image.id} className="group relative hover-lift">
                  <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-muted to-muted/50 shadow-lg">
                    <img
                      src={image.image_url}
                      alt={image.prompt}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000000)}?w=600&h=600&fit=crop`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <div className="space-y-2">
                      <p className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                        {image.prompt}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <Badge variant="outline" className="capitalize">
                          {image.style}
                        </Badge>
                        <span className="text-muted-foreground">
                          {new Date(image.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                      onClick={() => handleDownload(image)}
                    >
                      <Download className="mr-2 h-3 w-3" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Creative Tips */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="text-lg">💡 Writing Better Prompts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">Be specific about colors, style, and mood</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">Mention the intended use (logo, header, social media)</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">Include composition details (close-up, wide shot)</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">Specify any text or elements to include</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="text-lg">🚀 Best Practices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 bg-success rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">Generate multiple variations of important images</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 bg-warning rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">Keep your brand colors and style consistent</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 bg-success rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">Download and backup your favorite images</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 bg-warning rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">Use high-quality images for professional materials</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreativeStudio;
