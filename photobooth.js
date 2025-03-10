// Cek apakah perangkat mobile
const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
if (isMobile) {
    alert("Halaman ini hanya dapat diakses melalui desktop atau laptop. Kamera tidak dapat dibuka.");
    // Nonaktifkan interaksi yang terkait kamera
    const video = document.getElementById("videoElement");
    video.style.display = "none";
    const captureBtn = document.getElementById("captureBtn");
    captureBtn.disabled = true;
    // Jika diinginkan, nonaktifkan elemen lain yang berhubungan dengan kamera
} else {
    // Kode untuk desktop/laptop
    const video = document.getElementById("videoElement");
    const photoCountText = document.getElementById("photoCountText");
    const timerSelect = document.getElementById("timerSelect");
    const effectSelect = document.getElementById("effectSelect");
    const resetAllBtn = document.getElementById("resetAllBtn");
    const captureBtn = document.getElementById("captureBtn");
    const mirrorToggle = document.getElementById("mirrorToggle");
    const backBtn = document.getElementById("backBtn");
    const photoThumbnails = document.getElementById("photoThumbnails");
    const countdownOverlay = document.getElementById("countdownOverlay");
    let maxPhotos = 4;
    let mirrorEnabled = true;
    let selectedTimer = parseInt(timerSelect.value);
    let selectedEffect = effectSelect.value;
    let photoIndex = 1;
    let capturedPhotos = [];

    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;
        })
        .catch((err) => {
            console.error("Error mengakses kamera: " + err);
        });

    timerSelect.addEventListener("change", (e) => {
        selectedTimer = parseInt(e.target.value);
    });

    effectSelect.addEventListener("change", (e) => {
        selectedEffect = e.target.value;
        applyVideoFilter();
    });

    mirrorToggle.addEventListener("change", () => {
        mirrorEnabled = mirrorToggle.checked;
        applyVideoFilter();
    });

    backBtn.addEventListener("click", () => {
        window.location.href = "index.html";
    });

    captureBtn.addEventListener("click", () => {
        captureBtn.disabled = true;
        photoIndex = 1;
        capturedPhotos = [];
        updatePhotoCountText();

        function takeNextPhoto() {
            if (photoIndex > maxPhotos) {
                localStorage.setItem("capturedPhotos", JSON.stringify(capturedPhotos));
                window.location.href = "frame.html";
                return;
            }

            let countdown = selectedTimer;
            countdownOverlay.style.display = "block";
            countdownOverlay.textContent = countdown;

            const interval = setInterval(() => {
                countdown--;
                if (countdown > 0) {
                    countdownOverlay.textContent = countdown;
                } else {
                    clearInterval(interval);
                    countdownOverlay.style.display = "none";

                    capturePhoto();
                    photoIndex++;
                    if (photoIndex <= maxPhotos) {
                        updatePhotoCountText();
                    }
                    takeNextPhoto();
                }
            }, 1000);
        }

        takeNextPhoto();
    });

    resetAllBtn.addEventListener("click", () => {
        photoThumbnails.innerHTML = "";
        capturedPhotos = [];
        photoIndex = 1;
        updatePhotoCountText();
    });

    function applyVideoFilter() {
        let filter = "none";
        switch (selectedEffect) {
            case "sepia":
                filter = "sepia(1)";
                break;
            case "bw":
                filter = "grayscale(1)";
                break;
            case "vintage":
                filter = "contrast(1.2) saturate(0.8)";
                break;
            case "blur":
                filter = "contrast(1.5)";
                break;
            default:
                filter = "none";
        }

        video.style.transform = mirrorEnabled ? "scaleX(-1)" : "none";
        video.style.filter = filter;
    }

    function capturePhoto() {
        const originalWidth = video.videoWidth;
        const originalHeight = video.videoHeight;
        const canvas = document.createElement("canvas");
        canvas.width = originalWidth;
        canvas.height = originalHeight;
        const context = canvas.getContext("2d");
        if (mirrorEnabled) {
            context.translate(canvas.width, 0);
            context.scale(-1, 1);
        }

        context.drawImage(video, 0, 0, originalWidth, originalHeight);
        const dataURL = canvas.toDataURL("image/png");
        capturedPhotos.push(dataURL);
        const img = document.createElement("img");
        img.src = dataURL;
        img.classList.add("thumbnail");
        const wrapper = document.createElement("div");
        wrapper.classList.add("photo-wrapper");
        wrapper.appendChild(img);
        photoThumbnails.appendChild(wrapper);
    }

    function updatePhotoCountText() {
        photoCountText.textContent = `Take Photos (${photoIndex}/${maxPhotos})`;
    }
}
