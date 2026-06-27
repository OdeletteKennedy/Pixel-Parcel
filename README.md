# PixelParcel

PixelParcel is a Next.js application created with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

Repository: [https://github.com/OdeletteKennedy/Pixel-Parcel.git](https://github.com/OdeletteKennedy/Pixel-Parcel.git)

## Overview

PixelParcel provides a modern starting point for a web application built with Next.js.

The project uses the Next.js App Router structure and includes the default development workflow for local editing, previewing, and deployment.

It also uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to optimize and load the Geist font family.

## Features

- Built with Next.js
- Bootstrapped with `create-next-app`
- App Router project structure
- Local development server with fast refresh
- Editable main page in `app/page.tsx`
- Optimized font loading with `next/font`
- Ready for deployment on platforms that support Next.js

## Getting Started

Follow the steps below to run PixelParcel locally.

## Prerequisites

Make sure you have Node.js installed on your machine.

You will also need a package manager such as:

- npm
- yarn
- pnpm
- bun

## Installation

Clone the repository:

```bash
git clone https://github.com/OdeletteKennedy/Pixel-Parcel.git
```

Move into the project directory:

```bash
cd Pixel-Parcel
```

Install dependencies:

```bash
npm install
```

If you prefer another package manager, use the equivalent install command for that tool.

## Development

Start the development server:

```bash
npm run dev
```

You can also use one of the following commands:

```bash
yarn dev
```

```bash
pnpm dev
```

```bash
bun dev
```

Open your browser and visit:

[http://localhost:3000](http://localhost:3000)

The page will update automatically as you edit the source files.

## Editing the Application

The main page can be edited in:

```text
app/page.tsx
```

Save changes to see them reflected in the browser during development.

## Project Structure

A typical Next.js project includes files and folders such as:

```text
app/
public/
package.json
next.config.*
```

The `app` directory contains application routes and pages.

The `public` directory is used for static assets.

The `package.json` file defines scripts and dependencies for the project.

## Available Scripts

Run the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
