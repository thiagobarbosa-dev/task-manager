
# EN

# Task Manager

Task Manager is an intuitive and elegant web application designed for managing your daily tasks, inspired by the fluidity and simplicity of Google Keep. Organize your ideas, projects, and commitments with ease using features like task items, progress tracking, categorization, and filtering.

## Features

*   **Task Creation:** Quickly create new tasks with a title and optional category.
*   **Task Items:** Add detailed to-do items within each task. Mark items as pending or completed.
*   **Progress Tracking:** Visualize your progress on tasks with items via completion percentages.
*   **Task Categorization:** Assign categories to tasks for better organization.
*   **Filtering & Search:** Easily find tasks using a search bar (filters by title and category) and filter tasks based on item status (All, Pending Items, Completed Items).
*   **Inline Editing:** Click on a task card to load its data into the main form for quick editing.
*   **AJAX Delete:** Delete tasks directly from the list with a confirmation dialog, updated instantly via AJAX.
*   **User Authentication:** Securely manage your tasks with user accounts (powered by Devise).
*   **Internationalization (i18n):** Supports multiple languages (currently English and Portuguese).

## Screenshots

Here you can add screenshots showcasing the application's key features and UI.

### Home Page (Logged Out)

![alt text](<https://raw.githubusercontent.com/thiagobarbosa-dev/task-manager/refs/heads/main/public/CleanShot%202025-05-21%20at%2023.07.12.png>)

### Task Index Page (Logged In)

![alt text](<https://github.com/thiagobarbosa-dev/task-manager/blob/main/public/CleanShot%202025-05-21%20at%2023.11.45.png?raw=true>)

### Creating a New Task

![alt text](<https://github.com/thiagobarbosa-dev/task-manager/blob/main/public/CleanShot%202025-05-21%20at%2023.12.37.png?raw=true>)

### Filtered/Searched Tasks

![alt text](<https://github.com/thiagobarbosa-dev/task-manager/blob/main/public/CleanShot%202025-05-21%20at%2023.13.34.png?raw=true>)

## Technologies Used

*   Ruby on Rails (Backend, MVC, i18n)
*   PostgreSQL (Database)
*   Hotwire (Turbo Drive, Turbo Streams, Stimulus) (Frontend interactivity)
*   Tailwind CSS (Styling)
*   Docker (Containerization for development and production)

## Setup

Instructions on how to get the project up and running locally.

1.  **Prerequisites:**
    *   Docker and Docker Compose installed.
    *   Ruby (matching version in `.ruby-version` or `Dockerfile`) and Bundler (optional, if not using Docker exclusively).

2.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd task_manager
    ```

3.  **Set up Environment Variables:**
    *   Copy the example environment file:
      ```bash
      cp .env.example .env
      ```
    *   Edit the `.env` file and fill in your database credentials and any other necessary variables (like Devise secrets, Google OAuth if implemented). For local development with Docker Compose, ensure `DATABASE_HOST` points to the `db` service name (usually 'db').

4.  **Build and Run with Docker Compose (Development):**
    ```bash
    docker compose build
    docker compose up
    ```
    This will build the images and start the `db` and `web` services. The Rails application will be available at `http://localhost:3000`.

5.  **Database Setup:**
    *   Run migrations:
      ```bash
      docker compose exec web bin/rails db:migrate
      ```


6.  **Access the application:** Open your browser and go to `http://localhost:3000`.


## Contributing

If you'd like to contribute, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -am 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Create a new Pull Request.


## Contact

Thiago Barbosa - thiagobarbosa.dev@icloud.com

Linkedin: https://www.linkedin.com/in/thiagobarbosadev/
