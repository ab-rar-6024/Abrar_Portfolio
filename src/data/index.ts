// ============================================================
// DATA  —  Mohamed Abrar S A
// ============================================================

export const personalInfo = {
  name: 'Mohamed Abrar S A',
  shortName: 'MOHAMED ABRAR S A',
  initials: 'MOHAMED ABRAR S A',
  role: 'AI & Data Science Engineer',
  location: 'Chennai, Tamil Nadu',
  email: 'samohamedabrar2005@gmail.com',
  phone: '+91 9042272801',
  linkedin: 'https://linkedin.com/in/mohamed-abrar-24sa',
  github: 'https://github.com/ab-rar-6024',
  linkedinHandle: 'linkedin.com/in/mohamed-abrar-24sa',
  githubHandle: 'github.com/ab-rar-6024',
  bio: [
    "AI & Data Science Engineer with a passion for building intelligent systems that solve real-world problems. Final-year B.Tech student at BSACIST, graduating in 2027.",
    "I specialize in Machine Learning, Data Visualization, and building end-to-end AI applications — from interactive dashboards to computer vision systems.",
  ],
  roles: [
    'AI & Data Science Engineer',
    'Machine Learning Enthusiast',
    'Data Visualization Expert',
    'Problem Solver & Builder',
  ],
};

export const education = {
  degree: 'B.Tech — Artificial Intelligence & Data Science',
  institution: 'B. S. Abdur Rahman Crescent Institute of Science and Technology',
  period: '2023 – 2027',
  location: 'Chennai, Tamil Nadu',
};

export const stats = [
  { value: '5',  label: 'Internships' },
  { value: '4',  label: 'Freelance clients' },
  { value: '20', label: 'Certifications' },
  { value: '10', label: 'Projects Built' },
];

export type CertCategory = 'AI & ML' | 'Generative AI' | 'Data & Analytics' | 'Programming & Cloud';

export type Certification = {
  name: string;
  issuer: string;
  via?: string;          // platform it was delivered through
  date: string;
  category: CertCategory;
  url?: string;          // public verification link, when the certificate has one
  image?: string;        // the real certificate, in /public/certificates (a -thumb.jpg sits beside it)
};

// Taken from the certificate files themselves, newest first.
export const certifications: Certification[] = [
  { name: 'Deep Learning', issuer: 'Illinois Tech', via: 'Coursera', date: 'Sep 2026', category: 'AI & ML', url: 'https://coursera.org/verify/G0562FX9NIEA', image: '/certificates/deep-learning-illinois.jpg' },
  { name: 'Applied AI Specialization (6 courses)', issuer: 'Vanderbilt University', via: 'Coursera', date: 'Aug 2026', category: 'Generative AI', url: 'https://coursera.org/verify/specialization/P58ESS9YFE7H', image: '/certificates/applied-ai-vanderbilt.jpg' },
  { name: 'Applied Generative AI & Prompt Engineering Mastery', issuer: 'LearnKartS', via: 'Coursera', date: 'Jul 2026', category: 'Generative AI', url: 'https://coursera.org/verify/XRJZTYRRQVRZ', image: '/certificates/genai-prompt-mastery.jpg' },
  { name: 'Prompt Engineering for ChatGPT', issuer: 'Vanderbilt University', via: 'Coursera', date: 'Jul 2026', category: 'Generative AI', url: 'https://coursera.org/verify/XW5ZJVSAKJI5', image: '/certificates/prompt-engineering-chatgpt.jpg' },
  { name: 'Discover Data Analysis', issuer: 'Microsoft Learn', date: 'Jul 2026', category: 'Data & Analytics', image: '/certificates/discover-data-analysis.jpg' },
  { name: 'Claude 101', issuer: 'Anthropic', date: '2026', category: 'Generative AI', image: '/certificates/claude-101.jpg' },
  { name: 'Introduction to Data Science', issuer: 'Infosys Springboard', date: 'Jun 2025', category: 'Data & Analytics', image: '/certificates/intro-data-science.jpg' },
  { name: 'Introduction to Natural Language Processing', issuer: 'Infosys Springboard', date: 'Jun 2025', category: 'AI & ML', image: '/certificates/intro-nlp.jpg' },
  { name: 'Data Analytics Job Simulation', issuer: 'Quantium', via: 'Forage', date: 'Apr 2025', category: 'Data & Analytics', image: '/certificates/quantium-data-analytics.jpg' },
  { name: 'Advanced C++ Training', issuer: 'IIT Bombay', via: 'Spoken Tutorial', date: '2025', category: 'Programming & Cloud', image: '/certificates/advanced-cpp.jpg' },
  { name: 'AWS S3 Basics', issuer: 'Coursera Project Network', via: 'Coursera', date: 'Apr 2025', category: 'Programming & Cloud', url: 'https://coursera.org/verify/EZV6SZNTCOVQ', image: '/certificates/aws-s3-basics.jpg' },
  { name: 'GenAI Job Simulation', issuer: 'BCG X', via: 'Forage', date: 'Apr 2025', category: 'Generative AI', image: '/certificates/bcgx-genai.jpg' },
  { name: 'Introduction to Business Intelligence', issuer: 'Infosys Springboard', date: 'Mar 2025', category: 'Data & Analytics', image: '/certificates/intro-business-intelligence.jpg' },
  { name: 'Learning Data Mining with R', issuer: 'Infosys Springboard', date: 'Feb 2025', category: 'Data & Analytics', image: '/certificates/data-mining-r.jpg' },
  { name: 'Deep Learning Project: CNN Image Classification', issuer: 'Udemy', date: 'Jan 2025', category: 'AI & ML', url: 'https://ude.my/UC-febe22d0-b1a2-484d-baf1-41408fd4744a', image: '/certificates/cnn-image-classification.jpg' },
  { name: 'Machine Learning A-Z: AI, Python & R', issuer: 'Udemy', date: 'Jan 2025', category: 'AI & ML', url: 'https://ude.my/UC-f2c3cda0-185f-4a53-b733-fdbbda3f2ed1', image: '/certificates/machine-learning-a-z.jpg' },
  { name: 'Introduction to SQL', issuer: 'Simplilearn SkillUp', date: 'Oct 2024', category: 'Data & Analytics', image: '/certificates/intro-sql.jpg' },
  { name: 'Introduction to Python', issuer: 'LearnTube.ai', date: 'Oct 2024', category: 'Programming & Cloud', image: '/certificates/intro-python.jpg' },
  { name: 'C Training (scored 95%)', issuer: 'IIT Bombay', via: 'Spoken Tutorial', date: '2024', category: 'Programming & Cloud', image: '/certificates/c-training.jpg' },
  { name: 'SQL (Basic)', issuer: 'HackerRank', date: 'Sep 2024', category: 'Data & Analytics', url: 'https://www.hackerrank.com/certificates/db9f4381030d', image: '/certificates/sql-basic-hackerrank.jpg' },
];

export const awards = [
  {
    title: 'Best Team — DCE Startup Nexus',
    org: 'Dhanalakshmi College of Engineering · OneYes Infotech · Thozhil',
    date: 'Aug 2026',
    note: 'Recognised for teamwork, innovation, leadership and entrepreneurial excellence.',
  },
];

export type SkillGroup = {
  category: string;
  color: string;
  skills: { name: string; level: number }[];
  tags?: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    category: '// Languages',
    color: 'var(--cyan)',
    skills: [
      { name: 'Python', level: 85 },
      { name: 'SQL', level: 80 },
      { name: 'R', level: 70 },
    ],
  },
  {
    category: '// AI / ML',
    color: 'var(--purple)',
    skills: [
      { name: 'Machine Learning', level: 85 },
      { name: 'Deep Learning', level: 75 },
      { name: 'NLP / Chatbots', level: 70 },
      { name: 'Computer Vision', level: 65 },
    ],
  },
  {
    category: '// Data & Viz',
    color: 'var(--pink)',
    skills: [
      { name: 'Power BI', level: 85 },
      { name: 'Data Analysis', level: 82 },
      { name: 'ggplot2 / R Viz', level: 72 },
    ],
    tags: ['Problem Solving', 'Analytical Thinking', 'Team Collaboration', 'Communication', 'Adaptability', 'Time Management'],
  },
];

export type ProjectCategory = 'Client Websites' | 'AI & ML' | 'Apps & Systems';

export type Project = {
  id: string;
  num: string;
  title: string;
  description: string;
  tags: string[];
  icon: string;
  color: string;
  category: ProjectCategory;
  featured?: boolean;
  freelance?: boolean;     // built as a paid freelance engagement
  githubUrl?: string;
  liveUrl?: string;
  image?: string;          // screenshot / cover, in /public/projects
  gallery?: string[];      // photos shown in a lightbox when there is no live site
  privateRepo?: boolean;   // repo is private, so the GitHub link 404s for visitors
};

// From the starred repos on github.com/ab-rar-6024 (plus Z-Xpress). Live links and screenshots
// are for sites that are deployed; the rest link to source.
export const projects: Project[] = [
  {
    id: 'rr-events', freelance: true, num: '001', title: 'RR Events', icon: '🎤', color: 'var(--cyan)', category: 'Client Websites', featured: true,
    description: 'Marketing website for a Chennai events & entertainment studio — a multi-page React site with real event footage, GSAP + Lenis motion, a portfolio lightbox and a working enquiry form.',
    tags: ['React', 'JavaScript', 'GSAP', 'Lenis'],
    liveUrl: 'https://www.rrevents.live/', githubUrl: 'https://github.com/ab-rar-6024/RR-Events', image: '/projects/rr-events.jpg',
  },
  {
    id: 'tracole', freelance: true, num: '002', title: 'Tracole Technologies', icon: '🚧', color: 'var(--cyan)', category: 'Client Websites', featured: true,
    description: 'Corporate website for Tracole Technologies, a maker of high-security registration plates, reflective sheeting and road-safety systems — with a split “choose your path” intro, 3D and scroll-driven animation.',
    tags: ['React', 'JavaScript', 'Three.js', 'GSAP'],
    liveUrl: 'https://tracole.com/', githubUrl: 'https://github.com/ab-rar-6024/Tracole', image: '/projects/tracole.jpg',
  },
  {
    id: 'proofyx', num: '003', title: 'ProofyX', icon: '🛡️', color: 'var(--purple)', category: 'AI & ML', featured: true,
    description: 'AI deepfake and media-manipulation detector. Ensembles 7+ models (ViT, EfficientNet-B4, DINOv2, a frequency CNN and an audio CNN) with GradCAM heatmaps and cross-modal fusion across images, video and audio — served as a REST API and a web scanner.',
    tags: ['Python', 'Deep Learning', 'Computer Vision', 'GradCAM'],
    liveUrl: 'https://proofyx.vercel.app/', githubUrl: 'https://github.com/ab-rar-6024/ai-authenticity-checker', image: '/projects/proofyx.jpg',
  },
  {
    id: 'ignis-secura', num: '004', title: 'Ignis Secura', icon: '🧯', color: 'var(--pink)', category: 'Client Websites', featured: true,
    description: 'Product site for a smart gas-leak detector with AI-driven detection, instant alerts and automatic shut-off — risk explainer, feature walkthrough and pre-orders.',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Motion'],
    liveUrl: 'https://ignis-secura.vercel.app/', githubUrl: 'https://github.com/ab-rar-6024/Ignis-Secure-Website', image: '/projects/ignis-secura.jpg',
  },
  {
    id: 'pabt', freelance: true, num: '005', title: 'PABT Foundation', icon: '🌍', color: 'var(--cyan)', category: 'Client Websites', featured: true,
    description: 'Website for an Indian environmental NGO (Planting a Billion Trees) — an interactive 3D globe intro that walks visitors through five connected sustainability missions.',
    tags: ['Next.js', 'TypeScript', 'Three.js', 'GSAP'],
    liveUrl: 'https://www.pabtfoundation.com/', githubUrl: 'https://github.com/ab-rar-6024/PABT', image: '/projects/pabt.jpg',
  },
  {
    id: 'apm-iot', freelance: true, num: '006', title: 'APM IoT', icon: '🛰️', color: 'var(--cyan)', category: 'Client Websites',
    description: 'Marketing and product site for APM’s automotive IoT and fleet-telematics platform — an interactive vehicle hotspot explorer, product catalogue and SMTP contact form.',
    tags: ['Next.js', 'TypeScript', 'React Three Fiber', 'GSAP'],
    liveUrl: 'https://apm-iot.vercel.app/', githubUrl: 'https://github.com/ab-rar-6024/APM-IOT', image: '/projects/apm-iot.jpg',
  },
  {
    id: 'attendify', num: '007', title: 'Attendify — Attendance System', icon: '📱', color: 'var(--purple)', category: 'Apps & Systems', featured: true,
    description: 'Mobile-first attendance platform: GPS-validated punch in/out, PIN and biometric clock-in, admin dashboards with charts and monthly PDF reports.',
    tags: ['Node.js', 'Express', 'PostgreSQL', 'EJS'],
    liveUrl: 'https://attendancesystemmobile.vercel.app/', githubUrl: 'https://github.com/ab-rar-6024/Attendance_System_Mobile_v1', image: '/projects/attendify.jpg',
  },
  {
    id: 'pyroguard', num: '008', title: 'PyroGuard', icon: '🔥', color: 'var(--pink)', category: 'AI & ML',
    description: 'Real-time industrial wildfire and thermal-anomaly early-warning system that correlates NASA FIRMS satellite detections with site data, with a Gemini-powered incident co-pilot.',
    tags: ['React', 'TypeScript', 'Gemini API', 'Leaflet'],
    liveUrl: 'https://pyroguard.vercel.app/', githubUrl: 'https://github.com/ab-rar-6024/Pyroguard-intelligence-v1', image: '/projects/pyroguard.jpg',
  },
  {
    id: 'z-xpress', num: '009', title: 'Z-Xpress', icon: '📦', color: 'var(--cyan)', category: 'Apps & Systems',
    description: 'Courier booking, rate and invoice system for a courier business — runs as a Windows desktop app or a Flask web app, on MySQL or Supabase, with PDF/Excel invoices, automatic backups and one-click restore.',
    tags: ['Python', 'Flask', 'MySQL', 'Supabase'],
    image: '/projects/z-xpress.jpg', gallery: ['/projects/z-xpress.jpg'],
    githubUrl: 'https://github.com/ab-rar-6024/Z-Xpress', privateRepo: true,
  },
  {
    id: 'punch-in-out', num: '010', title: 'Punch In/Out App', icon: '⏱️', color: 'var(--purple)', category: 'Apps & Systems',
    description: 'The Attendify mobile app — a cross-platform app for workforce attendance that lets staff punch in and out with time tracking, built with Expo and React Native.',
    tags: ['React Native', 'Expo', 'TypeScript', 'Mobile'],
    image: '/projects/punch-in-out.jpg', gallery: ['/projects/punch-in-out.jpg'],
    githubUrl: 'https://github.com/ab-rar-6024/Punch-in-punch-out-app',
  },
];

export type Experience = {
  id: string;
  role: string;
  company: string;
  period: string;
  type: 'work' | 'education';
  engagement: 'Freelance' | 'Internship';
  certified: boolean;      // a signed certificate / letter backs this entry
  projectId?: string;      // the project this engagement produced, if any
  duration?: string;
  points: string[];
  tech?: string[];
};

// Freelance engagements and internships, newest first. Everything except RR Events is backed
// by a certificate or a signed letter.
export const experiences: Experience[] = [
  {
    id: 'pabt',
    role: 'Freelance AI Web Developer',
    company: 'PABT — Plant a Billion Trees',
    period: 'Sep 2026 – Oct 2026',
    type: 'work',
    engagement: 'Freelance',
    certified: true,
    projectId: 'pabt',
    duration: '2 months · paid',
    points: [
      'Built user-friendly web interfaces and features for the foundation’s digital initiatives',
      'Connected APIs, added AI-based functionality, and handled testing and deployment',
      'Delivered pabtfoundation.com with an interactive 3D globe tour of five sustainability missions',
    ],
    tech: ['Next.js', 'TypeScript', 'Three.js', 'GSAP'],
  },
  {
    id: 'rr-events',
    role: 'Freelance Web Developer',
    company: 'RR Events',
    period: 'Sep 2026 – Oct 2026',
    type: 'work',
    engagement: 'Freelance',
    certified: false,
    projectId: 'rr-events',
    duration: 'project',
    points: [
      'Designed and built rrevents.live for a Chennai events & entertainment studio',
      'Multi-page React site with real event footage, GSAP + Lenis motion and a working enquiry form',
    ],
    tech: ['React', 'GSAP', 'Lenis'],
  },
  {
    id: 'apm',
    role: 'Freelance AI Web Developer',
    company: 'APM Group',
    period: 'May 2026 – Aug 2026',
    type: 'work',
    engagement: 'Freelance',
    certified: true,
    projectId: 'apm-iot',
    duration: '4 months · paid',
    points: [
      'Designed, developed and enhanced web applications and AI-powered solutions for the company’s digital platforms',
      'Worked across frontend and backend, AI and API integration, responsive UI, testing and deployment',
      'Built the APM IoT product site with an interactive vehicle hotspot explorer and product catalogue',
    ],
    tech: ['Next.js', 'TypeScript', 'React Three Fiber', 'AI integration'],
  },
  {
    id: 'tracole',
    role: 'Freelance AI Web Developer',
    company: 'Tracole Technologies',
    period: 'May 2026 – Aug 2026',
    type: 'work',
    engagement: 'Freelance',
    certified: true,
    projectId: 'tracole',
    duration: '4 months · paid',
    points: [
      'Designed, built and integrated web applications and AI-powered solutions',
      'Owned frontend and backend work, API integration, responsive UI, testing and deployment',
      'Delivered tracole.com with a split “choose your path” intro, 3D and scroll-driven animation',
    ],
    tech: ['React', 'Three.js', 'GSAP', 'AI integration'],
  },
  {
    id: 'medfits',
    duration: '3 months',
    role: 'IT Intern',
    company: 'Medfits',
    period: 'Mar 2026 – May 2026',
    type: 'work',
    engagement: 'Internship',
    certified: true,
    points: [
      'Three-month IT internship handling assigned technical duties and responsibilities',
      'Recognised for dedication, professionalism and willingness to learn',
    ],
    tech: ['IT Systems', 'Web', 'Support'],
  },
  {
    id: 'dp-world',
    duration: '15 days',
    role: 'IT Intern',
    company: 'DP World',
    period: 'Jun 2025 – Jul 2025',
    type: 'work',
    engagement: 'Internship',
    certified: true,
    points: [
      'Intensive IT internship focused on hands-on practical learning',
      'Completed 10 project-based tasks involving IT systems and applications',
      'Assisted in application development, testing, troubleshooting and database operations',
    ],
    tech: ['Python', 'SQL', 'Automation', 'IT Systems'],
  },
  {
    id: 'cognifyz-ml',
    duration: '1 month',
    role: 'Machine Learning Intern',
    company: 'Cognifyz Technologies',
    period: 'Apr 2025 – May 2025',
    type: 'work',
    engagement: 'Internship',
    certified: true,
    points: [
      'Completed the machine learning internship programme',
      'Commended for attention to detail, coordination and communication',
    ],
    tech: ['Python', 'Machine Learning'],
  },
  {
    id: 'cognifyz-ds',
    duration: '1 month',
    role: 'Data Science Intern',
    company: 'Cognifyz Technologies',
    period: 'Apr 2025 – May 2025',
    type: 'work',
    engagement: 'Internship',
    certified: true,
    points: [
      'Completed the data science internship programme',
      'Commended for dedication, sincerity and a strong desire to learn',
    ],
    tech: ['Python', 'Data Analysis'],
  },
  {
    id: 'agnirva-ai',
    duration: '100+ hours',
    role: 'AI Intern (Fast Track Programme)',
    company: 'Agnirva',
    period: 'Completed Jan 2025',
    type: 'work',
    engagement: 'Internship',
    certified: true,
    points: [
      '100+ hours of hands-on learning applying AI tools to real-world problems',
    ],
    tech: ['Generative AI', 'AI Tools'],
  },
];
