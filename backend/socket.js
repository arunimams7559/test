const socketIo = require('socket.io');
const User = require('./models/usermodel');

const connectedUsers = new Map(); 

const initSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

  
    socket.on('user_connected', async (userId) => {
      if (!userId) return;
      
      try {
       
        await User.findByIdAndUpdate(userId, { 
          isOnline: true,
          lastActive: new Date()
        });
        
    
        connectedUsers.set(userId, socket.id);
        socket.userId = userId;
       
        io.emit('user_status_change', { userId, isOnline: true });
        
        console.log(`User ${userId} is now online`);
      } catch (err) {
        console.error('Error updating user online status:', err);
      }
    });

    socket.on('chat message', (msg) => {
      console.log('Message received:', msg);
      io.emit('chat message', msg);
    });

    socket.on('disconnect', async () => {
      console.log('A user disconnected:', socket.id);
      

      if (socket.userId) {
        try {
        
          await User.findByIdAndUpdate(socket.userId, { 
            isOnline: false,
            lastActive: new Date()
          });
          
        
          connectedUsers.delete(socket.userId);
          
         
          io.emit('user_status_change', { userId: socket.userId, isOnline: false });
          
          console.log(`User ${socket.userId} is now offline`);
        } catch (err) {
          console.error('Error updating user offline status:', err);
        }
      }
    });
  });
};

module.exports = initSocket;