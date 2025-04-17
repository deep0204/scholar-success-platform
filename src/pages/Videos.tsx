
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Youtube, Play } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const Videos = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState<null | {id: string, title: string}>(null);
  
  // Mock videos data - would come from YouTube API/Supabase in a real app
  const allVideos = [
    {
      id: "Oe421EPjeBE",
      title: "How to Choose the Right Career Path",
      thumbnail_url: "https://img.youtube.com/vi/Oe421EPjeBE/mqdefault.jpg",
      keyword: "career-guidance",
      views: "120K",
      date: "2 months ago"
    },
    {
      id: "XnGUVnNzm8w",
      title: "Top Engineering Colleges in India 2025",
      thumbnail_url: "https://img.youtube.com/vi/XnGUVnNzm8w/mqdefault.jpg",
      keyword: "top-colleges",
      views: "85K",
      date: "3 months ago"
    },
    {
      id: "LY7NBUP-jTU",
      title: "How to Ace JEE Mains & Advanced",
      thumbnail_url: "https://img.youtube.com/vi/LY7NBUP-jTU/mqdefault.jpg",
      keyword: "exam-strategies",
      views: "156K",
      date: "1 month ago"
    },
    {
      id: "zVQJhKUYZic",
      title: "Medical vs Engineering - Which is Right for You?",
      thumbnail_url: "https://img.youtube.com/vi/zVQJhKUYZic/mqdefault.jpg",
      keyword: "career-guidance",
      views: "92K",
      date: "4 months ago"
    },
    {
      id: "Kb3_31XaB8w",
      title: "Higher Education Opportunities in India",
      thumbnail_url: "https://img.youtube.com/vi/Kb3_31XaB8w/mqdefault.jpg",
      keyword: "education-india",
      views: "67K",
      date: "2 months ago"
    },
    {
      id: "8ccT_cHJxz8",
      title: "Best Study Techniques for NEET",
      thumbnail_url: "https://img.youtube.com/vi/8ccT_cHJxz8/mqdefault.jpg",
      keyword: "exam-strategies",
      views: "110K",
      date: "3 months ago"
    },
    {
      id: "m_R8DPGFbfI",
      title: "Arts Stream Career Options with Great Potential",
      thumbnail_url: "https://img.youtube.com/vi/m_R8DPGFbfI/mqdefault.jpg",
      keyword: "career-guidance",
      views: "78K",
      date: "1 month ago"
    },
    {
      id: "QJ0b6K1vj9I",
      title: "IIT vs NIT - Making the Right Choice",
      thumbnail_url: "https://img.youtube.com/vi/QJ0b6K1vj9I/mqdefault.jpg",
      keyword: "top-colleges",
      views: "145K",
      date: "2 months ago"
    }
  ];

  const categories = {
    "all": "All Videos",
    "career-guidance": "Career Guidance",
    "top-colleges": "Top Colleges",
    "exam-strategies": "Exam Strategies",
    "education-india": "Education in India"
  };
  
  // Filter videos based on search query
  const filterVideos = (videos: any[], category: string) => {
    return videos
      .filter(video => category === 'all' ? true : video.keyword === category)
      .filter(video => 
        video.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
  };

  const handlePlayVideo = (videoId: string, title: string) => {
    setActiveVideo({
      id: videoId,
      title: title
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Career Videos</h1>
        <p className="text-muted-foreground">Watch insightful videos about career paths and education options</p>
      </div>
      
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search videos..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Video Categories */}
      <Tabs defaultValue="all">
        <TabsList className="mb-6 w-full overflow-x-auto flex whitespace-nowrap scrollbar-hide">
          {Object.entries(categories).map(([key, label]) => (
            <TabsTrigger key={key} value={key} className="flex-shrink-0">
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {Object.keys(categories).map(category => (
          <TabsContent key={category} value={category}>
            {filterVideos(allVideos, category).length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filterVideos(allVideos, category).map((video) => (
                  <Card key={video.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative">
                      <img 
                        src={video.thumbnail_url} 
                        alt={video.title} 
                        className="w-full aspect-video object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-12 w-12 rounded-full bg-white text-black hover:scale-110 transition-transform"
                          onClick={() => handlePlayVideo(video.id, video.title)}
                        >
                          <Play className="h-6 w-6" />
                        </Button>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{video.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span>{video.views} views</span>
                        <span className="mx-1">•</span>
                        <span>{video.date}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handlePlayVideo(video.id, video.title)}
                      >
                        <Youtube className="mr-2 h-4 w-4 text-red-600" />
                        Watch Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No videos found</h3>
                <p className="text-muted-foreground">Try a different search term or category.</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Video Player Dialog */}
      {activeVideo && (
        <Dialog open={!!activeVideo} onOpenChange={() => setActiveVideo(null)}>
          <DialogContent className="sm:max-w-[80vw] max-h-[80vh] p-0">
            <DialogHeader className="p-4">
              <DialogTitle>{activeVideo.title}</DialogTitle>
            </DialogHeader>
            <div className="aspect-video w-full">
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${activeVideo.id}`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Videos;
