import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

function Home() {
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const token = storedUser?.token;
  const currentUserId = storedUser?.id?.toString();

  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState({});
  const [openComments, setOpenComments] = useState({});
  const [followingUsers, setFollowingUsers] = useState(
    Array.isArray(storedUser?.following) ? storedUser.following : []
  );

  // Custom delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    postId: null,
  });

  // ─── Fetch Posts ──────────────────────────────────────────────────────────
  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts");
      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load posts");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // ─── Create Post ──────────────────────────────────────────────────────────
  const createPost = async () => {
    try {
      if (!content.trim() && !image) {
        return toast.error("Post cannot be empty");
      }

      const formData = new FormData();
      formData.append("content", content);
      if (image) formData.append("image", image);

      setLoading(true);

      const res = await API.post("/posts", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPosts((prev) => [res.data, ...prev]);
      toast.success("Post created");

      setContent("");
      setImage(null);
      document.getElementById("image-upload").value = "";
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  // ─── Like / Unlike ────────────────────────────────────────────────────────
  const handleLike = async (postId) => {
    try {
      const res = await API.put(`/posts/${postId}/like`);
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId ? { ...post, likes: res.data.likes } : post
        )
      );
    } catch {
      toast.error("Failed to like post");
    }
  };

  // ─── Delete Post ──────────────────────────────────────────────────────────
  // Step 1: open the custom modal
  const confirmDelete = (postId) => {
    setDeleteModal({ open: true, postId });
  };

  // Step 2: user clicked "Delete" in modal
  const handleDelete = async () => {
    try {
      await API.delete(`/posts/${deleteModal.postId}`);
      setPosts((prev) => prev.filter((post) => post._id !== deleteModal.postId));
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete post");
    } finally {
      setDeleteModal({ open: false, postId: null });
    }
  };

  // Step 3: user clicked "Cancel" in modal
  const cancelDelete = () => {
    setDeleteModal({ open: false, postId: null });
  };

  // ─── Comment ──────────────────────────────────────────────────────────────
  const handleComment = async (postId) => {
    try {
      const text = commentText[postId];

      if (!text?.trim()) {
        return toast.error("Comment cannot be empty");
      }

      const res = await API.post(
        `/posts/${postId}/comment`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts((prev) =>
        prev.map((post) => (post._id === postId ? res.data : post))
      );

      setCommentText((prev) => ({ ...prev, [postId]: "" }));
    } catch {
      toast.error("Failed to comment");
    }
  };

  // ─── Follow / Unfollow ────────────────────────────────────────────────────
  const handleFollow = async (userId) => {
    try {
      const res = await API.put(
        `/auth/${userId}/follow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      let updatedFollowing = [...followingUsers];

      if (res.data.following) {
        updatedFollowing.push(userId);
      } else {
        updatedFollowing = updatedFollowing.filter((id) => id !== userId);
      }

      updatedFollowing = [...new Set(updatedFollowing)];
      setFollowingUsers(updatedFollowing);

      const updatedUser = { ...storedUser, following: updatedFollowing };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setPosts((prev) =>
        prev.map((post) => {
          if (post.user?._id?.toString() === userId?.toString()) {
            const followers = post.user?.followers || [];
            return {
              ...post,
              user: {
                ...post.user,
                followers: res.data.following
                  ? [...followers, currentUserId]
                  : followers.filter((id) => id?.toString() !== currentUserId),
              },
            };
          }
          return post;
        })
      );

      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error("Failed to follow user");
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">

        {/* ── Custom Delete Confirmation Modal ── */}
        {deleteModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Dark backdrop */}
            <div
              className="absolute inset-0 bg-black bg-opacity-40"
              onClick={cancelDelete}
            />

            {/* Modal box */}
            <div className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm mx-4 text-center">
              {/* Warning icon */}
              <div className="text-5xl mb-4">🗑️</div>

              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Delete this post?
              </h2>

              <p className="text-gray-500 text-sm mb-6">
                This action cannot be undone. The post will be permanently removed.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Post */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
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
              onChange={(e) => setImage(e.target.files[0])}
            />

            <span>{image ? image.name : "No image selected"}</span>
          </div>

          <button
            onClick={createPost}
            disabled={loading}
            className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-xl"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {Array.isArray(posts) &&
            posts.map((post) => {
              const isLiked = post.likes?.some(
                (id) => id?.toString() === currentUserId
              );

              const isFollowing = followingUsers.some(
                (id) => id?.toString() === post.user?._id?.toString()
              );

              const isOwnPost = post.user?._id?.toString() === currentUserId;

              return (
                <div key={post._id} className="bg-white p-6 rounded-2xl shadow-md">

                  {/* Post Header */}
                  <div className="flex justify-between items-center">

                    {/* Avatar + Name */}
                    <div className="flex items-center gap-3">
                      <Link to={`/profile/${post.user?._id}`}>
                        {post.user?.profilePic ? (
                          <img
                            src={post.user.profilePic}
                            alt={post.user.username}
                            className="w-11 h-11 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-600 text-sm">
                            {post.user?.username?.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </Link>

                      <div>
                        <Link to={`/profile/${post.user?._id}`}>
                          <h2 className="font-bold text-lg hover:text-blue-600 leading-tight">
                            {post.user?.username}
                          </h2>
                        </Link>
                        <p className="text-gray-500 text-sm">
                          {post.user?.followers?.length || 0} Followers •{" "}
                          {post.user?.following?.length || 0} Following
                        </p>
                      </div>
                    </div>

                    {/* Delete (own posts) or Follow (others) */}
                    {isOwnPost ? (
                      <button
                        onClick={() => confirmDelete(post._id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-xl text-sm font-medium transition"
                      >
                        🗑 Delete
                      </button>
                    ) : (
                      <button
                        onClick={() => handleFollow(post.user?._id)}
                        className={`px-4 py-2 rounded-xl font-medium text-sm ${
                          isFollowing
                            ? "bg-gray-300 text-gray-700"
                            : "bg-blue-600 text-white"
                        }`}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </button>
                    )}
                  </div>

                  {/* Post Content */}
                  {post.content && <p className="mt-4">{post.content}</p>}

                  {/* Post Image */}
                  {post.image && (
                    <img
                      src={post.image}
                      alt="Post"
                      className="mt-4 rounded-2xl w-full object-cover"
                    />
                  )}

                  {/* Like Button */}
                  <button
                    onClick={() => handleLike(post._id)}
                    className="mt-4 text-lg"
                  >
                    {isLiked ? "💜" : "🤍"} {post.likes?.length || 0} Likes
                  </button>

                  {/* Comment Section */}
                  <div className="mt-4 border-t pt-4">

                    <button
                      onClick={() =>
                        setOpenComments((prev) => ({
                          ...prev,
                          [post._id]: !prev[post._id],
                        }))
                      }
                      className="text-sm text-gray-500 hover:text-blue-600 mb-3"
                    >
                      💬 {post.comments?.length || 0} Comment
                      {post.comments?.length !== 1 ? "s" : ""}
                    </button>

                    {openComments[post._id] && (
                      <div className="space-y-2 mb-3">
                        {post.comments?.length === 0 ? (
                          <p className="text-sm text-gray-400">
                            No comments yet. Be the first!
                          </p>
                        ) : (
                          post.comments.map((comment, index) => (
                            <div
                              key={comment._id || index}
                              className="bg-gray-50 rounded-xl px-4 py-2"
                            >
                              <span className="font-semibold text-sm">
                                {comment.user?.username || "User"}
                              </span>
                              <span className="text-sm text-gray-700 ml-2">
                                {comment.text}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        value={commentText[post._id] || ""}
                        onChange={(e) =>
                          setCommentText((prev) => ({
                            ...prev,
                            [post._id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleComment(post._id);
                        }}
                        className="flex-1 border rounded-xl px-4 py-2 text-sm"
                      />
                      <button
                        onClick={() => handleComment(post._id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default Home;
