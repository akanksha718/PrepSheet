import { useTheme } from "../context/Theme";
import { useState, useEffect } from "react";
import { Briefcase, Calendar, MapPin, ExternalLink, Search, Filter, Loader } from "lucide-react";

export default function ProgressPanel() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // all, internship, job, hackathon
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch opportunities from multiple sources
  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      // Using GitHub Jobs API alternative - Remotive API for tech jobs
      const response = await fetch('https://remotive.com/api/remote-jobs?category=software-dev&limit=20');
      const data = await response.json();
      
      // Helper function to strip HTML and truncate text
      const stripHtml = (html) => {
        if (!html) return '';
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        let text = tmp.textContent || tmp.innerText || '';
        // Remove extra whitespace and newlines
        text = text.replace(/\s+/g, ' ').trim();
        return text.substring(0, 200) + (text.length > 200 ? '...' : '');
      };
      
      // Transform data to our format
      const formattedOpportunities = data.jobs.map(job => ({
        id: job.id,
        title: job.title,
        company: job.company_name,
        type: 'job',
        location: 'Remote',
        description: stripHtml(job.description),
        url: job.url,
        date: new Date(job.publication_date).toLocaleDateString(),
        tags: (job.tags || ['Software Development']).slice(0, 6)
      }));

      // Add some mock internship and hackathon data
      const mockInternships = [
        {
          id: 'int-1',
          title: 'Summer Software Engineering Intern',
          company: 'Google',
          type: 'internship',
          location: 'Mountain View, CA',
          description: 'Work on cutting-edge projects with experienced engineers. Build scalable systems and learn from the best.',
          url: 'https://careers.google.com',
          date: new Date().toLocaleDateString(),
          tags: ['Backend', 'Distributed Systems']
        },
        {
          id: 'int-2',
          title: 'Frontend Development Intern',
          company: 'Meta',
          type: 'internship',
          location: 'Menlo Park, CA',
          description: 'Build user-facing features for billions of users. Work with React, GraphQL, and modern web technologies.',
          url: 'https://www.metacareers.com',
          date: new Date().toLocaleDateString(),
          tags: ['React', 'Frontend', 'GraphQL']
        }
      ];

      const mockHackathons = [
        {
          id: 'hack-1',
          title: 'HackMIT 2026',
          company: 'MIT',
          type: 'hackathon',
          location: 'Cambridge, MA',
          description: '36-hour hackathon with workshops, mentorship, and prizes. Build innovative projects with teams.',
          url: 'https://hackmit.org',
          date: 'Oct 15-17, 2026',
          tags: ['AI/ML', 'Web Dev', 'Hardware']
        },
        {
          id: 'hack-2',
          title: 'MLH Hackathon Season',
          company: 'Major League Hacking',
          type: 'hackathon',
          location: 'Various',
          description: 'Join hackathons worldwide. Network with students, learn new skills, and win prizes.',
          url: 'https://mlh.io',
          date: 'Ongoing',
          tags: ['Beginners Welcome', 'Global']
        }
      ];

      setOpportunities([...formattedOpportunities.slice(0, 10), ...mockInternships, ...mockHackathons]);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      // Fallback to mock data if API fails
      setOpportunities([
        {
          id: '1',
          title: 'Software Engineer Intern',
          company: 'Tech Corp',
          type: 'internship',
          location: 'Remote',
          description: 'Join our engineering team to work on exciting projects. Learn from experienced developers.',
          url: '#',
          date: new Date().toLocaleDateString(),
          tags: ['React', 'Node.js']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesFilter = filter === 'all' || opp.type === filter;
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTypeColor = (type) => {
    switch(type) {
      case 'internship':
        return isLight ? 'bg-blue-100 text-blue-800' : 'bg-blue-900 text-blue-200';
      case 'job':
        return isLight ? 'bg-green-100 text-green-800' : 'bg-green-900 text-green-200';
      case 'hackathon':
        return isLight ? 'bg-purple-100 text-purple-800' : 'bg-purple-900 text-purple-200';
      default:
        return isLight ? 'bg-gray-100 text-gray-800' : 'bg-gray-700 text-gray-200';
    }
  };

  return (
    <div className={` 
        ${isLight ? "bg-white text-black" : "bg-[#292a2a] text-white"}
        rounded-xl shadow-md p-3 sm:p-4 space-y-4
      `}>
      {/* Header */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Opportunities Board</h1>
          <button
            onClick={fetchOpportunities}
            disabled={loading}
            className={`px-3 sm:px-4 py-2 rounded flex items-center justify-center gap-2 transition text-sm sm:text-base ${
              isLight
                ? "bg-slate-900 text-white hover:bg-slate-800"
                : "bg-orange-500 text-white hover:bg-orange-600"
            } disabled:opacity-50`}
          >
            {loading ? <Loader size={16} className="animate-spin" /> : <Search size={16} />}
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        <p className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
          Discover internships, jobs, and hackathons for BTech CSE students
        </p>
        <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search opportunities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded border outline-none ${
                isLight
                  ? "bg-white border-gray-300 text-black"
                  : "bg-gray-700 border-gray-600 text-white"
              }`}
            />
          </div>
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          

          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {['all', 'internship', 'job', 'hackathon'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-3 sm:px-4 py-2 rounded text-xs sm:text-sm font-medium capitalize transition whitespace-nowrap ${
                  filter === type
                    ? isLight
                      ? "bg-slate-900 text-white"
                      : "bg-orange-500 text-white"
                    : isLight
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Opportunities List */}
      <div className={`rounded-lg ${isLight ? "bg-gray-50" : "bg-[#3f4141]"} p-4`}>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader size={32} className="animate-spin text-orange-500" />
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <div className="text-center py-12">
            <p className={isLight ? "text-gray-500" : "text-gray-400"}>
              No opportunities found. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[500px] sm:max-h-[550px] lg:max-h-[650px] overflow-y-auto pr-2">
            {filteredOpportunities.map((opp) => (
              <div
                key={opp.id}
                className={`p-4 rounded-lg shadow-sm hover:shadow-md transition border ${
                  isLight ? "bg-white border-gray-200" : "bg-gray-800 border-gray-700"
                }`}
              >
                <div className="flex flex-col gap-3">
                  {/* Header with title and badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold truncate" title={opp.title}>
                        {opp.title}
                      </h3>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${getTypeColor(opp.type)}`}>
                      {opp.type}
                    </span>
                  </div>

                    {/* Meta information */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm">
                    <div className="flex items-center gap-1.5">
                      <Briefcase size={14} className="text-gray-500 flex-shrink-0" />
                      <span className="truncate">{opp.company}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-gray-500 flex-shrink-0" />
                      <span className="truncate">{opp.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-gray-500 flex-shrink-0" />
                      <span className="whitespace-nowrap">{opp.date}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className={`text-sm leading-relaxed line-clamp-2 ${
                    isLight ? "text-gray-700" : "text-gray-300"
                  }`}>
                    {opp.description}
                  </p>

                  {/* Tags - Show max 5 tags */}
                  {opp.tags && opp.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {opp.tags.slice(0, 5).map((tag, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                            isLight ? "bg-gray-100 text-gray-700" : "bg-gray-700 text-gray-300"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                      {opp.tags.length > 5 && (
                        <span className={`px-2 py-0.5 text-xs ${
                          isLight ? "text-gray-500" : "text-gray-400"
                        }`}>
                          +{opp.tags.length - 5} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Apply button */}
                  <a
                    href={opp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all w-full mt-1 ${
                      isLight
                        ? "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg"
                        : "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg"
                    }`}
                  >
                    Apply Now
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
        <span>Showing {filteredOpportunities.length} opportunities</span>
        <span className="text-xs">Last updated: {new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
}
