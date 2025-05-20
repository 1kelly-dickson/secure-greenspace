import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { signIn, signUp } from "@/state/auth";
import { useHookstate } from '@hookstate/core';
import { authState } from "@/state/auth";
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const auth = useHookstate(authState);
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      const result = await signIn(email, password);
      if (result.success) {
        toast({
          title: "Login successful!",
          description: "You have successfully logged in.",
        })
        navigate('/dashboard');
      } else {
        toast({
          variant: "destructive",
          title: "Login failed!",
          description: "Invalid credentials. Please try again.",
        })
      }
    } else {
      const result = await signUp(email, password);
      if (result.success) {
        toast({
          title: "Signup successful!",
          description: "You have successfully signed up. Please check your email to verify your account.",
        })
        setIsLogin(true); // Switch to login after successful signup
      } else {
        toast({
          variant: "destructive",
          title: "Signup failed!",
          description: "Failed to sign up. Please try again.",
        })
      }
    }
  };

  return (
    <div className="grid h-screen place-items-center">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>{isLogin ? "Login" : "Sign Up"}</CardTitle>
          <CardDescription>Enter your email and password to {isLogin ? "login" : "create an account"}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
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
            <CardFooter className="flex justify-between mt-4">
              <Button type="submit">{isLogin ? "Login" : "Sign Up"}</Button>
              <Button type="button" variant="link" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
