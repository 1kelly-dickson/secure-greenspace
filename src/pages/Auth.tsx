
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
import { z } from 'zod';

// Email validation schema with comprehensive checks
const emailSchema = z.string()
  .trim()
  .min(1, "Email is required")
  .email("Please enter a valid email address")
  .max(255, "Email must be less than 255 characters")
  .refine((email) => {
    // Check for valid email format with proper domain
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }, "Email must have a valid domain (e.g., user@example.com)")
  .refine((email) => {
    // Prevent disposable/temporary email domains (common ones)
    const disposableDomains = ['tempmail.com', 'throwaway.email', '10minutemail.com', 'guerrillamail.com'];
    const domain = email.split('@')[1]?.toLowerCase();
    return !disposableDomains.includes(domain);
  }, "Temporary email addresses are not allowed");

// Password validation schema
const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be less than 72 characters")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

// Username validation schema
const usernameSchema = z.string()
  .trim()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be less than 30 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores");

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
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
    setErrors({});

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
      // Sign up logic - validate all inputs
      const validationErrors: Record<string, string> = {};

      // Validate email
      const emailResult = emailSchema.safeParse(email);
      if (!emailResult.success) {
        validationErrors.email = emailResult.error.errors[0].message;
      }

      // Validate password
      const passwordResult = passwordSchema.safeParse(password);
      if (!passwordResult.success) {
        validationErrors.password = passwordResult.error.errors[0].message;
      }

      // Validate username if provided
      if (fullName) {
        const usernameResult = usernameSchema.safeParse(fullName);
        if (!usernameResult.success) {
          validationErrors.fullName = usernameResult.error.errors[0].message;
        }
      }

      // Check if passwords match
      if (password !== confirmPassword) {
        validationErrors.confirmPassword = "Passwords don't match";
      }

      // If there are validation errors, show them and stop
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: Object.values(validationErrors)[0],
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
                <Label htmlFor="fullName">Username</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    setErrors((prev) => ({ ...prev, fullName: '' }));
                  }}
                  placeholder="Choose a unique username (3-30 characters)"
                  className={errors.fullName ? 'border-destructive' : ''}
                  required={!isLogin}
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Letters, numbers, and underscores only
                </p>
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  placeholder="Enter your email"
                  className={errors.email ? 'border-destructive' : ''}
                  required={!isLogin}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: '' }));
                }}
                placeholder="Enter your password"
                className={errors.password ? 'border-destructive' : ''}
                required
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
              {!isLogin && (
                <p className="text-xs text-muted-foreground">
                  Must be 8+ characters with uppercase, lowercase, and numbers
                </p>
              )}
            </div>

            {!isLogin && (
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                  }}
                  placeholder="Confirm your password"
                  className={errors.confirmPassword ? 'border-destructive' : ''}
                  required={!isLogin}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                )}
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
