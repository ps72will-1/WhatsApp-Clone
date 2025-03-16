// Calls Module
const Calls = (function() {
    // Private variables
    let callActive = false;
    let callType = null;
    let callTimer = null;
    let callDuration = 0;
    let peerConnection = null;
    let localStream = null;
    let remoteStream = null;
    
    // DOM Elements
    const callAudioBtn = document.getElementById('call-audio-btn');
    const callVideoBtn = document.getElementById('call-video-btn');
    const callScreen = document.getElementById('call-screen');
    const callUserAvatar = document.getElementById('call-user-avatar');
    const callUserName = document.getElementById('call-user-name');
    const callStatus = document.getElementById('call-status');
    const callDurationElem = document.getElementById('call-duration');
    const toggleSpeaker = document.getElementById('toggle-speaker');
    const toggleMicCall = document.getElementById('toggle-mic-call');
    const toggleVideoCall = document.getElementById('toggle-video-call');
    const endCallBtn = document.getElementById('end-call');
    const callVideoContainer = document.getElementById('call-video-container');
    const localVideo = document.getElementById('local-video');
    const remoteVideo = document.getElementById('remote-video');
    
    // Initialize event listeners
    function init() {
        callAudioBtn.addEventListener('click', () => startCall('audio'));
        callVideoBtn.addEventListener('click', () => startCall('video'));
        endCallBtn.addEventListener('click', endCurrentCall);
        toggleMicCall.addEventListener('click', toggleCallMicrophone);
        toggleVideoCall.addEventListener('click', toggleCallVideo);
        toggleSpeaker.addEventListener('click', toggleCallSpeaker);
    }
    
    // Start a call
    function startCall(type) {
        const currentChat = Chat.getCurrentChat();
        if (!currentChat) return;
        
        callType = type;
        callActive = true;
        
        // Show call screen
        callScreen.classList.remove('hidden');
        
        // Set call details based on current chat
        const chatData = {
            chat1: {
                name: 'Lisa Johnson',
                avatar: 'https://i.imgur.com/9qkfQfH.png'
            },
            chat2: {
                name: 'Mike Smith',
                avatar: 'https://i.imgur.com/Jt1blLU.png'
            },
            chat3: {
                name: 'Sarah Wilson',
                avatar: 'https://i.imgur.com/bxf3qYO.png'
            }
        };
        
        const chat = chatData[currentChat];
        if (chat) {
            callUserName.textContent = chat.name;
            
            // Set avatar
            if (chat.avatar) {
                callUserAvatar.innerHTML = `<img src="${chat.avatar}" alt="${chat.name}" class="w-full h-full object-cover">`;
            } else {
                callUserAvatar.innerHTML = `<i class="fas fa-user"></i>`;
            }
        }
        
        // Set up call based on type
        if (type === 'audio') {
            toggleVideoCall.classList.add('hidden');
            callVideoContainer.classList.add('hidden');
            // Audio call setup
            setupMediaCall(false);
        } else {
            toggleVideoCall.classList.remove('hidden');
            callVideoContainer.classList.remove('hidden');
            // Video call setup
            setupMediaCall(true);
        }
        
        // Simulate call connecting
        setTimeout(() => {
            callStatus.textContent = 'Connected';
            callDurationElem.classList.remove('hidden');
            
            // Start call timer
            callDuration = 0;
            callTimer = setInterval(() => {
                callDuration++;
                const minutes = Math.floor(callDuration / 60).toString().padStart(2, '0');
                const seconds = (callDuration % 60).toString().padStart(2, '0');
                callDurationElem.textContent = `${minutes}:${seconds}`;
            }, 1000);
        }, 2000);
    }
    
    // End the current call
    function endCurrentCall() {
        // Stop timer
        if (callTimer) {
            clearInterval(callTimer);
            callTimer = null;
        }
        
        // Stop media streams
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            localStream = null;
        }
        
        // Close WebRTC connection
        if (peerConnection) {
            peerConnection.close();
            peerConnection = null;
        }
        
        // Reset call state
        callActive = false;
        callType = null;
        callDuration = 0;
        
        // Hide call screen
        callScreen.classList.add('hidden');
        
        // Reset call UI
        callStatus.textContent = 'Calling...';
        callDurationElem.classList.add('hidden');
        callDurationElem.textContent = '00:00';
        toggleVideoCall.classList.remove('camera-off');
        toggleMicCall.classList.remove('muted');
        toggleSpeaker.classList.remove('active');
    }
    
    // Setup media for call
    async function setupMediaCall(isVideo) {
        try {
            // Get user media
            const constraints = {
                audio: true,
                video: isVideo
            };
            
            localStream = await navigator.mediaDevices.getUserMedia(constraints);
            
            // Show local video if this is a video call
            if (isVideo) {
                localVideo.srcObject = localStream;
            }
            
            // In a real app, we would set up WebRTC connection here
            // For demo purposes, we'll simulate a connection
            
            if (isVideo) {
                // Simulate remote video after a delay
                setTimeout(() => {
                    // For demo, we'll just mirror the local stream as the remote stream
                    remoteVideo.srcObject = localStream;
                }, 2000);
            }
        } catch (err) {
            console.error('Error accessing media devices:', err);
            Utilities.showToast('Failed to access camera/microphone', 'error');
            endCurrentCall();
        }
    }
    
    // Toggle microphone
    function toggleCallMicrophone() {
        if (!localStream) return;
        
        const audioTracks = localStream.getAudioTracks();
        if (audioTracks.length === 0) return;
        
        const enabled = !audioTracks[0].enabled;
        audioTracks[0].enabled = enabled;
        
        // Update UI
        if (enabled) {
            toggleMicCall.classList.remove('muted');
            toggleMicCall.style.backgroundColor = '#555';
            toggleMicCall.innerHTML = '<i class="fas fa-microphone"></i>';
        } else {
            toggleMicCall.classList.add('muted');
            toggleMicCall.style.backgroundColor = '#FF4B4B';
            toggleMicCall.innerHTML = '<i class="fas fa-microphone-slash"></i>';
        }
    }
    
    // Toggle video
    function toggleCallVideo() {
        if (!localStream || callType !== 'video') return;
        
        const videoTracks = localStream.getVideoTracks();
        if (videoTracks.length === 0) return;
        
        const enabled = !videoTracks[0].enabled;
        videoTracks[0].enabled = enabled;
        
        // Update UI
        if (enabled) {
            toggleVideoCall.classList.remove('camera-off');
            toggleVideoCall.style.backgroundColor = '#555';
            toggleVideoCall.innerHTML = '<i class="fas fa-video"></i>';
        } else {
            toggleVideoCall.classList.add('camera-off');
            toggleVideoCall.style.backgroundColor = '#FF4B4B';
            toggleVideoCall.innerHTML = '<i class="fas fa-video-slash"></i>';
        }
    }
    
    // Toggle speaker
    function toggleCallSpeaker() {
        // In a real app, this would toggle between earpiece and speakerphone
        // For demo purposes, we'll just toggle the button state
        toggleSpeaker.classList.toggle('active');
        
        if (toggleSpeaker.classList.contains('active')) {
            toggleSpeaker.style.backgroundColor = '#22C55E';
        } else {
            toggleSpeaker.style.backgroundColor = '#555';
        }
        
        Utilities.showToast('Speaker ' + (toggleSpeaker.classList.contains('active') ? 'on' : 'off'), 'info');
    }
    
    // Public API
    return {
        init,
        startCall,
        endCurrentCall
    };
})();

// Initialize Calls module when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // This will be called from app.js to avoid initialization order issues
});