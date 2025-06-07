const mockupContainer = document.getElementById('mockup-container');
const fontSelector = document.getElementById('font-selector');
const previewModal = document.getElementById('preview-modal');
const modalClose = document.querySelector('.modal-close');
const showPreviewButton = document.getElementById('show-preview');
let currentlyEditing = null;
let activeElementForFontChange = null;

// モーダル制御の関数
function showModal() {
    previewModal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // スクロール防止
}

function hideModal() {
    previewModal.style.display = 'none';
    document.body.style.overflow = ''; // スクロール再開
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
showPreviewButton.addEventListener('click', showModal);

// ESCキーでモーダルを閉じる
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && previewModal.style.display === 'flex') {
        hideModal();
    }
});

function generateMockup() {
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

    document.documentElement.style.setProperty('--theme-color', color);
    const darkColor = adjustColor(color, -20);
    document.documentElement.style.setProperty('--theme-color-dark', darkColor);

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
            case 'SNSリンク':
                mockupHTML += generateFooter(color, facebook, instagram, twitter, line);
                break;
        }
    });

    mockupContainer.innerHTML = mockupHTML;
    initializeEditableElements();
    showModal();
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
    return `
        <div class="header">
            <div class="header-content">
                <h1 contenteditable="true" class="editable-text">${businessName}</h1>
                <nav>
                    ${selectedContents.map(content => `<a href="#${content.replace('/', '-')}">${content}</a>`).join('')}
                </nav>
            </div>
        </div>
    `;
}

function generateHero(catchphrase) {
    return `
        <div class="hero">
            <div class="image-container">
                <img src="https://via.placeholder.com/800x300?text=Hero+Image" alt="ヒーロー画像" class="editable-image" data-image-type="hero">
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
                <img src="https://via.placeholder.com/300x200?text=Store+Image" alt="店舗画像" class="editable-image" data-image-type="store">
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
            image: 'https://via.placeholder.com/300x225?text=Product+A'
        },
        {
            name: '商品B',
            price: '2,000円',
            description: '商品の説明文がここに入ります。',
            image: 'https://via.placeholder.com/300x225?text=Product+B'
        },
        {
            name: '商品C',
            price: '1,500円',
            description: '商品の説明文がここに入ります。',
            image: 'https://via.placeholder.com/300x225?text=Product+C'
        }
    ];

    return `
        <div id="メニュー-商品紹介" class="section">
            <h3 contenteditable="true" class="editable-text">メニュー/商品紹介</h3>
            <div contenteditable="true" class="editable-text content-block">${content || 'お薦めの商品をご紹介します。'}</div>
            <div class="menu-grid">
                ${menuItems.map(item => `
                    <div class="menu-item">
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
                <li contenteditable="true" class="editable-text">2023年X月X日：新しいサービスを開始しました。</li>
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

function generateFooter(color, facebook, instagram, twitter, line) {
    const snsLinks = [];
    if (facebook) snsLinks.push(`<a href="${facebook}" target="_blank">Facebook</a>`);
    if (instagram) snsLinks.push(`<a href="${instagram}" target="_blank">Instagram</a>`);
    if (twitter) snsLinks.push(`<a href="${twitter}" target="_blank">Twitter</a>`);
    if (line) snsLinks.push(`<a href="${line}" target="_blank">LINE</a>`);

    return `
        <div class="footer">
            <div contenteditable="true" class="editable-text">SNS:</div>
            <div class="sns-links">
                ${snsLinks.length > 0 ? snsLinks.join(' | ') : '<span contenteditable="true" class="editable-text">SNSリンクを設定してください</span>'}
            </div>
        </div>
    `;
}

// 編集機能の初期化
function initializeEditableElements() {
    // 編集可能要素のスタイルを設定
    const editableElements = document.querySelectorAll('.editable-text');
    editableElements.forEach(element => {
        element.addEventListener('focus', () => {
            element.classList.add('editing');
            // フォントセレクターの値を現在の要素のフォントに更新
            const currentFont = window.getComputedStyle(element).fontFamily;
            fontSelector.value = currentFont;
        });
        element.addEventListener('blur', () => {
            element.classList.remove('editing');
            saveVersion('テキスト編集');
        });
    });

    // 画像変更ボタンの設定
    const imageButtons = document.querySelectorAll('.change-image-btn');
    imageButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const imageContainer = button.closest('.menu-item-image') || button.closest('.image-container');
            const image = imageContainer.querySelector('.editable-image');
            const newUrl = prompt('新しい画像のURLを入力してください:', image.src);
            if (newUrl && newUrl.trim()) {
                image.src = newUrl.trim();
                saveVersion('画像変更');
            }
        });
    });

    // 商品追加ボタンの設定
    const addMenuItemButtons = document.querySelectorAll('.add-menu-item-btn');
    addMenuItemButtons.forEach(button => {
        button.addEventListener('click', () => {
            const menuGrid = button.previousElementSibling;
            const newMenuItem = document.createElement('div');
            newMenuItem.className = 'menu-item';
            newMenuItem.innerHTML = `
                <div class="menu-item-image">
                    <img src="https://via.placeholder.com/300x225?text=New+Product" alt="新商品" class="editable-image" data-image-type="menu">
                    <button class="change-image-btn menu-image">画像を変更</button>
                </div>
                <div class="menu-item-content">
                    <h4 contenteditable="true" class="editable-text menu-item-name">新商品</h4>
                    <div contenteditable="true" class="editable-text menu-item-price">0円</div>
                    <div contenteditable="true" class="editable-text menu-item-description">商品の説明文を入力してください。</div>
                </div>
            `;
            menuGrid.appendChild(newMenuItem);
            initializeEditableElements();
            saveVersion('商品追加');
        });
    });

    // お知らせ追加ボタンの設定
    const addNewsButtons = document.querySelectorAll('.add-news-btn');
    addNewsButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const newsList = e.target.previousElementSibling;
            const newItem = document.createElement('li');
            newItem.contentEditable = true;
            newItem.className = 'editable-text';
            newItem.textContent = '新しいお知らせ';
            newsList.appendChild(newItem);
            saveVersion('お知らせ追加');
        });
    });

    // 地図変更ボタンの設定
    const mapButtons = document.querySelectorAll('.change-map-btn');
    mapButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const mapContainer = e.target.closest('.map-container');
            const iframe = mapContainer.querySelector('iframe');
            const newEmbedCode = prompt('新しい地図の埋め込みコードを入力してください:', iframe.outerHTML);
            if (newEmbedCode && newEmbedCode.trim()) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = newEmbedCode.trim();
                const newIframe = tempDiv.querySelector('iframe');
                if (newIframe) {
                    iframe.src = newIframe.src;
                    saveVersion('地図変更');
                }
            }
        });
    });
}

// フォントセレクターの設定
fontSelector.addEventListener('change', () => {
    const selectedFont = fontSelector.value;
    if (!selectedFont) return;  // フォントが選択されていない場合は何もしない

    const activeElement = document.querySelector('.editing');
    if (activeElement) {
        // 編集中の要素がある場合は、その要素とその子要素にフォントを適用
        activeElement.style.fontFamily = selectedFont;
        const children = activeElement.querySelectorAll('*');
        children.forEach(child => {
            child.style.fontFamily = selectedFont;
        });
    } else {
        // 編集中の要素がない場合は、モックアップ全体にフォントを適用
        const mockupContainer = document.getElementById('mockup-container');
        mockupContainer.style.fontFamily = selectedFont;
        const allElements = mockupContainer.querySelectorAll('*');
        allElements.forEach(element => {
            element.style.fontFamily = selectedFont;
        });
    }
    saveVersion('フォント変更');
}); 