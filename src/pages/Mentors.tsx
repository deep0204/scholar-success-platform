
import React, { useState } from 'react';
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

const Mentors = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedMentor, setSelectedMentor] = useState<null | {
    id: number;
    name: string;
    college: string;
    specialization: string;
  }>(null);
  
  // Mock mentors data - would come from Supabase in a real app
  const mentors = [
    {
      id: 1,
      name: 'Dr. Rajesh Kumar',
      college: 'IIT Delhi',
      specialization: 'Computer Science',
      profile_image: '',
      available_dates: ['2025-04-20', '2025-04-22', '2025-04-24', '2025-04-26'],
      contact_info: 'rajesh.kumar@example.com',
      bio: 'Dr. Kumar has over 15 years of experience in the field of Computer Science. He specializes in AI and Machine Learning and has guided numerous students in their academic and career paths.',
      rating: 4.8,
      sessions_completed: 42
    },
    {
      id: 2,
      name: 'Prof. Anita Desai',
      college: 'Delhi University',
      specialization: 'Literature & Arts',
      profile_image: '',
      available_dates: ['2025-04-21', '2025-04-23', '2025-04-25', '2025-04-27'],
      contact_info: 'anita.desai@example.com',
      bio: 'Prof. Desai is a renowned literary expert with publications in several international journals. She guides students interested in pursuing humanities and literature.',
      rating: 4.7,
      sessions_completed: 38
    },
    {
      id: 3,
      name: 'Dr. Sunita Sharma',
      college: 'AIIMS Delhi',
      specialization: 'Medical Sciences',
      profile_image: '',
      available_dates: ['2025-04-19', '2025-04-21', '2025-04-23', '2025-04-25'],
      contact_info: 'sunita.sharma@example.com',
      bio: 'Dr. Sharma is a medical professional specializing in guiding students for medical entrance exams and career options in various medical fields.',
      rating: 4.9,
      sessions_completed: 56
    },
    {
      id: 4,
      name: 'Prof. Vikram Malhotra',
      college: 'IIM Ahmedabad',
      specialization: 'Business Management',
      profile_image: '',
      available_dates: ['2025-04-20', '2025-04-22', '2025-04-24', '2025-04-26'],
      contact_info: 'vikram.malhotra@example.com',
      bio: 'Prof. Malhotra is a management guru with extensive experience in corporate strategy. He guides students interested in business management and entrepreneurship.',
      rating: 4.8,
      sessions_completed: 47
    }
  ];

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const handleBookSession = (mentor: any) => {
    if (!date) {
      toast({
        title: "Please select a date",
        description: "You need to pick a date for your session",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would save to Supabase
    toast({
      title: "Session Booked!",
      description: `Your session with ${mentor.name} is scheduled for ${format(date, 'PPP')}`,
    });

    // Reset form
    setDate(undefined);
    setSelectedMentor(null);
  };

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
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            disabled={(date) => 
                              date < new Date() || 
                              date > new Date(2025, 5, 30)
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <p className="text-xs text-muted-foreground">
                        Available dates: Next 2 weeks, excluding weekends
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      type="submit" 
                      className="bg-campus-blue hover:bg-campus-blue/90"
                      onClick={() => handleBookSession(selectedMentor)}
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
