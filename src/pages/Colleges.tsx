
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getColleges, markCollegeAsViewed } from '@/lib/supabase';
import { College } from '@/lib/types';
import { Eye, ExternalLink, MapPin, GraduationCap, Star, Banknote, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Colleges = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [colleges, setColleges] = useState<College[]>([]);
  const [filteredColleges, setFilteredColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewedColleges, setViewedColleges] = useState<Record<number, boolean>>({});
  const [processingView, setProcessingView] = useState<Record<number, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');

  // Filter states
  const [filters, setFilters] = useState({
    stream: '',
    state: '',
    rating: 0,
    budget: [0, 2000000] as [number, number],
    search: '',
  });

  const [showFilters, setShowFilters] = useState(false);

  const formatCurrency = (value: number) => {
    return `₹${Math.round(value / 100000)} Lakh`;
  };

  // Load colleges on component mount
  useEffect(() => {
    const fetchColleges = async () => {
      setLoading(true);
      try {
        const { colleges: fetchedColleges, error } = await getColleges();
        
        if (error) {
          console.error("Error fetching colleges:", error);
          toast({
            title: "Error",
            description: "Failed to load colleges. Please try again.",
            variant: "destructive",
          });
          return;
        }
        
        if (fetchedColleges) {
          setColleges(fetchedColleges);
          setFilteredColleges(fetchedColleges);
        }
      } catch (err) {
        console.error("Exception in fetchColleges:", err);
        toast({
          title: "Error",
          description: "Failed to load colleges. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchColleges();
  }, []);

  // Apply filters when filter state changes
  useEffect(() => {
    if (colleges.length === 0) return;
    
    const applyFilters = () => {
      let result = [...colleges];
      
      // Apply stream filter
      if (filters.stream) {
        result = result.filter(college => college.stream === filters.stream);
      }
      
      // Apply state filter
      if (filters.state) {
        result = result.filter(college => college.state === filters.state);
      }
      
      // Apply rating filter
      if (filters.rating > 0) {
        result = result.filter(college => college.rating >= filters.rating);
      }
      
      // Apply budget filter
      if (filters.budget.length === 2) {
        result = result.filter(college => 
          college.budget_value >= filters.budget[0] && 
          college.budget_value <= filters.budget[1]
        );
      }
      
      // Apply search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        result = result.filter(college => 
          college.name.toLowerCase().includes(query) || 
          college.location.toLowerCase().includes(query)
        );
      }
      
      setFilteredColleges(result);
    };
    
    applyFilters();
  }, [filters, searchQuery, colleges]);

  // Get unique streams and states for filter dropdowns
  const streams = [...new Set(colleges.map(college => college.stream))];
  const states = [...new Set(colleges.map(college => college.state))];
  
  // Handle mark as viewed
  const handleMarkAsViewed = async (collegeId: number) => {
    if (!user?.id) {
      toast({
        title: "Not signed in",
        description: "Please sign in to mark colleges as viewed.",
        variant: "destructive",
      });
      return;
    }
    
    // Set processing state for this college
    setProcessingView(prev => ({ ...prev, [collegeId]: true }));
    
    try {
      const { data, error } = await markCollegeAsViewed(user.id, collegeId);
      
      if (error) {
        console.error("Error marking college as viewed:", error);
        toast({
          title: "Error",
          description: "Failed to mark college as viewed. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      // Update viewed colleges state
      setViewedColleges(prev => ({ ...prev, [collegeId]: true }));
      
      // Show success message
      toast({
        title: "College marked as viewed",
        description: "This college will appear in your recently viewed list.",
      });
      
    } catch (err) {
      console.error("Exception in handleMarkAsViewed:", err);
      toast({
        title: "Error",
        description: "Failed to mark college as viewed. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Reset processing state
      setProcessingView(prev => ({ ...prev, [collegeId]: false }));
    }
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
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">College Explorer</h1>
        <p className="text-muted-foreground">Discover and compare colleges based on your preferences</p>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full">
          <Input
            type="text"
            placeholder="Search colleges by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="whitespace-nowrap"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="mr-2 h-4 w-4" /> {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-muted/40 p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Stream</label>
              <Select 
                value={filters.stream} 
                onValueChange={(value) => setFilters({...filters, stream: value})}
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
            
            <div className="space-y-2">
              <label className="text-sm font-medium">State</label>
              <Select 
                value={filters.state} 
                onValueChange={(value) => setFilters({...filters, state: value})}
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
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Minimum Rating</label>
              <Select 
                value={filters.rating.toString()} 
                onValueChange={(value) => setFilters({...filters, rating: Number(value)})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any Rating</SelectItem>
                  <SelectItem value="3">3+ Stars</SelectItem>
                  <SelectItem value="4">4+ Stars</SelectItem>
                  <SelectItem value="4.5">4.5+ Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Budget Range</label>
                <span className="text-xs text-muted-foreground">
                  {formatCurrency(filters.budget[0])} - {formatCurrency(filters.budget[1])}
                </span>
              </div>
              <Slider
                min={0}
                max={2000000}
                step={50000}
                value={filters.budget}
                onValueChange={(value) => setFilters({...filters, budget: value as [number, number]})}
                className="py-4"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setFilters({
                stream: '',
                state: '',
                rating: 0,
                budget: [0, 2000000],
                search: '',
              })}
            >
              Clear All
            </Button>
          </div>
        </div>
      )}

      {/* Tabs for different college categories */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="engineering">Engineering</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="arts">Arts & Science</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-0">
          <CollegesList 
            colleges={filteredColleges} 
            viewedColleges={viewedColleges}
            processingView={processingView}
            onMarkAsViewed={handleMarkAsViewed}
          />
        </TabsContent>
        <TabsContent value="engineering" className="mt-0">
          <CollegesList 
            colleges={filteredColleges.filter(college => college.stream === 'Engineering')}
            viewedColleges={viewedColleges}
            processingView={processingView}
            onMarkAsViewed={handleMarkAsViewed}
          />
        </TabsContent>
        <TabsContent value="medical" className="mt-0">
          <CollegesList 
            colleges={filteredColleges.filter(college => college.stream === 'Medical')}
            viewedColleges={viewedColleges}
            processingView={processingView}
            onMarkAsViewed={handleMarkAsViewed}
          />
        </TabsContent>
        <TabsContent value="business" className="mt-0">
          <CollegesList 
            colleges={filteredColleges.filter(college => college.stream === 'Business')}
            viewedColleges={viewedColleges}
            processingView={processingView}
            onMarkAsViewed={handleMarkAsViewed}
          />
        </TabsContent>
        <TabsContent value="arts" className="mt-0">
          <CollegesList 
            colleges={filteredColleges.filter(college => college.stream === 'Arts & Science')}
            viewedColleges={viewedColleges}
            processingView={processingView}
            onMarkAsViewed={handleMarkAsViewed}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface CollegesListProps {
  colleges: College[];
  viewedColleges: Record<number, boolean>;
  processingView: Record<number, boolean>;
  onMarkAsViewed: (collegeId: number) => void;
}

const CollegesList: React.FC<CollegesListProps> = ({ colleges, viewedColleges, processingView, onMarkAsViewed }) => {
  if (colleges.length === 0) {
    return (
      <div className="text-center py-10">
        <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No colleges found</h3>
        <p className="mt-2 text-muted-foreground">Try adjusting your filters or search criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {colleges.map((college) => (
        <Card key={college.id} className="flex flex-col h-full">
          <CardHeader className="pb-2">
            <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden bg-muted">
              <img 
                src={college.image_url || '/placeholder.svg'} 
                alt={college.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
              <Badge className="absolute top-2 right-2 bg-campus-blue">
                {college.stream}
              </Badge>
            </div>
            <CardTitle className="line-clamp-2">{college.name}</CardTitle>
            <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
              <MapPin className="h-4 w-4" />
              <span>{college.location}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 pb-2 flex-grow">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{college.rating.toFixed(1)}</span>
              <span className="text-muted-foreground text-sm">/ 5.0</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Banknote className="h-4 w-4 text-emerald-500" />
              <span>{college.budget_range}</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-0">
            <Button
              variant="outline"
              size="sm"
              className={`gap-1 ${viewedColleges[college.id] ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : ''}`}
              onClick={() => onMarkAsViewed(college.id)}
              disabled={viewedColleges[college.id] || processingView[college.id]}
            >
              {processingView[college.id] ? (
                <span className="animate-spin mr-1">⟳</span>
              ) : (
                <Eye className="h-4 w-4 mr-1" />
              )}
              {viewedColleges[college.id] ? 'Viewed' : 'Mark as viewed'}
            </Button>
            <Button variant="default" size="sm" asChild>
              <a href={college.apply_link} target="_blank" rel="noopener noreferrer" className="gap-1">
                <ExternalLink className="h-4 w-4" />
                Apply
              </a>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default Colleges;
