
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, FileText, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

const KnowledgeBase = () => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      title: 'Company Onboarding Process',
      content: 'This document outlines the complete onboarding process for new employees...',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
      tags: ['HR', 'Process']
    },
    {
      id: '2',
      title: 'Marketing Strategy 2024',
      content: 'Our comprehensive marketing strategy for the upcoming year includes...',
      createdAt: '2024-01-14',
      updatedAt: '2024-01-16',
      tags: ['Marketing', 'Strategy']
    },
    {
      id: '3',
      title: 'Product Launch Checklist',
      content: 'Essential steps to follow when launching a new product or feature...',
      createdAt: '2024-01-13',
      updatedAt: '2024-01-13',
      tags: ['Product', 'Checklist']
    },
  ]);

  const [newDocument, setNewDocument] = useState({
    title: '',
    content: '',
    tags: '',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleCreateDocument = () => {
    if (!newDocument.title || !newDocument.content) {
      toast({
        title: "Error",
        description: "Please fill in title and content",
        variant: "destructive",
      });
      return;
    }

    const document: Document = {
      id: Date.now().toString(),
      title: newDocument.title,
      content: newDocument.content,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      tags: newDocument.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    };

    setDocuments([document, ...documents]);
    setNewDocument({ title: '', content: '', tags: '' });
    setIsDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Document created successfully",
    });
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
          <p className="text-muted-foreground">
            Organize and share your company's knowledge and documentation.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Document</DialogTitle>
              <DialogDescription>
                Create a new document to share knowledge with your team.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Document title"
                  value={newDocument.title}
                  onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })}
                />
              </div>
              <div>
                <Textarea
                  placeholder="Document content..."
                  value={newDocument.content}
                  onChange={(e) => setNewDocument({ ...newDocument, content: e.target.value })}
                  rows={8}
                />
              </div>
              <div>
                <Input
                  placeholder="Tags (comma-separated)"
                  value={newDocument.tags}
                  onChange={(e) => setNewDocument({ ...newDocument, tags: e.target.value })}
                />
              </div>
              <Button onClick={handleCreateDocument} className="w-full">
                Create Document
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Documents Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredDocuments.map((document) => (
          <Card 
            key={document.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              setSelectedDocument(document);
              setIsViewDialogOpen(true);
            }}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <Edit className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <CardTitle className="text-lg line-clamp-2">{document.title}</CardTitle>
              <CardDescription className="line-clamp-3">
                {document.content}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1 mb-2">
                {document.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Updated {document.updatedAt}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Document View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedDocument && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedDocument.title}</DialogTitle>
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedDocument.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </DialogHeader>
              <div className="mt-4">
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">{selectedDocument.content}</p>
                </div>
                <div className="mt-6 pt-4 border-t text-xs text-muted-foreground">
                  Created: {selectedDocument.createdAt} | Updated: {selectedDocument.updatedAt}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {filteredDocuments.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No documents found</h3>
            <p className="text-muted-foreground text-center">
              {searchTerm ? 'Try adjusting your search terms' : 'Create your first document to get started'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KnowledgeBase;
