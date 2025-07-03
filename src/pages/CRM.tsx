import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Mail, Users, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'lead' | 'customer' | 'prospect';
  value: number;
  createdAt: string;
}

const CRM = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);

  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'lead' as 'lead' | 'customer' | 'prospect',
    value: '',
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddContact = () => {
    if (!newContact.name || !newContact.email) {
      toast({
        title: "Error",
        description: "Please fill in name and email",
        variant: "destructive",
      });
      return;
    }

    const contact: Contact = {
      id: Date.now().toString(),
      name: newContact.name,
      email: newContact.email,
      phone: newContact.phone,
      company: newContact.company,
      status: newContact.status,
      value: parseFloat(newContact.value) || 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setContacts([contact, ...contacts]);
    setNewContact({ name: '', email: '', phone: '', company: '', status: 'lead', value: '' });
    setIsDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Contact added successfully",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'customer': return 'bg-green-100 text-green-800';
      case 'lead': return 'bg-blue-100 text-blue-800';
      case 'prospect': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalValue = contacts.reduce((sum, contact) => sum + contact.value, 0);
  const customerCount = contacts.filter(c => c.status === 'customer').length;
  const leadCount = contacts.filter(c => c.status === 'lead').length;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CRM</h1>
          <p className="text-muted-foreground">
            Manage your customer relationships and sales pipeline.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
              <DialogDescription>
                Enter the contact details to add them to your CRM.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  placeholder="Enter contact name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={newContact.company}
                  onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={newContact.status} onValueChange={(value: 'lead' | 'customer' | 'prospect') => setNewContact({ ...newContact, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="prospect">Prospect</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="value">Potential Value ($)</Label>
                <Input
                  id="value"
                  type="number"
                  value={newContact.value}
                  onChange={(e) => setNewContact({ ...newContact, value: e.target.value })}
                  placeholder="0"
                />
              </div>
              <Button onClick={handleAddContact} className="w-full">
                Add Contact
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {contacts.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-primary/10 p-6">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">No Contacts Yet</h2>
            <p className="text-muted-foreground max-w-md">
              Start building your customer database by adding your first contact.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Contact
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {/* CRM Summary */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contacts.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{customerCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{leadCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>

          {/* Contacts Table */}
          <Card>
            <CardHeader>
              <CardTitle>Contacts</CardTitle>
              <CardDescription>Manage your customer and prospect database</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">{contact.name}</TableCell>
                      <TableCell>{contact.company}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.phone}</TableCell>
                      <TableCell>
                        <span className={`capitalize px-2 py-1 rounded text-xs ${getStatusColor(contact.status)}`}>
                          {contact.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${contact.value.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default CRM;
