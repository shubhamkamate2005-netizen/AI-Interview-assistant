# AI Interview Assistant

A full-stack AI-powered interview preparation platform. Users can create accounts, upload resumes or documents, generate interview questions, practise interviews, and review generated reports.

## Features

- User registration and login
- JWT-based authentication
- Protected application routes
- Resume and PDF upload
- AI-generated interview questions
- Interview reports and feedback
- Responsive React interface
- MongoDB data storage

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Axios
- Sass

### Backend

- Node.js
- Express.js
- MongoDB and Mongoose
- JSON Web Tokens
- Google Gemini API
- Multer
- PDF Parse
- Puppeteer

## Project Structure

```text
AI-Interview-assistant/
├── Backend/
│   ├── scripts/
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   ├── lib/
│   │   └── style/
│   ├── .env.example
│   └── package.json
├── .gitignore
├── package.json
└── README.md
```

## Prerequisites

Install the following before running the project:

- Node.js
- npm
- MongoDB
- A Google Gemini API key

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/shubhamkamate2005-netizen/AI-Interview-assistant.git
cd AI-Interview-assistant
```

### 2. Install dependencies

```bash
npm install
npm --prefix Backend install
npm --prefix Frontend install
```

## Environment Configuration

Create `Backend/.env` using `Backend/.env.example`:

```env
MONGO_URI=mongodb://localhost:27017/ai-interview-assistant
JWT_SECRET_KEY=replace_with_a_secure_random_secret
GOOGLE_GENAI_API_KEY=replace_with_your_google_genai_api_key
GEMINI_MODEL=gemini-2.5-flash
FRONTEND_URL=http://localhost:5173
PORT=3000
```

Never commit your real `.env` file or API keys.

For a deployed frontend, create `Frontend/.env`:

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

You can leave this variable unset during local development because Vite uses the local `/api` proxy.

## Running the Application

Open two terminals from the project directory.

### Terminal 1 — Backend

```bash
npm run backend
```

The backend runs at:

```text
http://localhost:3000
```

### Terminal 2 — Frontend

```bash
npm run frontend
```

The frontend normally runs at:

```text
http://localhost:5173
```

## Available Commands

```bash
npm run backend    # Start backend in development mode
npm run frontend   # Start frontend development server
npm run build      # Build the frontend
npm run lint       # Check frontend code with ESLint
```

To run the backend without watch mode:

```bash
npm --prefix Backend start
```

## Production Build

Create the frontend production build:

```bash
npm run build
```

The generated files will be placed in `Frontend/dist`.

## Security

- Keep API keys and database credentials inside `.env`.
- Do not commit `.env` or `node_modules`.
- Rotate credentials immediately if they are accidentally exposed.
- Use a strong random value for `JWT_SECRET_KEY`.

## Author

**Shubham Kamate**

GitHub: [shubhamkamate2005-netizen](https://github.com/shubhamkamate2005-netizen)
