# Scoper - Canadian Internship Salaries 

<div align="center">

![Project Banner](https://github.com/user-attachments/assets/7c59a343-29f7-474d-bd59-9b20a95b8a17)

[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![Next.js](https://img.shields.io/badge/Next.js-black?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)

A platform for students to view and share internship salary data across Canada, promoting transparency in the tech industry.

[Features](#features) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started) • [Contributing](#contributing) • [Roadmap](#roadmap)

</div>

## Features

- View internship salaries across different companies in Canada
- Submit anonymous salary reports
- Coming soon: Search and filter by location

> Hosted on a custom production configured VPS instance with load balancing, autobuilds, github actions and more!

## Tech Stack

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

## Getting Started

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
```

3. Start the application:
```bash
docker-compose up --build
```

To stop the application:
```bash
docker-compose down  # Add -v flag to remove volumes
```

## 🗺️ Roadmap

> **Note**: For detailed task tracking, please see [GitHub Issues](https://github.com/HishamLadha/Canadian-Internship-Salaries/issues)

### Current Focus
- [ ] Enabling search by location
- [ ] Implementing paginated API calls for the tables
- [ ] Expanding the information on the home and company tables

### Future Improvements
- [ ] Add salary insights dashboard for contributors
- [ ] Develop comparative analytics features
- [ ] Add email verification system
- [ ] Implement company verification process
- [ ] Add data export functionality

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request or start a Github Issue.

