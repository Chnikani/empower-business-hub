
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Palette, Image, Download, Plus, Sparkles, Wand2, AlertCircle } from "lucide-react";
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
  const { currentBusiness, loading: businessLoading, error: businessError } = useBusiness();

  const loadImages = async () => {
    if (!currentBusiness) {
      setIsLoading(false);
      return;
    }
    
    try {
      const businessImages = await getBusinessImages(currentBusiness.id);
      setImages(businessImages);
    } catch (error) {
      console.error('Error loading images:', error);
      toast({
        title: "Error Loading Images",
        description: `Failed to load your generated images: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!businessLoading) {
      loadImages();
    }
  }, [currentBusiness, businessLoading]);

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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      toast({
        title: "Generation Failed",
        description: `Failed to generate image: ${errorMessage}`,
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
      console.error('Download failed:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download image. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (businessLoading) {
    return (
      <div className="space-y-8">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Setting Up Your Workspace...</h3>
            <p className="text-muted-foreground">Please wait while we prepare everything for you.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (businessError) {
    return (
      <div className="space-y-8">
        <Card className="border-destructive">
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-destructive">Error Loading Business Data</h3>
            <p className="text-muted-foreground mb-4">{businessError}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentBusiness) {
    return (
      <div className="space-y-8">
        <Card>
          <CardContent className="p-12 text-center">
            <Palette className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Welcome to Creative Studio</h3>
            <p className="text-muted-foreground mb-6">Please select or create a business account to start generating amazing images with AI.</p>
            <Button variant="outline">
              Create Business Account
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Palette className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Creative Studio
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              Generate stunning visuals with AI-powered image creation
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Powered
          </Badge>
          <Badge variant="secondary" className="bg-pink-100 text-pink-700 border-pink-200">
            <Wand2 className="h-3 w-3 mr-1" />
            High Quality
          </Badge>
        </div>
      </div>

      {/* Image Generator */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <Wand2 className="h-5 w-5 text-white" />
            </div>
            AI Image Generator
          </CardTitle>
          <CardDescription className="text-base">
            Describe your vision and watch our AI bring it to life with professional-quality images.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">What would you like to create?</label>
            <Textarea
              placeholder="Describe your image in detail... (e.g., 'A modern minimalist logo for a tech startup with blue and silver colors', 'Professional headshot of a businesswoman in office setting', 'Abstract geometric background for website header')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="resize-none text-base"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700">Art Style</label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Choose your style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realistic">🎯 Realistic Photography</SelectItem>
                  <SelectItem value="illustration">🎨 Digital Illustration</SelectItem>
                  <SelectItem value="abstract">🌟 Abstract Art</SelectItem>
                  <SelectItem value="minimalist">⚪ Minimalist Design</SelectItem>
                  <SelectItem value="vintage">📸 Vintage Style</SelectItem>
                  <SelectItem value="modern">💎 Modern & Sleek</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={handleGenerateImage} 
                disabled={isGenerating || !prompt.trim()}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full" />
                    Creating Magic...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-5 w-5" />
                    Generate Image
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gallery */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Image className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle>Your Gallery</CardTitle>
                <CardDescription>Browse and download your AI-generated masterpieces</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {images.length} images
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-20">
              <div className="animate-spin h-10 w-10 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Loading your creations...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-20">
              <div className="h-24 w-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Image className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Your Gallery Awaits</h3>
              <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
                Create your first AI-generated image using the generator above. Let your creativity flow!
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {images.map((image) => (
                <div key={image.id} className="group">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-lg mb-4 relative">
                    <img
                      src={image.image_url}
                      alt={image.prompt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=600&fit=crop`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-purple-600 transition-colors">
                        {image.prompt}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <Badge variant="outline" className="capitalize font-medium">
                          {image.style}
                        </Badge>
                        <span className="text-gray-500">
                          {new Date(image.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      className="w-full hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-all duration-200"
                      onClick={() => handleDownload(image)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Image
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreativeStudio;
