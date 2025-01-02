# Notes Manager

A note-taking application designed for capturing, organizing, and managing notes with a clean and aesthetic user interface.

## Installation & Usage

1. **Prerequisites**
    - Ensure you have **pnpm** installed as your package manager.

2. **Installation**
    - Clone or download this repository.
    - Navigate to the project directory in your terminal.
    - Install the required dependencies:
        ```bash
        pnpm install
        ```

3. **Running the Project**
    - Start the application:
        ```bash
        pnpm dev
        ```
    - The application will be accessible at [http://localhost:5173](http://localhost:5173) (or another port if 5173 is in use).

## Configuration

**1. Supabase Authentication (Optional)**

To enable Supabase authentication:

- Create a `.env` file in your project directory.
- Add the following environment variables:

    ```env
    VITE_SUPABASE_URL=your-project-url.supabase.co
    VITE_SUPABASE_ANON_KEY=your-anon-key
    ```

**2. Google Authentication (Optional)**

To enable Google Sign-In:

- Add the following to the `.env` file:

    ```env
    VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
    ```

**Note:** If not configured, the app will default to local storage for data persistence.

## Live Demo

You can also experience the Notes Manager application live at:

[Notes Manager](https://notesmanagerapp.netlify.app/)

