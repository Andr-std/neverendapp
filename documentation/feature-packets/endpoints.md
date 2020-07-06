# Endpoints

## Front Endpoints

- "/" (Once logged in)
  - Shows most recent stories
- "/login"
  - Session Form
- "/register"
  - Registration Form
- "/profile/:userId"
  - Profile Page
  - Liked Stories & Bio
  - Stories Contributed
- "/stories/:storyId"
  - Story Page (for viewing)
- "stories/new"
  - Story Creation Page
- "stories/:storyId/edit"
  - Story Edit Page

## API Endpoints

- Users
  - GET /api/users/:searchTerm
    - returns stories (with the owner user) based on search term
  - POST /api/users
    - add user to users table
  - GET /api/users/:id
    - return specific user from users table
  - PUT /api/users/:id
    - update specific user from users table
  - DELETE /api/users/:id
    - delete specific user from users table
- Session
  - POST /api/session
- Stories

  - GET /api/stories
    - return data from stories table (assembled from storyparts)
  - GET /api/stories/:id
    - return specific story from stories table (assembled from storyparts)
  - POST /api/stories
    - send data to stories table when a story is created
- StoryParts
  - POST /api/storyparts
    - add story to stories table
  - PUT /api/storyparts/:id
    - update specific storypart from storyparts table
  - DELETE /api/storyparts/:id
    - delete specific storypart from storyparts table
- Likes
  - POST /api/stories/:storyId/likes
    - Add a like to story
  - POST /api/comments/:commentId/likes
    - Add a like to comment
- Dislikes
  - POST /api/stories/:storyId/dislikes
    - Add a like to story
  - POST /api/comments/:commentId/dislikes
    - Add a like to comment
- Comments
  - GET /api/stories/:id/comments
    - return comments tied to a specific story
  - POST /api/stories/:id/comments
    - add comment to comments table based on current story
  - GET /api/comments/:id
    - return specific comment from comments table
  - DELETE /api/comments/:id
    - delete specific comment from comments table
