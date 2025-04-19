import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CalendarIcon, GraduationCap, BarChart3, Award, Bell, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getUserMissions, updateMissionStatus, getUserSessions, getRecentlyViewedColleges, cancelMentorSession } from '@/lib/supabase';
import { UserMission, MentorSession, RecentlyViewedCollege } from '@/lib/types';

const Dashboard = () => {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  
  const [weeklyMissions, setWeeklyMissions] = useState<UserMission[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<MentorSession[]>([]);
  const [recentColleges, setRecentColleges] = useState<RecentlyViewedCollege[]>([]);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New scholarship available for Science students', time: '2 hours ago' },
    { id: 2, text: 'Your mentor session is confirmed', time: '1 day ago' },
    { id: 3, text: 'You earned the Profile Champ badge!', time: '2 days ago' },
  ]);
  
  const [badges, setBadges] = useState([
    { id: 1, name: 'Profile Champ', awarded: true },
    { id: 2, name: 'College Explorer', awarded: false },
    { id: 3, name: 'Mentor Mentee', awarded: false },
    { id: 4, name: 'Career Curious', awarded: false },
  ]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (user?.id) {
        try {
          setLoading(true);
          
          // Fetch weekly missions
          const { missions, error: missionsError } = await getUserMissions(user.id);
          if (!missionsError && missions) {
            setWeeklyMissions(missions);
          }
          
          // Fetch upcoming sessions
          const { sessions, error: sessionsError } = await getUserSessions(user.id);
          if (!sessionsError && sessions) {
            setUpcomingSessions(sessions);
          }
          
          // Fetch recently viewed colleges
          const { recentColleges: colleges, error: collegesError } = await getRecentlyViewedColleges(user.id);
          if (!collegesError && colleges) {
            setRecentColleges(colleges);
          }
          
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchDashboardData();
  }, [user?.id]);
  
  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  // Handle checkbox change for weekly missions with improved error handling
  const handleMissionComplete = async (missionId: number, completed: boolean) => {
    if (!user?.id) return;
    
    try {
      // Optimistically update UI
      setWeeklyMissions(prev => 
        prev.map(mission => 
          mission.id === missionId 
            ? { ...mission, status: completed ? 'completed' : 'pending', completed_on: completed ? new Date().toISOString() : null } 
            : mission
        )
      );
      
      console.log("Updating mission:", missionId, "to", completed ? "completed" : "pending");
      
      const { error, xpChange, xpResult } = await updateMissionStatus(missionId, user.id, completed);
      
      if (error) {
        console.error("Error updating mission:", error);
        // Revert the UI change if there was an error
        setWeeklyMissions(prev => 
          prev.map(mission => 
            mission.id === missionId 
              ? { ...mission, status: completed ? 'pending' : 'completed', completed_on: completed ? null : mission.completed_on } 
              : mission
          )
        );
        
        toast({
          title: "Error",
          description: "Failed to update mission status. Please try again.",
          variant: "destructive",
        });
        
        return;
      }
      
      // Show toast notification
      if (completed) {
        toast({
          title: "Mission Completed!",
          description: `You earned ${xpChange} XP!`,
        });
        
        // Show level up notification if applicable
        if (xpResult?.levelUp) {
          toast({
            title: "Level Up!",
            description: `Congratulations! You're now level ${xpResult?.newLevel || 1}!`,
          });
        }
      } else {
        toast({
          title: "Mission Uncompleted",
          description: `You lost ${Math.abs(xpChange)} XP.`,
        });
      }
      
    } catch (error) {
      console.error("Error updating mission:", error);
      toast({
        title: "Error",
        description: "Failed to update mission status. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle cancellation of mentor session with improved implementation
  const handleCancelSession = async (sessionId: number) => {
    if (!user?.id) return;
    
    try {
      // Optimistically update UI
      setUpcomingSessions(prev => prev.filter(session => session.id !== sessionId));
      
      console.log("Cancelling session:", sessionId);
      
      const { error } = await cancelMentorSession(sessionId);
      
      if (error) {
        console.error("Error cancelling session:", error);
        
        // If there's an error, refetch the sessions to restore the accurate state
        const { sessions } = await getUserSessions(user.id);
        if (sessions) {
          setUpcomingSessions(sessions);
        }
        
        toast({
          title: "Error",
          description: "Failed to cancel session. Please try again.",
          variant: "destructive",
        });
        
        return;
      }
      
      // Show toast notification
      toast({
        title: "Session Cancelled",
        description: "Your mentor session has been cancelled successfully.",
      });
      
    } catch (error) {
      console.error("Error cancelling session:", error);
      toast({
        title: "Error",
        description: "Failed to cancel session. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Calculate level progress
  const calculateLevelProgress = () => {
    if (!profile) return 0;
    
    const xpInCurrentLevel = profile.xp % 100;
    return (xpInCurrentLevel / 100) * 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-campus-blue"></div>
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {profile?.full_name || 'Student'}</h1>
          <p className="text-muted-foreground">Here's an overview of your progress and activities.</p>
        </div>
      </div>
      
      {/* Progress Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Experience Points</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile?.xp || 0} XP</div>
            <p className="text-xs text-muted-foreground">{100 - (profile?.xp % 100)} XP until next level</p>
            <Progress value={calculateLevelProgress()} className="h-2 mt-3" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Level</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Level {profile?.level || 1}</div>
            <p className="text-xs text-muted-foreground">Keep going to unlock more features!</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Colleges Explored</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentColleges.length}</div>
            <p className="text-xs text-muted-foreground">Explore more to earn badges</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingSessions.length}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingSessions.length > 0 
                ? `Next session on ${formatDate(upcomingSessions[0].scheduled_date).split(',')[0]}` 
                : 'No upcoming sessions'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Badges */}
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Badges & Achievements</CardTitle>
            <CardDescription>Showcase your progress and accomplishments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {badges.map((badge) => (
              <div key={badge.id} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                  ${badge.awarded ? 'bg-campus-blue text-white' : 'bg-muted text-muted-foreground'}`}>
                  <Award className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{badge.name}</span>
                    {badge.awarded && <Badge className="bg-campus-success text-xs">Earned</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {badge.awarded ? 'Achievement unlocked!' : 'Keep going to earn this badge'}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        {/* Weekly Missions */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Missions</CardTitle>
            <CardDescription>Complete missions to earn XP</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {weeklyMissions.length > 0 ? (
              weeklyMissions.map((mission) => (
                <div key={mission.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`mission-${mission.id}`}
                    checked={mission.status === 'completed'}
                    onCheckedChange={(checked) => handleMissionComplete(mission.id, checked === true)}
                  />
                  <div className="flex-1">
                    <label 
                      htmlFor={`mission-${mission.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {mission.mission_text}
                    </label>
                    <div className="text-xs text-muted-foreground">Reward: {mission.xp} XP</div>
                  </div>
                  {mission.status === 'completed' && (
                    <Badge variant="outline" className="bg-campus-success/10 text-campus-success border-campus-success">
                      Complete
                    </Badge>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No missions available this week.</p>
            )}
          </CardContent>
        </Card>
        
        {/* Notifications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Stay updated with the latest</CardDescription>
            </div>
            <Bell className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="border-b pb-3 last:border-none last:pb-0">
                <p className="text-sm">{notification.text}</p>
                <span className="text-xs text-muted-foreground">{notification.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      
      {/* Upcoming Sessions */}
      {upcomingSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Mentor Sessions</CardTitle>
            <CardDescription>Your scheduled sessions with mentors</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingSessions.map((session) => (
              <div key={session.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-md mb-3 last:mb-0">
                <div>
                  <h4 className="font-medium">{session.mentors?.specialization || 'Mentor Session'}</h4>
                  <p className="text-sm text-muted-foreground">with {session.mentors?.name || 'Mentor'}</p>
                </div>
                <div className="flex flex-col md:flex-row gap-2 md:items-center">
                  <div className="text-sm flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4 text-campus-blue" />
                    <span>{formatDate(session.scheduled_date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="md:ml-2 w-fit bg-campus-success">{session.status}</Badge>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                      onClick={() => handleCancelSession(session.id)}
                      title="Cancel session"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      
      {/* Recent Colleges */}
      {recentColleges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recently Viewed Colleges</CardTitle>
            <CardDescription>Colleges you've explored recently</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentColleges.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <div className="w-16 h-16 rounded-md overflow-hidden bg-muted">
                    <img 
                      src={item.colleges?.image_url || '/placeholder.svg'} 
                      alt={item.colleges?.name || 'College'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{item.colleges?.name || 'College'}</h4>
                    <p className="text-sm text-muted-foreground">{item.colleges?.stream || 'Stream'}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
