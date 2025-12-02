import ResourceList from '@/components/resources/ResourceList';

// This would come from  Google Sheets API

const resources = [
  {
    id: 1,
    name: "Walla Walla Recovery Center",
    category: "Treatment Center",
    description: "Comprehensive addiction treatment services including detox, residential treatment, and outpatient programs for individuals and families.",
    phone: "(509) 555-0123",
    address: "123 Recovery Lane, Walla Walla, WA 99362",
    website: "https://wwrecovery.org",
    hours: "24/7 Crisis Line",
    services: ["Medical Detox", "Residential Treatment", "Outpatient Programs", "Family Therapy", "Aftercare Planning"]
  },
  {
    id: 2,
    name: "Hope & Healing Counseling",
    category: "Mental Health",
    description: "Licensed therapists specializing in addiction counseling, trauma therapy, and dual diagnosis treatment.",
    phone: "(509) 555-0456",
    address: "456 Wellness St, Walla Walla, WA 99362",
    website: "https://hopehealingww.com",
    hours: "Mon-Fri 8am-6pm",
    services: ["Individual Therapy", "Group Counseling", "EMDR", "Cognitive Behavioral Therapy"]
  },
  {
    id: 3,
    name: "Second Chance Sober Living",
    category: "Housing",
    description: "Safe, supportive transitional housing for individuals in recovery. Gender-specific homes with structured programs.",
    phone: "(509) 555-0789",
    address: "789 New Beginning Ave, Walla Walla, WA 99362",
    website: "https://secondchanceww.org",
    hours: "Office: Mon-Fri 9am-5pm",
    services: ["Sober Living Homes", "Life Skills Training", "Job Placement Assistance", "Peer Support"]
  },
  {
    id: 4,
    name: "NA/AA Walla Walla",
    category: "Support Groups",
    description: "Multiple daily meetings for Narcotics Anonymous and Alcoholics Anonymous throughout Walla Walla County.",
    phone: "(509) 555-1234",
    address: "Various locations throughout Walla Walla",
    website: "https://naww.org",
    hours: "Multiple daily meetings",
    services: ["12-Step Meetings", "Sponsorship", "Fellowship Events", "Literature"]
  },
  {
    id: 5,
    name: "Valley Recovery Resources",
    category: "Case Management",
    description: "Free case management services to help navigate treatment options, insurance, and community resources.",
    phone: "(509) 555-5678",
    address: "321 Support Circle, Walla Walla, WA 99362",
    website: "https://valleyrecovery.org",
    hours: "Mon-Fri 8am-5pm",
    services: ["Case Management", "Insurance Navigation", "Resource Referrals", "Benefits Assistance"]
  },
  {
    id: 6,
    name: "Fresh Start Employment Center",
    category: "Employment",
    description: "Job training, resume building, and employment placement for individuals in recovery.",
    phone: "(509) 555-9012",
    address: "654 Career Path, Walla Walla, WA 99362",
    website: "https://freshstartww.com",
    hours: "Tue-Thu 10am-4pm",
    services: ["Job Training", "Resume Writing", "Interview Prep", "Job Placement"]
  }
];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ResourceList resources={resources} />
    </div>
  );
}