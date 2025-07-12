// Khởi tạo trạng thái của nhạc nền
const music = document.getElementById('backgroundMusic');
const speakerIcon = document.getElementById('speakerIcon');
let isPlaying = false;
let isMuted = false;

function getOriginLink() {
    const url = document.getElementById('urlInput').value.trim();
    const result = document.getElementById('result');
    const copyButton = document.getElementById('copyButton');

    // Regex cho link raw GitHub
    const rawGithubRegex = /^https:\/\/raw\.githubusercontent\.com\/([^\/]+)\/([^\/]+)\/([^\/]+)\/(.+)$/;
    // Regex cho link CDN jsDelivr (sửa để bắt buộc @branch)
    const cdnJsDelivrRegex = /^https:\/\/cdn\.jsdelivr\.net\/gh\/([^\/]+)\/([^\/]+)@([^\/]+)\/(.+)$/;

    let user, repo, branch, path, originUrl;

    // Kiểm tra link raw GitHub
    const rawMatch = url.match(rawGithubRegex);
    // Kiểm tra link CDN jsDelivr
    const cdnMatch = url.match(cdnJsDelivrRegex);

    if (rawMatch) {
        user = rawMatch[1];
        repo = rawMatch[2];
        branch = rawMatch[3];
        path = rawMatch[4];
    } else if (cdnMatch) {
        user = cdnMatch[1];
        repo = cdnMatch[2];
        branch = cdnMatch[3]; // Nhánh từ @branch
        path = cdnMatch[4];
    } else {
        result.innerHTML = 'URL không hợp lệ. Phải là link raw GitHub hoặc CDN jsDelivr với @branch.';
        copyButton.style.display = 'none';
        return;
    }

    try {
        // Tạo link base GitHub
        originUrl = `https://github.com/${user}/${repo}/blob/${branch}/${path}`;
        result.innerHTML = `Link Gốc: <a href="${originUrl}" target="_blank">${originUrl}</a>`;
        copyButton.style.display = 'inline-block';
        copyButton.setAttribute('data-link', originUrl);
    } catch (error) {
        result.innerHTML = 'Có lỗi khi tạo link gốc, vui lòng thử lại.';
        copyButton.style.display = 'none';
    }
}

// Xóa nội dung ô nhập
function clearInput() {
    const urlInput = document.getElementById('urlInput');
    const result = document.getElementById('result');
    const copyButton = document.getElementById('copyButton');

    urlInput.value = '';
    result.innerHTML = '';
    copyButton.style.display = 'none';
}

// Sao chép link
function copyLink() {
    const copyButton = document.getElementById('copyButton');
    const link = copyButton.getAttribute('data-link');
    navigator.clipboard.writeText(link).then(() => {
        alert('Đã copy link!');
    }).catch(error => {
        console.log('Lỗi copy:', error);
    });
}

// Dán từ clipboard
async function pasteFromClipboard() {
    try {
        const text = await navigator.clipboard.readText();
        document.getElementById('urlInput').value = text;
        document.getElementById('result').innerHTML = '';
        document.getElementById('copyButton').style.display = 'none';
        // alert('Đã dán URL!');
    } catch (error) {
        console.log('Lỗi dán từ clipboard:', error);
        alert('Không thể dán từ clipboard. Vui lòng dán thủ công.');
    }
}

// Điều khiển nhạc nền khi tương tác
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

// Điều khiển nút loa
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

// Sự kiện tương tác để phát nhạc
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
    bgImage.src = 'https://cdn.jsdelivr.net/gh/tongtrankien1605/tongtrankien1605@main/global/image/city-night.jpg';
    bgImage.onload = () => console.log('Ảnh nền tải thành công');
    bgImage.onerror = () => console.log('Lỗi tải ảnh nền, kiểm tra link');
    // Ẩn nút dán nếu clipboard API không được hỗ trợ
    if (!navigator.clipboard || !navigator.clipboard.readText) {
        document.querySelector('.paste-button').style.display = 'none';
    }
});