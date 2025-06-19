function getOriginLink() {
    const url = document.getElementById('urlInput').value.trim();
    const result = document.getElementById('result');
    const copyButton = document.getElementById('copyButton');

    // Regex kiểm tra URL raw GitHub
    const rawGithubRegex = /^https:\/\/raw\.githubusercontent\.com\/[\w-]+\/[\w-]+\/[\w-]+\/.+$/;
    if (!rawGithubRegex.test(url)) {
        result.innerHTML = 'URL raw GitHub không hợp lệ. Phải bắt đầu bằng https://raw.githubusercontent.com/';
        copyButton.style.display = 'none';
        return;
    }

    try {
        // Chuyển đổi link raw thành link gốc
        const pathParts = url.split('/').slice(3); // Lấy phần sau raw.githubusercontent.com
        const user = pathParts[0];
        const repo = pathParts[1];
        const branch = pathParts[2];
        const filePath = pathParts.slice(3).join('/');
        const originUrl = `https://github.com/${user}/${repo}/blob/${branch}/${filePath}`;

        result.innerHTML = `Link Gốc: <a href="${originUrl}" target="_blank">${originUrl}</a>`;
        copyButton.style.display = 'inline-block';
        copyButton.setAttribute('data-link', originUrl);
    } catch (error) {
        result.innerHTML = 'Có lỗi khi tạo link gốc, vui lòng thử lại';
        copyButton.style.display = 'none';
    }
}

function copyLink() {
    const copyButton = document.getElementById('copyButton');
    const link = copyButton.getAttribute('data-link');
    navigator.clipboard.writeText(link).then(() => {
        alert('Đã copy link!');
    }).catch(error => {
        console.log('Lỗi copy:', error);
    });
}

function clearInput() {
    const urlInput = document.getElementById('urlInput');
    const result = document.getElementById('result');
    const copyButton = document.getElementById('copyButton');

    urlInput.value = '';
    result.innerHTML = '';
    copyButton.style.display = 'none';
}

const music = document.getElementById('backgroundMusic');
const speakerIcon = document.getElementById('speakerIcon');
let isPlaying = false;
let isMuted = false;

function toggleMusic() {
    if (!isPlaying && !isMuted) {
        music.play().then(() => {
            isPlaying = true;
            speakerIcon.textContent = '🔊';
        }).catch(error => {
            console.log('Lỗi phát nhạc:', error);
        });
    }
}

function toggleSpeaker() {
    if (isPlaying) {
        music.pause();
        isPlaying = false;
        isMuted = true;
        speakerIcon.textContent = '🔇';
    } else {
        music.play().then(() => {
            isPlaying = true;
            isMuted = false;
            speakerIcon.textContent = '🔊';
        }).catch(error => {
            console.log('Lỗi phát nhạc:', error);
        });
    }
}

document.addEventListener('mousemove', toggleMusic);
document.addEventListener('touchstart', toggleMusic);
document.addEventListener('touchend', toggleMusic);
document.addEventListener('click', (e) => {
    if (!e.target.closest('.speaker-button')) {
        toggleMusic();
    }
});

// Kiểm tra ảnh nền
window.addEventListener('load', () => {
    const bgImage = new Image();
    bgImage.src = 'https://raw.githubusercontent.com/tongtrankien1605/tongtrankien1605/main/global/image/city-night.jpg';
    bgImage.onload = () => console.log('Ảnh nền tải thành công');
    bgImage.onerror = () => console.log('Lỗi tải ảnh nền, kiểm tra link');
});