# Meal Planner

This is a full-stack app built with Django and React. You can search for recipes, save your favourites, and generate a shopping list for whatever recipe(s) you're planning to cook.

## What it does

- Search recipes using TheMealDB's public API
- Click into any meal/recipe to see its full ingredients and instructions
- Save recipes to your favorites
- Pick a few saved recipes and generate one combined shopping list for you to use
- 
## Built with

- Django + Django REST Framework (backend)
- React + Vite + React Router (frontend)
- [TheMealDB](https://www.themealdb.com/api.php) for the recipe data
- 
## How it's put together

React never talks to TheMealDB directly — every request goes through the Django backend first, which either proxies the request straight to TheMealDB or reads from/writes to its own database (for saved favorites). This also meant TheMealDB's awkward data format — ingredients spread across 20 separate fields — only needed handling in one place, not duplicated in the frontend too.

## Running it yourself

**Backend:**
\```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
\```
**Frontend** (separate terminal):
\```bash
cd frontend
npm install
npm run dev
\```
Then go to `http://localhost:5173`.

## What's not here yet

- No user accounts — right now favorites aren't tied to a specific person
- Not deployed — it's local-only for now
- The shopping list merges ingredients by name, not quantity, so it won't add up "2 onions + 1 onion" — just lists "onion" once
