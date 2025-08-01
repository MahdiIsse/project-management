// src/shared/data/dummyData.ts

import { formatDateForDatabase } from "@/shared/lib/utils/date-utils";

// Helper function to create dates relative to today
const getRelativeDate = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return formatDateForDatabase(date);
};

// Types voor onze dummy data structuur
export interface DummyWorkspace {
  title: string;
  description: string;
  color: string;
  position: number;
  columns: DummyColumn[];
}

export interface DummyColumn {
  title: string;
  border: string;
  position: number;
  tasks: DummyTask[];
}

export interface DummyTask {
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  due_date?: string;
  position: number;
  assigneeIds: number[]; // Index in DUMMY_ASSIGNEES array
  tagIds: number[]; // Index in DUMMY_TAGS array
}

export interface DummyAssignee {
  name: string;
  avatar_url: string | null;
}

export interface DummyTag {
  name: string;
  color_name: string;
}

// 🧑‍💼 ASSIGNEES (5 diverse team members)
export const DUMMY_ASSIGNEES: DummyAssignee[] = [
  {
    name: "Mahdi Isse",
    avatar_url: "/mahdi.jpg"
  },
  {
    name: "Emma van der Berg",
    avatar_url: "/vrouw-4.jpg"
  },
  {
    name: "Lars Janssen",
    avatar_url: "/man-1.jpg"
  },
  {
    name: "Sophie de Vries",
    avatar_url: "/vrouw-1.jpg"
  },
  {
    name: "Tim Bakker",
    avatar_url: "/man-2.jpg"
  },
  {
    name: "Lisa Meijer",
    avatar_url: "/vrouw-2.jpg"
  }
];

// 🏷️ TAGS (8 verschillende categorieën)
export const DUMMY_TAGS: DummyTag[] = [
  { name: "Frontend", color_name: "Blauw" },
  { name: "Backend", color_name: "Groen" },
  { name: "Database", color_name: "Paars" },
  { name: "Bug Fix", color_name: "Rood" },
  { name: "Feature", color_name: "Oranje" },
  { name: "Design", color_name: "Roze" },
  { name: "Testing", color_name: "Geel" },
  { name: "DevOps", color_name: "Grijs" }
];

// 🏢 WORKSPACES (3 verschillende projecten)
export const DUMMY_WORKSPACES: DummyWorkspace[] = [
  {
    title: "E-commerce Platform",
    description: "Moderne webshop met React, Node.js en PostgreSQL",
    color: "Blauw",
    position: 0,
    columns: [
      {
        title: "To Do",
        border: "border-blue-400",
        position: 0,
        tasks: [
          {
            title: "Product filter systeem",
            description: "Implementeer geavanceerde filter opties voor producten (prijs, categorie, merk, rating)",
            priority: "High",
            due_date: getRelativeDate(5),
            position: 0,
            assigneeIds: [0, 1], // Sarah, Marcus
            tagIds: [0, 4] // Frontend, Feature
          },
          {
            title: "Shopping cart persistentie",
            description: "Zorg dat winkelwagen items behouden blijven tussen sessies met localStorage",
            priority: "Medium",
            due_date: getRelativeDate(8),
            position: 1,
            assigneeIds: [0], // Sarah
            tagIds: [0, 4] // Frontend, Feature
          },
          {
            title: "Email notificatie systeem",
            description: "Setup SendGrid voor order confirmaties en status updates",
            priority: "Medium",
            due_date: getRelativeDate(12),
            position: 2,
            assigneeIds: [1], // Marcus
            tagIds: [1, 7] // Backend, DevOps
          }
        ]
      },
      {
        title: "In Progress",
        border: "border-yellow-400",
        position: 1,
        tasks: [
          {
            title: "Payment integratie Stripe",
            description: "Implementeer veilige betalingsverwerking met Stripe API en webhooks",
            priority: "High",
            due_date: getRelativeDate(3),
            position: 0,
            assigneeIds: [1, 2], // Marcus, Elena
            tagIds: [1, 4] // Backend, Feature
          },
          {
            title: "Product review systeem",
            description: "Ontwikkel review functionaliteit met sterren rating en comments",
            priority: "Medium",
            position: 1,
            assigneeIds: [2], // Elena
            tagIds: [0, 1, 2] // Frontend, Backend, Database
          }
        ]
      },
      {
        title: "Review",
        border: "border-purple-400",
        position: 2,
        tasks: [
          {
            title: "Mobile responsive design",
            description: "Test en optimaliseer de webshop voor verschillende schermformaten",
            priority: "High",
            due_date: getRelativeDate(1),
            position: 0,
            assigneeIds: [0, 4], // Sarah, Aisha
            tagIds: [0, 5, 6] // Frontend, Design, Testing
          },
          {
            title: "Security audit",
            description: "Voer penetratietests uit en implementeer security best practices",
            priority: "High",
            due_date: getRelativeDate(2),
            position: 1,
            assigneeIds: [1, 3], // Marcus, David
            tagIds: [1, 6] // Backend, Testing
          }
        ]
      },
      {
        title: "Done",
        border: "border-green-400",
        position: 3,
        tasks: [
          {
            title: "Project setup & database schema",
            description: "Next.js project opgezet met TypeScript, Supabase database geïnitialiseerd",
            priority: "High",
            position: 0,
            assigneeIds: [1, 3], // Marcus, David
            tagIds: [1, 2, 7] // Backend, Database, DevOps
          },
          {
            title: "User authenticatie systeem",
            description: "Login/register functionaliteit met JWT tokens en password hashing",
            priority: "High",
            position: 1,
            assigneeIds: [1], // Marcus
            tagIds: [1, 4] // Backend, Feature
          },
          {
            title: "Basic product CRUD",
            description: "Create, Read, Update, Delete operaties voor product management",
            priority: "Medium",
            position: 2,
            assigneeIds: [2], // Elena
            tagIds: [1, 2] // Backend, Database
          }
        ]
      }
    ]
  },
  {
    title: "Task Management App",
    description: "Portfolio project - Kanban board met drag & drop functionaliteit",
    color: "Groen",
    position: 1,
    columns: [
      {
        title: "Backlog",
        border: "border-gray-400",
        position: 0,
        tasks: [
          {
            title: "Advanced notifications",
            description: "Push notifications voor deadlines en task assignments",
            priority: "Low",
            due_date: getRelativeDate(20),
            position: 0,
            assigneeIds: [3], // David
            tagIds: [4, 7] // Feature, DevOps
          },
          {
            title: "Time tracking feature",
            description: "Mogelijkheid om tijd te loggen per taak voor productiviteitsanalyse",
            priority: "Low",
            due_date: getRelativeDate(25),
            position: 1,
            assigneeIds: [2, 4], // Elena, Aisha
            tagIds: [0, 1, 4] // Frontend, Backend, Feature
          }
        ]
      },
      {
        title: "In Development",
        border: "border-blue-400",
        position: 1,
        tasks: [
          {
            title: "Drag & Drop optimalisatie",
            description: "Verbeteren van de drag & drop performance en user experience",
            priority: "Medium",
            due_date: getRelativeDate(4),
            position: 0,
            assigneeIds: [0, 4], // Sarah, Aisha
            tagIds: [0, 5] // Frontend, Design
          },
          {
            title: "Real-time collaboratie",
            description: "WebSocket implementatie voor live updates tussen gebruikers",
            priority: "High",
            due_date: getRelativeDate(6),
            position: 1,
            assigneeIds: [1, 3], // Marcus, David
            tagIds: [1, 4] // Backend, Feature
          },
          {
            title: "Dark mode toggle",
            description: "Implementeer dark/light theme switcher met persistentie",
            priority: "Low",
            position: 2,
            assigneeIds: [0], // Sarah
            tagIds: [0, 5] // Frontend, Design
          }
        ]
      },
      {
        title: "Testing",
        border: "border-orange-400",
        position: 2,
        tasks: [
          {
            title: "E2E test suite",
            description: "Cypress tests voor kritieke user flows (login, task creation, drag & drop)",
            priority: "High",
            due_date: getRelativeDate(2),
            position: 0,
            assigneeIds: [3, 4], // David, Aisha
            tagIds: [6] // Testing
          },
          {
            title: "Performance monitoring",
            description: "Setup Lighthouse CI en Core Web Vitals tracking",
            priority: "Medium",
            position: 1,
            assigneeIds: [3], // David
            tagIds: [6, 7] // Testing, DevOps
          }
        ]
      },
      {
        title: "Completed",
        border: "border-green-400",
        position: 3,
        tasks: [
          {
            title: "Workspace management",
            description: "CRUD operaties voor workspaces met color coding en positions",
            priority: "High",
            position: 0,
            assigneeIds: [1, 2], // Marcus, Elena
            tagIds: [0, 1, 4] // Frontend, Backend, Feature
          },
          {
            title: "Task filtering & search",
            description: "Advanced filters voor assignees, tags, priority en search functionality",
            priority: "Medium",
            position: 1,
            assigneeIds: [0, 2], // Sarah, Elena
            tagIds: [0, 4] // Frontend, Feature
          },
          {
            title: "Responsive sidebar",
            description: "Mobile-friendly navigation met collapsible sidebar",
            priority: "Medium",
            position: 2,
            assigneeIds: [0, 4], // Sarah, Aisha
            tagIds: [0, 5] // Frontend, Design
          }
        ]
      }
    ]
  },
  {
    title: "Data Analytics Dashboard",
    description: "Business Intelligence dashboard met real-time data visualisatie",
    color: "Paars",
    position: 2,
    columns: [
      {
        title: "Planning",
        border: "border-indigo-400",
        position: 0,
        tasks: [
          {
            title: "Data warehouse design",
            description: "Ontwerp van de data warehouse architectuur met dimensional modeling",
            priority: "High",
            due_date: getRelativeDate(7),
            position: 0,
            assigneeIds: [2, 3], // Elena, David
            tagIds: [2, 7] // Database, DevOps
          },
          {
            title: "API rate limiting strategy",
            description: "Implementeer rate limiting voor externe data sources en API calls",
            priority: "Medium",
            due_date: getRelativeDate(14),
            position: 1,
            assigneeIds: [1], // Marcus
            tagIds: [1, 7] // Backend, DevOps
          }
        ]
      },
      {
        title: "Building",
        border: "border-yellow-400",
        position: 1,
        tasks: [
          {
            title: "Chart.js integratie",
            description: "Implementeer interactieve charts met Chart.js voor data visualisatie",
            priority: "High",
            due_date: getRelativeDate(5),
            position: 0,
            assigneeIds: [0, 4], // Sarah, Aisha
            tagIds: [0, 4] // Frontend, Feature
          },
          {
            title: "ETL pipeline setup",
            description: "Data extraction, transformation en loading pipeline met Node.js",
            priority: "High",
            due_date: getRelativeDate(9),
            position: 1,
            assigneeIds: [1, 3], // Marcus, David
            tagIds: [1, 2] // Backend, Database
          },
          {
            title: "Caching layer optimalisatie",
            description: "Redis implementatie voor performance verbetering van queries",
            priority: "Medium",
            position: 2,
            assigneeIds: [3], // David
            tagIds: [1, 2, 7] // Backend, Database, DevOps
          }
        ]
      },
      {
        title: "QA Testing",
        border: "border-red-400",
        position: 2,
        tasks: [
          {
            title: "Data accuracy validation",
            description: "Valideer de accuraatheid van berekende KPIs en metrics",
            priority: "High",
            due_date: getRelativeDate(1),
            position: 0,
            assigneeIds: [2, 4], // Elena, Aisha
            tagIds: [6, 2] // Testing, Database
          },
          {
            title: "Load testing dashboard",
            description: "Test performance onder hoge load met meerdere concurrent users",
            priority: "Medium",
            position: 1,
            assigneeIds: [3], // David
            tagIds: [6, 7] // Testing, DevOps
          }
        ]
      },
      {
        title: "Deployed",
        border: "border-green-400",
        position: 3,
        tasks: [
          {
            title: "Authentication & permissions",
            description: "Role-based access control voor verschillende dashboard secties",
            priority: "High",
            position: 0,
            assigneeIds: [1, 2], // Marcus, Elena
            tagIds: [1, 4] // Backend, Feature
          },
          {
            title: "Basic dashboard layout",
            description: "Responsive grid layout met sidebar navigation en header",
            priority: "Medium",
            position: 1,
            assigneeIds: [0, 4], // Sarah, Aisha
            tagIds: [0, 5] // Frontend, Design
          },
          {
            title: "Database connections setup",
            description: "Connecties naar verschillende data sources (PostgreSQL, MongoDB, APIs)",
            priority: "High",
            position: 2,
            assigneeIds: [3], // David
            tagIds: [2, 7] // Database, DevOps
          }
        ]
      }
    ]
  }
];

// Export all dummy data
export const DUMMY_DATA = {
  workspaces: DUMMY_WORKSPACES,
  assignees: DUMMY_ASSIGNEES,
  tags: DUMMY_TAGS
} as const;