const notifications = [];
let nextId = 1;

function createNotification({ message, type, movie_id }) {
  const notif = {
    id: nextId++,
    message,
    type: type || 'movie_added',
    movie_id: movie_id || null,
    created_at: new Date().toISOString(),
    read: false,
  };
  notifications.unshift(notif);
  if (notifications.length > 50) notifications.length = 50;
  return notif;
}

function getNotifications(limit = 10) {
  return notifications.slice(0, limit);
}

function markAsRead(ids) {
  notifications.forEach(n => {
    if (ids.includes(n.id)) n.read = true;
  });
}

module.exports = { createNotification, getNotifications, markAsRead };
