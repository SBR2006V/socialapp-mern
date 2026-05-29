import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

function Home() {
  const storedUser =
    JSON.parse(localStorage.getItem("user")) || {};

  console.log(storedUser);

const token = storedUser?.token;

  const username =
  storedUser?.username || "User";

  const currentUserId =
  storedUser?.id;

  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState({});

  // Follow state
  const [followingUsers, setFollowingUsers] =
  useState(
    Array.isArray(storedUser?.following)
      ? storedUser.following
      : []
  );

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts")

      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load posts");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Create Post
  const createPost = async () => {
    try {
      if (!content.trim() && !image) {
        return toast.error(
          "Post cannot be empty"
        );
      }

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

      setLoading(true);

      const res =
        await API.post(
  "/posts",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      setPosts((prev) => [
        res.data,
        ...prev,
      ]);

      toast.success("Post created");

      setContent("");
      setImage(null);

      document.getElementById(
        "image-upload"
      ).value = "";
    } catch (error) {
      toast.error(
        error.response?.data
          ?.message ||
          "Failed to create post"
      );
    } finally {
      setLoading(false);
    }
  };

  // Like
  const handleLike = async (
    postId
  ) => {
    try {
      const res =
        await API.put(
  `/auth/${id}/follow`
);

      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes:
                  res.data.likes,
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

  // Comment
  const handleComment =
    async (postId) => {
      try {
        const text =
          commentText[
            postId
          ];

        if (!text?.trim()) {
          return toast.error(
            "Comment cannot be empty"
          );
        }

        const res =
          await API.post(
            `/posts/${postId}/comment`,
            { text },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        setPosts((prev) =>
          prev.map((post) =>
            post._id ===
            postId
              ? res.data
              : post
          )
        );

        setCommentText(
          (prev) => ({
            ...prev,
            [postId]: "",
          })
        );
      } catch {
        toast.error(
          "Failed to comment"
        );
      }
    };

  // Follow / Unfollow
  const handleFollow =
    async (userId) => {
      try {
        const res =
          await API.put(
            `/auth/${userId}/follow`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        let updatedFollowing =
          [...followingUsers];

        if (
          res.data.following
        ) {
          updatedFollowing.push(
            userId
          );
        } else {
          updatedFollowing =
            updatedFollowing.filter(
              (id) =>
                id !== userId
            );
        }

        // Remove duplicates
        updatedFollowing = [
          ...new Set(
            updatedFollowing
          ),
        ];

        setFollowingUsers(
          updatedFollowing
        );

        // Save to localStorage
        const updatedUser = {
          ...storedUser,
          following: updatedFollowing,
        };

        localStorage.setItem(
          "user",
          JSON.stringify(
            updatedUser
          )
        );

        // Update followers instantly
        setPosts((prev) =>
          prev.map((post) => {
            if (
              post.user?._id ===
              userId
            ) {
              const followers =
                post.user
                  ?.followers ||
                [];

              return {
                ...post,
                user: {
                  ...post.user,
                  followers:
                    res.data.following
                      ? [
                          ...followers,
                          currentUserId,
                        ]
                      : followers.filter(
                          (id) =>
                            id !==
                            currentUserId
                        ),
                },
              };
            }

            return post;
          })
        );

        toast.success(
          res.data.message
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

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">
              Social Feed
            </h1>

            <p className="text-gray-600 mt-1">
              Hello,{" "}
              <span className="font-semibold">
                {username}
              </span>
              👋
            </p>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem(
                "user"
              );

              window.location.href =
                "/login";
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl font-medium"
          >
            Logout
          </button>
        </div>

        {/* Create Post */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) =>
              setContent(
                e.target.value
              )
            }
            className="w-full border rounded-xl p-4 resize-none"
            rows="4"
          />

          <div className="mt-4 flex gap-4 items-center">
            <label
              htmlFor="image-upload"
              className="cursor-pointer bg-gray-200 hover:bg-gray-300 px-5 py-3 rounded-xl"
            >
              📷 Choose Image
            </label>

            <input
              id="image-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) =>
                setImage(
                  e.target.files[0]
                )
              }
            />

            <span>
              {image
                ? image.name
                : "No image selected"}
            </span>
          </div>

          <button
            onClick={createPost}
            disabled={loading}
            className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-xl"
          >
            {loading
              ? "Posting..."
              : "Post"}
          </button>
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {Array.isArray(posts) &&
            posts.map((post) => {
            const isLiked =
  post.likes?.some(
    (id) =>
      id.toString() ===
      currentUserId?.toString()
  );

            const isFollowing =
  followingUsers.some(
    (id) =>
      id.toString() ===
      post.user?._id?.toString()
  );

            return (
              <div
                key={post._id}
                className="bg-white p-6 rounded-2xl shadow-md"
              >
                <div className="flex justify-between">

                  <div>
                    <Link
                      to={`/profile/${post.user?._id}`}
                    >
                      <h2 className="font-bold text-xl hover:text-blue-600">
                        {post.user?.username}
                      </h2>
                    </Link>

                    <p className="text-gray-500 text-sm">
                      {
                        post.user
                          ?.followers
                          ?.length || 0
                      } Followers •{" "}
                      {
                        post.user
                          ?.following
                          ?.length || 0
                      } Following
                    </p>
                  </div>

                  {post.user?._id !==
                    currentUserId && (
                    <button
                      onClick={() =>
                        handleFollow(
                          post.user
                            ?._id
                        )
                      }
                      className={`px-4 py-2 rounded-xl font-medium ${
                        isFollowing
                          ? "bg-gray-300"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      {isFollowing
                        ? "Following"
                        : "Follow"}
                    </button>
                  )}
                </div>

                {post.content && (
                  <p className="mt-4">
                    {post.content}
                  </p>
                )}

                {post.image && (
                  <img
                    src={post.image}
                    alt="Post"
                    className="mt-4 rounded-2xl w-full"
                  />
                )}

                <button
                  onClick={() =>
                    handleLike(
                      post._id
                    )
                  }
                  className="mt-4"
                >
                  {isLiked
                    ? "💜"
                    : "🤍"}{" "}
                  {
                    post.likes
                      ?.length
                  } Likes
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Home;