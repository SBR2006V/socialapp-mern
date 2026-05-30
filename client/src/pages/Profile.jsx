import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  // FIX: consistent id extraction + string conversion
  const currentUserId = storedUser?.id?.toString();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit states
  const [editing, setEditing] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const res = await API.get(`/auth/profile/${id}`);
      setUser(res.data.user);
      setPosts(res.data.posts);
      setEditUsername(res.data.user.username);
      setEditBio(res.data.user.bio || "");
    } catch (error) {
      console.log(error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("username", editUsername);
      formData.append("bio", editBio);
      if (profileImage) formData.append("profilePic", profileImage);

      const res = await API.put("/auth/profile", formData);

      setUser(res.data.user);

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          username: res.data.user.username,
          bio: res.data.user.bio,
          profilePic: res.data.user.profilePic,
        })
      );

      toast.success("Profile updated!");
      setEditing(false);
      setProfileImage(null);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading profile...</div>;
  }

  // FIX: string comparison on both sides
  const isOwnProfile = currentUserId === user?._id?.toString();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition"
        >
          <span className="text-xl">←</span> Back to Feed
        </button>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <div className="flex items-center gap-6">

            {/* Profile picture or initials */}
            {user?.profilePic ? (
              <img
                src={user.profilePic}
                alt="profile"
                className="w-28 h-28 rounded-full object-cover"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center text-3xl font-bold text-gray-600">
                {user?.username?.slice(0, 2).toUpperCase()}
              </div>
            )}

            <div>
              <h1 className="text-3xl font-bold">{user?.username}</h1>
              <p className="text-gray-500 mt-1">{user?.bio || "No bio yet"}</p>
              <p className="mt-3 text-gray-600">
                {user?.followers?.length || 0} Followers •{" "}
                {user?.following?.length || 0} Following
              </p>

              {isOwnProfile && (
                <button
                  onClick={() => setEditing(!editing)}
                  className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
                >
                  {editing ? "Cancel" : "Edit Profile"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Edit Form */}
        {editing && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-5">Edit Profile</h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                className="w-full border rounded-xl p-4"
              />

              <textarea
                placeholder="Bio"
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="w-full border rounded-xl p-4"
                rows="4"
              />

              {/* FIX: Styled file input — replaces the ugly default browser one */}
              <div>
                <p className="text-sm text-gray-500 mb-2">Profile Picture</p>
                <label
                  htmlFor="profile-pic-upload"
                  className="cursor-pointer inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 font-medium px-5 py-3 rounded-xl transition"
                >
                  📷 {profileImage ? profileImage.name : "Choose Photo"}
                </label>
                <input
                  id="profile-pic-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setProfileImage(e.target.files[0])}
                />
              </div>

              <button
                onClick={handleUpdateProfile}
                disabled={saving}
                className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}

        {/* Posts */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Posts</h2>

          {posts.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl text-gray-500">
              No posts yet
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-2xl p-6 shadow-md"
              >
                {post.content && <p className="mb-4">{post.content}</p>}

                {post.image && (
                  <img
                    src={post.image}
                    alt="post"
                    className="rounded-xl w-full object-cover"
                  />
                )}

                <p className="mt-4 text-gray-500">
                  ❤️ {post.likes?.length || 0} Likes
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
