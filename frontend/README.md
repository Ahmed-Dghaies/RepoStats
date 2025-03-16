# GitHub Repository Stats

## Overview

This project provides a web-based interface to display statistics of GitHub repositories. It consists of a **frontend** (served with Nginx) and a **backend** (Node.js API) that fetches and processes GitHub repository data.

## Features

- Fetch and display GitHub repository statistics.
- Backend API for retrieving repository details.
- Frontend served via Nginx.
- Dockerized setup for easy deployment.

## Prerequisites

Before running the project, ensure you have the following installed:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Setup and Installation

### 1. Clone the Repository

```sh
git clone https://github.com/Ahmed-Dghaies/RepoStats.git
cd RepoStats
```

### 2. Configure Environment Variables

The backend requires environment variables to function correctly. Copy the `.env.template` file inside the `backend` folder and rename it to `.env`:

```sh
cp backend/.env.template backend/.env
```

Fill in the required values in `backend/.env`.

### 3. Run the Project with Docker Compose

```sh
docker-compose up --build
```

This will build and start both the **frontend** and **backend** containers.

### 4. Access the Application

- **Frontend**: `http://localhost`
- **Backend API**: `http://localhost:3000`

## Project Structure

```
.github-stats/
├── frontend/        # Frontend (React, Vue, or other framework)
│   ├── Dockerfile   # Frontend Dockerfile
│   ├── nginx.conf   # Nginx configuration
│   └── src/         # Frontend source code
│
├── backend/         # Backend (Node.js, Express API)
│   ├── Dockerfile   # Backend Dockerfile
│   ├── .env.template # Environment variables template
│   ├── src/         # Backend source code
│
├── docker-compose.yml # Docker Compose file
└── README.md         # Project documentation
```

## Stopping the Containers

To stop the running containers, use:

```sh
docker-compose down
```

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit (`git commit -m "Add new feature"`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a Pull Request.

## License

This project is licensed under the [License](LICENSE).
