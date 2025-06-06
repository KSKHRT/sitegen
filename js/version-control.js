// Version control elements
const hamburgerToggle = document.getElementById('hamburger-toggle');
const hamburgerContent = document.getElementById('hamburger-content');
const saveButton = document.getElementById('save-button');
const loadButton = document.getElementById('load-button');
const toggleHistoryButton = document.getElementById('toggle-history');
const versionSidebar = document.getElementById('version-sidebar');
const historyList = document.getElementById('version-history-list');

let versions = [];
let saveTimer;

// Load saved versions from localStorage
const storedVersions = localStorage.getItem('mockupVersions');
if (storedVersions) {
    versions = JSON.parse(storedVersions);
    versions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    updateVersionList();
}

// Hamburger menu functionality
hamburgerToggle.addEventListener('click', () => {
    hamburgerContent.style.display = hamburgerContent.style.display === 'none' ? 'flex' : 'none';
});

// Version control functions
function saveMockup() {
    const title = prompt('バージョン名を入力してください (任意):');
    saveVersion(title);
}

function loadMockup() {
    const savedHTML = localStorage.getItem('mockupHTML');
    if (savedHTML) {
        mockupContainer.innerHTML = savedHTML;
        alert('保存されたモックアップを読み込みました。');
    } else {
        alert('保存されたモックアップはありません。');
    }
}

function saveVersion(title) {
    const timestamp = new Date();
    const versionData = {
        title: title || `v${versions.length + 1}`,
        timestamp: timestamp.toISOString(),
        html: mockupContainer.innerHTML
    };
    versions.push(versionData);
    versions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    localStorage.setItem('mockupVersions', JSON.stringify(versions));
    updateVersionList();
}

function loadVersion(index) {
    if (index >= 0 && index < versions.length) {
        mockupContainer.innerHTML = versions[index].html;
    }
}

function updateVersionList() {
    historyList.innerHTML = '';
    versions.forEach((version, index) => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = `${version.title} (${new Date(version.timestamp).toLocaleString()})`;
        link.onclick = (e) => {
            e.preventDefault();
            loadVersion(index);
        };
        listItem.appendChild(link);

        const restoreButton = document.createElement('button');
        restoreButton.textContent = '復元';
        restoreButton.onclick = () => {
            loadVersion(index);
            saveVersion('(復元) ' + version.title);
        };
        listItem.appendChild(restoreButton);

        historyList.appendChild(listItem);
    });
}

// Auto-save functionality
mockupContainer.addEventListener('input', () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
        saveVersion('(自動保存)');
    }, 3000); // 3秒後に自動保存
});

// Version history toggle
toggleHistoryButton.addEventListener('click', () => {
    const isHidden = versionSidebar.style.display === 'none';
    versionSidebar.style.display = isHidden ? 'block' : 'none';
});

// Event listeners for version control buttons
saveButton.addEventListener('click', saveMockup);
loadButton.addEventListener('click', loadMockup); 