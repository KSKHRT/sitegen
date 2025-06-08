// Form elements
const formSection = document.getElementById('form-section');
const formContent = document.getElementById('form-content');
const generateButton = document.getElementById('generate-button');
const toggleFormButton = document.getElementById('toggle-form');
const contentDetailsDiv = document.getElementById('content-details');
const contentCheckboxes = document.querySelectorAll('input[name="content"]');
const snsFields = document.getElementById('sns-fields');

let formVisible = true;

// Content checkbox event handlers
contentCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        // SNSリンクのチェックボックス状態に応じてSNSフィールドの表示/非表示を切り替え
        if (checkbox.value === 'SNSリンク') {
            snsFields.style.display = checkbox.checked ? 'block' : 'none';
        }
        
        // コンテンツ詳細テキストエリアの更新
        updateContentDetails();
    });
});

// コンテンツ詳細の更新関数
function updateContentDetails() {
    contentDetailsDiv.innerHTML = '';
    contentCheckboxes.forEach(cb => {
        if (cb.checked && cb.value !== 'SNSリンク') {  // SNSリンク以外のチェックされた項目にテキストエリアを追加
            const label = document.createElement('label');
            label.textContent = `${cb.value}の内容:`;
            const textarea = document.createElement('textarea');
            textarea.name = `${cb.value.replace('/', '_')}_text`;
            textarea.placeholder = `${cb.value}の詳細な内容を入力してください`;
            contentDetailsDiv.appendChild(label);
            contentDetailsDiv.appendChild(textarea);
            contentDetailsDiv.appendChild(document.createElement('br'));
        }
    });
}

// Form toggle functionality
toggleFormButton.addEventListener('click', () => {
    formContent.style.display = formContent.style.display === 'none' ? 'block' : 'none';
    toggleFormButton.textContent = formContent.style.display === 'none' ? '▼' : '▲';
    formVisible = !formVisible;
});

// 初期状態の設定
document.addEventListener('DOMContentLoaded', () => {
    const snsCheckbox = document.querySelector('input[name="content"][value="SNSリンク"]');
    if (snsCheckbox) {
        snsFields.style.display = snsCheckbox.checked ? 'block' : 'none';
    }
    updateContentDetails();
}); 