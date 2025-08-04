# 🚀 Project Management Platform

> Een moderne, volledig functionele projectmanagement applicatie gebouwd met Next.js en TypeScript.

**🌟 Live Demo:** [app.bymahdi.nl](https://app.bymahdi.nl)

---

## 📋 Overzicht

Een geavanceerde task management platform met real-time functionaliteiten, gebouwd als portfolio project om moderne React development skills te demonstreren. De applicatie biedt een intuïtieve interface voor teamcollaboratie met drag-and-drop functionaliteit, filtering, en comprehensive task management.

## ✨ Features

### 🎯 **Core Functionaliteiten**

- **Multi-workspace ondersteuning** - Organiseer projecten in aparte workspaces
- **Drag & Drop Interface** - Intuïtieve taak management met @dnd-kit
- **Dual View Modes** - Switch tussen Kanban board en lijst weergave
- **Advanced Filtering** - Filter op status, prioriteit, assignees en tags

### 👥 **Team Management**

- **User Authentication** - Veilige login/registratie via Supabase
- **Assignee Management** - Wijs taken toe aan team members
- **Avatar Upload** - Personaliseer profielen met avatar afbeeldingen
- **Role-based Access** - Workspace-gebaseerde toegangscontrole

### 🏷️ **Task Organization**

- **Priority Levels** - Low, Medium, High prioriteiten
- **Custom Tags** - Categoriseer taken met kleurgecodeerde tags
- **Due Dates** - Deadline management met visual indicators
- **Rich Descriptions** - Uitgebreide taak beschrijvingen
- **Status Tracking** - Aanpasbare kolommen per workspace

### 🎨 **User Experience**

- **Responsive Design** - Optimaal op alle devices
- **Dark/Light Mode** - Automatische thema detectie
- **Intuitive Forms** - Advanced form validation met Zod schemas
- **Search & Filter** - Krachtige zoek functionaliteiten
- **Inline Creation** - Creëer tags/assignees direct vanuit formulieren

## 🛠️ Tech Stack

### **Frontend**

- **Next.js 15** - React framework met App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern component library
- **React Hook Form** - Performante formulieren
- **Zod** - Schema validation
- **@dnd-kit** - Drag and drop functionality
- **TanStack Query** - State management & caching

### **Backend & Database**

- **Supabase** - PostgreSQL database, auth & real-time
- **Server Actions** - Next.js server-side operations
- **File Upload** - Avatar image handling
- **Row Level Security** - Database-level authorization

### **Development Tools**

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **Git** - Version control

## 🚀 Installation & Setup

### **Prerequisites**

- Node.js 18+
- npm/yarn/pnpm
- Supabase account

### **1. Clone Repository**

```bash
git clone https://github.com/yourusername/project-management-v2.git
cd project-management-v2
```

### **2. Install Dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

### **3. Environment Setup**

Creëer een `.env.local` bestand:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### **4. Database Setup**

1. Maak een nieuw Supabase project
2. Run de SQL migrations (beschikbaar op aanvraag)
3. Enable Row Level Security
4. Setup storage bucket voor avatars

### **5. Start Development Server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in je browser.

## 👨‍💻 Developer

**Mahdi Isse**

- Portfolio: [bymahdi.nl](https://bymahdi.nl)
- LinkedIn: [linkedin.com/in/mahdi-isse](https://linkedin.com/in/mahdi-isse)
- Email: mahdi.isse@outlook.com
