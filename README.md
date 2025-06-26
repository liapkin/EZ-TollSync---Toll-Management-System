# EZ-TollSync - Toll Management System

## Overview
EZ-TollSync is a comprehensive toll management system designed for highway toll interoperability. The system provides a complete solution for managing toll passes, analyzing traffic patterns, and handling inter-operator settlements.

## Team Members
- Αλεξανδρόπουλος Νίκος
- Αλεξανδρόπουλος Κωνσταντίνος
- Λιαπάκης Κωνσταντίνος
- Ιατράκης Δημήτρης

## Project Structure
```
softeng24-41/
├── back-end/         # Django REST API backend
├── front-end/        # Next.js web application
├── cli-client/       # Python CLI client
├── documentation/    # Project documentation and specifications
└── ai-log/          # Development logs and architecture notes
```

## Technology Stack

### Backend
- **Framework**: Django (Python)
- **Database**: MySQL
- **API**: RESTful API with OpenAPI 3.0.3 specification
- **Authentication**: Token-based authentication

### Frontend
- **Framework**: Next.js (React)
- **UI Components**: Radix UI + Tailwind CSS
- **Mapping**: React Leaflet & Google Maps API
- **Charts**: Chart.js & Recharts
- **HTTP Client**: Axios

### CLI Client
- **Language**: Python
- **API Client**: Auto-generated from OpenAPI specification
- **Testing**: unittest framework

## Key Features

### Core Functionality
- **Toll Pass Management**: Track and manage toll passes across different operators
- **Real-time Analytics**: Visualize toll data with interactive maps and charts
- **Inter-operator Settlement**: Calculate and manage charges between toll operators
- **Administrative Tools**: Health checks, data reset, and system management

### API Endpoints
- Authentication (`/login`, `/logout`)
- Pass Analysis (`/PassAnalysis/{stationOP}/{tagOP}/{date_from}/{date_to}`)
- Toll Station Passes (`/TollStationPasses/{tollStationID}/{date_from}/{date_to}`)
- Operator Charges (`/ChargesBy/{tollOp}/{date_from}/{date_to}`)
- Passes Cost Calculation (`/PassesCost/{tollOp}/{tagOp}/{date_from}/{date_to}`)
- Administrative endpoints for system management

### Frontend Features
- Interactive dashboard with real-time data visualization
- Heat map visualization of toll station traffic
- Debt report charts for inter-operator settlements
- Date range filtering for all analytics
- Responsive design for various screen sizes

## Installation & Setup

### Backend Setup
```bash
cd back-end/api/tolll
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup
```bash
cd front-end
npm install
npm run dev
```

### CLI Client Setup
```bash
cd cli-client/openapi
pip install -r requirements.txt
python cli.py --help
```

## API Documentation
The API follows OpenAPI 3.0.3 specification. Full documentation is available at:
- Specification file: `documentation/openapi.yaml`
- Base URL: `https://localhost:9115/api`

## Testing
- **Backend**: Functional tests available in Postman collections
- **CLI**: Unit tests in `cli-client/openapi/test/`
- **Frontend**: Testing framework ready for implementation

## Database Schema
The system uses a MySQL database with tables for:
- Operators
- Toll Stations
- Vehicles/Tags
- Passes (toll transactions)

Database dumps and DDL scripts are available in `back-end/database/`.

## Documentation
- Software Requirements Specification (SRS)
- UML Diagrams (Activity, Class, Component, Deployment, Sequence)
- ER Diagrams
- All documentation is in `documentation/` directory

## Development Notes
- The project follows a 3-tier architecture
- SSL certificate configuration supported
- Error handling implemented across all layers
- Supports CSV data import for passes and toll stations

## Course Information
**Course**: Τεχνολογία Λογισμικού 2024-25  
**Project**: Ανάπτυξη λογισμικού για τη διαχείριση των οφειλών μεταξύ εταιρειών διαχείρισης σταθμών διοδίων

## License
This project was developed as part of Software Engineering course @ NTUA (2024-25).
