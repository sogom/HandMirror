const preview = document.getElementById('cameraPreview');

let activeStream = null;
let starting = null;

window.handMirror.onStartCamera(() => {
  startCamera();
});

window.handMirror.onStopCamera(() => {
  stopCamera();
});

async function startCamera() {
  if (activeStream || starting) {
    return starting;
  }

  starting = navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      width: { ideal: 960 },
      height: { ideal: 960 },
      facingMode: 'user'
    }
  })
    .then((stream) => {
      activeStream = stream;
      preview.srcObject = stream;
      return preview.play();
    })
    .catch((error) => {
      window.handMirror.reportCameraError(error.message);
    })
    .finally(() => {
      starting = null;
    });

  return starting;
}

function stopCamera() {
  if (!activeStream) {
    return;
  }

  for (const track of activeStream.getTracks()) {
    track.stop();
  }

  activeStream = null;
  preview.srcObject = null;
}
