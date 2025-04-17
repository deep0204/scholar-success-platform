
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/toast';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [step, setStep] = React.useState(1);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock registration - in reality this would call Supabase auth.signUp()
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Registration successful",
        description: "Redirecting to login",
      });
      navigate('/login');
    }, 1500);
  };

  const handleNextStep = () => {
    setStep(step + 1);
    window.scrollTo(0, 0);
  };
  
  const handlePrevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4 py-10">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-campus-blue flex items-center justify-center">
            <span className="text-white font-bold text-xl">CC</span>
          </div>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            {step === 1 ? "Enter your personal information to get started" : 
             step === 2 ? "Tell us about your education" : 
             "Select your preferences"}
          </CardDescription>
          
          <div className="flex justify-between items-center mt-4 px-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm 
                  ${i < step ? 'bg-campus-blue text-white' : 
                    i === step ? 'bg-campus-blue/20 border-2 border-campus-blue text-campus-blue' : 
                    'bg-muted text-muted-foreground'}`}>
                  {i}
                </div>
                <span className="text-xs mt-1 text-muted-foreground">
                  {i === 1 ? "Personal" : i === 2 ? "Education" : "Preferences"}
                </span>
              </div>
            ))}
          </div>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <RadioGroup defaultValue="male" className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" min="13" max="100" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+91 9876543210" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="student@example.com" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required />
                </div>
              </>
            )}
            
            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="educationBackground">Current Education Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high_school">High School (10th)</SelectItem>
                      <SelectItem value="higher_secondary">Higher Secondary (12th)</SelectItem>
                      <SelectItem value="undergraduate">Undergraduate</SelectItem>
                      <SelectItem value="graduate">Graduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="percentage">Overall Percentage/CGPA</Label>
                  <Input id="percentage" type="text" placeholder="e.g. 85% or 8.5" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stream">Stream/Field of Study</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your stream" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="commerce">Commerce</SelectItem>
                      <SelectItem value="arts">Arts/Humanities</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="medical">Medical</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            
            {step === 3 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="preferredStates">Preferred States</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select preferred states" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="karnataka">Karnataka</SelectItem>
                      <SelectItem value="tamil_nadu">Tamil Nadu</SelectItem>
                      <SelectItem value="telangana">Telangana</SelectItem>
                      <SelectItem value="west_bengal">West Bengal</SelectItem>
                      <SelectItem value="uttar_pradesh">Uttar Pradesh</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">You can select multiple states after registration</p>
                </div>
              </>
            )}
          </CardContent>
          
          <CardFooter className={`flex ${step !== 1 ? 'justify-between' : 'justify-end'}`}>
            {step !== 1 && (
              <Button type="button" variant="outline" onClick={handlePrevStep}>
                Previous
              </Button>
            )}
            
            {step !== 3 ? (
              <Button type="button" className="bg-campus-blue hover:bg-campus-blue/90" onClick={handleNextStep}>
                Next
              </Button>
            ) : (
              <Button type="submit" className="bg-campus-blue hover:bg-campus-blue/90" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Complete Registration"}
              </Button>
            )}
          </CardFooter>
        </form>
        
        <div className="px-6 pb-6 text-center text-sm">
          Already have an account?{' '}
          <Button variant="link" className="p-0 h-auto" type="button" onClick={() => navigate('/login')}>
            Login
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Register;
