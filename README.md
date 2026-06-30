# PixelParcel

PixelParcel is a Next.js application bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

Repository: [https://github.com/OdeletteKennedy/Pixel-Parcel.git](https://github.com/OdeletteKennedy/Pixel-Parcel.git)

## Overview

PixelParcel provides a clean foundation for building a modern web application with Next.js.

The project uses the Next.js App Router structure and includes the standard development workflow for local editing, previewing, building, and deployment.

It also uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to optimize and load the Geist font family efficiently.

## Features

- Built with Next.js
- Created with `create-next-app`
- Uses the App Router project structure
- Includes a local development server with fast refresh
- Main page can be edited in `app/page.tsx`
- Uses optimized font loading through `next/font`
- Suitable for deployment on platforms that support Next.js

## Getting Started

Follow the steps below to run PixelParcel on your local machine.

## Prerequisites

Before you begin, make sure Node.js is installed.

You will also need a package manager. Common options include:

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

Install the project dependencies:

```bash
npm install
```

If you use another package manager, run the equivalent install command for that tool.

For example:

```bash
yarn install
```

```bash
pnpm install
```

```bash
bun install
```

## Development

Start the development server with npm:

```bash
npm run dev
```

You can also start the development server with another supported package manager:

```bash
yarn dev
```

```bash
pnpm dev
```

```bash
bun dev
```

After the server starts, open your browser and visit:

[http://localhost:3000](http://localhost:3000)

The application will reload automatically as you edit the source files.

## Editing the Application

The main page is located at:

```text
app/page.tsx
```

Edit this file to change the default page content.

When the development server is running, saved changes will appear in the browser automatically.

## Project Structure

A typical PixelParcel project structure includes:

```text
app/
public/
package.json
next.config.*
```

The `app` directory contains application routes, layouts, and pages.
