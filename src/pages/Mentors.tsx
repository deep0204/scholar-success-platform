
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { getMentors, bookMentorSession, createSampleData } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const Mentors = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState<null | {
    id: number;
    name: string;
    college: string;
    specialization: string;
  }>(null);
  
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        // First ensure we have sample data
        await createSampleData();
        
        // Then fetch mentors
        const { mentors: data, error } = await getMentors();
        
        if (error) {
          throw error;
        }
        
        setMentors(data || []);
      } catch (error) {
        console.error("Error fetching mentors:", error);
        toast({
          title: "Error",
          description: "Failed to fetch mentors. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchMentors();
  }, [toast]);

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const handleBookSession = async () => {
    if (!date) {
      toast({
        title: "Please select a date",
        description: "You need to pick a date for your session",
        variant: "destructive",
      });
      return;
    }
    
    if (!user?.id || !selectedMentor) {
      toast({
        title: "Error",
        description: "Unable to book session. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      const formattedDate = date.toISOString();
      const { error } = await bookMentorSession(user.id, selectedMentor.id, formattedDate);
      
      if (error) throw error;
      
      toast({
        title: "Session Booked!",
        description: `Your session with ${selectedMentor.name} is scheduled for ${format(date, 'PPP')}`,
      });

      // Reset form
      setDate(undefined);
      setSelectedMentor(null);
    } catch (error) {
      console.error("Error booking session:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error booking your session. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="p-4">Loading mentors...</div>;
  }

  // If no mentors found after loading
  if (mentors.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mentor Connect</h1>
          <p className="text-muted-foreground">Book sessions with experienced mentors from top institutions</p>
        </div>
        <Card className="text-center p-8">
          <CardContent className="pt-6">
            <p className="mb-4">No mentors available at the moment. Please check back later.</p>
            <Button 
              onClick={async () => {
                setLoading(true);
                await createSampleData();
                const { mentors: refreshedMentors } = await getMentors();
                setMentors(refreshedMentors || []);
                setLoading(false);
              }}
              className="bg-campus-blue hover:bg-campus-blue/90"
            >
              Refresh Mentors
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mentor Connect</h1>
        <p className="text-muted-foreground">Book sessions with experienced mentors from top institutions</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mentors.map((mentor) => (
          <Card key={mentor.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="text-center relative">
              <div className="absolute top-4 right-4">
                <Badge>{mentor.specialization}</Badge>
              </div>
              <div className="flex flex-col items-center mb-2">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={mentor.profile_image} />
                  <AvatarFallback className="bg-campus-purple text-white text-2xl">
                    {getInitials(mentor.name)}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="font-bold text-lg">{mentor.name}</CardTitle>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <GraduationCap className="h-4 w-4 mr-1" />
                  <span>{mentor.college}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm mb-4">{mentor.bio}</p>
              <div className="flex justify-center gap-4 text-sm mb-4">
                <div>
                  <div className="font-medium">{mentor.rating}</div>
                  <div className="text-xs text-muted-foreground">Rating</div>
                </div>
                <div>
                  <div className="font-medium">{mentor.sessions_completed}+</div>
                  <div className="text-xs text-muted-foreground">Sessions</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex justify-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full bg-campus-blue hover:bg-campus-blue/90"
                    onClick={() => setSelectedMentor({
                      id: mentor.id,
                      name: mentor.name,
                      college: mentor.college,
                      specialization: mentor.specialization
                    })}
                  >
                    Book Session
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Book a Session</DialogTitle>
                    <DialogDescription>
                      Select a date for your session with {selectedMentor?.name}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="date">Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            className="pointer-events-auto"
                            disabled={(currentDate) => {
                              // Disable dates in the past
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              
                              // Also disable dates more than 30 days in the future
                              const thirtyDaysFromNow = new Date();
                              thirtyDaysFromNow.setDate(today.getDate() + 30);
                              
                              return currentDate < today || currentDate > thirtyDaysFromNow;
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <p className="text-xs text-muted-foreground">
                        Available dates: Next 30 days
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      type="submit" 
                      className="bg-campus-blue hover:bg-campus-blue/90"
                      onClick={handleBookSession}
                    >
                      Confirm Booking
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Mentors;
