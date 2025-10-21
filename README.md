# Scoper - Canadian Internship Salaries

<div align="center">

![Project Banner](https://github.com/HishamLadha/Canadian-Internship-Salaries/blob/main/assets/Home-Hero.png)
![Home Table](https://github.com/HishamLadha/Canadian-Internship-Salaries/blob/main/assets/Home-Table.png)
![Tech Stack Overview](https://github.com/HishamLadha/Canadian-Internship-Salaries/blob/main/assets/SystemDesign.png)

[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![Next.js](https://img.shields.io/badge/Next.js-black?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![DigitalOcean](https://img.shields.io/badge/DigitalOcean-0080FF?style=for-the-badge&logo=digitalocean&logoColor=white)](https://digitalocean.com)

A platform for students to view and share internship salary data across Canada, promoting transparency in the tech industry.

[Features](#features) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started) • [Analytics](#analytics) • [Contributing](#contributing) • [Roadmap](#roadmap)

</div>

## Features

- **View Salary Data**: Browse comprehensive internship salary information across Canadian companies
- **Submit Anonymous Reports**: Contribute salary data to help fellow students make informed decisions
- **Advanced Analytics Dashboard**: Explore salary trends, company comparisons, and market insights
- **Search & Filter**: Find specific companies and locations
- **Interactive Visualizations**: Charts and graphs showing salary distributions and trends
- **Company Profiles**: Detailed views for individual companies with salary statistics
- **Location-based Analysis**: Salary data organized by Canadian cities and provinces

> Hosted on a custom production VPS instance configured with load balancing, autobuilds, github actions and more!

## 🛠️ Tech Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- Shadcn
- Zod

### Backend

- FastAPI
- Python
- SQLModel
- PostgreSQL
- Pandas

### Deployment

- Traefik (reverse proxying, load balancing, https)
- Watchtower (autobuilds)
- Docker + docker-compose
- ufw (firewall)
- Github actions

## 🚀 Getting Started

### Prerequisites

- Docker
- Docker Compose

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/Canadian-Internship-Salaries.git
cd Canadian-Internship-Salaries
```

2. Create `.env` file and configure your environment:

```bash
POSTGRES_USER=replace_with_your_username
POSTGRES_PASSWORD=replace_with_your_password
POSTGRES_DB=replace_with_your_database_name
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db/${POSTGRES_DB}
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=replace_your_api_key
ADMIN_USERNAME=replace_with_your_username
ADMIN_PASSWORD=replace_with_your_password
```

3. Start the application:

```bash
docker-compose up --build
```

To stop the application:

```bash
docker-compose down  # Add -v flag to remove volumes when you want to delete your db, for example
```

## 📊 Analytics

The platform features a comprehensive **Analytics Dashboard** that provides deep insights into Canadian internship salary data:

📈 **[View Analytics Dashboard](https://scoper.fyi/analytics)**

## 🗺️ Roadmap

### Current Focus

- [x] Enabling search by location
- [x] Implementing paginated API calls for the tables
- [x] Refactor codebase
- [x] Expanding the information on the home and company tables
- [x] **Analytics Dashboard** - Comprehensive salary analytics with trends, comparisons, and insights
- [x] **Company Comparison Tool** - Side-by-side salary analysis between multiple companies
- [x] Waterloo and UTSC Data

## Contributing

Please feel free to submit a Pull Request or start a Github Issue.
