
import { useState } from 'react'
import { useBusiness } from '@/contexts/BusinessContext'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Building2, Plus, LogOut } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export const BusinessSelector = () => {
  const { currentBusiness, businesses, setCurrentBusiness, createBusiness } = useBusiness()
  const { signOut } = useAuth()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newBusinessName, setNewBusinessName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()

  const handleCreateBusiness = async () => {
    if (!newBusinessName.trim()) return

    setIsCreating(true)
    try {
      await createBusiness(newBusinessName.trim())
      setNewBusinessName('')
      setIsDialogOpen(false)
      toast({
        title: "Business Created!",
        description: `${newBusinessName} has been created successfully.`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={currentBusiness?.id || ''}
        onValueChange={(value) => {
          const business = businesses.find(b => b.id === value)
          if (business) setCurrentBusiness(business)
        }}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select Business" />
        </SelectTrigger>
        <SelectContent>
          {businesses.map((business) => (
            <SelectItem key={business.id} value={business.id}>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                {business.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Business</DialogTitle>
            <DialogDescription>
              Add a new business account to manage separately.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="business-name">Business Name</Label>
              <Input
                id="business-name"
                placeholder="Enter business name"
                value={newBusinessName}
                onChange={(e) => setNewBusinessName(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCreateBusiness}
                disabled={isCreating || !newBusinessName.trim()}
                className="flex-1"
              >
                {isCreating ? 'Creating...' : 'Create Business'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Button variant="ghost" size="icon" onClick={signOut}>
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  )
}
