import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation resources
import af from './locales/af';
import ar from './locales/ar';
import ca from './locales/ca';
import cs from './locales/cs';
import da from './locales/da';
import de from './locales/de';
import el from './locales/el';
import en from './locales/en';
import es from './locales/es';
import fi from './locales/fi';
import fr from './locales/fr';
import he from './locales/he';
import hi from './locales/hi';
import hu from './locales/hu';
import id from './locales/id';
import it from './locales/it';
import ja from './locales/ja';
import ko from './locales/ko';
import mr from './locales/mr';
import nl from './locales/nl';
import no from './locales/no';
import pl from './locales/pl';
import pt from './locales/pt';
import ro from './locales/ro';
import ru from './locales/ru';
import sr from './locales/sr';
import sv from './locales/sv';
import tr from './locales/tr';
import uk from './locales/uk';
import vi from './locales/vi';
import zh from './locales/zh';


i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      af,
      ar,
      ca,
      cs,
      da,
      de,
      el,
      en,
      es,
      fi,
      fr,
      he,
      hi,
      hu,
      id,
      it,
      ja,
      ko,
      mr,
      nl,
      no,
      pl,
      pt,
      ro,
      ru,
      sr,
      sv,
      tr,
      uk,
      vi,
      zh
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;
