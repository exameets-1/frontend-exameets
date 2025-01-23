import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLikedPosts } from '../store/slices/postSlice';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const LikedPosts = () => {
  const dispatch = useDispatch();
  const { likedPosts, loading } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch(fetchLikedPosts());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Liked Posts</h2>
      {likedPosts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No liked posts yet.</p>
      ) : (
        <div className="grid gap-4">
          {likedPosts.map((post) => (
            <div
              key={post._id}
              className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow"
            >
              <Link to={`/posts/${post._id}`}>
                <h3 className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                  {post.title}
                </h3>
              </Link>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                {post.content}
              </p>
              <div className="flex items-center justify-between mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span>By {post.author.name}</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedPosts; 