const fs = require('fs');
const path = require('path');

const PARTS_DIR = path.join(__dirname, 'parts');
const OUTPUT_FILE = path.join(__dirname, 'index.html');
const STYLES_FILE = path.join(__dirname, 'styles.css');
const SCRIPT_FILE = path.join(__dirname, 'script.js');

const partsOrder = [
    'head.html',
    'header.html',
    'hero.html',
    'problems.html',
    'benefits.html',
    'features.html',
    'quiz.html',
    'instruction.html',
    'cta_trial.html',
    'tariffs.html',
    'platforms.html',
    'use_cases.html',
    'reviews.html',
    'trust.html',
    'faq.html',
    'cta_final.html',
    'seo_text.html',
    'footer.html',
    'popup_and_sticky.html'
];

function build() {
    let outputHtml = '<!DOCTYPE html>\n<html lang="ru">\n';

    // Читаем head
    try {
        let headContent = fs.readFileSync(path.join(PARTS_DIR, 'head.html'), 'utf-8');
        
        // Вставляем CSS
        if (fs.existsSync(STYLES_FILE)) {
            const styles = fs.readFileSync(STYLES_FILE, 'utf-8');
            headContent = headContent.replace('<!-- INJECT_STYLES -->', `<style>\n${styles}\n</style>`);
        }
        
        outputHtml += headContent + '\n';
    } catch (e) {
        console.error('Ошибка чтения head.html', e);
        return;
    }

    outputHtml += '<body>\n';

    // Читаем тело
    for (let i = 1; i < partsOrder.length; i++) {
        const partFile = partsOrder[i];
        const partPath = path.join(PARTS_DIR, partFile);
        if (fs.existsSync(partPath)) {
            const content = fs.readFileSync(partPath, 'utf-8');
            outputHtml += `<!-- START: ${partFile} -->\n${content}\n<!-- END: ${partFile} -->\n\n`;
        } else {
            console.warn(`Файл не найден: ${partFile}`);
        }
    }

    // Вставляем JS
    if (fs.existsSync(SCRIPT_FILE)) {
        const script = fs.readFileSync(SCRIPT_FILE, 'utf-8');
        outputHtml += `<script>\n${script}\n</script>\n`;
    }

    outputHtml += '</body>\n</html>';

    fs.writeFileSync(OUTPUT_FILE, outputHtml, 'utf-8');
    console.log('Сборка успешно завершена: index.html создан.');
}

build();
