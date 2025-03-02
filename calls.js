// Demo call data (would be replaced with Firebase data in a real app)
const demoCalls = [
    { id: 'call1', userId: 'user2', name: 'Alice Johnson', type: 'video', status: 'incoming', time: '10 mins ago', duration: '5:23' },
    { id: 'call2', userId: 'user3', name: 'Bob Wilson', type: 'audio', status: 'outgoing', time: '2 hours ago', duration: '3:45' },
    { id: 'call3', userId: 'user2', name: 'Alice Johnson', type: 'audio', status: 'missed', time: 'Yesterday', duration: null },
    { id: 'call4', userId: 'user4', name: 'Emily Davis', type: 'video', status: 'outgoing', time: 'Yesterday', duration: '10:12' }
];

// DOM Elements
const callsList = document.getElementById('calls-list');
const callActiveArea = document.getElementById('call-active-area');

// Set up calls event listeners
function setupCallsEventListeners() {
    // New call button
    document.getElementById('new-call-btn').addEventListener('click', () => {
        alert('This would open the new call dialog in a real application');
    });
    
    // Call buttons in chat
    document.getElementById('call-btn').addEventListener('click', () => {
        if (window.currentChat) {
            switchTab('calls');
            simulateIncomingCall(window.currentChat.id, false);
        }
    });
    
    document.getElementById('video-btn').addEventListener('click', () => {
        if (window.currentChat) {
            switchTab('calls');
            simulateIncomingCall(window.currentChat.id, true);
        }
    });
}

// Load call history
function loadCalls() {
    callsList.innerHTML = '';
    
    demoCalls.forEach(call => {
        const callElement = document.createElement('div');
        callElement.className = 'call-item';
        callElement.dataset.callId = call.id;
        
        const user = window.demoUsers.find(u => u.id === call.userId);
        const initials = user ? getInitials(user.name) : '??';
        
        let icon = '';
        let statusText = '';
        let statusColor = '';
        
        if (call.status === 'incoming') {
            icon = call.type === 'video' ? 'fa-video' : 'fa-phone';
            statusText = 'Incoming';
            statusColor = 'text-green-500';
        } else if (call.status === 'outgoing') {
            icon = call.type === 'video' ? 'fa-video' : 'fa-phone';
            statusText = 'Outgoing';
            statusColor = 'text-blue-500';
        } else if (call.status === 'missed') {
            icon = 'fa-phone-slash';
            statusText = 'Missed';
            statusColor = 'text-red-500';
        }
        
        callElement.innerHTML = `
            <div class="call-avatar">${initials}</div>
            <div class="call-info">
                <div class="call-name">${call.name}</div>
                <div class="call-status ${statusColor}">
                    <i class="fas ${icon}"></i>
                    ${statusText} • ${call.duration ? call.duration : 'Not answered'}
                </div>
            </div>
            <div class="call-time">${call.time}</div>
        `;
        
        callElement.addEventListener('click', () => {
            simulateIncomingCall(call.userId, call.type === 'video');
        });
        
        callsList.appendChild(callElement);
    });
}

// Simulate an incoming call
function simulateIncomingCall(userId, isVideo) {
    const user = window.demoUsers.find(u => u.id === userId);
    if (!user) return;
    
    callActiveArea.innerHTML = `
        <div class="video-container ${isVideo ? '' : 'hidden'}">
            <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-white text-center">
                    <div class="call-avatar bg-gray-700 mx-auto mb-4" style="width: 100px; height: 100px; font-size: 40px;">
                        ${getInitials(user.name)}
                    </div>
                    <h2 class="text-2xl font-bold">${user.name}</h2>
                    <p class="mb-4">${isVideo ? 'Video call' : 'Voice call'} in progress</p>
                    <p class="text-sm">In a real application, this would use WebRTC for a real-time call</p>
                </div>
            </div>
        </div>
        
        <div class="text-center ${isVideo ? 'hidden' : ''}">
            <div class="call-avatar bg-gray-200 dark:bg-gray-700 mx-auto mb-4" style="width: 100px; height: 100px; font-size: 40px;">
                ${getInitials(user.name)}
            </div>
            <h2 class="text-2xl font-bold mb-2">${user.name}</h2>
            <p class="mb-4">Call in progress...</p>
            <p class="text-sm opacity-70 mb-8">00:05</p>
        </div>
        
        <div class="call-controls">
            <button class="call-control-button">
                <i class="fas fa-microphone-slash"></i>
            </button>
            ${isVideo ? `
            <button class="call-control-button">
                <i class="fas fa-video-slash"></i>
            </button>
            ` : ''}
            <button class="call-control-button">
                <i class="fas fa-volume-up"></i>
            </button>
            <button class="call-control-button call-end">
                <i class="fas fa-phone-slash"></i>
            </button>
        </div>
    `;
    
    // Add event listener to end call button
    const endCallButton = callActiveArea.querySelector('.call-end');
    endCallButton.addEventListener('click', () => {
        // Reset call active area
        callActiveArea.innerHTML = `
            <div class="text-center">
                <i class="fas fa-phone-alt fa-5x mb-4 opacity-50"></i>
                <h2 class="text-xl font-bold mb-2">Start a Call</h2>
                <p>Select a contact from the left to start a call</p>
            </div>
        `;
        
        // Add new call to history
        const now = new Date();
        const newCall = {
            id: 'call' + (demoCalls.length + 1),
            userId: userId,
            name: user.name,
            type: isVideo ? 'video' : 'audio',
            status: 'outgoing',
            time: 'Just now',
            duration: '0:15'
        };
        
        demoCalls.unshift(newCall);
        loadCalls();
    });
}

// WebRTC functionality for a real application
function setupWebRTC() {
    // This would be implemented in a real app
    
    // In a real app, you would have:
    // - Local and remote video/audio streams
    // - STUN/TURN servers configuration
    // - Signaling through Firebase
    // - Peer connection setup
    // - Handling of ICE candidates
    
    /*
    // WebRTC variables
    let localStream = null;
    let remoteStream = null;
    let peerConnection = null;
    
    // STUN servers for WebRTC
    const configuration = {
        iceServers: [
            {
                urls: [
                    'stun:stun1.l.google.com:19302',
                    'stun:stun2.l.google.com:19302'
                ]
            }
        ]
    };
    
    // Start local stream
    async function startLocalStream(videoEnabled) {
        try {
            localStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: videoEnabled
            });
            
            // Display in local video element
            const localVideo = document.getElementById('local-video');
            if (localVideo) {
                localVideo.srcObject = localStream;
            }
            
            return localStream;
        } catch (error) {
            console.error('Error starting local stream:', error);
            return null;
        }
    }
    
    // Create peer connection
    function createPeerConnection() {
        peerConnection = new RTCPeerConnection(configuration);
        
        // Add local stream tracks
        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });
        
        // Set up remote stream
        remoteStream = new MediaStream();
        const remoteVideo = document.getElementById('remote-video');
        if (remoteVideo) {
            remoteVideo.srcObject = remoteStream;
        }
        
        // Add remote tracks when they arrive
        peerConnection.ontrack = event => {
            event.streams[0].getTracks().forEach(track => {
                remoteStream.addTrack(track);
            });
        };
        
        // Handle ICE candidates
        peerConnection.onicecandidate = event => {
            if (event.candidate) {
                // Send candidate to peer via Firebase
                const callId = document.getElementById('call-container').dataset.callId;
                db.collection('calls').doc(callId).collection('candidates').add({
                    userId: window.currentUser.id,
                    candidate: event.candidate.toJSON(),
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
        };
        
        return peerConnection;
    }
    
    // Make offer
    async function makeOffer(userId) {
        try {
            // Create call document
            const callData = {
                fromUser: window.currentUser.id,
                toUser: userId,
                status: 'pending',
                type: document.getElementById('video-enabled').checked ? 'video' : 'audio',
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            const callRef = await db.collection('calls').add(callData);
            const callId = callRef.id;
            
            // Store call ID
            document.getElementById('call-container').dataset.callId = callId;
            
            // Create offer
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            
            // Save offer to Firebase
            await db.collection('calls').doc(callId).update({
                offer: {
                    type: offer.type,
                    sdp: offer.sdp
                }
            });
            
            // Listen for answer
            db.collection('calls').doc(callId)
                .onSnapshot(async (snapshot) => {
                    const data = snapshot.data();
                    if (!peerConnection.currentRemoteDescription && data.answer) {
                        const answerDescription = new RTCSessionDescription(data.answer);
                        await peerConnection.setRemoteDescription(answerDescription);
                    }
                });
            
            // Listen for remote ICE candidates
            db.collection('calls').doc(callId).collection('candidates')
                .where('userId', '==', userId)
                .onSnapshot((snapshot) => {
                    snapshot.docChanges().forEach(async (change) => {
                        if (change.type === 'added') {
                            const data = change.doc.data();
                            try {
                                await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
                            } catch (error) {
                                console.error('Error adding ICE candidate:', error);
                            }
                        }
                    });
                });
            
            return callId;
        } catch (error) {
            console.error('Error making offer:', error);
            return null;
        }
    }
    
    // Answer call
    async function answerCall(callId) {
        try {
            // Store call ID
            document.getElementById('call-container').dataset.callId = callId;
            
            // Get call data
            const callDoc = await db.collection('calls').doc(callId).get();
            const callData = callDoc.data();
            
            // Set remote description from offer
            const offerDescription = new RTCSessionDescription(callData.offer);
            await peerConnection.setRemoteDescription(offerDescription);
            
            // Create answer
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            
            // Update call with answer
            await db.collection('calls').doc(callId).update({
                answer: {
                    type: answer.type,
                    sdp: answer.sdp
                },
                status: 'connected'
            });
            
            // Listen for remote ICE candidates
            db.collection('calls').doc(callId).collection('candidates')
                .where('userId', '==', callData.fromUser)
                .onSnapshot((snapshot) => {
                    snapshot.docChanges().forEach(async (change) => {
                        if (change.type === 'added') {
                            const data = change.doc.data();
                            try {
                                await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
                            } catch (error) {
                                console.error('Error adding ICE candidate:', error);
                            }
                        }
                    });
                });
            
            return true;
        } catch (error) {
            console.error('Error answering call:', error);
            return false;
        }
    }
    
    // End call
    async function endCall() {
        // Get call ID
        const callId = document.getElementById('call-container').dataset.callId;
        if (!callId) return false;
        
        try {
            // Update call status
            await db.collection('calls').doc(callId).update({
                status: 'ended',
                endTime: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Close peer connection
            if (peerConnection) {
                peerConnection.close();
                peerConnection = null;
            }
            
            // Stop local stream
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
                localStream = null;
            }
            
            // Reset UI
            document.getElementById('call-container').innerHTML = `
                <div class="text-center">
                    <i class="fas fa-phone-alt fa-5x mb-4 opacity-50"></i>
                    <h2 class="text-xl font-bold mb-2">Start a Call</h2>
                    <p>Select a contact from the left to start a call</p>
                </div>
            `;
            
            return true;
        } catch (error) {
            console.error('Error ending call:', error);
            return false;
        }
    }
    */
}

// Export functions
window.setupCallsEventListeners = setupCallsEventListeners;
window.loadCalls = loadCalls;
window.simulateIncomingCall = simulateIncomingCall;