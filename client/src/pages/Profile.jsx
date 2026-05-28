import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

function Profile() {
  const { id } = useParams();

  const storedUser =
    JSON.parse(localStorage.getItem("user")) || {};

  const currentUserId =
    storedUser?.id ||
    storedUser?.user?.id;

  const token =
  storedUser?.token;

  const [user, setUser] =
    useState(null);

  const [posts, setPosts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile =
    async () => {
      try {
        const res =
          await API.get(
  `/auth/profile/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        setUser(res.data.user);
        setPosts(res.data.posts);
      } catch (error) {
        console.log(error);
        toast.error(
          "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading profile...
      </div>
    );
  }

  const isOwnProfile =
    currentUserId === user?._id;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <div className="flex items-center gap-6">

            <img
              src={
  user?.profilePic ||
  "https://ui-avatars.com/api/?name=User"
}
              alt="profile"
              className="w-28 h-28 rounded-full object-cover"
            />

            <div>
              <h1 className="text-3xl font-bold">
                {user?.username}
              </h1>

              <p className="text-gray-500 mt-1">
                {user?.bio || "No bio yet"}
              </p>

              <p className="mt-3 text-gray-600">
                {user?.followers?.length || 0}
                {" "}Followers •{" "}
                {user?.following?.length || 0}
                {" "}Following
              </p>

              {isOwnProfile && (
                <button className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-xl">
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* User Posts */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">
            Posts
          </h2>

          {posts.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl">
              No posts yet
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-2xl p-6 shadow-md"
              >
                {post.content && (
                  <p className="mb-4">
                    {post.content}
                  </p>
                )}

                {post.image && (
                  <img
                    src={post.image}
                    alt="post"
                    className="rounded-xl w-full"
                  />
                )}

                <p className="mt-4 text-gray-500">
                  ❤️{" "}
                  {post.likes?.length || 0}
                  {" "}Likes
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