// ЛОГИКА МОДАЛЬНОГО ОКНА
const dlg = document.getElementById('contactDialog');
const openBtn = document.getElementById('openDialog');
const closeBtn = document.getElementById('closeButt');
const form = document.getElementById('contactForm');
let lastActive = null;

openBtn.addEventListener('click', () => {
    lastActive = document.activeElement;
    dlg.showModal();    // модальный режим + затемнение
    dlg.querySelector('input,select,textarea,button')?.focus();
});

closeBtn.addEventListener('click', () => dlg.close('cancel'));

form?.addEventListener('submit', (e) => {
    // валидация см. 1.4.2; при успехе закрываем окно 
});

// Esc по умолчанию вызывает событие 'cancel' и закрывает <dialog>
// Обработчик закрытия модалки для возврата фокуса.
dlg.addEventListener('close', () => { lastActive?.focus(); });


// ЛЁГКАЯ МАСКА ТЕЛЕФОНА
const phoneInput = document.getElementById('phone');

phoneInput?.addEventListener('input', (e) => {
    // Получаем значение, удаляем всё, кроме цифр, и ограничиваем 11 символами.
    let digits = e.target.value.replace(/\D/g, '').slice(0, 11); // до 11 цифр
    const d = digits.replace(/^8/, '7'); // нормализуем 8 → 7
    // Заменяем первую 8 на 7 (для российских номеров)

    const parts = []
    if (d.length > 0) parts.push('+7');
    if (d.length > 1) parts.push(' (' + d.slice(1, 4));
    if (d.length > 4) parts[parts.length - 1] += ')';
    if (d.length >= 5) parts.push(' ' + d.slice(4, 7));
    if (d.length >= 8) parts.push('-' + d.slice(7, 9));
    if (d.length >= 10) parts.push('-' + d.slice(9, 11));
    phoneInput.value = parts.join('');
});

// Строгая проверка (если задаёте pattern из JS):
phoneInput?.setAttribute('pattern', '^\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}$');

// ВАЛИДАЦИЯ ФОРМЫ
form?.addEventListener('submit', (e) => {
    // 1) Сброс кастомных сообщений
    [...form.elements].forEach(el => el.setCustomValidity?.(''));

    // 2) Проверка встроенных ограничений
    if (!form.checkValidity()) {
        e.preventDefault();

        // Пример: таргетированное сообщение
        const email = form.elements.email;
        if (email?.validity.typeMismatch) {
            email.setCustomValidity('Введите корректный e-mail, например name@example.com');
        }

        form.reportValidity(); // показать браузерные подсказки

        // Ally: подсветка проблемных полей
        [...form.elements].forEach(el => {
            if (el.willValidate) el.toggleAttribute('aria-invalid', !el.checkValidity());
        });
        return;
    }

    // 3) Успешная «отправка» (без сервера)
    e.preventDefault();
    // Если форма внутри <dialog>, закрываем окно:
    document.getElementById('contactDialog').close('success');
    form.reset();
});