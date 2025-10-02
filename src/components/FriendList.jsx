import React, { useState } from 'react';
import { UserPlus, X, Users, CheckCircle } from 'lucide-react';

const FriendList = ({ friends, onAddFriend, onRemoveFriend }) => {
  const [newFriendName, setNewFriendName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastAddedFriend, setLastAddedFriend] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newFriendName.trim() && !friends.some(f => f.name.toLowerCase() === newFriendName.trim().toLowerCase())) {
      setLastAddedFriend(newFriendName.trim());
      onAddFriend(newFriendName);
      setNewFriendName('');
      
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Success Message */}
      {showSuccess && lastAddedFriend && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div className="flex-1">
              <p className="font-medium text-green-800">
                <span className="font-semibold">{lastAddedFriend}</span> added successfully! ✅
              </p>
              <p className="text-sm text-green-700">Ready to split expenses together</p>
            </div>
          </div>
        </div>
      )}

      {/* Add Friend Form */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={newFriendName}
            onChange={(e) => setNewFriendName(e.target.value)}
            placeholder="Enter friend's name"
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            autoComplete="off"
            maxLength={30}
          />
          <button
            type="submit"
            disabled={!newFriendName.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <UserPlus className="h-5 w-5" />
            Add Friend
          </button>
        </form>
      </div>

      {/* Friends List */}
      {friends.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b bg-gray-50 rounded-t-lg">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Friends ({friends.length})
            </h3>
          </div>
          <div className="divide-y">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {friend.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 text-lg">{friend.name}</span>
                </div>
                <button
                  onClick={() => onRemoveFriend(friend.id)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  title={`Remove ${friend.name}`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border">
          <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">No friends added yet</h3>
          <p className="text-gray-400">Add at least 2 friends to start splitting expenses</p>
        </div>
      )}
    </div>
  );
};

export default FriendList;