// server/database/seed.js
const bcrypt = require('bcryptjs');

function seedDatabase(db) {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;

  if (userCount > 0) {
    // Database already has data, do not re-seed
    return;
  }

  console.log('[Database] Database is empty. Seeding initial sample data...');

  const defaultPasswordHash = bcrypt.hashSync('Demo123!', 10);

  // 1. Insert 5 Sample Students
  const insertUser = db.prepare(`
    INSERT INTO users (full_name, email, password_hash, university, department, semester, bio, profile_image, github_url, linkedin_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const students = [
    {
      full_name: 'Amina Rahman',
      email: 'demo@skillnest.local',
      password_hash: defaultPasswordHash,
      university: 'State University of Technology',
      department: 'Computer Science and Engineering',
      semester: '7th Semester',
      bio: 'Full-stack enthusiast interested in modern web architectures and real-time collaborative systems. Seeking capstone project teammates!',
      profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      github_url: 'https://github.com/aminarahman',
      linkedin_url: 'https://linkedin.com/in/aminarahman',
    },
    {
      full_name: 'Marcus Johnson',
      email: 'marcus.j@campus.edu',
      password_hash: defaultPasswordHash,
      university: 'Northwestern Metropolitan University',
      department: 'Software Engineering',
      semester: '6th Semester',
      bio: 'Passionate about mobile computing and backend microservices with Node.js and Go. President of the University ACM Chapter.',
      profile_image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
      github_url: 'https://github.com/marcusjohnson',
      linkedin_url: 'https://linkedin.com/in/marcusjohnson-se',
    },
    {
      full_name: 'Sarah Chen',
      email: 'sarah.chen@univ-tech.edu',
      password_hash: defaultPasswordHash,
      university: 'Institute of Applied Sciences',
      department: 'Artificial Intelligence & Robotics',
      semester: '8th Semester',
      bio: 'Final-year student specializing in Computer Vision and applied deep learning. Looking to connect with frontend devs for AI demos.',
      profile_image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
      github_url: 'https://github.com/sarahchen-ai',
      linkedin_url: 'https://linkedin.com/in/sarahchen-ai',
    },
    {
      full_name: 'Alex Rivera',
      email: 'alex.rivera@polytech.edu',
      password_hash: defaultPasswordHash,
      university: 'Federal Polytechnic University',
      department: 'Information Technology',
      semester: '7th Semester',
      bio: 'Frontend developer passionate about accessible UI/UX, responsive design, and component design systems. Loves React & Figma.',
      profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      github_url: 'https://github.com/alexrivera-dev',
      linkedin_url: 'https://linkedin.com/in/alexriveradev',
    },
    {
      full_name: 'Priya Patel',
      email: 'priya.patel@cityeng.edu',
      password_hash: defaultPasswordHash,
      university: 'City College of Engineering',
      department: 'Data Science & Machine Learning',
      semester: '5th Semester',
      bio: 'Junior data scientist working with Python, Pandas, and interactive analytics dashboards. Interested in predictive analytics & open data.',
      profile_image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
      github_url: 'https://github.com/priyapatel-ds',
      linkedin_url: 'https://linkedin.com/in/priyapatel-data',
    },
  ];

  const userIds = [];
  for (const s of students) {
    const info = insertUser.run(
      s.full_name,
      s.email,
      s.password_hash,
      s.university,
      s.department,
      s.semester,
      s.bio,
      s.profile_image,
      s.github_url,
      s.linkedin_url
    );
    userIds.push(info.lastInsertRowid);
  }

  // 2. Insert Technical Skills (At least 10 unique skills across students)
  const insertSkill = db.prepare('INSERT INTO skills (user_id, skill_name) VALUES (?, ?)');

  const studentSkills = [
    // Amina (user 1)
    { userId: userIds[0], skills: ['JavaScript', 'React', 'Node.js', 'Express', 'SQLite', 'Git'] },
    // Marcus (user 2)
    { userId: userIds[1], skills: ['Node.js', 'Go', 'Docker', 'REST API', 'PostgreSQL', 'C++'] },
    // Sarah (user 3)
    { userId: userIds[2], skills: ['Python', 'Machine Learning', 'PyTorch', 'Computer Vision', 'FastAPI', 'NumPy'] },
    // Alex (user 4)
    { userId: userIds[3], skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Figma', 'UI/UX Design'] },
    // Priya (user 5)
    { userId: userIds[4], skills: ['Python', 'Data Science', 'Pandas', 'SQL', 'Data Visualization', 'Machine Learning'] },
  ];

  for (const item of studentSkills) {
    for (const skill of item.skills) {
      insertSkill.run(item.userId, skill);
    }
  }

  // 3. Insert 6 Sample Projects
  const insertProject = db.prepare(`
    INSERT INTO projects (user_id, title, description, technologies, github_url, demo_url, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const sampleProjects = [
    {
      userId: userIds[0],
      title: 'UniCollab – Realtime Peer Study Platform',
      description: 'A web app enabling university students to create virtual breakout study rooms, share session notes, and track exam prep schedules.',
      technologies: 'React, Node.js, WebSockets, Express, SQLite',
      github_url: 'https://github.com/aminarahman/unicollab',
      demo_url: 'https://unicollab-demo.local',
      image_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80',
    },
    {
      userId: userIds[0],
      title: 'SmartAttendance – QR Code Course Tracker',
      description: 'Streamlined university course attendance registration using dynamic expiring QR codes and automated faculty reports.',
      technologies: 'JavaScript, Express, SQLite, Chart.js',
      github_url: 'https://github.com/aminarahman/smart-attendance',
      demo_url: '',
      image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
    },
    {
      userId: userIds[1],
      title: 'CampusRide – Student Carpooling App',
      description: 'Peer-to-peer campus ride sharing network that matches commuters by university class schedules and route intersections.',
      technologies: 'Node.js, Express, Leaflet.js, REST API',
      github_url: 'https://github.com/marcusjohnson/campus-ride',
      demo_url: 'https://campusride.example.org',
      image_url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&auto=format&fit=crop&q=80',
    },
    {
      userId: userIds[2],
      title: 'EcoVision – Campus Recycling Classifier',
      description: 'Computer vision classification model trained to identify recyclable materials and guide waste segregation on campus smart bins.',
      technologies: 'Python, PyTorch, OpenCV, Flask',
      github_url: 'https://github.com/sarahchen-ai/ecovision-classifier',
      demo_url: '',
      image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80',
    },
    {
      userId: userIds[3],
      title: 'DesignKit – Accessible UI Component Library',
      description: 'A lightweight, WCAG 2.1 AA compliant UI component library built from scratch using clean vanilla CSS and React.',
      technologies: 'React, CSS, JavaScript, Storybook',
      github_url: 'https://github.com/alexrivera-dev/designkit-ui',
      demo_url: 'https://designkit-preview.local',
      image_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80',
    },
    {
      userId: userIds[4],
      title: 'GradeMetrics – Academic Performance Predictor',
      description: 'Exploratory data analysis and predictive pipeline uncovering key correlations between lecture attendance, lab participation, and finals.',
      technologies: 'Python, Pandas, Scikit-Learn, Streamlit',
      github_url: 'https://github.com/priyapatel-ds/grademetrics',
      demo_url: '',
      image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    },
  ];

  for (const p of sampleProjects) {
    insertProject.run(
      p.userId,
      p.title,
      p.description,
      p.technologies,
      p.github_url,
      p.demo_url,
      p.image_url
    );
  }

  // 4. Insert 3 Collaboration Opportunities (Team Finder)
  const insertOpp = db.prepare(`
    INSERT INTO opportunities (user_id, title, description, required_skills, status)
    VALUES (?, ?, ?, ?, ?)
  `);

  const sampleOpportunities = [
    {
      userId: userIds[0],
      title: 'Looking for a Frontend React Developer for Final Year Capstone',
      description: 'We are developing a university event ticketing and club management portal. The backend Express API is already built, and we need someone skilled in React to build clean responsive forms and dashboards.',
      required_skills: 'React, JavaScript, CSS, REST API',
      status: 'Open',
    },
    {
      userId: userIds[2],
      title: 'Seeking UI/UX Designer & Web Dev for AI Healthcare Project',
      description: 'Our research lab has built an AI symptom-checking diagnostic algorithm in Python. We need an energetic teammate to design and code a welcoming web interface for user trials before the university symposium.',
      required_skills: 'React, UI/UX Design, CSS, Python',
      status: 'Open',
    },
    {
      userId: userIds[1],
      title: 'Teammates Wanted for National Inter-University Hackathon',
      description: 'Forming a 4-person team to compete in next month’s National Sustainable Campus Hackathon. Looking for a frontend developer and a data visualization whiz who can work quickly under a 36-hour sprint.',
      required_skills: 'JavaScript, Data Visualization, React, Git',
      status: 'Open',
    },
  ];

  for (const o of sampleOpportunities) {
    insertOpp.run(
      o.userId,
      o.title,
      o.description,
      o.required_skills,
      o.status
    );
  }

  console.log('[Database] Sample data successfully seeded!');
  console.log('[Database] Demo Account: demo@skillnest.local | Password: Demo123!');
}

module.exports = { seedDatabase };

