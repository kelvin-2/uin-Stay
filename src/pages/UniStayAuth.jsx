import React, { useState } from 'react';
import { Building, User, Mail, Lock, Home, BookOpen, Phone, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const UniStayAuth = () => {
  const [userType, setUserType] = useState('student');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-xl shadow-lg border-blue-100">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-500/10 p-3 rounded-full">
              <Home className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-blue-900">Welcome to UniStay</CardTitle>
          <CardDescription className="text-blue-600">
            Your gateway to student accommodation
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex gap-4 justify-center mb-6">
            <Button
              variant={userType === 'student' ? 'default' : 'outline'}
              onClick={() => setUserType('student')}
              className={`flex items-center gap-2 ${
                userType === 'student' 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'hover:bg-blue-50'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Student
            </Button>
            <Button
              variant={userType === 'landlord' ? 'default' : 'outline'}
              onClick={() => setUserType('landlord')}
              className={`flex items-center gap-2 ${
                userType === 'landlord' 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'hover:bg-blue-50'
              }`}
            >
              <Building className="h-4 w-4" />
              Landlord
            </Button>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-blue-50">
              <TabsTrigger 
                value="login"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Sign up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-blue-900">Email</Label>
                  <div className="relative">
                    <Mail className="h-4 w-4 absolute left-3 top-3 text-blue-400" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="name@example.com"
                      className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-400" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-blue-900">Password</Label>
                  <div className="relative">
                    <Lock className="h-4 w-4 absolute left-3 top-3 text-blue-400" />
                    <Input 
                      id="password" 
                      type="password" 
                      className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-400" 
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-blue-900">
                    <input type="checkbox" className="rounded border-blue-300 text-blue-600" />
                    Remember me
                  </label>
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    Forgot password?
                  </a>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700" 
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full-name" className="text-blue-900">Full Name</Label>
                  <div className="relative">
                    <User className="h-4 w-4 absolute left-3 top-3 text-blue-400" />
                    <Input 
                      id="full-name" 
                      type="text" 
                      placeholder="John Doe"
                      className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-400" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-blue-900">Email</Label>
                  <div className="relative">
                    <Mail className="h-4 w-4 absolute left-3 top-3 text-blue-400" />
                    <Input 
                      id="signup-email" 
                      type="email" 
                      placeholder="name@example.com"
                      className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-400" 
                    />
                  </div>
                </div>

                {userType === 'student' && (
                  <div className="space-y-2">
                    <Label htmlFor="university" className="text-blue-900">University</Label>
                    <div className="relative">
                      <BookOpen className="h-4 w-4 absolute left-3 top-3 text-blue-400" />
                      <Input 
                        id="university" 
                        type="text" 
                        placeholder="Your University"
                        className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-400" 
                      />
                    </div>
                  </div>
                )}

                {userType === 'landlord' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-blue-900">Phone Number</Label>
                      <div className="relative">
                        <Phone className="h-4 w-4 absolute left-3 top-3 text-blue-400" />
                        <Input 
                          id="phone" 
                          type="tel" 
                          placeholder="+44 123 456 7890"
                          className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-400" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-blue-900">Primary Location</Label>
                      <div className="relative">
                        <MapPin className="h-4 w-4 absolute left-3 top-3 text-blue-400" />
                        <Input 
                          id="location" 
                          type="text" 
                          placeholder="City"
                          className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-400" 
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-blue-900">Password</Label>
                  <div className="relative">
                    <Lock className="h-4 w-4 absolute left-3 top-3 text-blue-400" />
                    <Input 
                      id="signup-password" 
                      type="password"
                      className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-400" 
                    />
                  </div>
                </div>

                <div className="text-sm text-blue-900">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-blue-300 text-blue-600" required />
                    I agree to the Terms of Service and Privacy Policy
                  </label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700" 
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="justify-center text-sm text-blue-600">
          {userType === 'student' ? 
            "Find your perfect student home" : 
            "List your properties to thousands of students"
          }
        </CardFooter>
      </Card>
    </div>
  );
};

export default UniStayAuth;