# Saba Zulfiqar — Modern 3D Animated Full Stack Portfolio & Admin Dashboard

A production-ready, high-performance 3D animated portfolio website built for **Saba Zulfiqar**, customized to win freelance clients and impress US-based recruiters and engineering hiring managers.

Includes a fully secured `/admin` command center with authentication, real-time cache revalidation (`revalidatePath`), project showcase manager, categorized skills manager, timeline milestone manager, profile configuration, and contact message inbox.

---

## 🚀 Live Demo & Featured Projects
- **Portfolio:** [https://saba-portfolio.vercel.app](https://saba-portfolio.vercel.app)
- **TypeOye:** [https://typeoye.com](https://typeoye.com)
- **Saba Fashion:** [https://saba-fashion.vercel.app](https://saba-fashion.vercel.app)

---

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + Lucide Icons + Glassmorphism design system
- **3D Graphics:** Three.js + React Three Fiber (`@react-three/fiber`) + `@react-three/drei`
- **Animations:** Framer Motion (UI micro-interactions, cards, modals) + GSAP ScrollTrigger
- **Database:** PostgreSQL (Neon / Supabase ready) with Prisma ORM
- **Authentication:** NextAuth (Auth.js) credentials login with bcrypt password hashing
- **Security:** Rate limiting, CSRF protection, input validation via Zod, protected routes
- **Email & Notifications:** Resend API integration with simulated local fallback
- **Image Management:** Cloudinary API integration with local preview fallback
- **SEO & Schema:** Dynamic metadata, Open Graph cards, dynamic XML sitemap, `robots.txt`, and JSON-LD Person schema

---

## 📂 Project Structure

```
├── prisma/
│   ├── schema.prisma           # Prisma schema (AdminUser, Profile, Project, Skill, TimelineItem, Message)
│   └── seed.ts                 # Database seeder (admin credentials, TypeOye, Saba Fashion, 40 skills, timeline)
├── public/
│   ├── images/                 # SVG previews and icons
│   └── resume.pdf              # PDF Resume placeholder
├── src/
│   ├── app/
│   │   ├── (admin)/admin/      # Admin dashboard pages (projects, skills, timeline, settings, messages)
│   │   ├── api/                # API routes (NextAuth, contact submission, admin CRUD routes)
│   │   ├── projects/[slug]/    # Individual project case study dynamic page
│   │   ├── globals.css         # Tailwind & theme variables
│   │   ├── layout.tsx          # Root layout with SEO metadata and JSON-LD
│   │   ├── page.tsx            # Main public portfolio page
│   │   ├── robots.ts           # Robots.txt
│   │   └── sitemap.ts          # XML Sitemap
│   ├── components/
│   │   ├── 3d/                 # Hero 3D interactive knot and Skills particle sphere
│   │   ├── portfolio/          # Navbar, Hero, About, Skills, Projects, Timeline, Contact, Footer, Cursor
│   │   ├── providers/          # ThemeProvider and AuthProvider
│   │   └── ui/                 # Toast notifications and reusable components
│   ├── lib/
│   │   ├── auth.ts             # NextAuth credentials logic
│   │   ├── data.ts             # Data layer with Prisma queries and resilient seeded defaults
│   │   ├── prisma.ts           # Global PrismaClient singleton
│   │   ├── rate-limit.ts       # In-memory sliding window rate limiter
│   │   ├── resend.ts           # Email sender with Resend API
│   │   └── validations.ts      # Zod validation schemas
│   └── types/                  # TypeScript interface definitions
├── .env.example                # Sample environment variables
├── next.config.mjs             # Next.js optimization configuration
└── tailwind.config.ts          # Tailwind theme and custom animation setup
```

---

## ⚡ Quickstart: Local Development

### 1. Clone & Install Dependencies
```bash
git clone <your-repo-url>
cd "full stack saba portfolio"
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure the following variables are defined:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/saba_portfolio?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="portfolio-super-secret-key-change-this-in-production-min-32-chars"
AUTH_SECRET="portfolio-super-secret-key-change-this-in-production-min-32-chars"
ADMIN_EMAIL="sabazulfiqar926@gmail.com"
ADMIN_PASSWORD="AdminPassword2026!"
```

> **Note on Resilient Fallback:** If you do not have a live PostgreSQL database running immediately, the portfolio is engineered with built-in data fallback in `src/lib/data.ts`. The public site and 3D scenes will run immediately without crashing!

### 3. Generate Prisma Client & Push Database Schema
When your PostgreSQL database (e.g. Neon or Supabase) is connected:
```bash
npx prisma generate
npx prisma db push
npm run prisma:seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Admin Dashboard Access

- **Login URL:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Default Email:** `sabazulfiqar926@gmail.com`
- **Default Password:** `AdminPassword2026!` (Change this inside `.env` or in production!)

### Admin Dashboard Features:
1. **Overview:** View high-level metrics (projects, skills, milestones, unread contact messages).
2. **Projects Manager:** Create, update, toggle featured/published status, manage slugs and tech tags.
3. **Skills Manager:** Group skills into Frontend, Backend, Databases, DevOps, Testing, and Fundamentals with proficiency levels.
4. **Timeline Manager:** Add or edit Experience (Orzeh Technologies) and Education (Allama Iqbal Open University).
5. **Profile Settings:** Update your professional bio, email, WhatsApp number, resume link, and social profiles.
6. **Messages Inbox:** View incoming contact submissions with timestamps, mark messages as read/unread, or delete them.

---

## 🌐 Deploying to Vercel

### Step 1: Set Up Cloud PostgreSQL Database
1. Create a free PostgreSQL database on [Neon.tech](https://neon.tech) or [Supabase.com](https://supabase.com).
2. Copy the pooled connection string (e.g. `postgresql://...neon.tech/neondb?sslmode=require`).

### Step 2: Push to GitHub
```bash
git add .
git commit -m "feat: complete 3D animated portfolio & admin dashboard"
git push origin main
```

### Step 3: Deploy on Vercel
1. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
2. Select your repository.
3. In **Environment Variables**, add:
   - `DATABASE_URL`: Your Neon/Supabase PostgreSQL connection string.
   - `NEXTAUTH_URL`: Your Vercel deployment URL (e.g., `https://your-portfolio.vercel.app`).
   - `NEXTAUTH_SECRET`: A secure 32+ character random string.
   - `AUTH_SECRET`: Same value as `NEXTAUTH_SECRET`.
   - `ADMIN_EMAIL`: Your admin email.
   - `ADMIN_PASSWORD`: A secure production password.
   - *(Optional)* `RESEND_API_KEY`: API key from [Resend](https://resend.com) for real emails.
   - *(Optional)* `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
4. Click **Deploy**.
5. Once deployed, run the seed script once against your cloud database:
   ```bash
   DATABASE_URL="<your-cloud-connection-string>" npx prisma db push
   DATABASE_URL="<your-cloud-connection-string>" npm run prisma:seed
   ```

---

## 📄 License
MIT &copy; Saba Zulfiqar
