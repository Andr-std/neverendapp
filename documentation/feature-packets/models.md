# Models

## Model List

- User
- Story
- StoryPart
- Comment
- Story Category
- Story Like
- Comment Like
- Story dislike
- Comment dislike

### Users Table

| column    | type    | max length | default | constraints      |
| --------- | ------- | ---------- | ------- | ---------------- |
| userName  | varchar | 20         | no      | not null, unique |
| password  | binary  | none       | no      | not null         |
| firstName | varchar | 50         | no      | not null         |
| lastName  | varchar | 50         | no      | not null         |
| email     | varchar | 50         | no      | not null, unique |
| bio       | text    | none       | no      | none             |
| isAdmin   | boolean | none       | false   | not null         |

### Stories

| column     | type    | max length | default | constraints                                |
| ---------- | ------- | ---------- | ------- | ------------------------------------------ |
| title      | varchar | 500        | no      | not null                                   |
| subHeading | varchar | 500        | no      | none                                       |
| userId     | integer | none       | no      | not null, references: (Users.Id) |
| categoryId | integer | none       | no      | not null, references: (StoryCategories.Id) |
| isEditLock | boolean | none       | false   | not null                                   |

### StoryParts

| column     | type    | max length | default | constraints                                |
| ---------- | ------- | ---------- | ------- | ------------------------------------------ |
| body       | text    | none       | no      | not null                                   |
| userId     | integer | none       | no      | not null, references: (Users.Id)           |
| storyId    | integer | none       | no      | not null, references: (Stories.Id)         |
| orderNo    | integer | none       | no      | not null                                   |
|            |         |            |         | orderNo, storyID composite constraint      |

### Comments

| column  | type    | max length | default | constraints                        |
| ------- | ------- | ---------- | ------- | ---------------------------------- |
| storyId | integer | none       | no      | not null, references: (Stories.Id) |
| userId  | integer | none       | no      | not null, references: (Users.Id)   |
| body    | text    | none       | no      | not null                           |

### Story Categories

| column       | type    | max length | default | constraints |
| ------------ | ------- | ---------- | ------- | ----------- |
| categoryName | varchar | 25         | no      | not null    |

### Story Likes

| column  | type    | max length | default | constraints                          |
| ------- | ------- | ---------- | ------- | ------------------------------------ |
| userId  | integer | none       | no      | not null references: (Users.Id)      |
| storyId | integer | none       | no      | not null references: (Stories.Id)    |
|         |         |            |         | userId, storyId composite constraint |

### Comment Likes

| column    | type    | max length | default | constraints                            |
| --------- | ------- | ---------- | ------- | -------------------------------------- |
| userId    | integer | none       | no      | not null references: (Users.Id)        |
| commentId | integer | none       | no      | not null references: (Comments.Id)     |
|           |         |            |         | userId, commentId composite constraint |

### Story dislikes

| column  | type    | max length | default | constraints                          |
| ------- | ------- | ---------- | ------- | ------------------------------------ |
| userId  | integer | none       | no      | not null references: (Users.Id)      |
| storyId | integer | none       | no      | not null references: (Stories.Id)    |
|         |         |            |         | userId, storyId composite constraint |

### Comment dislikes

| column    | type    | max length | default | constraints                            |
| --------- | ------- | ---------- | ------- | -------------------------------------- |
| userId    | integer | none       | no      | not null references: (Users.Id)        |
| commentId | integer | none       | no      | not null references: (Comments.Id)     |
|           |         |            |         | userId, commentId composite constraint |
