# Mnemonic Computing Specification Viewer

An interactive web viewer for the Mnemonic Computing Specification v0.1, transforming a series of technical documents into a beautifully formatted, interactive, and navigable website.

## Features

-   **Multi-Document Navigation**: Seamlessly switch between the Core Specification, Technical Architecture, and Security Model documents.
-   **Interactive Visualizations**: Complex concepts are brought to life with custom-built interactive components, including:
    -   An **Architecture Diagram** explaining the system's layers.
    -   An **MVCC Visualizer** demonstrating transactional semantics.
    -   A **ReBAC Visualizer** for exploring relationship-based access control.
    -   An **LSM-Tree Visualizer** showing the persistence model in action.
    -   And many more...
-   **AI-Powered Playground**: The **Mnemonic Playground** allows users to manipulate a live semantic graph using natural language commands, powered by the Google Gemini API.
-   **Dynamic Table of Contents**: A sticky sidebar tracks your reading position and allows for quick navigation between sections.
-   **Responsive Design**: Fully accessible and usable on devices of all sizes, from mobile phones to desktops.
-   **Clean & Modern UI**: A dark-themed, aesthetically pleasing interface built with Tailwind CSS.

## Technology Stack

-   **Frontend**: [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **AI**: [Google Gemini API](https://ai.google.dev/) for natural language processing in the Mnemonic Playground.

This project is built without a traditional bundler, using modern browser features like ES Modules and [Import Maps](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) for dependency management.

## Project Structure

The project is organized into several key directories:

```
.
├── index.html                # Main HTML entry point
├── index.tsx                 # React application root
├── App.tsx                   # Main application component and layout
├── types.ts                  # TypeScript type definitions
├── metadata.json             # Application metadata
│
├── components/               # All UI components
│   ├── Sidebar.tsx           # Navigation sidebar
│   ├── Header.tsx            # Page header and document switcher
│   ├── ContentSection.tsx    # Renders a section of a document
│   ├── MnemonicPlayground.tsx  # Interactive graph playground with Gemini AI
│   └── ...                   # Other visualizer components
│
└── *Content.ts               # Content files for each document
```

## How to Run

1.  **API Key**: The `MnemonicPlayground` component requires a Google Gemini API key. Ensure you have an environment variable named `API_KEY` available in the context where the application is served.
2.  **Serve the application**: Since there is no build step, you can run this project with any simple static file server.
    -   If you have Python installed:
        ```bash
        python -m http.server
        ```
    -   Or using Node.js:
        ```bash
        npx serve
        ```
3.  Open your browser and navigate to the local server address (e.g., `http://localhost:8000`).
