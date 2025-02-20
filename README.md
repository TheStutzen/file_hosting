# Video Converter

## Project Setup and Usage

This guide provides instructions for setting up and running the project locally using Docker.

### Prerequisites

Before starting, ensure you have the following tools installed:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Setup Instructions

### 1. Clone the Repository

**Clone the project repository to your local machine:**

```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Configure Environment Variables

**Create a .env file from the provided .env.example template:**

```bash
cp .env.example .env
```

This will create a copy of the environment configuration that the application uses.

### 3. Start the Application

**Use Docker Compose to build and start the containers:**

```bash
docker compose up --build
```

**This command will:**

    • Pull necessary Docker images.
    • Build the application container.
    • Start the application.

### Accessing the Application

Once the containers are running, the application will be available at:

[http://localhost:3000](http://localhost:3000)

---

## Application Features

### 1. Upload .iso file

- **Endpoint:** `POST /upload`
- **Description:** Uploads a `.iso` file.
- **Request Example (using cURL):**

```bash
curl -X POST http://localhost:3000/upload -F "file=@/path/to/***.iso"
```

- **Response Example:**

```json
{
  "ok": true,
  "message": "File uploaded successfully!",
  "downloadUrl": "http://localhost:3000/download/*****.iso"
}
```

### 2. Download .iso File

- **Endpoint:** `GET /download/:filename`
- **Description:** Downloads `.iso` file.
- **Request Example:**

```bash
curl -O http://localhost:3000/download/****.iso
```
