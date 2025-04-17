import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Trophy from '@/components/ui/trophy';
import { getLeaderboard } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Leaderboard = () => {
  const { toast } = useToast();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const { users: data, error } = await getLeaderboard();
        
        if (error) throw error;
        
        // Transform the data to include position and badges (mocked for now)
        const transformedData = data.map((user, index) => ({
          ...user,
          position: index + 1,
          badges: Math.max(0, 3 - index) // Mock badges: 3 for 1st place, 2 for 2nd, etc.
        }));
        
        setUsers(transformedData);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        toast({
          title: "Error",
          description: "Failed to load leaderboard data. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboardData();
  }, [toast]);

  // Get initials from name
  const getInitials = (name: string = '') => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Get trophy type based on position
  const getTrophyType = (position: number) => {
    if (position === 1) return 'gold';
    if (position === 2) return 'silver';
    if (position === 3) return 'bronze';
    return 'default';
  };
  
  if (loading) {
    return <div className="p-4">Loading leaderboard...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
        <p className="text-muted-foreground">See how you rank among other students</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Students</CardTitle>
          <CardDescription>Based on experience points and achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Top 3 Users */}
            {users.length > 0 && (
              <div className="flex flex-col lg:flex-row justify-center items-center gap-4 lg:gap-8 mb-8">
                {users.slice(0, Math.min(3, users.length)).map(user => (
                  <div 
                    key={user.id} 
                    className={`flex flex-col items-center p-6 rounded-lg w-full max-w-xs 
                      ${user.position === 1 ? 'order-2 lg:transform lg:scale-110' : 
                      user.position === 2 ? 'order-1' : 'order-3'}`}
                  >
                    <Trophy 
                      type={getTrophyType(user.position)} 
                      size="lg"
                      className="mb-2"
                    />
                    <span className="text-xl font-bold text-campus-blue">#{user.position}</span>
                    <div className="mt-3 mb-2">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className={`text-xl 
                          ${user.position === 1 ? 'bg-yellow-400 text-yellow-800' : 
                          user.position === 2 ? 'bg-gray-300 text-gray-700' : 
                          'bg-amber-700 text-amber-100'}`}>
                          {getInitials(user.full_name)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <h3 className="font-bold text-lg">{user.full_name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm">{user.xp} XP</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-sm">Level {user.level}</span>
                    </div>
                    <div className="mt-2">
                      <Badge className="bg-campus-blue">{user.badges} Badges</Badge>
                    </div>
                    {profile?.id === user.id && (
                      <Badge variant="outline" className="mt-2 bg-campus-blue/10 text-campus-blue border-campus-blue">
                        You
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Rest of the Users */}
            {users.length > 3 && (
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Rank</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Student</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">XP</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Level</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground hidden md:table-cell">Badges</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.slice(3).map((user) => (
                      <tr key={user.id} className={`border-t ${profile?.id === user.id ? 'bg-campus-blue/5' : ''}`}>
                        <td className="px-4 py-3 text-sm">{user.position}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs bg-muted">
                                {getInitials(user.full_name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium">{user.full_name}</span>
                              {profile?.id === user.id && (
                                <span className="text-xs text-campus-blue">You</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-right">{user.xp} XP</td>
                        <td className="px-4 py-3 text-sm text-right">{user.level}</td>
                        <td className="px-4 py-3 text-sm text-right hidden md:table-cell">
                          {user.badges > 0 ? (
                            <Badge className="ml-auto bg-campus-blue">{user.badges}</Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {users.length === 0 && (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No users on the leaderboard yet. Complete activities to earn XP and get ranked!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;
