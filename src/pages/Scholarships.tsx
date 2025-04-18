
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getScholarships } from '@/lib/supabase';

const Scholarships = () => {
  const { toast } = useToast();
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const { scholarships: data, error } = await getScholarships();
        
        if (error) {
          throw error;
        }
        
        setScholarships(data);
      } catch (error) {
        console.error("Error fetching scholarships:", error);
        toast({
          title: "Error",
          description: "Failed to fetch scholarships. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchScholarships();
  }, [toast]);

  if (loading) {
    return <div className="p-4">Loading scholarships...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Scholarships</h1>
        <p className="text-muted-foreground">Find scholarships that match your profile</p>
      </div>
      
      {scholarships.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {scholarships.map((scholarship) => (
            <Card key={scholarship.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{scholarship.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{scholarship.category}</p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="mb-4">
                    <h3 className="font-semibold">Eligibility</h3>
                    <p className="text-sm text-muted-foreground">{scholarship.eligibility}</p>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-semibold">Amount</h3>
                    <p className="text-sm text-muted-foreground">{scholarship.amount}</p>
                  </div>
                  {scholarship.description && (
                    <div className="mb-4">
                      <h3 className="font-semibold">Description</h3>
                      <p className="text-sm text-muted-foreground">{scholarship.description}</p>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold">Last Date</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(scholarship.last_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <Button 
                  className="mt-4 w-full bg-campus-blue hover:bg-campus-blue/90"
                  onClick={() => window.open(scholarship.link, '_blank')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No scholarships available</h3>
          <p className="text-muted-foreground">Check back later for updates.</p>
        </div>
      )}
    </div>
  );
};

export default Scholarships;
