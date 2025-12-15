# Patient Record System (PRS)

## Overview
This document outlines the implementation, milestone plan, responsibilities and technical tools for the Patient Record System (PRS) developed as part of SE-3315 Software Project Management.

---

## Milestones
### Milestone 1 – Core Backend & Database (Mid-November 2025)
- PostgreSQL DB schema: patients, departments, doctors, users.
- Java Spring Boot backend with CRUD REST APIs for patients.
- Basic authentication endpoint (role-based for doctor/admin).
- Local build/run instructions.

### Milestone 2 – Functional Web Interface & MVP (Early/Mid-December 2025)
- Vue.js web interface: login, patient list (table view), edit  delete.
- Patient search & filtering, doctor/department association screens.
- Integration between frontend+backend.
- MVP features implemented end-to-end.

### Milestone 3 – Tested & Demo Ready System (December 15 – January 2)
- System tested based on Test Plan.
- Major/critical bugs fixed.
- UI/UX refinements, final build and demo.

---

## Staffing & Responsibilities
- **Requirements:** Şehran (lead), Gizem (review)
- **Design:** Ata (architecture), Zeynep (UI/data flow)
- **Iteration 1:** Gizem (Lead Dev, Backend+DB); everyone contributes.
- **Iteration 2:** Zeynep (Lead, Frontend UI); Şehran (Lead, Data & Validation)
- **Iteration 3:** Gizem (Lead, Integration & Test)
- **Testing:** All members active in functional/UI/regression test.

---

## Process
- **Git/GitHub** for version control using feature/develop/main branches.
- Pull Request–based review, code review before iteration merges.
- Each developer builds locally before pushing code. Weekly iteration builds.

---

## Coding Standard & Testing
- camelCase variables, PascalCase classes, UPPER_SNAKE_CASE constants.
- Descriptive naming, inline comments for non-trivial logic.
- **Testing:**
  - Backend: JUnit for service/controllers.
  - Integration: API/Postman flows.
  - UI/UX: scenario-based/manual testing.

---

## Risks
- Scope creep, time constraints, inexperience, integration issues, data errors.
- Mitigation: clear priorities, regular builds, early API contracts, pair programming.

---

## Key Tools
- **Backend:** IntelliJ IDEA, Java 17+, Spring Boot, JUnit
- **Frontend:** VSCode, Vue 3, npm, Pinia, Tailwind CSS
- **Database:** PostgreSQL
- **VCS:** Git/GitHub
- **Test:** JUnit, Postman

---

## Run & Setup
1. Install dependencies: `npm install` or `yarn install`
2. Start frontend: `npm run dev` or `yarn dev` (Vue)
3. Backend build: `mvn clean install` (SpringBoot, documented separately)
4. Access: [http://localhost:5173](http://localhost:5173)
5. Demo Users:
   - **admin/admin123**
   - **doctor1/docpass**

---

## Functional Requirements

### Authentication & Authorization
- Only authorized users (admin, doctor) can use the system. Login required to access any page or patient data.
- Session holds user’s role; the UI and API restrict features accordingly.

### Patients
- Each patient has a unique, immutable Patient ID (cannot be duplicated or left blank).
- Patient names cannot be blank; must be meaningful text (letters, optional space, 3-50 chars).
- Doctor and department associations are mandatory; cannot create a patient without both.
- Patients can be searched and filtered by ID, name, doctor, and department (combinable).
- Patient records can only be updated (except ID); can only be deleted by admin (with confirmation).
- Deleting a patient is permanent and requires explicit user confirmation.

### Doctors
- Added/removed only by admin; doctor must not have assigned patients to be deleted.
- Doctors cannot manage (add/remove) other doctors or departments.

### Departments
- Added/removed only by admin; departments with assigned patients cannot be deleted.

### Doctor Permissions
- Can view, search, filter and update patient records.
- Cannot create, or delete patient records.
- Cannot add, edit or delete doctors and departments.

### Validation & Error Handling
- All required fields enforced in both UI and backend.
- User-friendly error messages for all failed operations (invalid input, duplication, constraints).
- No invalid or partial data entry allowed.

---

## Further Info/Maintenance
Contact the project team for any setup, bug, or future extension issues. Full design and database diagrams are provided in the SDS document.
