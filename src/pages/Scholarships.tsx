
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Award, ExternalLink, Search } from 'lucide-react';
import { format } from 'date-fns';

const Scholarships = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Mock scholarships data - would come from Supabase in a real app
  const scholarships = [
    {
      id: 1,
      name: 'CBSE Single Girl Child Scholarship',
      category: 'Female',
      eligibility: 'Female students who are the only child of their parents',
      link: 'http://cbse.nic.in/scholarship.html',
      last_date: new Date('2025-06-30'),
      description: 'The Single Girl Child Scholarship is for female students who are the only child of their parents. It offers financial assistance for higher education.',
      amount: '₹12,000 per annum'
    },
    {
      id: 2,
      name: 'National Means Cum Merit Scholarship (NMMS)',
      category: 'Merit',
      eligibility: 'Students from economically weaker sections with good academic records',
      link: 'https://scholarships.gov.in',
      last_date: new Date('2025-05-15'),
      description: 'The NMMS is designed to prevent drop-out of talented students from economically weaker sections at class VIII and encourage them to continue education till class XII.',
      amount: '₹12,000 per annum'
    },
    {
      id: 3,
      name: 'Post Matric Scholarship for SC Students',
      category: 'SC',
      eligibility: 'SC students pursuing post-matriculation courses',
      link: 'https://scholarships.gov.in',
      last_date: new Date('2025-07-10'),
      description: 'This scholarship supports educational development of Scheduled Caste students for studies in India beyond the matriculation stage.',
      amount: 'Varies based on course'
    },
    {
      id: 4,
      name: 'Post Matric Scholarship for ST Students',
      category: 'ST',
      eligibility: 'ST students pursuing post-matriculation courses',
      link: 'https://scholarships.gov.in',
      last_date: new Date('2025-07-15'),
      description: 'This scholarship supports educational development of Scheduled Tribe students for studies in India beyond the matriculation stage.',
      amount: 'Varies based on course'
    },
    {
      id: 5,
      name: 'INSPIRE Scholarship for Higher Education (SHE)',
      category: 'Science',
      eligibility: 'Students pursuing science stream in higher education',
      link: 'https://online-inspire.gov.in',
      last_date: new Date('2025-08-31'),
      description: 'INSPIRE SHE offers scholarships to students pursuing Science stream in higher education, particularly for those who wish to continue in research-based careers.',
      amount: '₹80,000 per annum'
    },
    {
      id: 6,
      name: 'Central Sector Scheme of Scholarships for College and University Students',
      category: 'Merit',
      eligibility: 'Top 20 percentile students in class 12 board exams',
      link: 'https://scholarships.gov.in',
      last_date: new Date('2025-06-20'),
      description: 'This scholarship is awarded to meritorious students from low-income families to pursue higher education.',
      amount: '₹10,000 per annum'
    },
    {
      id: 7,
      name: 'Prime Minister\'s Scholarship Scheme for Central Armed Police Forces and Assam Rifles',
      category: 'Defense',
      eligibility: 'Dependent wards of personnel of CAPFs and Assam Rifles',
      link: 'https://scholarships.gov.in',
      last_date: new Date('2025-09-15'),
      description: 'Scholarships for the dependent wards of personnel of Central Armed Police Forces and Assam Rifles who have died or become disabled during duty.',
      amount: '₹36,000 per annum'
    },
    {
      id: 8,
      name: 'Sitaram Jindal Scholarship',
      category: 'General',
      eligibility: 'Students from financially weak backgrounds with good academic record',
      link: 'https://www.sitaramjindalfoundation.org',
      last_date: new Date('2025-05-30'),
      description: 'The Sitaram Jindal Foundation offers scholarships to economically backward and deserving students to pursue education.',
      amount: 'Varies based on course'
    },
    {
      id: 9,
      name: 'Kishore Vaigyanik Protsahan Yojana (KVPY)',
      category: 'Science',
      eligibility: 'Students pursuing basic science courses',
      link: 'https://kvpy.iisc.ac.in',
      last_date: new Date('2025-08-10'),
      description: 'KVPY is a scholarship program funded by the Department of Science and Technology of the Government of India to encourage students to pursue basic science courses.',
      amount: '₹5,000 to ₹7,000 monthly'
    }
  ];
  
  // Get unique categories for filter
  const categories = Array.from(new Set(scholarships.map(s => s.category)));
  
  // Filter scholarships based on search and category
  const filteredScholarships = scholarships.filter(scholarship => {
    const matchesSearch = scholarship.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          scholarship.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === '' || scholarship.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Format date function
  const formatDate = (date: Date) => {
    return format(date, 'MMMM d, yyyy');
  };

  // Calculate days remaining
  const getDaysRemaining = (lastDate: Date) => {
    const today = new Date();
    const diffTime = lastDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Female':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'Merit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SC':
      case 'ST':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Science':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Defense':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Scholarships for You</h1>
        <p className="text-muted-foreground">Find financial support opportunities for your education</p>
      </div>
      
      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search scholarships..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Results Section */}
      {filteredScholarships.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredScholarships.map((scholarship) => (
            <Card key={scholarship.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{scholarship.name}</CardTitle>
                  <Badge variant="outline" className={`${getCategoryColor(scholarship.category)}`}>
                    {scholarship.category}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">{scholarship.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Eligibility</h4>
                  <p className="text-sm text-muted-foreground">{scholarship.eligibility}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Amount</h4>
                  <p className="text-sm font-semibold">{scholarship.amount}</p>
                </div>
                
                <div className="flex items-center gap-1 text-sm">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Last Date:</span>
                  <span className="font-medium">{formatDate(scholarship.last_date)}</span>
                  <Badge 
                    variant="outline" 
                    className={
                      getDaysRemaining(scholarship.last_date) < 14
                        ? "bg-red-100 text-red-800 border-red-200 ml-auto"
                        : "bg-green-100 text-green-800 border-green-200 ml-auto"
                    }
                  >
                    {getDaysRemaining(scholarship.last_date)} days left
                  </Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-campus-blue hover:bg-campus-blue/90"
                  onClick={() => window.open(scholarship.link, '_blank')}
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
          <div className="inline-block p-4 rounded-full bg-muted mb-4">
            <Award className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No scholarships found</h3>
          <p className="text-muted-foreground">Try adjusting your filters to see more results.</p>
        </div>
      )}
    </div>
  );
};

export default Scholarships;
