import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

function Home() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState({});
  const [followingUsers, setFollowingUsers] = useState([]);

  const storedUser =
    JSON.parse(localStorage.getItem("user")) || {};

  const currentUserId =
    storedUser?.user?.id;

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const res = await API.get("/api/posts");

      setPosts(res.data);

      // Sync following users from DB
      const currentUserPost = res.data.find(
        (post) =>
          post.user?._id === currentUserId
      );

      if (currentUserPost?.user?.following) {
        setFollowingUsers(
          currentUserPost.user.following
        );

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...storedUser,
            user: {
              ...storedUser.user,
              following:
                currentUserPost.user.following,
            },
          })
        );
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load posts");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Create post
  const createPost = async () => {
    try {
      if (!content.trim() && !image) {
        return toast.error(
          "Post cannot be empty"
        );
      }

      const token = storedUser?.token;

      if (!token) {
        return toast.error(
          "Login first"
        );
      }

      setLoading(true);

      const formData = new FormData();

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

      const res = await API.post(
        "/api/posts",
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
        error.response?.data?.message ||
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
      const token =
        storedUser?.token;

      const res = await API.put(
        `/api/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
  const handleComment = async (
    postId
  ) => {
    try {
      const token =
        storedUser?.token;

      const text =
        commentText[postId];

      if (!text?.trim()) {
        return toast.error(
          "Comment cannot be empty"
        );
      }

      const res = await API.post(
        `/api/posts/${postId}/comment`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? res.data
            : post
        )
      );

      setCommentText((prev) => ({
        ...prev,
        [postId]: "",
      }));
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

      const res = await API.put(
        `/api/auth/${userId}/follow`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const isAlreadyFollowing =
  followingUsers.includes(
    userId
  );

const updatedFollowing =
  isAlreadyFollowing
    ? followingUsers.filter(
        (id) => id !== userId
      )
    : [
        ...followingUsers,
        userId,
      ];

setFollowingUsers(
  updatedFollowing
);

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          user: {
            ...storedUser.user,
            following:
              updatedFollowing,
          },
        })
      );

      // Fetch fresh DB data
      await fetchPosts();
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
            value={content}
            onChange={(e) =>
              setContent(
                e.target.value
              )
            }
            className="w-full border rounded-xl p-4 resize-none"
            rows="4"
          />

          <div className="mt-4 flex items-center gap-4 flex-wrap">
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

            <span className="text-sm text-gray-500">
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
          {posts.map((post) => {
            const isLiked =
              post.likes?.includes(
                currentUserId
              );

            const isFollowing =
              followingUsers.includes(
                post.user?._id
              );

            return (
              <div
                key={post._id}
                className="bg-white p-6 rounded-2xl shadow-md"
              >
                <div className="flex justify-between">
                  <div>
                    <h2 className="font-bold text-xl">
                      {
                        post.user
                          ?.username
                      }
                    </h2>

                    <p className="text-gray-500 text-sm">
                      {Array.isArray(
                        post.user
                          ?.followers
                      )
                        ? post.user
                            .followers
                            .length
                        : 0}{" "}
                      Followers •{" "}
                      {Array.isArray(
                        post.user
                          ?.following
                      )
                        ? post.user
                            .following
                            .length
                        : 0}{" "}
                      Following
                    </p>
                  </div>

                  {post.user?._id !==
                    currentUserId && (
                    <button
                      onClick={() =>
                        handleFollow(
                          post.user
                            ._id
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

                {/* Content */}
{post.content && (
  <p className="mt-4 text-gray-700">
    {post.content}
  </p>
)}

{/* Image */}
{post.image && (
  <img
    src={post.image}
    alt="Post"
    className="mt-4 rounded-2xl w-full max-h-125 object-cover"
  />
)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Home;