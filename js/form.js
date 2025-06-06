// Form elements
const formSection = document.getElementById('form-section');
const formContent = document.getElementById('form-content');
const generateButton = document.getElementById('generate-button');
const toggleFormButton = document.getElementById('toggle-form');
const contentDetailsDiv = document.getElementById('content-details');
const contentCheckboxes = document.querySelectorAll('input[name="content"]');

let formVisible = true;

// Content checkbox event handlers
contentCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        contentDetailsDiv.innerHTML = '';
        contentCheckboxes.forEach(cb => {
            if (cb.checked) {
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
    });
});

// Form toggle functionality
toggleFormButton.addEventListener('click', () => {
    formContent.style.display = formContent.style.display === 'none' ? 'block' : 'none';
    toggleFormButton.textContent = formContent.style.display === 'none' ? '▼' : '▲';
    formVisible = !formVisible;
}); 