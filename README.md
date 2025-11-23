# Semester Project 2

Semester Project 2: Auction Website "Nordic Auction House".

## Description

An auction website called "Nordic Auction House" where users can browse listings, place bids, and create their own auction listings.

## Built With

- HTML
- Tailwind CSS
- JavaScript
- Noroff API

## Getting Started

### Installing

1. Clone the repo:

```
git clone https://github.com/yourusername/semester-project-2.git
```

2. Install dependencies:

```
npm install
```

### Running

To run the app, run the following commands:

```
npm run dev
```

You'll need to use a local server (like Live Server) to view the site.

### Testing

This project uses Playwright for end-to-end testing. The tests cover all user stories:

1. A user with a stud.noroff.no email may register
2. A registered user may login
3. A registered user may logout
4. A registered user may update their avatar
5. A registered user may view their total credit
6. A registered user may create a Listing with a title, deadline date, media gallery and description
7. A registered user may add a Bid to another user's Listing
8. A registered user may view Bids made on a Listing
9. An unregistered user may search through Listings

To run the tests:

1. Install Playwright browsers (first time only):

```
npx playwright install
```

2. Start your development server (e.g., Live Server on port 5500)

3. Run tests:

```
npm test
```

Or run tests with UI:

```
npm run test:ui
```
