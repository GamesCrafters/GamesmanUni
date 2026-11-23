import { createI18n, I18nOptions } from "vue-i18n";
import enUS from "../../../locales/en-US.json";
import es from "../../../locales/es.json";
import hi from "../../../locales/hi.json";
import zh from "../../../locales/zh.json";

export const i18nOptions: I18nOptions = {
    escapeParameter: false,
    fallbackFormat: false,
    fallbackLocale: "en-US",
    fallbackRoot: true,
    fallbackWarn: true,
    flatJson: false,
    globalInjection: true,
    inheritLocale: true,
    legacy: false,
    locale: "en-US",
    messages: {
        "en-US": enUS,
        es,
        hi,
        zh,
    },
    missingWarn: true,
};

export const i18n = createI18n(i18nOptions);
