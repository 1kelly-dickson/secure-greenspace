
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { signIn, signUp } from "@/state/auth";
import { useHookstate } from '@hookstate/core';
import { authState } from "@/state/auth";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useHookstate(authState);
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        console.error('Google sign in error:', error);
        toast({
          variant: "destructive",
          title: "Google Sign In Failed",
          description: error.message,
        });
      }
    } catch (error) {
      console.error('Unexpected error during Google sign in:', error);
      toast({
        variant: "destructive",
        title: "Google Sign In Failed",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isLogin) {
      // Login logic - support both email and username
      let loginEmail = usernameOrEmail;
      
      // If it doesn't contain @, treat it as username and fetch email
      if (!usernameOrEmail.includes('@')) {
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', usernameOrEmail)
            .single();

          if (profileError || !profileData) {
            toast({
              variant: "destructive",
              title: "Login failed",
              description: "Username not found. Please check your username or use your email.",
            });
            setIsLoading(false);
            return;
          }

          // Get the user's email from auth.users
          const { data: userData, error: userError } = await supabase.auth.admin.getUserById(profileData.id);
          
          if (userError || !userData.user?.email) {
            toast({
              variant: "destructive",
              title: "Login failed",
              description: "Could not find email for this username. Please use your email to login.",
            });
            setIsLoading(false);
            return;
          }

          loginEmail = userData.user.email;
        } catch (error) {
          console.error('Error fetching user email:', error);
          toast({
            variant: "destructive",
            title: "Login failed",
            description: "Error looking up username. Please try using your email instead.",
          });
          setIsLoading(false);
          return;
        }
      }

      const result = await signIn(loginEmail, password);
      if (result.success) {
        toast({
          title: "Login successful!",
          description: "Welcome back!",
        });
        navigate('/dashboard');
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid credentials. Please check your email/username and password.",
        });
      }
    } else {
      // Sign up logic
      if (password !== confirmPassword) {
        toast({
          variant: "destructive",
          title: "Password mismatch",
          description: "Passwords do not match. Please try again.",
        });
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        toast({
          variant: "destructive",
          title: "Password too short",
          description: "Password must be at least 6 characters long.",
        });
        setIsLoading(false);
        return;
      }

      const result = await signUp(email, password);
      if (result.success) {
        // Update the profile with full name
        if (result.data?.user) {
          try {
            const { error: profileError } = await supabase
              .from('profiles')
              .update({ 
                full_name: fullName,
                username: fullName.toLowerCase().replace(/\s+/g, '_') + '_' + Math.random().toString(36).substr(2, 4)
              })
              .eq('id', result.data.user.id);

            if (profileError) {
              console.error('Error updating profile:', profileError);
            }
          } catch (error) {
            console.error('Error updating profile:', error);
          }
        }

        toast({
          title: "Sign up successful!",
          description: "Please check your email to verify your account before logging in.",
        });
        setIsLogin(true);
        setEmail('');
        setFullName('');
        setPassword('');
        setConfirmPassword('');
      } else {
        toast({
          variant: "destructive",
          title: "Sign up failed",
          description: result.error?.message || "Failed to create account. Please try again.",
        });
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="grid h-screen place-items-center bg-gray-50">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>{isLogin ? "Welcome Back" : "Create Account"}</CardTitle>
          <CardDescription>
            {isLogin ? "Sign in to your account" : "Sign up for a new account"}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button 
            variant="outline" 
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full"
          >
            <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
            </svg>
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  required={!isLogin}
                />
              </div>
            )}

            {isLogin ? (
              <div className="grid gap-2">
                <Label htmlFor="usernameOrEmail">Email or Username</Label>
                <Input
                  id="usernameOrEmail"
                  type="text"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder="Enter your email or username"
                  required
                />
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {!isLogin && (
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required={!isLogin}
                />
              </div>
            )}

            <CardFooter className="flex flex-col gap-4 px-0">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Processing..." : (isLogin ? "Sign In" : "Sign Up")}
              </Button>
              <Button 
                type="button" 
                variant="link" 
                onClick={() => setIsLogin(!isLogin)}
                disabled={isLoading}
              >
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
