// Version control elements
const saveButton = document.getElementById('save-button');
const loadButton = document.getElementById('load-button');
const toggleHistoryButton = document.getElementById('toggle-history');
const historyList = document.getElementById('version-history-list');
const mockupContainer = document.getElementById('mockup-container');
const versionHistoryModal = document.getElementById('version-history-modal');
const modalCloseButtons = document.querySelectorAll('.modal-close');

// デバッグ用：要素が正しく取得できているか確認
console.log('Elements found:', {
    saveButton: !!saveButton,
    loadButton: !!loadButton,
    toggleHistoryButton: !!toggleHistoryButton,
    historyList: !!historyList,
    mockupContainer: !!mockupContainer,
    versionHistoryModal: !!versionHistoryModal,
    modalCloseButtons: modalCloseButtons.length
});

let versions = [];
let saveTimer;

// Load saved versions from localStorage
const storedVersions = localStorage.getItem('mockupVersions');
if (storedVersions) {
    versions = JSON.parse(storedVersions);
    versions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    updateVersionList();
    // デバッグ用：保存されているバージョンの確認
    console.log('Loaded versions:', versions);
}

// Version control functions
function saveMockup() {
    const title = prompt('バージョン名を入力してください (任意):');
    if (title !== null) {  // キャンセルされなかった場合のみ保存
        saveVersion(title);
        alert('モックアップを保存しました。');
        // デバッグ用：保存後のバージョン確認
        console.log('Saved versions:', versions);
    }
}

function loadMockup() {
    const savedVersions = localStorage.getItem('mockupVersions');
    if (savedVersions) {
        const versions = JSON.parse(savedVersions);
        if (versions.length > 0) {
            // 最新のバージョンを読み込む
            mockupContainer.innerHTML = versions[0].html;
            initializeEditableElements();
            alert('保存されたモックアップを読み込みました。');
        } else {
            alert('保存されたバージョンはありません。');
        }
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
    versions.unshift(versionData);  // 新しいバージョンを先頭に追加
    localStorage.setItem('mockupVersions', JSON.stringify(versions));
    updateVersionList();
    // デバッグ用：バージョン保存の確認
    console.log('Version saved:', versionData);
}

function loadVersion(index) {
    if (index >= 0 && index < versions.length) {
        mockupContainer.innerHTML = versions[index].html;
        initializeEditableElements();
        hideVersionHistoryModal();
    }
}

function updateVersionList() {
    if (!historyList) {
        console.error('History list element not found');
        return;
    }
    
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
        
        const restoreButton = document.createElement('button');
        restoreButton.textContent = '復元';
        restoreButton.onclick = () => {
            loadVersion(index);
            saveVersion('(復元) ' + version.title);
            alert('バージョンを復元しました。');
            hideVersionHistoryModal();
        };

        listItem.appendChild(link);
        listItem.appendChild(restoreButton);
        historyList.appendChild(listItem);
    });
    
    // デバッグ用：リスト更新の確認
    console.log('Version list updated with', versions.length, 'items');
}

// Modal control functions
function showVersionHistoryModal() {
    if (!versionHistoryModal) {
        console.error('Version history modal not found');
        return;
    }
    console.log('Showing version history modal');
    versionHistoryModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    updateVersionList();
}

function hideVersionHistoryModal() {
    if (!versionHistoryModal) {
        console.error('Version history modal not found');
        return;
    }
    console.log('Hiding version history modal');
    versionHistoryModal.style.display = 'none';
    document.body.style.overflow = '';
}

// Auto-save functionality
let lastContent = mockupContainer.innerHTML;
mockupContainer.addEventListener('input', () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
        const currentContent = mockupContainer.innerHTML;
        if (currentContent !== lastContent) {
            saveVersion('(自動保存)');
            lastContent = currentContent;
        }
    }, 3000);
});

// Event listeners
toggleHistoryButton.addEventListener('click', () => {
    console.log('History button clicked');
    showVersionHistoryModal();
});

saveButton.addEventListener('click', saveMockup);
loadButton.addEventListener('click', loadMockup);

// Event listeners for modal close buttons
modalCloseButtons.forEach(button => {
    button.addEventListener('click', function() {
        const modal = this.closest('.modal-overlay');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
});

// Close modals when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.style.display = 'none';
        document.body.style.overflow = '';
    }
});

// Close modals with ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = '';
    }
});

// Initialize editable elements after loading version
function initializeEditableElements() {
    if (typeof window.initializeEditableElements === 'function') {
        window.initializeEditableElements();
    }
} 