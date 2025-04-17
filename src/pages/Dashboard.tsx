
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CalendarIcon, GraduationCap, BarChart3, Award, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  // Mock user data - in reality this would come from Supabase
  const user = {
    name: 'Ananya Sharma',
    xp: 75,
    level: 1,
    levelProgress: 75,
    nextLevelXp: 100,
    badges: [
      { id: 1, name: 'Profile Champ', awarded: true },
      { id: 2, name: 'College Explorer', awarded: false },
      { id: 3, name: 'Mentor Mentee', awarded: false },
      { id: 4, name: 'Career Curious', awarded: false },
    ],
    upcomingSessions: [
      { 
        id: 1, 
        mentorName: 'Dr. Rajesh Kumar', 
        date: '2025-04-24T14:00:00', 
        status: 'confirmed',
        topic: 'Engineering Career Paths'
      }
    ],
    weeklyMissions: [
      { id: 1, text: 'Explore 3 colleges', completed: true, xp: 15 },
      { id: 2, text: 'Book a mentor session', completed: false, xp: 20 },
      { id: 3, text: 'Watch 2 career videos', completed: false, xp: 10 },
      { id: 4, text: 'Ask the Career Coach 3 questions', completed: false, xp: 15 },
    ],
    recentColleges: [
      { id: 1, name: 'IIT Delhi', stream: 'Engineering', image: '/placeholder.svg' },
      { id: 2, name: 'Lady Shri Ram College', stream: 'Arts', image: '/placeholder.svg' },
    ],
    notifications: [
      { id: 1, text: 'New scholarship available for Science students', time: '2 hours ago' },
      { id: 2, text: 'Your mentor session is confirmed', time: '1 day ago' },
      { id: 3, text: 'You earned the Profile Champ badge!', time: '2 days ago' },
    ]
  };
  
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name}</h1>
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
            <div className="text-2xl font-bold">{user.xp} XP</div>
            <p className="text-xs text-muted-foreground">{user.nextLevelXp - user.xp} XP until next level</p>
            <Progress value={user.levelProgress} className="h-2 mt-3" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Level</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Level {user.level}</div>
            <p className="text-xs text-muted-foreground">Keep going to unlock more features!</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Colleges Explored</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.recentColleges.length}</div>
            <p className="text-xs text-muted-foreground">Explore more to earn badges</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.upcomingSessions.length}</div>
            <p className="text-xs text-muted-foreground">Next session on {user.upcomingSessions.length ? formatDate(user.upcomingSessions[0].date).split(',')[0] : 'N/A'}</p>
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
            {user.badges.map((badge) => (
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
            {user.weeklyMissions.map((mission) => (
              <div key={mission.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={mission.completed}
                  className="h-4 w-4 rounded border-gray-300 text-campus-blue focus:ring-campus-blue"
                  readOnly
                />
                <div className="flex-1">
                  <div className="text-sm">{mission.text}</div>
                  <div className="text-xs text-muted-foreground">Reward: {mission.xp} XP</div>
                </div>
                {mission.completed && (
                  <Badge variant="outline" className="bg-campus-success/10 text-campus-success border-campus-success">
                    Complete
                  </Badge>
                )}
              </div>
            ))}
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
            {user.notifications.map((notification) => (
              <div key={notification.id} className="border-b pb-3 last:border-none last:pb-0">
                <p className="text-sm">{notification.text}</p>
                <span className="text-xs text-muted-foreground">{notification.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      
      {/* Upcoming Sessions */}
      {user.upcomingSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Mentor Sessions</CardTitle>
            <CardDescription>Your scheduled sessions with mentors</CardDescription>
          </CardHeader>
          <CardContent>
            {user.upcomingSessions.map((session) => (
              <div key={session.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-md">
                <div>
                  <h4 className="font-medium">{session.topic}</h4>
                  <p className="text-sm text-muted-foreground">with {session.mentorName}</p>
                </div>
                <div className="flex flex-col md:flex-row gap-2 md:items-center">
                  <div className="text-sm flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4 text-campus-blue" />
                    <span>{formatDate(session.date)}</span>
                  </div>
                  <Badge className="md:ml-2 w-fit bg-campus-success">{session.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      
      {/* Recent Colleges */}
      {user.recentColleges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recently Viewed Colleges</CardTitle>
            <CardDescription>Colleges you've explored recently</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.recentColleges.map((college) => (
                <div key={college.id} className="flex gap-3 items-center">
                  <div className="w-16 h-16 rounded-md overflow-hidden bg-muted">
                    <img 
                      src={college.image} 
                      alt={college.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{college.name}</h4>
                    <p className="text-sm text-muted-foreground">{college.stream}</p>
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
