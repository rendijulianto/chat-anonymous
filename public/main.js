document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    const roomList = document.getElementById('room-list');
    const messageInput = document.getElementById('message');
    const sendButton = document.getElementById('send');
    const messagesContainer = document.getElementById('messages-container');
    const messagesList = document.getElementById('messages');
    const createRoomButton = document.getElementById('create-room');
    const typingIndicator = document.getElementById('typing-indicator');



    const imageInput = document.getElementById('imageInput');
    const sendImageButton = document.getElementById('sendImage');

    sendImageButton.addEventListener('click', () => {
        imageInput.click(); // Trigger the file input click event
    });

  

    let currentRoom = '';
    let typingTimeout;

    const scrollToBottom = () => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    messageInput.addEventListener('input', () => {
        if (currentRoom) {
            socket.emit('typing', { room: currentRoom });
            clearTimeout(typingTimeout);
            typingTimeout = setTimeout(() => {
                socket.emit('stop typing', { room: currentRoom });
            }, 1000);
        }
    });

    imageInput.addEventListener('change', () => {
        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function () {
                const base64Image = reader.result.split(',')[1]; // Extract base64 data
                if (currentRoom) {
                    socket.emit('image message', base64Image, currentRoom);
                }
            };
            reader.readAsDataURL(file);
        }
    });

    sendButton.addEventListener('click', () => {
        const message = messageInput.value;
        if (currentRoom && message) {
            socket.emit('chat message', message, currentRoom);
            messageInput.value = '';
        }
    });

    createRoomButton.addEventListener('click', () => {
        const roomName = prompt('Enter room name:');
        if (roomName) {
            socket.emit('create room', roomName);
        }
    });

    socket.on('room list', (rooms) => {
        roomList.innerHTML = '';
        rooms.forEach(room => {
            const li = document.createElement('li');
            li.classList.add('room-item', 'flex', 'items-center', 'p-2', 'cursor-pointer');
            
            if (room === currentRoom) {
                li.classList.add('active-room');
            }

            const icon = document.createElement('i');
            icon.classList.add('fas', 'fa-comments', 'text-gray-500', 'mr-2');
            li.appendChild(icon);

            const link = document.createElement('a');
            link.href = '#';
            link.textContent = room;
            link.addEventListener('click', () => {
                currentRoom = room;
                messagesList.innerHTML = ''; // Clear previous messages
                socket.emit('join room', room);
                socket.emit('request chat history', room);
                document.querySelectorAll('.room-item').forEach(item => item.classList.remove('active-room'));
                li.classList.add('active-room');
            });

            li.appendChild(link);
            roomList.appendChild(li);
        });
    });

    socket.on('chat message', (msg) => {
        if (msg.room === currentRoom) {
            const li = document.createElement('li');
            li.classList.add('flex', 'mb-2', 'items-start', 'space-x-2', 'p-2', 'shadow', 'rounded');

            if (msg.author === socket.id) {
                li.classList.add('justify-end', 'bg-blue-100');
            } else {
                li.classList.add('justify-start', 'bg-gray-100');
            }

            const icon = document.createElement('i');
            icon.classList.add('fas', 'fa-user-circle', 'text-blue-500', 'text-2xl');
            li.appendChild(icon);

            const messageContent = document.createElement('div');
            const messageText = document.createElement('p');
            messageText.textContent = msg.content;
            messageContent.appendChild(messageText);

            const messageMeta = document.createElement('small');
            messageMeta.textContent = `Author: ${msg.author}, ${new Date(msg.timestamp).toLocaleTimeString()}`;
            messageContent.appendChild(messageMeta);

            li.appendChild(messageContent);
            messagesList.appendChild(li);
            scrollToBottom(); // Auto-scroll to the latest message after loading history
        }
    });

    socket.on('image message', (msg) => {
        if (msg.room === currentRoom) {
            const li = document.createElement('li');
            li.classList.add('flex', 'mb-2', 'items-start', 'space-x-2', 'p-2', 'shadow', 'rounded');

            if (msg.author === socket.id) {
                li.classList.add('justify-end', 'bg-blue-100');
            } else {
                li.classList.add('justify-start', 'bg-gray-100');
            }

            const icon = document.createElement('i');
            icon.classList.add('fas', 'fa-user-circle', 'text-blue-500', 'text-2xl');
            li.appendChild(icon);

            const messageContent = document.createElement('div');
            if (msg.type === 'text') {
                const messageText = document.createElement('p');
                messageText.textContent = msg.content;
                messageContent.appendChild(messageText);
            } else if (msg.type === 'image') {
                const img = document.createElement('img');
                img.src = `data:image/jpeg;base64,${msg.content}`;
                img.style.maxWidth = '200px';
                img.alt = 'User sent image';
                messageContent.appendChild(img);
            }

            const messageMeta = document.createElement('small');
            messageMeta.textContent = `Author: ${msg.author}, ${new Date(msg.timestamp).toLocaleTimeString()}`;
            messageContent.appendChild(messageMeta);

            li.appendChild(messageContent);
            messagesList.appendChild(li);
            scrollToBottom();
        }
    });

    socket.on('chat history', (messages) => {
        messagesList.innerHTML = ''; // Clear previous history
        messages.forEach(msg => {
            const li = document.createElement('li');
            li.classList.add('flex',  'mb-2', 'items-start', 'space-x-2', 'p-2', 'shadow', 'rounded');

            if (msg.author === socket.id) {
                li.classList.add('justify-end', 'bg-blue-100');
            } else {
                li.classList.add('justify-start', 'bg-gray-100');
            }

            const icon = document.createElement('i');
            icon.classList.add('fas', 'fa-user-circle', 'text-blue-500', 'text-2xl');
            li.appendChild(icon);

            const messageContent = document.createElement('div');
            if (msg.type === 'text') {
                const messageText = document.createElement('p');
                messageText.textContent = msg.content;
                messageContent.appendChild(messageText);
            } else {
                const img = document.createElement('img');
                img.src = `data:image/jpeg;base64,${msg.content}`;
                img.style.maxWidth = '200px';
                img.alt = 'User sent image';
                messageContent.appendChild(img);
            }

            const messageMeta = document.createElement('small');
            messageMeta.textContent = `Author: ${msg.author}, ${new Date(msg.timestamp).toLocaleTimeString()}`;
            messageContent.appendChild(messageMeta);

            li.appendChild(messageContent);
            messagesList.appendChild(li);
        });
        scrollToBottom(); 
    });

    socket.on('typing', (data) => {
        if (data.room === currentRoom) {
            typingIndicator.textContent = `${data.author} is typing...`;
            typingIndicator.classList.remove('hidden');
        }
    });

    socket.on('stop typing', (data) => {
        if (data.room === currentRoom) {
            typingIndicator.classList.add('hidden');
        }
    });
});
