const { readdirSync, readFileSync, writeFileSync } = require('fs');
const converter = require('i18next-conv');
const i18nDir = './public/i18n';
const options = {
    skipUntranslated: true,
    keyseparator: '°#°#°#°#°',
};

const files = readdirSync(i18nDir);
const numberOfFiles = files.length;
const storeTranslationsForIndex = index => {
    if (index >= 0 && index < numberOfFiles) {
        const file = files[index];
        const fileSplittend = file.split('.');
        if (fileSplittend.length === 2 && fileSplittend[1] === 'po') {
            const fileContent = readFileSync(i18nDir + '/' + file, 'utf-8');
            const locale = fileSplittend[0];
            converter.gettextToI18next(locale, fileContent, options).then(function(data) {
                writeFileSync(i18nDir + locale + '.json', data);
                storeTranslationsForIndex(index + 1);
            });
        } else {
            storeTranslationsForIndex(index + 1);
        }
    }
};

storeTranslationsForIndex(0);
