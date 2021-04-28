# UPLOAD SERVICE

Upload service is the backend that accepts uploaded video, puts that into the GridFS and schedules extraction of that video with the queue system, serves static files of the frontend written in React.js, also provides REST API to serve extracted speeches from videos.

## TECHNOLOGIES USED
- Node.js
- Express.js
- Express-GridFS