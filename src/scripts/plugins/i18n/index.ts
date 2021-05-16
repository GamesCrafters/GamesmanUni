import { createI18n, I18nOptions } from "vue-i18n";

export const i18nOptions: I18nOptions = {
    escapeParameter: false,
    fallbackFormat: false,
    fallbackRoot: true,
    fallbackWarn: true,
    flatJson: false,
    globalInjection: true,
    inheritLocale: true,
    legacy: false,
    missingWarn: true,
};

export const i18n = createI18n(i18nOptions);
