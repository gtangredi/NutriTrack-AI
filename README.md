# NutriTrack AI
# NutriTrack AI

A full-stack nutrition and fitness tracking application that centralizes meal logging, workout tracking, and weight monitoring into a single dashboard. Users can search real nutrition data via the USDA FoodData Central API, log meals with accurate macro breakdowns, and visualize their progress over time through interactive charts.

## Technologies Used

**Frontend:**

- React (Vite)
- Chart.js / react-chartjs-2 (data visualization)
- Axios (API requests)

**Backend:**

- Flask (Python)
- SQLAlchemy (ORM)
- Flask-JWT-Extended (authentication)
- Flask-CORS

**Database:**

- PostgreSQL

**External API:**

- USDA FoodData Central API (nutrition data)

## Setup and Run Instructions

### Prerequisites

- Python 3.10+
- Node.js 22+
- PostgreSQL installed and running locally

### 1. Clone the repository

```bash
git clone <this-repo-url>
cd nutritrack-ai
```

### 2. Database setup

Create the database and a dedicated user in `psql`:

```sql
CREATE DATABASE nutritrack;
CREATE USER nutritrack_user WITH PASSWORD 'devpassword';
GRANT ALL PRIVILEGES ON DATABASE nutritrack TO nutritrack_user;
```

### 3. Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in `backend/` with:

```
DATABASE_URL=postgresql://nutritrack_user:devpassword@localhost:5432/nutritrack
JWT_SECRET_KEY=your-secret-key-here
USDA_API_KEY=your-usda-api-key-here
```

Get a free USDA API key at: https://fdc.nal.usda.gov/api-key-signup

Seed a test user:

```bash
python seed.py
```

Run the backend:

```bash
python app.py
```

Backend runs at `http://localhost:5000`.

### 4. Frontend setup

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

### Test Credentials

```
Username: testuser
Password: testpassword
```

## Core Functionality

- **Authentication** — JWT-protected login with persistent sessions (stays logged in across page refreshes). Registration is not implemented for this MVP; users are pre-seeded via `seed.py`.
- **Weight Tracking** — Log daily weight entries, view paginated history, and see trends on a line chart.
- **Workout Tracking** — Log workout type, duration, and calories burned, with paginated history and a bar chart of workout duration over time.
- **Meal Logging via USDA API** — Search real foods through the USDA FoodData Central API and log them to your meal history with a single click, no manual entry of nutrition data required.
- **Dashboard** — Combines weight trend, workout duration, daily calorie totals, and a stacked macro breakdown (protein/carbs/fat) into one visual overview.
- **Pagination** — All log lists (weight, workouts, meals) support paginated browsing of history.

### API Endpoints

| Method   | Route                    | Description                                     |
| -------- | ------------------------ | ----------------------------------------------- |
| POST     | `/api/login`           | Authenticate and receive a JWT                  |
| GET/POST | `/api/weight`          | List (paginated) or create weight logs          |
| GET/POST | `/api/workouts`        | List (paginated) or create workout logs         |
| GET/POST | `/api/meals`           | List (paginated) or create meal logs            |
| GET      | `/api/foods/search?q=` | Search USDA FoodData Central for nutrition info |

## Future Enhancements

- **AI-powered nutrition coaching** — Considered during planning (Hugging Face Inference API integration) but deliberately scoped out of the MVP to prioritize core tracking features and time constraints. Noted as a future enhancement per original project scope.
- **User registration** — Full sign-up flow (currently deprioritized in favor of seeded test users, per project scope decisions).
- **Barcode scanning** for packaged foods.
- **Mobile support.**

## Deployment

---
