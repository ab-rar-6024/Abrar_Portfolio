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
    "Aspiring AI & Data Science Engineer with a passion for building intelligent systems that solve real-world problems. Currently in my 2nd year of B.Tech at BSACIST.",
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
  { value: '9+', label: 'Projects Built' },
  { value: '7+', label: 'Certifications' },
  { value: '1',  label: 'Internship' },
  { value: '2027', label: 'Graduating' },
];

export const certifications = [
  { icon: '☁️', name: 'AWS Project Network', issuer: 'Coursera' },
  { icon: '🤖', name: 'Machine Learning A-Z', issuer: 'Udemy' },
  { icon: '🧠', name: 'Deep Learning', issuer: 'Udemy' },
  { icon: '📊', name: 'Data Mining in R', issuer: 'Infosys' },
  { icon: '📈', name: 'Business Intelligence', issuer: 'Infosys' },
  { icon: '✨', name: 'BCGX Generative AI Simulation', issuer: 'BCG X' },
  { icon: '🔢', name: 'Quantium Job Simulation', issuer: 'Quantium' },
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

export type Project = {
  id: string;
  num: string;
  title: string;
  description: string;
  tags: string[];
  icon: string;
  color: string;
  featured?: boolean;
  githubUrl?: string;   // ← add this
  liveUrl?: string; 
};

export const projects: Project[] = [
  {
    id: 'ai-virtual-mouse',
    num: '001',
    title: 'AI Virtual Mouse',
    description: 'Developed a contactless mouse controller using computer vision and hand gesture recognition. Users control the cursor and perform clicks using finger movements detected via webcam in real time.',
    tags: ['Python', 'OpenCV', 'MediaPipe', 'Computer Vision'],
    icon: '🖱️',
    color: 'var(--cyan)',
    featured: true,
    githubUrl: 'https://github.com/ab-rar-6024/AI_Virtual_Mouse',
  },
  {
    id: 'ai-theft-detection',
    num: '002',
    title: 'AI Theft Detection System',
    description: 'Built a real-time surveillance system using deep learning to detect suspicious behavior and theft activity from CCTV feeds, with instant alert notifications.',
    tags: ['Python', 'YOLOv8', 'Deep Learning', 'OpenCV'],
    icon: '🔒',
    color: 'var(--pink)',
    featured: true,
    githubUrl: 'https://github.com/ab-rar-6024/AI_Theft_Detection',
  },
  {
    id: 'jarvis-voice-assistant',
    num: '003',
    title: 'Jarvis AI Voice Assistant',
    description: 'Created a personal AI voice assistant capable of answering questions, controlling system functions, browsing the web, and performing tasks through natural language voice commands.',
    tags: ['Python', 'NLP', 'Speech Recognition', 'AI'],
    icon: '🎙️',
    color: 'var(--purple)',
    featured: true,
    githubUrl: 'https://github.com/ab-rar-6024/Jarvis_voice_assistant',
  },
  {
    id: 'real-time-object-captioning',
    num: '004',
    title: 'Real-Time Object Captioning',
    description: 'Created a live object detection and captioning system that identifies objects in real-time video streams and generates natural language descriptions for accessibility and surveillance use cases.',
    tags: ['Python', 'YOLO', 'NLP', 'Computer Vision'],
    icon: '🎥',
    color: 'var(--cyan)',
    githubUrl: 'https://github.com/ab-rar-6024/real_time_object_captioning',
  },
  {
    id: 'power-bi-analytics',
    num: '005',
    title: 'Power BI Analytics Dashboard',
    description: 'Designed interactive business intelligence dashboards with KPIs, dynamic charts, slicers, and DAX-powered measures to transform raw operational data into actionable business insights.',
    tags: ['Power BI', 'DAX', 'Data Analytics', 'KPI Design'],
    icon: '📊',
    color: 'var(--cyan)',
    githubUrl: 'https://github.com/ab-rar-6024/Power-BI-Analytics-Project',
  },
  {
    id: 'ai-chatbot',
    num: '006',
    title: 'AI Chatbot Application',
    description: 'Rule-based and AI-assisted chatbot for automated query handling, improving response efficiency with predefined logic and NLP concepts.',
    tags: ['Python', 'NLP', 'AI', 'Chatbot'],
    icon: '🤖',
    color: 'var(--purple)',
    githubUrl: 'https://github.com/ab-rar-6024/Jarvis_voice_assistant',
  },
  {
    id: 'attendance-mobile',
    num: '007',
    title: 'Attendance System Mobile App',
    description: 'Developed and deployed a full-stack mobile attendance management application with secure authentication, real-time tracking, and admin controls. Live on Google Play Store.',
    tags: ['Flutter', 'Mobile', 'Firebase', 'Play Store'],
    icon: '📱',
    color: 'var(--purple)',
    featured: true,
    githubUrl: 'https://github.com/ab-rar-6024/Attendance_System_Mobile_v1',
    liveUrl: 'https://attendancesystemmobile.vercel.app/',
  },
  {
    id: 'punch-in-out',
    num: '008',
    title: 'Punch In/Out Workforce App',
    description: 'Built a web and mobile workforce attendance solution with GPS-based punch tracking, shift management, and automated timesheet generation for HR teams.',
    tags: ['JavaScript', 'Web Dev', 'HR Tech', 'Time Tracking'],
    icon: '⏱️',
    color: 'var(--cyan)',
    githubUrl: 'https://github.com/ab-rar-6024/Punch-in-punch-out-app',
  },
  {
    id: 'vehicle-detection',
    num: '009',
    title: 'Vehicle Detection System',
    description: 'Implemented a computer vision-based vehicle detection and classification system using deep learning for real-time traffic monitoring and smart city safety applications.',
    tags: ['Python', 'YOLO', 'Deep Learning', 'Smart City'],
    icon: '🚗',
    color: 'var(--cyan)',
    githubUrl: 'https://github.com/ab-rar-6024/vehicle_detection',
  },
];

export type Experience = {
  id: string;
  role: string;
  company: string;
  period: string;
  type: 'work' | 'education';
  points: string[];
  tech?: string[];
};

export const experiences: Experience[] = [
  {
    id: 'dp-world',
    role: 'IT Intern',
    company: 'DP World',
    period: 'Jun 2025 – Jul 2025',
    type: 'work',
    points: [
      '15-day intensive IT internship focused on hands-on practical learning',
      'Completed 10 project-based tasks involving IT systems and applications',
      'Gained exposure to software development, system support and database operations',
      'Assisted in application development, testing, and troubleshooting',
      'Collaborated with team members in a real-time operational environment',
    ],
    tech: ['Python', 'SQL', 'Automation', 'IT Systems'],
  },
];
