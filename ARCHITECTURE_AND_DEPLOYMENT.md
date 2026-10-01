# THE SMART MODERN PUBLIC SCHOOL QAMBER - MANAGEMENT SYSTEM (ERP)

An enterprise-grade, modern, and responsive School Management Web Application designed specifically for **THE SMART MODERN PUBLIC SCHOOL QAMBER**.

---

## 1. Demo Credentials & Sample Accounts

You can switch between any of these accounts with **1-click** using the demo pills on the Login Page or the role switcher in the top navigation bar:

| Role | Username / Email | Password | Access Level |
|---|---|---|---|
| **Admin** | `admin@smartmodern.edu.pk` | `admin123` | Full unrestricted system access |
| **Principal** | `principal@smartmodern.edu.pk` | `principal123` | Executive, academics, examinations, fee views, notices |
| **Teacher** | `teacher@smartmodern.edu.pk` | `teacher123` | Assigned classes, attendance marking, homework, marks entry |
| **Accountant** | `accountant@smartmodern.edu.pk` | `accountant123` | Fee collections, receipts, challans, pending dues, financial reports |
| **Staff** | `staff@smartmodern.edu.pk` | `staff123` | Admissions intake, registers, student directory view |

---

## 2. Core Modules & Functionality Implemented

1. **Authentication & RBAC**:
   - Role-Based Access Control matrix for all 5 roles.
   - Demo account quick-switcher.
   - Session persistence in LocalStorage with security reminders.

2. **Dashboard & Analytics**:
   - KPIs: Total Students (Boys vs Girls), Faculty, Staff, Classes, Today's Attendance, Fee Collections, Outstanding Dues, New Admissions.
   - 4 Interactive Chart.js charts:
     - Student Gender Ratio (Doughnut)
     - Daily Attendance Breakdown (Bar)
     - Fee Collections vs Pending (Pie)
     - Monthly Admissions Trend (Line)
   - Quick action shortcuts.

3. **Student Management**:
   - Complete CRUD: Add, edit, delete, search, filter (class, gender, status).
   - Tabbed student profile modal (Bio, Attendance log, Fee ledger, Exam results, Homework, Documents).
   - Student Academic Promotion modal (batch promote students across grades).
   - Structured Excel export (`.xlsx` using `xlsx` library with auto-fitted column widths), CSV export, and print view.

4. **Faculty & Teachers**:
   - Full teacher profiles (Designation, CNIC, qualifications, assigned subjects, assigned classes, salary).
   - Induct new teacher modal, profile view, search, filter, and structured Excel export (`.xlsx`).

5. **Support Staff**:
   - Directory for Accountant, Clerk, Librarian, Receptionist, Security, Lab Assistants.

6. **Parents & Guardians**:
   - Profiles with linked enrolled children.

7. **Classes & Sections**:
   - Grade levels 1 to 10 with sections (A, B, C, Science-A, etc.), incharge teacher, room number, and seat capacity.

8. **Curriculum Subjects**:
   - Subject codes, class levels, assigned educators, maximum and passing marks.

9. **Attendance System**:
   - Date, Class, and Section selector.
   - One-click [Present] [Absent] [Leave] toggles.
   - "Mark All Present", "Mark All Absent", "Save Attendance".
   - Teacher attendance register ([Present], [Absent], [Leave], [Half Day]).
   - Structured Excel export (`.xlsx`) for both Student and Teacher attendance registers.
   - Real-time progress bar.

10. **Weekly Timetable Grid**:
    - Monday to Saturday, Periods 1 to 7 with time intervals, subjects, educators, and rooms.
    - Add period modal & printer-friendly timetable layout.

11. **Homework Management**:
    - Assign coursework with titles, instructions, classes, subjects, and due dates.

12. **Examinations & Auto-Grading**:
    - Exam schedules & date sheets.
    - Marks entry grid with automatic calculation of total marks, percentages, letter grades (A+, A, B, C, D, F) and pass/fail status based on configurable settings.
    - **Official Printable Report Card** with school letterhead, student photo, subject-wise scores, teacher remarks, principal signature, and official school seal.

13. **Fee & Financial Management**:
    - Class fee structures.
    - Fee collection counter with invoice generation, discounts, and payment methods (Cash, Bank Transfer, Online).
    - **Official Printable Fee Challan / Receipt** with office & student copies.
    - Outstanding & pending fees ledger.

14. **Admissions & Auto-Enrollment**:
    - Application intake workflow.
    - Approval action automatically creates student record with celebration confetti.

15. **Leave Management**:
    - Leave requests for students, teachers, and staff with approval workflow.

16. **Notice Board & Circulars**:
    - Publish notices with priority badges, categories, and target audiences.

17. **Notifications Center**:
    - In-app alerts with unread badges, mark all as read, and delete.

18. **Reports & Analytics**:
    - Multi-table reports with instant CSV exports and print formatting.

19. **Global Search**:
    - Real-time search across students, teachers, staff, fees, and notices (`Ctrl+K` / `⌘K`).

20. **System & School Settings**:
    - Configurable school profile (Name, address, phone, principal, registration number).
    - Academic session switcher (2026–2027).
    - Configurable grading scale & passing percentage.
    - One-click demo data re-seed button.

---

## 3. How to Run Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Steps
```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```
Open your browser at `http://localhost:3000`.

### Build for Production
```bash
npm run build
```
This generates the optimized production bundle in `/dist`.

---

## 4. Deploying to GitHub Pages

To deploy this project to GitHub Pages:
1. In `vite.config.ts`, add the `base` property with your repository name:
   ```typescript
   export default defineConfig({
     base: '/<repository-name>/',
     // ...
   });
   ```
2. Build the project:
   ```bash
   npm run build
   ```
3. Deploy the `/dist` directory to the `gh-pages` branch using `gh-pages` package:
   ```bash
   npx gh-pages -d dist
   ```

---

## 5. Connecting to Firebase or Supabase

The application uses a centralized service layer (`src/services/storage.ts`) where all collection reads and writes are typed.

### To Connect Firebase Firestore:
1. Install Firebase SDK:
   ```bash
   npm install firebase
   ```
2. In `src/services/firebase.ts`, initialize Firebase with your configuration keys:
   ```typescript
   import { initializeApp } from 'firebase/app';
   import { getFirestore } from 'firebase/firestore';

   const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
   };

   export const app = initializeApp(firebaseConfig);
   export const db = getFirestore(app);
   ```
3. Swap `localStorage.getItem` / `localStorage.setItem` in `src/services/storage.ts` with Firestore `getDocs(collection(db, key))` and `setDoc(doc(db, key, id), data)`.

### To Connect Supabase:
1. Install `@supabase/supabase-js`.
2. Create client:
   ```typescript
   import { createClient } from '@supabase/supabase-js';
   export const supabase = createClient(
     import.meta.env.VITE_SUPABASE_URL,
     import.meta.env.VITE_SUPABASE_ANON_KEY
   );
   ```
3. Map collections to Supabase PostgreSQL tables: `students`, `teachers`, `attendance`, `fee_payments`, `exam_results`.
