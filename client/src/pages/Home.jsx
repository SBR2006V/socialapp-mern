import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

function Home() {
  const [posts, setPosts] =
    useState([]);

  const [content, setContent] =
    useState("");

  const [image, setImage] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [
    commentText,
    setCommentText,
  ] = useState({});

  const storedUser =
    JSON.parse(
      localStorage.getItem(
        "user"
      )
    );

  const currentUserId =
    storedUser?.id;

  // Fetch Posts
  const fetchPosts =
    async () => {
      try {
        const res =
          await API.get(
            "/api/posts"
          );

        setPosts(
          res.data
        );
      } catch (error) {
        console.log(
          error
        );

        toast.error(
          "Failed to load posts"
        );
      }
    };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Create Post
  const createPost =
    async () => {
      try {
        if (
          !content.trim() &&
          !image
        ) {
          return toast.error(
            "Post cannot be empty"
          );
        }

        const token =
          storedUser?.token;

        if (!token) {
          return toast.error(
            "Login first"
          );
        }

        setLoading(true);

        const formData =
          new FormData();

        formData.append(
          "content",
          content
        );

        if (image) {
          formData.append(
            "image",
            image
          );
        }

        const res =
          await API.post(
            "/api/posts",
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        // Add new post instantly
        setPosts(
          (prev) => [
            res.data,
            ...prev,
          ]
        );

        toast.success(
          "Post created"
        );

        setContent("");
        setImage(null);

        document.getElementById(
          "image-upload"
        ).value = "";
      } catch (error) {
        console.log(
          error.response
            ?.data
        );

        toast.error(
          error.response
            ?.data
            ?.message ||
            "Failed to create post"
        );
      } finally {
        setLoading(false);
      }
    };

  // Like / Unlike
  const handleLike =
    async (
      postId
    ) => {
      try {
        const token =
          storedUser?.token;

        if (!token) {
          return toast.error(
            "Login first"
          );
        }

        const res =
          await API.put(
            `/api/posts/${postId}/like`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        setPosts(
          (prev) =>
            prev.map(
              (
                post
              ) =>
                post._id ===
                postId
                  ? {
                      ...post,
                      likes:
                        res
                          .data
                          .likes,
                    }
                  : post
            )
        );
      } catch (error) {
        console.log(
          error
        );

        toast.error(
          "Failed to like post"
        );
      }
    };

  // Add Comment
  const handleComment =
    async (
      postId
    ) => {
      try {
        const token =
          storedUser?.token;

        if (!token) {
          return toast.error(
            "Login first"
          );
        }

        const text =
          commentText[
            postId
          ];

        if (
          !text?.trim()
        ) {
          return toast.error(
            "Comment cannot be empty"
          );
        }

        const res =
          await API.post(
            `/api/posts/${postId}/comment`,
            { text },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        // Update post instantly
        setPosts(
          (prev) =>
            prev.map(
              (
                post
              ) =>
                post._id ===
                postId
                  ? res.data
                  : post
            )
        );

        // Clear comment box
        setCommentText(
          (
            prev
          ) => ({
            ...prev,
            [postId]:
              "",
          })
        );

        toast.success(
          "Comment added"
        );
      } catch (error) {
        console.log(
          error
        );

        toast.error(
          "Failed to add comment"
        );
      }
    };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Social Feed
        </h1>

        {/* Create Post */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(
              e
            ) =>
              setContent(
                e.target
                  .value
              )
            }
            className="w-full border rounded-xl p-4 outline-none resize-none"
            rows="4"
          />

          {/* Image Upload */}
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <label
              htmlFor="image-upload"
              className="cursor-pointer bg-gray-200 hover:bg-gray-300 px-5 py-2 rounded-xl font-medium transition"
            >
              📷 Choose Image
            </label>

            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={(
                e
              ) =>
                setImage(
                  e
                    .target
                    .files[0]
                )
              }
              className="hidden"
            />

            {image ? (
              <span className="text-sm text-gray-600 truncate max-w-[250px]">
                {
                  image.name
                }
              </span>
            ) : (
              <span className="text-sm text-gray-400">
                No image selected
              </span>
            )}
          </div>

          <button
            onClick={
              createPost
            }
            disabled={
              loading
            }
            className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading
              ? "Posting..."
              : "Post"}
          </button>
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {posts.length ===
          0 ? (
            <p className="text-center text-gray-500">
              No posts yet
            </p>
          ) : (
            posts.map(
              (
                post
              ) => {
                const isLiked =
                  post.likes?.includes(
                    currentUserId
                  );

                return (
                  <div
                    key={
                      post._id
                    }
                    className="bg-white p-6 rounded-2xl shadow-md"
                  >
                    {/* Username */}
                    <h2 className="font-bold text-lg mb-2">
                      {post
                        .user
                        ?.username ||
                        "Unknown User"}
                    </h2>

                    {/* Content */}
                    {post.content && (
                      <p className="text-gray-700 mt-2">
                        {
                          post.content
                        }
                      </p>
                    )}

                    {/* Image */}
                    {post.image && (
                      <img
                        src={
                          post.image
                        }
                        alt="Post"
                        className="mt-4 rounded-2xl w-full max-h-[500px] object-cover"
                      />
                    )}

                    {/* Like */}
                    <div className="mt-4 flex items-center gap-3">
                      <button
                        onClick={() =>
                          handleLike(
                            post._id
                          )
                        }
                        className="text-2xl hover:scale-110 transition"
                      >
                        {isLiked
                          ? "❤️"
                          : "🤍"}
                      </button>

                      <span className="text-gray-600 font-medium">
                        {
                          post
                            .likes
                            ?.length
                        }{" "}
                        Likes
                      </span>
                    </div>

                    {/* Comments */}
                    <div className="mt-5 border-t pt-4">
                      <p className="font-semibold text-gray-700 mb-3">
                        💬{" "}
                        {post
                          .comments
                          ?.length ||
                          0}{" "}
                        Comments
                      </p>

                      {/* Comment List */}
                      <div className="space-y-2 mb-4">
                        {post
                          .comments
                          ?.length >
                        0 ? (
                          post.comments.map(
                            (
                              comment,
                              index
                            ) => (
                              <div
                                key={
                                  index
                                }
                                className="bg-gray-100 p-3 rounded-xl"
                              >
                                <span className="font-semibold">
                                  {comment
                                    .user
                                    ?.username ||
                                    "User"}
                                  :
                                </span>{" "}
                                {
                                  comment.text
                                }
                              </div>
                            )
                          )
                        ) : (
                          <p className="text-sm text-gray-400">
                            No comments yet
                          </p>
                        )}
                      </div>

                      {/* Add Comment */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          value={
                            commentText[
                              post
                                ._id
                            ] ||
                            ""
                          }
                          onChange={(
                            e
                          ) =>
                            setCommentText(
                              (
                                prev
                              ) => ({
                                ...prev,
                                [post
                                  ._id]:
                                  e
                                    .target
                                    .value,
                              })
                            )
                          }
                          className="flex-1 border rounded-xl px-4 py-2 outline-none"
                        />

                        <button
                          onClick={() =>
                            handleComment(
                              post._id
                            )
                          }
                          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
                        >
                          Post
                        </button>
                      </div>
                    </div>

                    {/* Date */}
                    <p className="text-sm text-gray-400 mt-4">
                      {new Date(
                        post.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>
                );
              }
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;