
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ExternalLink, Search, School, Filter, Eye, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getColleges, viewCollege } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { College } from '@/lib/types';

const Colleges = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [colleges, setColleges] = useState<College[]>([]);
  const [viewedColleges, setViewedColleges] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    stream: '',
    state: '',
    budget: [0, 1000000],
    rating: 0,
  });

  // Derived states for unique values
  const [streams, setStreams] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);

  useEffect(() => {
    const fetchColleges = async () => {
      setLoading(true);
      try {
        const { colleges: data, error } = await getColleges();
        
        if (error) throw error;
        
        setColleges(data || []);
        
        if (data && data.length > 0) {
          // Extract unique streams and states
          const uniqueStreams = Array.from(new Set(data.map(college => college.stream)));
          const uniqueStates = Array.from(new Set(data.map(college => college.state)));
          setStreams(uniqueStreams);
          setStates(uniqueStates);
        }
      } catch (err) {
        console.error("Error fetching colleges:", err);
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

  // Format budget values for display
  const formatBudget = (value: number) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)} Lakh`;
    }
    return `₹${value}`;
  };

  // Filter colleges based on selected filters
  const filteredColleges = colleges.filter(college => {
    const matchesSearch = filters.search === '' || 
                         college.name.toLowerCase().includes(filters.search.toLowerCase()) || 
                         college.location.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStream = filters.stream === '' || college.stream === filters.stream;
    const matchesState = filters.state === '' || college.state === filters.state;
    const matchesBudget = college.budget_value >= filters.budget[0] && 
                         college.budget_value <= filters.budget[1];
    const matchesRating = college.rating >= filters.rating;

    return matchesSearch && matchesStream && matchesState && matchesBudget && matchesRating;
  });

  // Handle viewing college details
  const handleViewCollege = async (collegeId: number) => {
    if (!user?.id) return;
    
    try {
      await viewCollege(user.id, collegeId);
      setViewedColleges(prev => [...prev, collegeId]);
      
      toast({
        description: "College added to your recently viewed list",
      });
    } catch (error) {
      console.error("Error updating recently viewed colleges:", error);
      toast({
        title: "Error",
        description: "Failed to mark college as viewed. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle applying to a college
  const handleApplyClick = (collegeName: string, link: string) => {
    toast({
      title: "Application Link",
      description: `Opening application page for ${collegeName}`,
    });
    
    if (link) {
      window.open(link, '_blank');
    }
  };

  const isCollegeViewed = (collegeId: number) => viewedColleges.includes(collegeId);

  const handleToggleFilters = () => {
    setShowFilters(prevState => !prevState);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      stream: '',
      state: '',
      budget: [0, 1000000],
      rating: 0,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-campus-blue"></div>
          <p className="text-muted-foreground">Loading colleges...</p>
        </div>
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
      <Card>
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <div className="relative lg:w-1/3">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search colleges..."
                className="pl-8"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleToggleFilters}
            >
              <Filter className="h-4 w-4" /> 
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>
        </CardHeader>
        
        {showFilters && (
          <CardContent className="pt-4">
            <div className="grid gap-4 md:grid-cols-3">
              {/* Stream Filter */}
              <div>
                <label className="text-sm font-medium mb-1 block">Stream</label>
                <Select 
                  value={filters.stream}
                  onValueChange={(value) => setFilters(prev => ({...prev, stream: value}))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Streams" />
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
                <label className="text-sm font-medium mb-1 block">State</label>
                <Select
                  value={filters.state}
                  onValueChange={(value) => setFilters(prev => ({...prev, state: value}))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All States" />
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
                <label className="text-sm font-medium mb-1 block">Rating</label>
                <Select
                  value={filters.rating.toString()}
                  onValueChange={(value) => setFilters(prev => ({...prev, rating: parseFloat(value)}))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any Rating" />
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
                onValueChange={(value) => setFilters(prev => ({...prev, budget: value}))}
                className="mt-2"
              />
            </div>
          </CardContent>
        )}
      </Card>
      
      {/* Results Section */}
      {filteredColleges.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredColleges.map((college) => (
            <Card 
              key={college.id} 
              className="overflow-hidden hover:shadow-md transition-shadow bg-card"
            >
              <div className="h-48 bg-muted relative">
                <img 
                  src={college.image_url || '/placeholder.svg'} 
                  alt={college.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
                <Button
                  variant="secondary"
                  size="sm"
                  className={`absolute top-2 right-2 ${isCollegeViewed(college.id) ? 'bg-green-500 text-white hover:bg-green-600' : ''}`}
                  onClick={() => handleViewCollege(college.id)}
                  disabled={isCollegeViewed(college.id)}
                >
                  {isCollegeViewed(college.id) ? (
                    <>
                      <Check className="mr-1 h-4 w-4" /> Viewed
                    </>
                  ) : (
                    <>
                      <Eye className="mr-1 h-4 w-4" /> Mark as Viewed
                    </>
                  )}
                </Button>
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
                  onClick={() => handleApplyClick(college.name, college.apply_link)}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Apply Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <School className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No colleges found</h3>
            <p className="text-muted-foreground text-center">
              Try adjusting your filters to see more results.
            </p>
            {(filters.search || filters.stream || filters.state || filters.rating > 0) && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={handleResetFilters}
              >
                Reset Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Colleges;
