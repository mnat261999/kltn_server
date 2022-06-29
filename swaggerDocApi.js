/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register new account
 *     tags: [Users-Authen]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                  email:
 *                      type: string
 *                      example: mnat261999@gmail.com
 *                  fullname:
 *                      type: string
 *                      example: Nguyễn Mai Anh Thư
 *                  username:
 *                      type: string
 *                      example: cycy26
 *                  password:
 *                      type: string
 *                      example: Thu123456
 *                  dob:
 *                      type: string
 *                      example: 02/06/1999
 *                  gender:
 *                      type: string
 *                      example: Nu
 *     responses:
 *       200:
 *         description: 
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/activation:
 *   post:
 *     summary: Acctivation account
 *     tags: [Users-Authen]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                  activation_token:
 *                      type: string
 *                      example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsbmFtZSI6Ik1haSBOZ3V54buFbiBBbmggVGjGsCIsInVzZXJuYW1lIjoibHVjeSIsImVtYWlsIjoidGh1MjYxOTk5QGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEyJHFKaG4zL3BsT2lCUk5mY1A0YzdMWmVNSHVvZDdYb054dnJ6MC93eWtpQTNEaG9leUhVaXVDIiwiZG9iIjoiV2VkIEp1biAwMSAyMDIyIDExOjMwOjIwIEdNVCswNzAwIChJbmRvY2hpbmEgVGltZSkiLCJnZW5kZXIiOiJOdSIsImlhdCI6MTY1NDA1NzgyMCwiZXhwIjoxNjU0MDU3ODgwfQ.u5rTN2Znci7dXHwsKbY3mgXBC7ulH2NqZfOuQUVCWnI
 *     responses:
 *       200:
 *         description: 
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login to account
 *     tags: [Users-Authen]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                  email:
 *                      type: string
 *                      example: thu261999@gmail.com
 *                  password:
 *                      type: string
 *                      example: Thu123456
 *     responses:
 *       200:
 *         description: 
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/refresh_token:
 *   post:
 *     summary: Refresh token
 *     tags: [Users-Authen]
 *     responses:
 *       200:
 *         description: 
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/forgot:
 *   post:
 *     summary: Forgot password
 *     tags: [Users-Authen]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                  email:
 *                      type: string
 *                      example: thu261999@gmail.com
 *     responses:
 *       200:
 *         description: 
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/reset:
 *   put:
 *     summary: Reset password
 *     security:
 *          - Auth: []
 *     tags: [Users-Authen]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                  password:
 *                      type: string
 *                      example: Thu123456
 *     responses:
 *       200:
 *         description: 
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: Logout
 *     tags: [Users-Authen]
 *     responses:
 *       200:
 *         description: 
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/search_user:
 *  get:
 *      summary: Search user
 *      security:
 *          - Auth: []
 *      tags: [Users]
 *      parameters:
 *          - in: query
 *            name: keyword
 *            schema:
 *              type: string
 *          - in: query
 *            name: limit
 *            schema:
 *              type: number
 *          - in: query
 *            name: skip
 *            schema:
 *              type: number
 *      responses:
 *       200:
 *         description: 
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/infor/{id}:
 *  get:
 *      summary: Get infor user
 *      security:
 *          - Auth: []
 *      tags: [Users]
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *       200:
 *         description: 
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/login/infor:
 *  get:
 *      summary: Get infor user login
 *      security:
 *          - Auth: []
 *      tags: [Users]
 *      responses:
 *       200:
 *         description: 
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/update:
 *   patch:
 *     summary: Update infor user
 *     security:
 *          - Auth: []
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                  email:
 *                      type: string
 *                      example: thu261999@gmail.com
 *                  fullname:
 *                      type: string
 *                      example: Nguyễn Mai Anh Thư
 *                  username:
 *                      type: string
 *                      example: cycy26
 *                  password:
 *                      type: string
 *                      example: Thu123456
 *                  dob:
 *                      type: string
 *                      example: 02/06/1999
 *                  gender:
 *                      type: string
 *                      example: Nu
 *                  address:
 *                      type: string
 *                      example: 139/9 Trần Huy Liệu Phường 8 Phú Nhuận
 *                  website:
 *                      type: string
 *                      example: https://www.facebook.com/profile.php?id=100079626489896
 *     responses:
 *       200:
 *         description: 
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/suggestions_user:
 *  get:
 *      summary: Suggest user
 *      security:
 *          - Auth: []
 *      tags: [Users]
 *      parameters:
 *          - in: query
 *            name: num
 *            schema:
 *              type: number
 *      responses:
 *       200:
 *         description: 
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/block/{id}:
 *  put:
 *      summary: Block user
 *      security:
 *          - Auth: []
 *      tags: [Users-Block]
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *       200:
 *         description: 
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/unblock/{id}:
 *  put:
 *      summary: Unblock user
 *      security:
 *          - Auth: []
 *      tags: [Users-Block]
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *       200:
 *         description: 
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/list/block:
 *  get:
 *      summary: List of blocked users
 *      security:
 *          - Auth: []
 *      tags: [Users-Block]
 *      responses:
 *       200:
 *         description: 
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/askfollow/{id}:
 *  put:
 *      summary: Send invite follow
 *      security:
 *          - Auth: []
 *      tags: [Users-Follow]
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *       200:
 *         description: 
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/cancel/invite/follow/{id}:
 *  put:
 *      summary: Cancel invite follow
 *      security:
 *          - Auth: []
 *      tags: [Users-Follow]
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *            description: id of the user you want to cancel the invite to follow
 *      responses:
 *       200:
 *         description: 
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/declinefollow/{id}:
 *  put:
 *      summary: Decline follow
 *      security:
 *          - Auth: []
 *      tags: [Users-Follow]
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *       200:
 *         description: 
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/acceptfollow/{id}:
 *  put:
 *      summary: Accept follow
 *      security:
 *          - Auth: []
 *      tags: [Users-Follow]
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *       200:
 *         description: 
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/{action}/{userId}:
 *  get:
 *      summary: Get list follower or following
 *      security:
 *          - Auth: []
 *      tags: [Users-Follow]
 *      parameters:
 *          - in: path
 *            name: action
 *            required: true
 *            schema:
 *              type: string
 *            description: action = enum[follower, following]
 *          - in: path
 *            name: userId
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *       200:
 *         description: 
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /upload/avatar:
 *  post:
 *      summary: Upload avatar to aws s3
 *      security:
 *          - Auth: []
 *      tags: [Avatars]
 *      requestBody:
 *          content:
 *               multipart/form-data:
 *                   schema:
 *                       type: object
 *                       properties:
 *                           files:
 *                               type: array
 *                               items:
 *                                   type: string
 *                                   format: binary
 *      responses:
 *       200:
 *         description: 
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /avatar/update:
 *   put:
 *     summary: Update avatar for user
 *     security:
 *          - Auth: []
 *     tags: [Avatars]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                  avatar:
 *                      type: object
 *                      example: {"key": "avatar/90ab430b-6ada-4f82-87f4-4c22a79db346_B612_20200326_093040_724.jpg","url": "https://social-pet-bucket.s3.amazonaws.com/avatar/90ab430b-6ada-4f82-87f4-4c22a79db346_B612_20200326_093040_724.jpg"}
 *     responses:
 *       200:
 *         description: 
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /avatar/all:
 *  get:
 *      summary: Get avatar by user login
 *      security:
 *          - Auth: []
 *      tags: [Avatars]
 *      responses:
 *       200:
 *         description: 
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /avatar/all/{id}:
 *  get:
 *      summary: Get avatar by user id
 *      security:
 *          - Auth: []
 *      tags: [Avatars]
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *       200:
 *         description: 
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /avatar/delete/{id}:
 *  delete:
 *      summary: Delete avatar by id of Avatar
 *      security:
 *          - Auth: []
 *      tags: [Avatars]
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *       200:
 *         description: 
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /upload/cover:
 *  post:
 *      summary: Upload cover to aws s3
 *      security:
 *          - Auth: []
 *      tags: [Covers]
 *      requestBody:
 *          content:
 *               multipart/form-data:
 *                   schema:
 *                       type: object
 *                       properties:
 *                           files:
 *                               type: array
 *                               items:
 *                                   type: string
 *                                   format: binary
 *      responses:
 *       200:
 *         description: 
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /cover/update:
 *   put:
 *     summary: Update cover for user
 *     security:
 *          - Auth: []
 *     tags: [Covers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                  cover:
 *                      type: object
 *                      example: {"key": "cover/f92f981b-8663-449b-a231-59227887b27c_1614620041_266888_url.jpeg","url": "https://social-pet-bucket.s3.amazonaws.com/cover/f92f981b-8663-449b-a231-59227887b27c_1614620041_266888_url.jpeg"}
 *     responses:
 *       200:
 *         description: 
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /cover/all:
 *  get:
 *      summary: Get cover by user login
 *      security:
 *          - Auth: []
 *      tags: [Covers]
 *      responses:
 *       200:
 *         description: 
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /cover/all/{id}:
 *  get:
 *      summary: Get cover by user id
 *      security:
 *          - Auth: []
 *      tags: [Covers]
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *       200:
 *         description: 
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /cover/delete/{id}:
 *  delete:
 *      summary: Delete cover by id of Cover
 *      security:
 *          - Auth: []
 *      tags: [Covers]
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *       200:
 *         description: 
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /post/create:
 *   post:
 *     summary: Create post
 *     security:
 *          - Auth: []
 *     tags: [Posts]
 *     requestBody:
 *       description: Không thể để trống cả hai trường
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                  content:
 *                      type: string
 *                      example: content example
 *                  medias:
 *                      type: array
 *                      example:  [{"media": {"key": "media/ef1042d2-4850-4419-a38c-be492ecfad9e_9720c057-aba6-4b8b-93dc-04ad0f98f029_meo-muop-giong-meo-pho-bien-tren-the-gioi.jpg","url": "https://social-pet-bucket.s3.amazonaws.com/media/ef1042d2-4850-4419-a38c-be492ecfad9e_9720c057-aba6-4b8b-93dc-04ad0f98f029_meo-muop-giong-meo-pho-bien-tren-the-gioi.jpg"},"typeMedia": "image/jpeg"}]
 *     responses:
 *       200:
 *         description: 
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /post/newfeed:
 *  get:
 *      summary: Get posts for newfeed
 *      security:
 *          - Auth: []
 *      tags: [Posts]
 *      responses:
 *       200:
 *         description: 
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /post/{id}:
 *   patch:
 *     summary: Update post
 *     security:
 *          - Auth: []
 *     tags: [Posts]
 *     parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *     requestBody:
 *       description: Không thể để trống cả hai trường
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                  content:
 *                      type: string
 *                      example: content example
 *                  medias:
 *                      type: array
 *                      example:  [{"media": {"key": "media/ef1042d2-4850-4419-a38c-be492ecfad9e_9720c057-aba6-4b8b-93dc-04ad0f98f029_meo-muop-giong-meo-pho-bien-tren-the-gioi.jpg","url": "https://social-pet-bucket.s3.amazonaws.com/media/ef1042d2-4850-4419-a38c-be492ecfad9e_9720c057-aba6-4b8b-93dc-04ad0f98f029_meo-muop-giong-meo-pho-bien-tren-the-gioi.jpg"},"typeMedia": "image/jpeg"}]
 *                  mediaIdDeleteList:
 *                      type: array
 *                      example: []
 *     responses:
 *       200:
 *         description: 
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /post/like/{id}:
 *  patch:
 *      summary: Like post
 *      security:
 *          - Auth: []
 *      tags: [Posts]
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *            description: id is idPost
 *      responses:
 *       200:
 *         description: 
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /post/unlike/{id}:
 *  patch:
 *      summary: Unlike post
 *      security:
 *          - Auth: []
 *      tags: [Posts]
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *            description: id is idPost
 *      responses:
 *       200:
 *         description: 
 *       500:
 *         description: Some server error
 */

