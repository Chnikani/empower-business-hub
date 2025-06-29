import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Users, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface InvitationInfo {
  id: string;
  group_id: string;
  invitation_code: string;
  expires_at: string | null;
  max_uses: number | null;
  current_uses: number;
  is_active: boolean;
  chat_groups: {
    name: string;
    description: string;
    business_accounts: {
      name: string;
    };
  };
}

const InviteAccept = () => {
  const { code } = useParams<{ code: string }>();
  const { user, signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [invitation, setInvitation] = useState<InvitationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSignUp, setShowSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (code) {
      validateInvitation();
    }
  }, [code]);

  useEffect(() => {
    if (user && invitation) {
      joinGroup();
    }
  }, [user, invitation]);

  const validateInvitation = async () => {
    try {
      const { data, error } = await supabase
        .from('group_invitations')
        .select(`
          id,
          group_id,
          invitation_code,
          expires_at,
          max_uses,
          current_uses,
          is_active,
          chat_groups!inner(
            name,
            description,
            business_accounts!inner(name)
          )
        `)
        .eq('invitation_code', code)
        .single();

      if (error) throw error;

      // Check if invitation is valid
      if (!data.is_active) {
        throw new Error('This invitation link has been deactivated');
      }

      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        throw new Error('This invitation link has expired');
      }

      if (data.max_uses && data.current_uses >= data.max_uses) {
        throw new Error('This invitation link has reached its usage limit');
      }

      setInvitation(data);
    } catch (error: any) {
      console.error('Error validating invitation:', error);
      setError(error.message || 'Invalid invitation link');
    } finally {
      setLoading(false);
    }
  };

  const joinGroup = async () => {
    if (!user || !invitation) return;

    setProcessing(true);
    try {
      // Check if user is already a member
      const { data: existingMember } = await supabase
        .from('group_members')
        .select('id')
        .eq('group_id', invitation.group_id)
        .eq('user_id', user.id)
        .single();

      if (existingMember) {
        toast({
          title: "Already a member",
          description: "You're already a member of this group"
        });
        navigate('/chat');
        return;
      }

      // Add user to group
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: invitation.group_id,
          user_id: user.id,
          is_admin: false
        });

      if (memberError) throw memberError;

      // Update invitation usage count
      const { error: updateError } = await supabase
        .from('group_invitations')
        .update({ current_uses: invitation.current_uses + 1 })
        .eq('id', invitation.id);

      if (updateError) throw updateError;

      toast({
        title: "Welcome!",
        description: `You've joined ${invitation.chat_groups.name}`
      });

      navigate('/chat');
    } catch (error: any) {
      console.error('Error joining group:', error);
      toast({
        title: "Error",
        description: "Failed to join the group",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !fullName) return;

    setProcessing(true);
    try {
      await signUp(email, password, {
        full_name: fullName,
        role: 'business_manager'
      });

      toast({
        title: "Account created!",
        description: "Please check your email to verify your account, then you'll be added to the group."
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Validating invitation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Invalid Invitation</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => navigate('/')} variant="outline">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (processing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Joining group...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
      <Card className="w-full max-w-md modern-card">
        <CardHeader className="text-center">
          <div className="mx-auto h-12 w-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mb-4">
            <Users className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl">Team Invitation</CardTitle>
          {invitation && (
            <div className="text-center">
              <p className="text-muted-foreground">You've been invited to join</p>
              <h3 className="text-lg font-semibold text-gradient">
                {invitation.chat_groups.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                in {invitation.chat_groups.business_accounts.name}
              </p>
              {invitation.chat_groups.description && (
                <p className="text-sm text-muted-foreground mt-2">
                  {invitation.chat_groups.description}
                </p>
              )}
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          {!user ? (
            <div className="space-y-4">
              {!showSignUp ? (
                <div className="space-y-4">
                  <p className="text-center text-muted-foreground">
                    Sign in or create an account to join this team
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => navigate('/login')}
                    >
                      Sign In
                    </Button>
                    <Button 
                      className="flex-1 btn-gradient"
                      onClick={() => setShowSignUp(true)}
                    >
                      Create Account
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSignUp}
                      disabled={!fullName || !email || !password}
                      className="flex-1 btn-gradient"
                    >
                      Create Account & Join
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowSignUp(false)}
                    >
                      Back
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Welcome to the team!</h3>
              <p className="text-muted-foreground mb-6">
                You've successfully joined {invitation?.chat_groups.name}
              </p>
              <Button onClick={() => navigate('/chat')} className="btn-gradient">
                Go to Team Chat
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InviteAccept;
