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

  const [
    followingUsers,
    setFollowingUsers,
  ] = useState([]);

  const storedUser =
    JSON.parse(
      localStorage.getItem(
        "user"
      )
    ) || {};

  const currentUserId =
    storedUser?.user?.id;

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

    if (
      storedUser?.following
    ) {
      setFollowingUsers(
        storedUser.following
      );
    }
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
      } catch {
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

        setCommentText(
          (
            prev
          ) => ({
            ...prev,
            [postId]:
              "",
          })
        );
      } catch {
        toast.error(
          "Failed to comment"
        );
      }
    };

  // Follow / Unfollow
const handleFollow = async (
  userId
) => {
  try {
    const token =
      storedUser?.token;

    await API.put(
      `/api/auth/${userId}/follow`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const isFollowing =
      followingUsers.includes(
        userId
      );

    const updated =
      isFollowing
        ? followingUsers.filter(
            (id) =>
              id !== userId
          )
        : [
            ...followingUsers,
            userId,
          ];

    setFollowingUsers(
      updated
    );

    localStorage.setItem(
      "user",
      JSON.stringify({
        ...storedUser,
        following:
          updated,
      })
    );

    // Update UI instantly
    setPosts((prev) =>
      prev.map((post) => {
        if (
          post.user?._id !==
          userId
        ) {
          return post;
        }

        return {
          ...post,
          user: {
            ...post.user,

            followers:
              isFollowing
                ? (
                    post.user
                      .followers ||
                    []
                  ).filter(
                    (id) =>
                      id !==
                      currentUserId
                  )
                : [
                    ...(
                      post.user
                        .followers ||
                      []
                    ),
                    currentUserId,
                  ],

            following:
              post.user
                .following ||
              [],
          },
        };
      })
    );
  } catch (error) {
    console.log(error);

    toast.error(
      "Failed to follow user"
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
            value={
              content
            }
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

          <div className="mt-4 flex items-center gap-4 flex-wrap">
            <label
              htmlFor="image-upload"
              className="cursor-pointer bg-gray-200 hover:bg-gray-300 px-5 py-3 rounded-xl font-medium transition"
            >
              📷 Choose Image
            </label>

            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(
                e
              ) =>
                setImage(
                  e.target
                    .files[0]
                )
              }
            />

            <span className="text-sm text-gray-500">
              {image
                ? image.name
                : "No image selected"}
            </span>
          </div>

          <button
            onClick={
              createPost
            }
            disabled={
              loading
            }
            className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition disabled:bg-gray-400"
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
              No posts
              yet
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

                const isFollowing =
                  followingUsers.includes(
                    post
                      .user
                      ?._id
                  );

                return (
                  <div
                    key={
                      post._id
                    }
                    className="bg-white p-6 rounded-2xl shadow-md"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="font-bold text-xl">
                          {post
                            .user
                            ?.username ||
                            "Unknown User"}
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                          {
                            post
                              .user
                              ?.followers
                              ?.length ||
                            0
                          }{" "}
                          Followers •{" "}
                          {
                            post
                              .user
                              ?.following
                              ?.length ||
                            0
                          }{" "}
                          Following
                        </p>
                      </div>

                      {post
                        .user
                        ?._id !==
                        currentUserId && (
                        <button
                          onClick={() =>
                            handleFollow(
                              post
                                .user
                                ._id
                            )
                          }
                          className={`px-4 py-2 rounded-xl font-medium transition ${
                            isFollowing
                              ? "bg-gray-300"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          {isFollowing
                            ? "Following"
                            : "Follow"}
                        </button>
                      )}
                    </div>

                    {/* Content */}
                    {post.content && (
                      <p className="mt-4 text-gray-700">
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
                        className="mt-4 rounded-2xl w-full max-h-125 object-cover"
                      />
                    )}

                    {/* Like */}
                    <div className="mt-5 flex items-center gap-3">
                      <button
                        onClick={() =>
                          handleLike(
                            post._id
                          )
                        }
                        className="text-2xl"
                      >
                        {isLiked
                          ? "❤️"
                          : "🤍"}
                      </button>

                      <span className="text-gray-700">
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
                      <p className="font-semibold mb-3">
                        💬{" "}
                        {post
                          .comments
                          ?.length ||
                          0}{" "}
                        Comments
                      </p>

                      <div className="space-y-2 mb-4">
                        {post.comments?.map(
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
                        )}
                      </div>

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
                          className="flex-1 border rounded-xl px-4 py-2"
                        />

                        <button
                          onClick={() =>
                            handleComment(
                              post._id
                            )
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-xl transition"
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