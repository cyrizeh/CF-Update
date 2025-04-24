# CryoFuture Web Application Updates

## Recent Updates

### Shipping Management Section
1. **Dark Theme Consistency**
   - Updated background color (#282b2c) across all components
   - Added gradient borders to cards and modals
   - Improved text contrast with white headings and gray descriptions

2. **Stats Cards**
   - Added new "Onboarding" stats card
   - Expanded grid layout to 5 columns
   - Stats now include:
     - Onboarding
     - Coordinating
     - Scheduled
     - In Transit
     - Delivered

3. **Settings Section**
   - Updated shipping settings UI with dark theme
   - Added gradient borders to settings cards
   - Improved tab navigation styling
   - Enhanced notification toggles visibility

4. **Shipping Request Modal**
   - Three-step form with validation:
     - Patient Information
     - Shipping Details
     - Review
   - Dark theme consistent form inputs
   - Progress indicator
   - Validation error handling

## Tech Stack
- Next.js
- TypeScript
- Tailwind CSS
- Flowbite React Components

## Getting Started
1. Clone the repository
```bash
git clone https://github.com/cyrizeh/CF-Update.git
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

## Contributing
Please read our contributing guidelines before submitting pull requests.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!


## Deploy to Azure
### HTTP ERROR 431
In order to fix 431 http error on azure we need to [Increasing Request Header](https://azureossd.github.io/2022/06/08/Increasing-Request-Header-sizes-on-Linux-App-Services/). To do so we need to add new `Environment variables` to `Web App`

    NODE_OPTIONS --max-http-header-size=30000