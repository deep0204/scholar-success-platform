import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ExternalLink, Search, CalendarClock } from 'lucide-react';
import { getScholarships } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const Scholarships = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [scholarships, setScholarships] = useState([]);
  
  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const { scholarships: data, error } = await getScholarships();
        
        if (error) throw error;
        
        setScholarships(data || []);
      } catch (error) {
        console.error("Error fetching scholarships:", error);
        toast({
          title: "Error",
          description: "Failed to load scholarships. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchScholarships();
  }, [toast]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  
  const filteredScholarships = scholarships.filter(scholarship => 
    scholarship.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    scholarship.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scholarship.eligibility.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleApplyClick = (name: string) => {
    toast({
      title: "Scholarship Application",
      description: `Opening application page for ${name}`,
    });
  };
  
  if (loading) {
    return <div className="p-4">Loading scholarships...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Scholarships for You</h1>
        <p className="text-muted-foreground">Discover financial aid opportunities to support your education</p>
      </div>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search scholarships by name, category, or eligibility..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {filteredScholarships.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredScholarships.map(scholarship => (
            <Card key={scholarship.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{scholarship.name}</CardTitle>
                  <Badge className="bg-campus-blue">{scholarship.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Eligibility</h4>
                    <p className="text-sm text-muted-foreground">{scholarship.eligibility}</p>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarClock className="h-4 w-4 mr-2" />
                    <span>Last Date: {formatDate(scholarship.last_date)}</span>
                  </div>
                  
                  {scholarship.description && (
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Description</h4>
                      <p className="text-sm text-muted-foreground">{scholarship.description}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-campus-blue hover:bg-campus-blue/90"
                  onClick={() => {
                    handleApplyClick(scholarship.name);
                    window.open(scholarship.link, '_blank');
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
          <h3 className="text-lg font-medium">No scholarships found</h3>
          <p className="text-muted-foreground">Try a different search term or check back later for new opportunities.</p>
        </div>
      )}
    </div>
  );
};

export default Scholarships;
