
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ExternalLink, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getColleges, viewCollege } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const Colleges = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    stream: '',
    state: '',
    budget: [0, 1000000],
    rating: 0,
  });
  const [colleges, setColleges] = useState([]);
  const [streams, setStreams] = useState([]);
  const [states, setStates] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchColleges = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { colleges: data, error: collegeError } = await getColleges();
        
        if (collegeError) {
          throw collegeError;
        }
        
        setColleges(data || []);
        
        // Extract unique streams and states
        if (data && data.length > 0) {
          const uniqueStreams = Array.from(new Set(data.map(college => college.stream)));
          const uniqueStates = Array.from(new Set(data.map(college => college.state)));
          setStreams(uniqueStreams);
          setStates(uniqueStates);
        }
      } catch (err) {
        console.error("Error fetching colleges:", err);
        setError("Failed to fetch colleges. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to fetch colleges. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchColleges();
  }, [toast]);
  
  // Format budget values
  const formatBudget = (value) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)} Lakh`;
    }
    return `₹${value}`;
  };

  // Filter colleges based on selected filters
  const filteredColleges = colleges.filter(college => {
    const matchesSearch = college.name.toLowerCase().includes(filters.search.toLowerCase()) || 
                          college.location.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStream = filters.stream === '' || college.stream === filters.stream;
    const matchesState = filters.state === '' || college.state === filters.state;
    const matchesBudget = college.budget_value >= filters.budget[0] && 
                          college.budget_value <= filters.budget[1];
    const matchesRating = college.rating >= filters.rating;

    return matchesSearch && matchesStream && matchesState && matchesBudget && matchesRating;
  });

  // Handle applying to a college
  const handleApplyClick = (collegeName) => {
    toast({
      title: "Application Link",
      description: `Opening application page for ${collegeName}`,
    });
  };

  // Handle viewing college details
  const handleViewCollege = async (collegeId) => {
    if (!user?.id) return;
    
    try {
      await viewCollege(user.id, collegeId);
      toast({
        description: "College added to your recently viewed list",
      });
    } catch (error) {
      console.error("Error updating recently viewed colleges:", error);
    }
  };

  if (loading) {
    return <div className="p-4">Loading colleges...</div>;
  }
  
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">College Explorer</h1>
          <p className="text-muted-foreground">Find the perfect college for your future</p>
        </div>
        <Card className="text-center p-8">
          <CardContent className="pt-6">
            <p className="mb-4 text-red-500">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-campus-blue hover:bg-campus-blue/90"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If no colleges found after loading
  if (colleges.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">College Explorer</h1>
          <p className="text-muted-foreground">Find the perfect college for your future</p>
        </div>
        <Card className="text-center p-8">
          <CardContent className="pt-6">
            <p className="mb-4">No colleges available at the moment. Please check back later.</p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-campus-blue hover:bg-campus-blue/90"
            >
              Refresh Colleges
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">College Explorer</h1>
        <p className="text-muted-foreground">Find the perfect college for your future</p>
      </div>
      
      {/* Filter Section */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {/* Search Input */}
            <div className="col-span-1 lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search colleges..."
                  className="pl-8"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </div>
            </div>
            
            {/* Stream Filter */}
            <div>
              <Select 
                value={filters.stream}
                onValueChange={(value) => setFilters({...filters, stream: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Stream" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Streams</SelectItem>
                  {streams.map(stream => (
                    <SelectItem key={stream} value={stream}>{stream}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* State Filter */}
            <div>
              <Select
                value={filters.state}
                onValueChange={(value) => setFilters({...filters, state: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All States</SelectItem>
                  {states.map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Rating Filter */}
            <div>
              <Select
                value={filters.rating.toString()}
                onValueChange={(value) => setFilters({...filters, rating: parseFloat(value)})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any Rating</SelectItem>
                  <SelectItem value="4">4+ Stars</SelectItem>
                  <SelectItem value="4.5">4.5+ Stars</SelectItem>
                  <SelectItem value="4.8">4.8+ Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Budget Slider */}
          <div className="mt-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Budget Range</span>
              <span className="text-sm text-muted-foreground">
                {formatBudget(filters.budget[0])} - {formatBudget(filters.budget[1])}
              </span>
            </div>
            <Slider
              defaultValue={[0, 1000000]}
              min={0}
              max={1000000}
              step={50000}
              value={filters.budget}
              onValueChange={(value) => setFilters({...filters, budget: value})}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Results Section */}
      {filteredColleges.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredColleges.map((college) => (
            <Card 
              key={college.id} 
              className="overflow-hidden hover:shadow-md transition-shadow"
              onClick={() => handleViewCollege(college.id)}
            >
              <div className="h-48 bg-muted">
                <img 
                  src={college.image_url || '/placeholder.svg'} 
                  alt={college.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </div>
              <CardContent className="pt-6">
                <h2 className="font-bold text-lg mb-1">{college.name}</h2>
                <div className="text-sm text-muted-foreground mb-3">
                  <div>{college.location}</div>
                  <div>{college.stream}</div>
                  <div>{college.budget_range}</div>
                </div>
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {Array(5).fill(0).map((_, index) => (
                      <svg 
                        key={index}
                        className={`w-4 h-4 ${index < Math.floor(college.rating) ? "text-yellow-400" : "text-gray-300"}`}
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-sm font-medium">{college.rating}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button 
                  className="w-full bg-campus-blue hover:bg-campus-blue/90"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApplyClick(college.name);
                    window.open(college.apply_link, '_blank');
                  }}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Apply Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No colleges found</h3>
          <p className="text-muted-foreground">Try adjusting your filters to see more results.</p>
        </div>
      )}
    </div>
  );
};

export default Colleges;
