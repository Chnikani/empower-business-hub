
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette, Image, Download, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GeneratedImage {
  id: string;
  prompt: string;
  style: string;
  createdAt: string;
  url: string;
}

const CreativeStudio = () => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([
    {
      id: '1',
      prompt: 'Modern office workspace with plants',
      style: 'realistic',
      createdAt: '2024-01-15',
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400'
    },
    {
      id: '2',
      prompt: 'Abstract geometric pattern in blue',
      style: 'abstract',
      createdAt: '2024-01-14',
      url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400'
    },
    {
      id: '3',
      prompt: 'Professional team meeting illustration',
      style: 'illustration',
      createdAt: '2024-01-13',
      url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400'
    }
  ]);
  
  const { toast } = useToast();

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a description for your image",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate image generation (in real app, this would call an AI service)
    setTimeout(() => {
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        prompt,
        style,
        createdAt: new Date().toISOString().split('T')[0],
        url: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000000)}?w=400`
      };
      
      setImages([newImage, ...images]);
      setPrompt('');
      setIsGenerating(false);
      
      toast({
        title: "Success",
        description: "Image generated successfully!",
      });
    }, 2000);
  };

  const handleDownload = (image: GeneratedImage) => {
    // In a real app, this would download the actual image
    toast({
      title: "Download Started",
      description: "Your image download has begun",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Creative Studio</h1>
        <p className="text-muted-foreground">
          Generate custom images and manage your creative assets for marketing and branding.
        </p>
      </div>

      {/* Image Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            AI Image Generator
          </CardTitle>
          <CardDescription>
            Describe what you want to create and our AI will generate custom images for your business.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Textarea
              placeholder="Describe the image you want to generate... (e.g., 'Modern business logo with blue and green colors', 'Professional team photo for website header')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger>
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realistic">Realistic</SelectItem>
                  <SelectItem value="illustration">Illustration</SelectItem>
                  <SelectItem value="abstract">Abstract</SelectItem>
                  <SelectItem value="minimalist">Minimalist</SelectItem>
                  <SelectItem value="vintage">Vintage</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleGenerateImage} 
              disabled={isGenerating}
              className="px-8"
            >
              {isGenerating ? (
                <>Generating...</>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Images Gallery */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Your Generated Images
          </CardTitle>
          <CardDescription>
            Browse and download your AI-generated images
          </CardDescription>
        </CardHeader>
        <CardContent>
          {images.length === 0 ? (
            <div className="text-center py-12">
              <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No images yet</h3>
              <p className="text-muted-foreground">Generate your first image to get started</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {images.map((image) => (
                <div key={image.id} className="group relative">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={image.url}
                      alt={image.prompt}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-3 space-y-2">
                    <p className="text-sm font-medium line-clamp-2">{image.prompt}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="capitalize px-2 py-1 bg-secondary rounded">
                        {image.style}
                      </span>
                      <span>{image.createdAt}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
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

      {/* Asset Management Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Creative Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Writing Better Prompts</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Be specific about colors, style, and mood</li>
                <li>• Mention the intended use (logo, header, social media)</li>
                <li>• Include composition details (close-up, wide shot)</li>
                <li>• Specify any text or elements to include</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Best Practices</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Generate multiple variations of important images</li>
                <li>• Keep your brand colors and style consistent</li>
                <li>• Download and backup your favorite images</li>
                <li>• Use high-quality images for professional materials</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreativeStudio;
