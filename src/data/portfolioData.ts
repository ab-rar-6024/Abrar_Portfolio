// ─── TYPES ────────────────────────────────────────────────────────
export interface NavItem { label: string; href: string; }
export interface SkillBar { name: string; pct: number; }
export interface SkillGroup { title: string; skills: SkillBar[]; tags?: string[]; }
export interface Project { 
  id: number; 
  title: string; 
  desc: string; 
  tags: string[]; 
  icon: string; 
  color: 'cyan' | 'purple' | 'pink'; 
  link?: string; 
  githubUrl?: string;
  liveUrl?: string;
}
export interface ExperienceItem { date: string; role: string; company: string; points: string[]; side: 'left' | 'right'; }
export interface Certification { icon: string; name: string; issuer: string; }

// ─── DATA ──────────────────────────────────────────────────────────
export const NAV_ITEMS: NavItem[] = [
  { label: 'Home',       href: 'hero'       },
  { label: 'About',      href: 'about'      },
  { label: 'Skills',     href: 'skills'     },
  { label: 'Projects',   href: 'projects'   },
  { label: 'Experience', href: 'experience' },
  { label: 'Contact',    href: 'contact'    },
];

export const HERO_ROLES: string[] = [
  'AI & Data Science Engineer',
  'Machine Learning Enthusiast',
  'Data Visualization Expert',
  'Problem Solver & Builder',
];

export const SKILL_GROUPS: SkillGroup[] = [
  { title: 'Languages', skills: [{ name: 'Python', pct: 85 },{ name: 'SQL', pct: 80 },{ name: 'R', pct: 70 }] },
  { title: 'AI / ML', skills: [{ name: 'Machine Learning', pct: 85 },{ name: 'Deep Learning', pct: 75 },{ name: 'NLP / Chatbots', pct: 70 },{ name: 'Computer Vision', pct: 65 }] },
  { title: 'Data & Tools', skills: [{ name: 'Power BI', pct: 85 },{ name: 'Data Analysis', pct: 82 },{ name: 'ggplot2 / R Viz', pct: 75 }], tags: ['Problem Solving','Analytical Thinking','Team Collaboration','Communication','Adaptability','Time Management'] },
];

export const PROJECTS: Project[] = [
  { 
    id: 1, 
    title: 'AI Virtual Mouse', 
    desc: 'Developed a contactless mouse controller using computer vision and hand gesture recognition. Users control the cursor and perform clicks using finger movements detected via webcam in real time.', 
    tags: ['Python', 'OpenCV', 'MediaPipe', 'Computer Vision'], 
    icon: '🖱️', 
    color: 'cyan',
    githubUrl: 'https://github.com/ab-rar-6024/AI_Virtual_Mouse'
  },
  { 
    id: 2, 
    title: 'AI Theft Detection System', 
    desc: 'Built a real-time surveillance system using deep learning to detect suspicious behavior and theft activity from CCTV feeds, with instant alert notifications.', 
    tags: ['Python', 'YOLOv8', 'Deep Learning', 'OpenCV'], 
    icon: '🔒', 
    color: 'pink',
    githubUrl: 'https://github.com/ab-rar-6024/AI_Theft_Detection'
  },
  { 
    id: 3, 
    title: 'Jarvis AI Voice Assistant', 
    desc: 'Created a personal AI voice assistant capable of answering questions, controlling system functions, browsing the web, and performing tasks through natural language voice commands.', 
    tags: ['Python', 'NLP', 'Speech Recognition', 'AI'], 
    icon: '🎙️', 
    color: 'purple',
    githubUrl: 'https://github.com/ab-rar-6024/Jarvis_voice_assistant'
  },
  { 
    id: 4, 
    title: 'Real-Time Object Captioning', 
    desc: 'Created a live object detection and captioning system that identifies objects in real-time video streams and generates natural language descriptions for accessibility and surveillance use cases.', 
    tags: ['Python', 'YOLO', 'NLP', 'Computer Vision'], 
    icon: '🎥', 
    color: 'cyan',
    githubUrl: 'https://github.com/ab-rar-6024/real_time_object_captioning'
  },
  { 
    id: 5, 
    title: 'Power BI Analytics Dashboard', 
    desc: 'Designed interactive business intelligence dashboards with KPIs, dynamic charts, slicers, and DAX-powered measures to transform raw operational data into actionable business insights.', 
    tags: ['Power BI', 'DAX', 'Data Analytics', 'KPI Design'], 
    icon: '📊', 
    color: 'cyan',
    githubUrl: 'https://github.com/ab-rar-6024/Power-BI-Analytics-Project'
  },
  { 
    id: 6, 
    title: 'AI Chatbot Application', 
    desc: 'Rule-based and AI-assisted chatbot for automated query handling, improving response efficiency with predefined logic and NLP concepts.', 
    tags: ['Python', 'NLP', 'AI', 'Chatbot'], 
    icon: '🤖', 
    color: 'purple',
    githubUrl: 'https://github.com/ab-rar-6024/Jarvis_voice_assistant'
  },
  { 
    id: 7, 
    title: 'Attendance System Mobile App', 
    desc: 'Developed and deployed a full-stack mobile attendance management application with secure authentication, real-time tracking, and admin controls. Live on Google Play Store.', 
    tags: ['Flutter', 'Mobile', 'Firebase', 'Play Store'], 
    icon: '📱', 
    color: 'purple',
    githubUrl: 'https://github.com/ab-rar-6024/Attendance_System_Mobile_v1',
    liveUrl: 'https://attendancesystemmobile.vercel.app/'
  },
  { 
    id: 8, 
    title: 'Punch In/Out Workforce App', 
    desc: 'Built a web and mobile workforce attendance solution with GPS-based punch tracking, shift management, and automated timesheet generation for HR teams.', 
    tags: ['JavaScript', 'Web Dev', 'HR Tech', 'Time Tracking'], 
    icon: '⏱️', 
    color: 'cyan',
    githubUrl: 'https://github.com/ab-rar-6024/Punch-in-punch-out-app'
  },
  { 
    id: 9, 
    title: 'Vehicle Detection System', 
    desc: 'Implemented a computer vision-based vehicle detection and classification system using deep learning for real-time traffic monitoring and smart city safety applications.', 
    tags: ['Python', 'YOLO', 'Deep Learning', 'Smart City'], 
    icon: '🚗', 
    color: 'purple',
    githubUrl: 'https://github.com/ab-rar-6024/vehicle_detection'
  },
];

export const EXPERIENCE: ExperienceItem[] = [
  { date:'June 2025 – July 2025', role:'IT Intern', company:'DP World', side:'right', points:['15-day intensive IT internship focused on hands-on practical learning','Completed 10 project-based tasks involving IT systems and applications','Gained exposure to software development, system support & database ops','Assisted in application development, testing, and troubleshooting','Collaborated with team members in a real-time operational environment'] },
];

export const CERTIFICATIONS: Certification[] = [
  { icon:'☁️', name:'AWS Project Network', issuer:'Coursera' },
  { icon:'🤖', name:'Machine Learning A-Z', issuer:'Udemy' },
  { icon:'🧠', name:'Deep Learning', issuer:'Udemy' },
  { icon:'📊', name:'Data Mining in R', issuer:'Infosys' },
  { icon:'📈', name:'Business Intelligence', issuer:'Infosys' },
  { icon:'✨', name:'BCGX Generative AI Simulation', issuer:'BCG X' },
  { icon:'🔢', name:'Quantium Job Simulation', issuer:'Quantium' },
];

export const CONTACT_INFO = {
  email:    'samohamedabrar2005@gmail.com',
  phone:    '+91 9042272801',
  linkedin: 'https://linkedin.com/in/mohamed-abrar-24sa',
  github:   'https://github.com/ab-rar-6024',
  location: 'Chennai, Tamil Nadu, India',
};