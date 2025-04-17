import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Trophy from '@/components/ui/trophy';

const Leaderboard = () => {
  const users = [
    { id: 1, name: 'Ananya Sharma', xp: 375, level: 3, position: 1, badges: 3 },
    { id: 2, name: 'Rahul Patel', xp: 310, level: 3, position: 2, badges: 2 },
    { id: 3, name: 'Priya Singh', xp: 285, level: 2, position: 3, badges: 2 },
    { id: 4, name: 'Amit Kumar', xp: 240, level: 2, position: 4, badges: 1 },
    { id: 5, name: 'Neha Gupta', xp: 215, level: 2, position: 5, badges: 1 },
    { id: 6, name: 'Vikram Malhotra', xp: 190, level: 1, position: 6, badges: 1 },
    { id: 7, name: 'Sneha Reddy', xp: 170, level: 1, position: 7, badges: 1 },
    { id: 8, name: 'Karan Verma', xp: 150, level: 1, position: 8, badges: 0 },
    { id: 9, name: 'Ritu Sharma', xp: 130, level: 1, position: 9, badges: 0 },
    { id: 10, name: 'Deepak Chopra', xp: 110, level: 1, position: 10, badges: 0 },
  ];

  // Get initials from name
  const getInitials = (name: string) => {
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
            <div className="flex flex-col lg:flex-row justify-center items-center gap-4 lg:gap-8 mb-8">
              {users.slice(0, 3).map(user => (
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
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <h3 className="font-bold text-lg">{user.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm">{user.xp} XP</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-sm">Level {user.level}</span>
                  </div>
                  <div className="mt-2">
                    <Badge className="bg-campus-blue">{user.badges} Badges</Badge>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Rest of the Users */}
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
                    <tr key={user.id} className="border-t">
                      <td className="px-4 py-3 text-sm">{user.position}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-muted">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.name}</span>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;
