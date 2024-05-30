<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chatroom App</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <div class="main">
        <h1>Chatroom App</h1>

        <!-- Chatroom Management Section -->
        <div id="chatroomSection">
            <h3>Manage Chatrooms</h3>
            <button id="createChatroomBtn">Create Chatroom</button>
            <button id="joinChatroomBtn">Join Chatroom</button>
        </div>

        <!-- Create Chatroom Section -->
        <div id="createChatroomSection" style="display:none;">
            <h3>Create a Chatroom</h3>
            <form id="chatroomForm">
                <label for="chatroomName">Chatroom Name:</label>
                <input type="text" id="chatroomName" name="chatroomName" placeholder="Enter Chatroom Name" required>

                <label for="chatroomPassword">Chatroom Password:</label>
                <input type="password" id="chatroomPassword" name="chatroomPassword" placeholder="Enter Chatroom Password" required>

                <button type="submit">Create Chatroom</button>
            </form>
        </div>

        <!-- Join Chatroom Section -->
        <div id="joinChatroomSection" style="display:none;">
            <h3>Join a Chatroom</h3>
            <form id="joinChatroomForm">
                <label for="joinChatroomName">Chatroom Name:</label>
                <input type="text" id="joinChatroomName" name="joinChatroomName" placeholder="Enter Chatroom Name" required>

                <label for="joinChatroomPassword">Chatroom Password:</label>
                <input type="password" id="joinChatroomPassword" name="joinChatroomPassword" placeholder="Enter Chatroom Password" required>

                <button type="submit">Join Chatroom</button>
            </form>
        </div>
    </div>

    <!-- Include the Firebase JavaScript SDK -->
    <script src="https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js"></script>
    <!-- Reference your custom Firebase.js file -->
    <script src="firebase.js"></script>

    <script>
        // Chatroom management logic
        document.getElementById('createChatroomBtn').addEventListener('click', function() {
            document.getElementById('chatroomSection').style.display = 'none';
            document.getElementById('createChatroomSection').style.display = 'block';
        });

        document.getElementById('joinChatroomBtn').addEventListener('click', function() {
            document.getElementById('chatroomSection').style.display = 'none';
            document.getElementById('joinChatroomSection').style.display = 'block';
        });

        document.getElementById('chatroomForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const chatroomName = document.getElementById('chatroomName').value;
            const chatroomPassword = document.getElementById('chatroomPassword').value;

            // Simulate a server request
            localStorage.setItem('chatroom_' + chatroomName, JSON.stringify({ password: chatroomPassword }));
            alert('Chatroom Created Successfully');
            window.location.href = 'chatpage.html?name=' + chatroomName;
        });

        document.getElementById('joinChatroomForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const chatroomName = document.getElementById('joinChatroomName').value;
            const chatroomPassword = document.getElementById('joinChatroomPassword').value;

            const storedChatroom = localStorage.getItem('chatroom_' + chatroomName);
            if (storedChatroom) {
                const chatroom = JSON.parse(storedChatroom);
                if (chatroom.password === chatroomPassword) {
                    alert('Joined Chatroom Successfully');
                    window.location.href = 'chatpage.html?name=' + chatroomName;
                } else {
                    alert('Incorrect Chatroom Password');
                }
            } else {
                alert('Chatroom not found');
            }
        });
    </script>
</body>

</html>
