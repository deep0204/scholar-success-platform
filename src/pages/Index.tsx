import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Users, Video, MessageSquare, Award, LogIn, UserPlus } from 'lucide-react';
import Trophy from '@/components/ui/trophy';

const Index = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: <GraduationCap className="h-8 w-8 text-campus-blue" />,
      title: "Discover Top Colleges",
      description: "Explore and filter colleges based on your preferences, budget, and academic requirements."
    },
    {
      icon: <Users className="h-8 w-8 text-campus-purple" />,
      title: "Connect with Mentors",
      description: "Book sessions with experienced mentors from top institutions across the country."
    },
    {
      icon: <Video className="h-8 w-8 text-campus-blue" />,
      title: "Career Videos",
      description: "Watch insightful videos about career paths, education options, and exam strategies."
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-campus-purple" />,
      title: "AI Career Coach",
      description: "Get personalized guidance through our AI assistant trained to help with career decisions."
    },
    {
      icon: <Award className="h-8 w-8 text-campus-blue" />,
      title: "Scholarship Finder",
      description: "Access a database of scholarships tailored to your profile and qualifications."
    },
    {
      icon: <Trophy className="h-8 w-8 text-campus-purple" />,
      title: "Earn XP & Badges",
      description: "Track your progress and earn rewards as you complete various activities on the platform."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-campus-blue to-campus-purple py-12 md:py-24">
        <div className="container mx-auto px-4 flex flex-col items-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 animate-fade-in">
            CampusConnect
          </h1>
          <p className="text-xl md:text-2xl text-center max-w-3xl mb-10 animate-fade-in" style={{animationDelay: '0.2s'}}>
            Your all-in-one platform to explore colleges, connect with mentors, and build your academic future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{animationDelay: '0.4s'}}>
            <Button 
              size="lg" 
              variant="default" 
              className="bg-white text-campus-blue hover:bg-gray-100"
              onClick={() => navigate('/login')}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90" 
              onClick={() => navigate('/register')}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Register Now
            </Button>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything You Need To Succeed
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="animate-fade-in hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-muted py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students who are making informed decisions about their education and career path.
          </p>
          <Button 
            size="lg" 
            className="bg-campus-blue hover:bg-campus-blue/90"
            onClick={() => navigate('/register')}
          >
            Get Started Now
          </Button>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-card text-card-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 CampusConnect. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
