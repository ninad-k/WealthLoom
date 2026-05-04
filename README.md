# LuminaCast SaaS Platform

LuminaCast is an enterprise-grade, multi-tenant SaaS platform designed for video course creators. It features a high-performance **.NET 10 gRPC Backend** and a modern **Next.js 16 App Router Frontend**.

## 🚀 Key Features

*   **Multi-Tenant Architecture**: Supports dynamic white-labeling via environment variables.
*   **Zero-Trust Authentication**: Integrated with Clerk for highly secure JWT Bearer token authentication.
*   **Stripe Monetization**: Built-in webhook listeners to automatically unlock courses upon successful payment.
*   **Anti-Piracy Video Delivery**: Direct integration with AWS S3 / Cloudflare R2 to generate temporary, self-destructing Presigned URLs. Raw video files are never exposed.
*   **Course Packaging Engine**: Creators can upload hundreds of videos and seamlessly package them into sellable courses.

## 🏗️ Architecture

*   **Frontend**: Next.js (App Router), Tailwind CSS, Framer Motion, Clerk UI.
*   **Backend**: .NET 10 Web API + gRPC, Entity Framework Core (SQLite).
*   **Testing**: xUnit, Moq, Microsoft.AspNetCore.Mvc.Testing.
*   **CI/CD**: GitHub Actions.
*   **Orchestration**: Docker Compose.

## 🏃‍♂️ Running Locally (Docker)

The easiest way to run the entire stack is via Docker Compose.

1.  **Configure Environment Variables**:
    Create a `.env.local` file in the root directory based on `.env.example` (or configure directly in `docker-compose.yml`). You will need:
    *   `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` & `CLERK_SECRET_KEY`
    *   `STRIPE_SECRET_KEY` & `STRIPE_WEBHOOK_SECRET`
    *   `STORAGE_ACCESS_KEY` & `STORAGE_SECRET_KEY` (AWS S3 or Cloudflare R2)

2.  **Start the Cluster**:
    ```bash
    docker-compose up --build
    ```
    *   The **Frontend** will be available at `http://localhost:3000`.
    *   The **Backend** gRPC/REST server will be available at `http://localhost:5000`.

## 🧪 Testing

The backend business logic is strictly tested using xUnit.

To run the test suite:
```bash
dotnet test LuminaCast.Backend.Tests/LuminaCast.Backend.Tests.csproj
```

## 📦 Continuous Integration

This repository is equipped with a GitHub Actions workflow (`.github/workflows/ci.yml`). Every push to `main` or `develop` will automatically:
1. Restore and build the .NET 10 backend.
2. Execute the xUnit test suite with Code Coverage analysis.
3. Install NPM dependencies and build the Next.js frontend to detect any TypeScript or routing errors.
