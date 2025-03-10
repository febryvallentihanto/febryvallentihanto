const photos = JSON.parse(localStorage.getItem("capturedPhotos") || "[]");
const photosWrapper = document.getElementById("photosWrapper");
const frameContainer = document.getElementById("frameContainer");
const downloadBtn = document.getElementById("downloadBtn");
photos.slice(0, 4).forEach((src) => {
    const img = document.createElement("img");
    img.src = src;
    photosWrapper.appendChild(img);
});

document.querySelectorAll(".color-swatch").forEach((swatch) => {
    swatch.addEventListener("click", () => {
        const color = swatch.getAttribute("data-color");
        frameContainer.style.backgroundColor = color;
        frameContainer.style.backgroundImage = "none"; 
    });
});

document.querySelectorAll(".texture-swatch").forEach((swatch) => {
    swatch.addEventListener("click", () => {
        const textureUrl = swatch.getAttribute("data-texture");
        // Terapkan background texture
        frameContainer.style.backgroundImage = `url('${textureUrl}')`;
        frameContainer.style.backgroundSize = "cover";
        frameContainer.style.backgroundPosition = "center";
        frameContainer.style.backgroundRepeat = "no-repeat";
        frameContainer.style.backgroundColor = "transparent";
    });
});

downloadBtn.addEventListener("click", () => {
    html2canvas(frameContainer).then((canvas) => {
        const link = document.createElement("a");
        link.download = "my-frame.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
});
