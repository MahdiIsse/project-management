# Project Management Platform

Een modern en functioneel platform voor projectmanagement, gebouwd met Next.js en Supabase.

**🚀 Live Demo: [app.bymahdi.nl](https://app.bymahdi.nl)**

---

## Over dit project

Dit project is een uitgebreid platform voor taakbeheer dat ik heb ontwikkeld als een showcase van mijn vaardigheden in moderne webdevelopment. Mijn doel was om een volledig functionele, real-time applicatie te bouwen die niet alleen technisch geavanceerd is, maar ook intuïtief en prettig in gebruik.

Ik heb me gericht op een schone architectuur, een optimale developer experience en een set features die echt nuttig zijn voor het beheren van projecten in teamverband.

## Belangrijkste Features

In plaats van een lange lijst, hier de kernfunctionaliteiten die het platform biedt:

- **Workspaces & Projecten:** Organiseer je werk in gescheiden workspaces, elk met eigen kolommen, taken en leden.
- **Drag & Drop Board:** Een intuïtief Kanban board om taken eenvoudig te verplaatsen tussen statussen.
- **Lijstweergave:** Wissel naar een compacte lijstweergave voor een ander overzicht van je taken.
- **Slimme Filters:** Filter taken snel op basis van status, prioriteit, toegewezen persoon of tags.
- **Team Collaboratie:** Wijs taken toe aan teamleden en personaliseer profielen met een eigen avatar.
- **Custom Tags & Prioriteiten:** Creëer eigen tags met kleuren en stel prioriteiten in om werk te structureren.


## Tech Stack & Keuzes

Voor dit project heb ik gekozen voor een moderne en schaalbare tech stack.

- **Framework:** **Next.js 15 (App Router)** - Voor server-side rendering, routing en server actions.
- **Taal:** **TypeScript** - Voor robuuste en type-veilige code.
- **Styling:** **Tailwind CSS** & **shadcn/ui** - Voor een strak design en een efficiënte manier van stylen.
- **State Management:** **TanStack Query (React Query)** - Voor het cachen en beheren van server state.
- **Formulieren:** **React Hook Form** & **Zod** - Voor performante en valideerbare formulieren.
- **Backend & Database:** **Supabase** - Dient als complete backend met een PostgreSQL database, authenticatie, file storage en real-time functionaliteit.
- **Drag & Drop:** **@dnd-kit** - Voor een performante en toegankelijke drag-and-drop ervaring.

## Zelf draaien

Volg deze stappen om het project lokaal op te zetten.

**Vereisten:**

- Node.js v18+
- Een package manager (npm, yarn, of pnpm)
- Een gratis [Supabase account](https://supabase.com/)

**1. Clone de repository**

```bash
git clone https://github.com/mahdiisse/project-management-v2.git
cd project-management-v2
```

**2. Installeer de dependencies**

```bash
npm install
```

**3. Zet je environment variabelen op**

Maak een `.env.local` bestand aan in de root van het project en voeg je Supabase credentials toe:

```env
NEXT_PUBLIC_SUPABASE_URL=jouw_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=jouw_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=jouw_service_role_key
```

Deze keys vind je in de API settings van je Supabase project.

**4. Database opzetten**

Voor het opzetten van de database heb je de SQL-schema's nodig. Neem contact met me op, dan stuur ik ze je toe. Ik werk eraan om deze binnenkort aan de repository toe te voegen voor een eenvoudigere setup.

**5. Start de development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in je browser om de applicatie te zien.

## 👨‍💻 Contact

**Mahdi Isse**

- **Portfolio:** [bymahdi.nl](https://bymahdi.nl)
- **LinkedIn:** [linkedin.com/in/mahdi-isse](https://linkedin.com/in/mahdi-isse)
- **E-mail:** mahdi.isse@outlook.com
