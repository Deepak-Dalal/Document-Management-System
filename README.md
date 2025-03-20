# Document Management System API

## Overview

This is a backend APIs service for a Document Management System built using Node.js, Express.js, Sequelize, and Supabase PostgreSQL. It provides RESTful endpoints for managing folders and files, including CRUD operations, metadata retrieval, and file sorting.

### Postman APIs Testing Screenshots

The API has been tested with Postman, and testing screenshots are included. [Screenshots](#testing-with-postman)

## Features

- **Folder Management**: Create, update, delete, and retrieve folders.
- **File Management**: Upload, update descriptions, delete, and fetch files within folders.
- **File Metadata**: Retrieve metadata of files stored in folders.
- **Sorting & Filtering**: Get files within a folder sorted by specific criteria.

## Tech Stack

- **Node.js** (Backend)
- **Express.js** (API Framework)
- **Sequelize** (ORM for PostgreSQL)
- **Supabase PostgreSQL** (Database)
- **Multer** (Middleware for file uploads)

## API Endpoints

### Folder Routes

| Method | Endpoint             | Description           |
| ------ | -------------------- | --------------------- |
| POST   | `/folders/create`    | Create a new folder   |
| PATCH  | `/folders/:folderId` | Update folder details |
| DELETE | `/folders/:folderId` | Delete a folder       |
| GET    | `/folders/`          | Retrieve all folders  |

### File Routes

| Method | Endpoint                            | Description                               |
| ------ | ----------------------------------- | ----------------------------------------- |
| POST   | `/folders/:folderId/files`          | Upload a file to a folder                 |
| PATCH  | `/folders/:folderId/files/:fileId`  | Update file description                   |
| DELETE | `/folders/:folderId/files/:fileId`  | Delete a file from a folder               |
| GET    | `/folders/:folderId/files`          | Get all files in a folder                 |
| GET    | `/folders/:folderId/filesBySort`    | Get sorted files within a folder          |
| GET    | `/folders/:folderId/files/metadata` | Get file metadata                         |
| GET    | `/files/`                           | Retrieve files across all folders by type |

## File Uploads

- Files are uploaded using **Multer**.
- Uploaded files are stored in the `uploads` directory inside the project repository.
- Ensure the `uploads` folder exists before running the server to avoid errors.

## Installation

### Prerequisites

- **Node.js** v16+
- **PostgreSQL** database (Supabase recommended)

### Steps

1. Clone the repository:
   ```sh
   git clone https://github.com/Deepak-Dalal/Document-Management-System.git
   ```
2. Navigate to the project directory:
   ```sh
   cd Document-Management-System
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following:
     ```env
     DB_USER=your_db_username
     DB_PASSWORD=your_db_password
     DB_NAME=your_db_name
     DB_HOST=your_db_host
     DB_PORT=your_db_port
     PORT=your_port_number
     ```
5. Run database migrations:
   ```sh
   npx sequelize db:migrate
   ```
6. Run the development server:
   ```sh
   npm start
   ```

The API will be accessible at `http://localhost:<PORT>`.

## Future Enhancements

- User Authentication & Authorization
- Cloud Storage Integration (e.g., AWS S3, Google Drive)
- Pagination & Search Functionality

## Testing with Postman

Folder Functionalities

1.1 Create Folder  
✅ Valid request  
![Create Folder - Valid](screenshots/1.png)

❌ Missing attributes  
![Create Folder - Missing Attributes](screenshots/2.png)

❌ Name is not unique  
![Create Folder - Name Not Unique](screenshots/3.png)

❌ Invalid type  
![Create Folder - Invalid Type](screenshots/4.png)

❌ Invalid maxFileLimit  
![Create Folder - Invalid maxFileLimit](screenshots/5.png)

1.2 Update Folder  
✅ Valid request  
![Update Folder - Valid](screenshots/6.png)

❌ Invalid folderId  
![Update Folder - Invalid folderId](screenshots/7.png)

❌ Invalid type and maxFileLimit  
![Update Folder - Invalid type and maxFileLimit](screenshots/8.png)

1.3 Delete Folder  
✅ Valid request  
![Delete Folder - Valid](screenshots/9.png)

❌ Invalid folderId  
![Delete Folder - Invalid folderId](screenshots/10.png)

File Functionalities

Upload File  
✅ Valid request  
![Upload File - Valid](screenshots/11.png)

❌ Folder doesn’t exist  
![Upload File - Folder doesn’t exist](screenshots/12.png)

❌ File type mismatch  
![Upload File - File Type Mismatch](screenshots/13.png)

❌ Exceeds folder limit  
![Upload File - Exceeds Folder Limit](screenshots/14.png)

❌ Exceed file limit of 10MB  
![Upload File - Exceeds 10MB Limit](screenshots/15.png)

Update File Description  
✅ Valid request  
![Update File - Valid](screenshots/16.png)

❌ File doesn’t exist in the specified folder  
![Update File - File Not Found](screenshots/17.png)

Delete File  
✅ Valid request  
![Delete File - Valid](screenshots/18.png)

❌ File doesn’t exist in the specified folder  
![Delete File - File Not Found](screenshots/19.png)

Read Functionalities

Get All Folders  
✅ Valid request  
![Get All Folders - Valid](screenshots/20.png)

Get Files in a Folder  
✅ Valid request  
![Get Files in Folder - Valid](screenshots/21.png)

❌ Empty folder  
![Get Files in Folder - Empty](screenshots/22.png)

Sort Files by Size  
✅ Valid request  
![Sort Files - By Size](screenshots/23.png)

Sort Files by Recency  
✅ Valid request  
![Sort Files - By Recency](screenshots/24.png)

Get Files by Type Across Folders  
✅ Valid request  
![Get Files by Type - Valid](screenshots/25.png)

Get File Metadata  
✅ Valid request  
![Get File Metadata - Valid](screenshots/26.png)
