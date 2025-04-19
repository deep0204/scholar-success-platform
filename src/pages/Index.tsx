
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Users, Video, MessageSquare, Award, LogIn, UserPlus, ArrowRight, ChevronRight, CheckCircle } from 'lucide-react';
import Trophy from '@/components/ui/trophy';

const Index = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: <GraduationCap className="h-8 w-8 text-campus-blue" />,
      title: "College Explorer",
      description: "Discover and compare colleges that match your preferences, interests, and academic achievements."
    },
    {
      icon: <Users className="h-8 w-8 text-campus-blue" />,
      title: "Mentor Connect",
      description: "Connect with experienced mentors who can guide you through the college selection process."
    },
    {
      icon: <Video className="h-8 w-8 text-campus-blue" />,
      title: "Career Videos",
      description: "Watch informative videos about career paths, college experiences, and educational journeys from successful professionals."
    }
  ];

  const stats = [
    { value: "10k+", label: "Colleges Listed" },
    { value: "1,500+", label: "Admissions" },
    { value: "100+", label: "Counselors" },
    { value: "800+", label: "Scholarships" }
  ];

  const testimonials = [
    {
      quote: "CampusConnect helped me find my dream college within my budget. The personalized recommendations were spot on!",
      name: "Priya S.",
      role: "Engineering Student"
    },
    {
      quote: "The mentors on CampusConnect gave me valuable insights that no brochure could provide. It made my decision so much easier.",
      name: "Rahul M.",
      role: "Medical Student"
    },
    {
      quote: "As a first-generation college student, I was lost until I found CampusConnect. Now I'm attending my ideal college!",
      name: "Ananya K.",
      role: "Business Student"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section with Browser Window */}
      <div className="bg-gradient-to-r from-[#0EA5E9] to-[#9b87f5] py-16 md:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2 text-white z-10 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Find Your Perfect College
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-lg opacity-90">
              Your personalized guide to discovering colleges that match your academic goals, budget, and preferences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-white text-[#0EA5E9] hover:bg-gray-100"
                onClick={() => navigate('/register')}
              >
                <span className="mr-2">Register Now</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                className="bg-transparent border border-white text-white hover:bg-white/10" 
                onClick={() => navigate('/login')}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            </div>
          </div>
          
          <div className="md:w-1/2 mt-12 md:mt-0 z-10">
            <div className="bg-white rounded-lg shadow-2xl overflow-hidden max-w-xl mx-auto">
              {/* Browser Chrome */}
              <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center">
                <div className="flex space-x-2 mr-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="bg-white rounded-md flex-1 py-1 px-3 text-xs text-gray-500 flex items-center">
                  <span>campusconnect.com</span>
                </div>
              </div>
              
              {/* Browser Content */}
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">How Does It Work</h2>
                <p className="text-gray-500 mb-8 text-sm">Find your perfect college match in three simple steps.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center p-4 rounded-lg bg-gray-50">
                      <div className="text-xl font-bold text-campus-blue">{stat.value}</div>
                      <div className="text-xs text-gray-500">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>
      </div>
      
      {/* Why CampusConnect Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why CampusConnect?</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              We simplify the college search process by providing personalized recommendations and expert guidance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="animate-fade-in hover:shadow-md transition-shadow border-none">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="mb-4 bg-blue-50 p-4 rounded-full">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Key Features with Browser Window */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Everything you need to make an informed college decision.
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2">
              <div className="space-y-8">
                <div className="flex gap-4 items-start">
                  <div className="bg-[#9b87f5]/10 p-3 rounded-full">
                    <GraduationCap className="h-6 w-6 text-[#9b87f5]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">College Explorer</h3>
                    <p className="text-gray-600">
                      Filter colleges by course, location, fees, and more to find your perfect match. Compare options side by side and make informed decisions.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="bg-[#0EA5E9]/10 p-3 rounded-full">
                    <Users className="h-6 w-6 text-[#0EA5E9]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Mentor Connect</h3>
                    <p className="text-gray-600">
                      Connect with students and alumni from your target colleges who can provide insider perspectives and honest feedback about campus life.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="bg-[#9b87f5]/10 p-3 rounded-full">
                    <Video className="h-6 w-6 text-[#9b87f5]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Career Videos</h3>
                    <p className="text-gray-600">
                      Watch informative videos about different career paths, college experiences, and educational journeys from successful professionals.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                {/* Browser Chrome */}
                <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center">
                  <div className="flex space-x-2 mr-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="bg-white rounded-md flex-1 py-1 px-3 text-xs text-gray-500 flex items-center">
                    <span>campusconnect.com</span>
                  </div>
                </div>
                
                {/* Browser Content */}
                <div className="p-6 relative">
                  <div className="rounded-lg overflow-hidden bg-[#f8f8f8] p-4">
                    <div className="text-center">
                      <div className="font-bold text-lg text-[#0EA5E9] inline-block px-3 py-1 rounded-full bg-[#0EA5E9]/10 mb-6">Hurry Up!</div>
                      <h3 className="text-xl font-bold mb-2">Avail your Scholarship upto 25000/-</h3>
                      <p className="text-sm text-gray-500 mb-4">Are you planning for MBBS?</p>
                      <Button className="bg-[#0EA5E9]">Claim Now</Button>
                    </div>
                    
                    <div className="mt-8 flex items-center justify-center gap-2">
                      <img src="/placeholder.svg" className="w-8 h-8" alt="Icon" />
                      <div className="text-lg font-bold">800+</div>
                      <div className="text-sm text-gray-500">Scholarships</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-[#0EA5E9] rounded-lg p-6 text-white">
                <div className="text-3xl font-bold">10k+</div>
                <div className="text-lg">Colleges Listed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonials Section */}
      <div className="py-16 bg-[#0EA5E9] text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Student Success Stories</h2>
            <p className="text-white/90 max-w-xl mx-auto">
              Hear what our users have to say about their experience with CampusConnect.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20"
              >
                <p className="italic mb-4">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-white/80">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Dream College?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have found their perfect college match with CampusConnect.
          </p>
          <Button 
            size="lg" 
            className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90"
            onClick={() => navigate('/register')}
          >
            Register Now
          </Button>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-[#1A1F2C] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-8 w-8 text-[#0EA5E9]" />
                <span className="text-xl font-bold">CampusConnect</span>
              </div>
              <p className="text-gray-400 mb-4">
                Your personalized guide to finding the perfect college.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Register</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Login</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Connect</h3>
              <div className="flex gap-4">
                <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© 2025 CampusConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
