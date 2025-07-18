# Identity Reconciliation Node

A solution to the Bitespeed Backend Task: Identity Reconciliation. This project implements an API to help reconcile user identities by linking primary and secondary contact points based on the given problem statement.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Project](#running-the-project)
- [API Documentation](#api-documentation)
  - [POST /identify](#post-identify)
    - [Request](#request)
    - [Response](#response)
    - [Example](#example)
- [Design Approach](#design-approach)
- [Database Schema](#database-schema)
- [Assumptions & Decisions](#assumptions--decisions)
- [License](#license)

## Overview

This repository provides a backend service that reconciles identities based on contact information (emails and phone numbers). When a user is identified through an email or phone number, the service manages the association between multiple identifiers, ensuring that all related contacts are linked under a primary user.

## Features

- Accepts user identity queries through API.
- Links identities using email and phone number, distinguishing between primary and secondary contact records.
- Handles duplicate or overlapping contact scenarios.
- Returns a unified representation of connected identities.

## Tech Stack

- Node.js
- TypeScript
- Hapi.js
- Database: PostgreSQL
- Sequelize (ORM)

## Getting Started

### Prerequisites

- Node.js (version >= 14)
- npm or yarn
- PostgreSQL

### Installation

```bash
git clone https://github.com/mdumar2430/identity-recoincilation-node.git
cd identity-recoincilation-node
npm install
```

### Environment Variables

Create a `.env` file at the root with the following variables:

```
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
PORT=3000
```

### Running the Project

```bash
npm run build
npm run start
```

## API Documentation

### POST `/identify`

This endpoint accepts a payload containing either an email or a phone number and returns a unified representation of the user's linked contacts.

#### Request

```json
{
  "email": "user1@example.com",
  "phoneNumber": 1234567890
}
```

- Both `email` and `phoneNumber` are optional, but at least one must be present.

#### Response

```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["user1@example.com", "user2@example.com"],
    "phoneNumbers": ["1234567890", "9876543210"],
    "secondaryContactIds": [2, 3]
  }
}
```

#### Example

**cURL**

```bash
curl -X POST http://localhost:3000/identify \
  -H 'Content-Type: application/json' \
  -d '{"email":"user1@example.com"}'
```

## Design Approach

- **Contact Entity:** Each email or phone number is stored as a `contact` entry, with a reference to its primary contact.
- **Primary vs. Secondary:** The first unique identifier inserted becomes the primary. Any subsequent entries with overlapping information are added as secondary and linked to the correct primary contact.
- **Association Correction:** If two groups are found to be connected by a new identity, all records are merged under the earliest created contact.

## Database Schema

A typical schema design is:

| Field            | Type    | Description                                  |
|------------------|---------|----------------------------------------------|
| id               | INT     | Unique identifier (Primary Key)              |
| phoneNumber      | STRING  | User's phone number                          |
| email            | STRING  | User's email                                 |
| linkedId         | INT     | Reference to primary contact (nullable)      |
| linkPrecedence   | ENUM    | 'primary' or 'secondary'                     |
| createdAt        | DATETIME| Auto-generated creation time                 |
| updatedAt        | DATETIME| Auto-generated update time                   |

## Assumptions & Decisions

- Only valid entries (at least one identifier present) are processed.
- When conflicting or duplicate identifiers are found, records are merged, and the oldest contact becomes primary.
- Secondary contacts maintain a reference to their primary contact.
- The API always responds with the up-to-date structure of the identity cluster.

## License

This project is developed as part of the Bitespeed Backend Task: Identity Reconciliation.

---

[1] https://github.com/mdumar2430/identity-recoincilation-node
[2] https://bitespeed.notion.site/Bitespeed-Backend-Task-Identity-Reconciliation-1fb21bb2a930802eb896d4409460375c
