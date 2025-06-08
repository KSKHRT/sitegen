const mockupContainer = document.getElementById('mockup-container');
const fontSelector = document.getElementById('font-selector');
const previewModal = document.getElementById('preview-modal');
const modalClose = document.querySelector('.modal-close');
const showPreviewButton = document.getElementById('show-preview');
let currentlyEditing = null;
let activeElementForFontChange = null;

// フォントセレクターのイベントリスナー
fontSelector.addEventListener('change', function() {
    mockupContainer.style.fontFamily = this.value;
});

// モーダル制御の関数
function showModal() {
    console.log('Showing modal');
    console.log('Modal element:', previewModal);
    if (!previewModal) {
        console.error('Modal element not found!');
        return;
    }
    previewModal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // スクロール防止
    
    // フォントセレクターの初期値を設定し、適用
    if (fontSelector.value) {
        mockupContainer.style.fontFamily = fontSelector.value;
    } else {
        fontSelector.value = "'Noto Sans JP', sans-serif";
        mockupContainer.style.fontFamily = fontSelector.value;
    }
    
    console.log('Modal displayed');
}

function hideModal() {
    console.log('Hiding modal');
    if (!previewModal) {
        console.error('Modal element not found!');
        return;
    }
    previewModal.style.display = 'none';
    document.body.style.overflow = ''; // スクロール再開
    console.log('Modal hidden');
}

// モーダルの外側をクリックした時に閉じる
previewModal.addEventListener('click', (e) => {
    if (e.target === previewModal) {
        hideModal();
    }
});

// 閉じるボタンのイベントリスナー
modalClose.addEventListener('click', hideModal);

// プレビュー表示ボタンのイベントリスナー
showPreviewButton.addEventListener('click', () => {
    generateMockup();
});

// ESCキーでモーダルを閉じる
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && previewModal.style.display === 'flex') {
        hideModal();
    }
});

function generateMockup() {
    console.log('generateMockup started');
    const industry = document.getElementById('industry').value;
    const purpose = document.getElementById('purpose').value;
    const color = document.getElementById('color').value;
    const catchphrase = document.getElementById('catchphrase').value;
    const businessName = document.getElementById('business-name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const weekdayHours = document.getElementById('weekday-hours').value;
    const weekendHours = document.getElementById('weekend-hours').value;
    const holiday = document.getElementById('holiday').value;
    const postalCode = document.getElementById('postal-code').value;
    const address = document.getElementById('address').value;
    const metaDescription = document.getElementById('meta-description').value;
    const facebook = document.getElementById('facebook').value;
    const instagram = document.getElementById('instagram').value;
    const twitter = document.getElementById('twitter').value;
    const line = document.getElementById('line').value;
    const payments = Array.from(document.querySelectorAll('input[name="payment"]:checked')).map(cb => cb.value);
    const selectedContents = Array.from(document.querySelectorAll('input[name="content"]:checked')).map(cb => cb.value);
    const contentTexts = {};
    
    console.log('Form values collected:', {
        industry,
        purpose,
        color,
        catchphrase,
        businessName,
        selectedContents
    });
    
    if (!industry || !purpose || !color || !catchphrase || !businessName) {
        alert('必須項目（業種、目的、カラーテーマ、キャッチフレーズ、事業者名）を入力してください');
        return;
    }

    selectedContents.forEach(content => {
        const textarea = document.querySelector(`textarea[name="${content.replace('/', '_')}_text"]`);
        if (textarea) {
            contentTexts[content] = textarea.value;
        }
    });

    console.log('Content texts collected:', contentTexts);

    document.documentElement.style.setProperty('--theme-color', color);
    const darkColor = adjustColor(color, -20);
    document.documentElement.style.setProperty('--theme-color-dark', darkColor);

    console.log('Generating HTML sections');
    let mockupHTML = generateHeader(color, selectedContents, businessName);
    mockupHTML += generateHero(catchphrase);

    selectedContents.forEach(content => {
        switch(content) {
            case '店舗紹介':
                mockupHTML += generateStoreSection(contentTexts[content], businessName, weekdayHours, weekendHours, holiday, payments);
                break;
            case 'メニュー/商品紹介':
                mockupHTML += generateMenuSection(contentTexts[content]);
                break;
            case 'お知らせ':
                mockupHTML += generateNewsSection(contentTexts[content]);
                break;
            case 'アクセス':
                mockupHTML += generateAccessSection(contentTexts[content], address, postalCode, phone, email);
                break;
            case '問い合わせ':
                mockupHTML += generateContactSection(contentTexts[content], phone, email);
                break;
        }
    });

    // フッターは常に生成
    mockupHTML += generateFooter(color, businessName, address, phone, email, facebook, instagram, twitter, line);

    console.log('Setting mockup HTML');
    mockupContainer.innerHTML = mockupHTML;
    console.log('Initializing editable elements');
    initializeEditableElements();
    console.log('Showing modal');
    showModal();
    console.log('generateMockup completed');
}

// カラーを調整する関数
function adjustColor(hex, percent) {
    // hexをRGBに変換
    let r = parseInt(hex.substring(1,3), 16);
    let g = parseInt(hex.substring(3,5), 16);
    let b = parseInt(hex.substring(5,7), 16);

    // 明るさを調整
    r = Math.max(0, Math.min(255, r + (r * percent / 100)));
    g = Math.max(0, Math.min(255, g + (g * percent / 100)));
    b = Math.max(0, Math.min(255, b + (b * percent / 100)));

    // RGBを16進数に戻す
    const toHex = (n) => {
        const hex = Math.round(n).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Mockup section generators
function generateHeader(color, selectedContents, businessName) {
    console.log('Generating header with:', { color, selectedContents, businessName });
    const navItems = selectedContents.map(content => {
        const id = content === 'メニュー/商品紹介' ? 'メニュー-商品紹介' : content;
        return `<a href="#${id}" class="nav-item">${content}</a>`;
    }).join('');

    // 業種に基づいてデフォルトロゴを選択
    const industry = document.getElementById('industry').value;
    const defaultLogo = getDefaultLogo(industry);

    return `
        <div class="header">
            <div class="header-content">
                <div class="logo-container">
                    <div class="logo">
                        <img src="${defaultLogo}" alt="${businessName}" class="editable-image logo-image">
                        <div contenteditable="true" class="editable-text logo-text" style="display: none;">${businessName}</div>
                        <button class="change-image-btn logo-upload-btn">ロゴ画像を変更</button>
                    </div>
                </div>
                <nav>${navItems}</nav>
            </div>
        </div>
    `;
}

// 業種に基づいてデフォルトロゴを返す関数
function getDefaultLogo(industry) {
    const logos = {
        'restaurant': 'images/defaults/logo-restaurant.svg',
        'retail': 'images/defaults/logo-retail.svg',
        'beauty': 'images/defaults/logo-beauty.svg',
        'medical': 'images/defaults/logo-medical.svg',
        'education': 'images/defaults/logo-education.svg',
        'realestate': 'images/defaults/logo-realestate.svg',
        'construction': 'images/defaults/logo-construction.svg',
        'fitness': 'images/defaults/logo-fitness.svg',
        'professional': 'images/defaults/logo-professional.svg',
        'other': 'images/defaults/logo-default.svg'
    };
    return logos[industry] || logos.other;
}

function generateHero(catchphrase) {
    return `
        <div class="hero">
            <div class="image-container">
                <img src="images/defaults/hero.jpeg" alt="ヒーロー画像" class="editable-image" data-image-type="hero">
                <button class="change-image-btn">画像を変更</button>
            </div>
            <h2 contenteditable="true" class="editable-text">${catchphrase}</h2>
        </div>
    `;
}

function generateStoreSection(content, businessName, weekdayHours, weekendHours, holiday, payments) {
    const paymentMethods = {
        'cash': '現金',
        'credit-card': 'クレジットカード',
        'electronic-money': '電子マネー',
        'qr-code': 'QRコード決済'
    };

    return `
        <div id="店舗紹介" class="section">
            <h3 contenteditable="true" class="editable-text">店舗紹介</h3>
            <div class="image-container">
                <img src="images/defaults/store.jpeg" alt="店舗画像" class="editable-image" data-image-type="store">
                <button class="change-image-btn">画像を変更</button>
            </div>
            <div contenteditable="true" class="editable-text content-block">${content || `${businessName}へようこそ。`}</div>
            <div class="business-info">
                <h4 contenteditable="true" class="editable-text">営業時間</h4>
                <p contenteditable="true" class="editable-text">平日: ${weekdayHours || '9:00-18:00'}</p>
                <p contenteditable="true" class="editable-text">土日祝: ${weekendHours || '10:00-17:00'}</p>
                <p contenteditable="true" class="editable-text">定休日: ${holiday || '水曜日'}</p>
                ${payments.length > 0 ? `
                    <h4 contenteditable="true" class="editable-text">お支払い方法</h4>
                    <p contenteditable="true" class="editable-text">${payments.map(p => paymentMethods[p]).join('・')}</p>
                ` : ''}
            </div>
        </div>
    `;
}

function generateMenuSection(content) {
    const menuItems = [
        {
            name: '商品A',
            price: '1,000円',
            description: '商品の説明文がここに入ります。',
            image: 'images/defaults/product1.jpeg'
        },
        {
            name: '商品B',
            price: '2,000円',
            description: '商品の説明文がここに入ります。',
            image: 'images/defaults/product2.jpeg'
        },
        {
            name: '商品C',
            price: '1,500円',
            description: '商品の説明文がここに入ります。',
            image: 'images/defaults/product3.jpeg'
        }
    ];

    return `
        <div id="メニュー-商品紹介" class="section">
            <h3 contenteditable="true" class="editable-text">メニュー/商品紹介</h3>
            <div contenteditable="true" class="editable-text content-block">${content || 'お薦めの商品をご紹介します。'}</div>
            <div class="menu-grid">
                ${menuItems.map(item => `
                    <div class="menu-item">
                        <button class="delete-btn" title="削除">×</button>
                        <div class="menu-item-image">
                            <img src="${item.image}" alt="${item.name}" class="editable-image" data-image-type="menu">
                            <button class="change-image-btn menu-image">画像を変更</button>
                        </div>
                        <div class="menu-item-content">
                            <h4 contenteditable="true" class="editable-text menu-item-name">${item.name}</h4>
                            <div contenteditable="true" class="editable-text menu-item-price">${item.price}</div>
                            <div contenteditable="true" class="editable-text menu-item-description">${item.description}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button class="add-menu-item-btn">商品を追加</button>
        </div>
    `;
}

function generateNewsSection(content) {
    return `
        <div id="お知らせ" class="section">
            <h3 contenteditable="true" class="editable-text">お知らせ</h3>
            <div contenteditable="true" class="editable-text content-block">${content || 'ここにお知らせが入ります。'}</div>
            <ul class="news-list">
                <li contenteditable="true" class="editable-text">
                    <button class="delete-btn" title="削除">×</button>
                    2023年X月X日：新しいサービスを開始しました。
                </li>
            </ul>
            <button class="add-news-btn">お知らせを追加</button>
        </div>
    `;
}

function generateAccessSection(content, address, postalCode, phone, email) {
    return `
        <div id="アクセス" class="section">
            <h3 contenteditable="true" class="editable-text">アクセス</h3>
            <div contenteditable="true" class="editable-text content-block">
                <p>〒${postalCode || '000-0000'}</p>
                <p>${address || '住所が設定されていません'}</p>
                ${phone ? `<p>TEL: ${phone}</p>` : ''}
                ${email ? `<p>Email: ${email}</p>` : ''}
                ${content ? `<p>${content}</p>` : ''}
            </div>
            <div class="map-container">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.745777342719!2d139.5362846152564!3d35.3354288802035!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6018578a5769c995%3A0x994c38314c11505c!2z5rWc5Y2X6aeF!5e0!3m2!1sja!2sjp!4v1682345678901!5m2!1sja!2sjp" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
                <button class="change-map-btn">地図を変更</button>
            </div>
        </div>
    `;
}

function generateContactSection(content, phone, email) {
    return `
        <div id="問い合わせ" class="section">
            <h3 contenteditable="true" class="editable-text">問い合わせ</h3>
            <div contenteditable="true" class="editable-text content-block">${content || 'お問い合わせはこちらから'}</div>
            <form class="contact-form">
                <div class="form-field">
                    <label contenteditable="true" class="editable-text">お名前:</label>
                    <input type="text" placeholder="お名前を入力">
                </div>
                <div class="form-field">
                    <label contenteditable="true" class="editable-text">メールアドレス:</label>
                    <input type="email" placeholder="メールアドレスを入力">
                </div>
                <div class="form-field">
                    <label contenteditable="true" class="editable-text">お問い合わせ内容:</label>
                    <textarea placeholder="お問い合わせ内容を入力"></textarea>
                </div>
                <button type="submit">送信</button>
            </form>
            <div class="contact-info">
                ${phone ? `<p contenteditable="true" class="editable-text">TEL: ${phone}</p>` : ''}
                ${email ? `<p contenteditable="true" class="editable-text">Email: ${email}</p>` : ''}
            </div>
        </div>
    `;
}

function generateFooter(color, businessName, address, phone, email, facebook, instagram, twitter, line) {
    let snsLinks = '';
    
    if (facebook) {
        const accountName = facebook.split('/').pop();
        snsLinks += `<a href="${facebook}" target="_blank">@${accountName}</a>`;
    }
    if (instagram) {
        const accountName = instagram.split('/').pop();
        snsLinks += `<a href="${instagram}" target="_blank">@${accountName}</a>`;
    }
    if (twitter) {
        const accountName = twitter.split('/').pop();
        snsLinks += `<a href="${twitter}" target="_blank">@${accountName}</a>`;
    }
    if (line) {
        const accountName = line.split('/').pop();
        snsLinks += `<a href="${line}" target="_blank">@${accountName}</a>`;
    }

    return `
        <div class="footer">
            <div class="footer-content">
                <div class="footer-info">
                    <div class="footer-brand">
                        <h3 contenteditable="true" class="editable-text">${businessName}</h3>
                    </div>
                    <div class="footer-contact">
                        ${address ? `<p contenteditable="true" class="editable-text">〒${address}</p>` : ''}
                        ${phone ? `<p contenteditable="true" class="editable-text">TEL: ${phone}</p>` : ''}
                        ${email ? `<p contenteditable="true" class="editable-text">Email: ${email}</p>` : ''}
                    </div>
                </div>
                ${snsLinks ? `
                    <div class="sns-links">
                        ${snsLinks}
                    </div>
                ` : ''}
                <div class="footer-copyright">
                    <p contenteditable="true" class="editable-text">© ${new Date().getFullYear()} ${businessName}</p>
                </div>
            </div>
        </div>
    `;
}

// 編集機能の初期化
function initializeEditableElements() {
    const editableElements = document.querySelectorAll('.editable-text');
    const logoImage = document.querySelector('.logo-image');
    const logoContainer = document.querySelector('.logo-container');
    const logoUploadBtn = document.querySelector('.logo-upload-btn');

    editableElements.forEach(element => {
        element.addEventListener('click', function() {
            if (!this.isContentEditable) {
                this.contentEditable = true;
                this.classList.add('editing');
                this.focus();
            }
        });

        element.addEventListener('blur', function() {
            this.contentEditable = false;
            this.classList.remove('editing');
        });

        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.blur();
            }
        });
    });

    // 画像変更ボタンのイベントリスナー
    document.querySelectorAll('.change-image-btn').forEach(button => {
        // 既存のイベントリスナーを削除
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        newButton.addEventListener('click', () => {
            const image = newButton.parentElement.querySelector('img');
            const newUrl = prompt('新しい画像のURLを入力してください:');
            if (newUrl && newUrl.trim()) {
                image.src = newUrl.trim();
            }
        });
    });

    // 商品追加ボタンのイベントリスナー
    document.querySelectorAll('.add-menu-item-btn').forEach(button => {
        // 既存のイベントリスナーを削除
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        newButton.addEventListener('click', () => {
            const menuGrid = newButton.previousElementSibling;
            const newMenuItem = document.createElement('div');
            newMenuItem.className = 'menu-item';
            newMenuItem.innerHTML = `
                <button class="delete-btn" title="削除">×</button>
                <div class="menu-item-image">
                    <img src="images/defaults/product1.jpeg" alt="新商品" class="editable-image" data-image-type="menu">
                    <button class="change-image-btn menu-image">画像を変更</button>
                </div>
                <div class="menu-item-content">
                    <h4 contenteditable="true" class="editable-text menu-item-name">新商品</h4>
                    <div contenteditable="true" class="editable-text menu-item-price">1,000円</div>
                    <div contenteditable="true" class="editable-text menu-item-description">商品の説明文がここに入ります。</div>
                </div>
            `;
            menuGrid.appendChild(newMenuItem);
            initializeEditableElements();
        });
    });

    // お知らせ追加ボタンのイベントリスナー
    document.querySelectorAll('.add-news-btn').forEach(button => {
        // 既存のイベントリスナーを削除
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        newButton.addEventListener('click', () => {
            const newsList = newButton.previousElementSibling;
            const newItem = document.createElement('li');
            newItem.className = 'editable-text';
            newItem.contentEditable = true;
            newItem.innerHTML = `
                <button class="delete-btn" title="削除">×</button>
                新しいお知らせ
            `;
            newsList.appendChild(newItem);
            initializeEditableElements();
        });
    });

    // 削除ボタンのイベントリスナー
    document.querySelectorAll('.delete-btn').forEach(button => {
        // 既存のイベントリスナーを削除
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        newButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            const item = event.target.closest('.menu-item, li');
            if (item && confirm('本当に削除しますか？')) {
                item.remove();
            }
        });
    });

    // Logo image handling
    if (logoUploadBtn) {
        logoUploadBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        logoImage.src = e.target.result;
                        logoImage.dataset.isCustom = 'true';
                        logoUploadBtn.textContent = 'ロゴ画像を変更';
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        });
    }

    // Add reset logo option
    if (logoContainer) {
        const resetLogoBtn = document.createElement('button');
        resetLogoBtn.className = 'reset-logo-btn';
        resetLogoBtn.textContent = '↺';
        resetLogoBtn.title = 'デフォルトロゴに戻す';
        resetLogoBtn.style.display = 'none';
        logoContainer.appendChild(resetLogoBtn);

        resetLogoBtn.addEventListener('click', () => {
            const industry = document.getElementById('industry').value;
            const defaultLogo = getDefaultLogo(industry);
            logoImage.src = defaultLogo;
            logoImage.dataset.isCustom = 'false';
            resetLogoBtn.style.display = 'none';
        });

        // Show/hide reset button when custom logo is used
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'src' || mutation.attributeName === 'data-is-custom')) {
                    resetLogoBtn.style.display = logoImage.dataset.isCustom === 'true' ? 'block' : 'none';
                }
            });
        });

        observer.observe(logoImage, { attributes: true });
    }
}

// SNSリンクのチェックボックス制御
function initializeSNSControls() {
    const snsCheckbox = document.querySelector('input[name="content"][value="SNSリンク"]');
    const snsFields = document.getElementById('sns-fields');
    
    if (snsCheckbox && snsFields) {
        // 初期状態の設定
        snsFields.style.display = snsCheckbox.checked ? 'block' : 'none';
        
        // チェックボックスの状態変更時の処理
        snsCheckbox.addEventListener('change', function() {
            snsFields.style.display = this.checked ? 'block' : 'none';
        });
    }
}

// DOMContentLoadedイベントリスナーを追加
document.addEventListener('DOMContentLoaded', function() {
    initializeSNSControls();
    
    // コンテンツチェックボックスの変更イベント
    const contentCheckboxes = document.querySelectorAll('input[name="content"]');
    contentCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const contentId = this.value.replace('/', '_') + '_text';
            const contentField = document.getElementById(contentId);
            if (contentField) {
                contentField.closest('.form-group').style.display = this.checked ? 'block' : 'none';
            }
            
            // SNSリンクの場合は特別な処理
            if (this.value === 'SNSリンク') {
                const snsFields = document.getElementById('sns-fields');
                if (snsFields) {
                    snsFields.style.display = this.checked ? 'block' : 'none';
                }
            }
        });
        
        // 初期状態の設定
        checkbox.dispatchEvent(new Event('change'));
    });
}); 