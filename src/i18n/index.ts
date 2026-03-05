import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import frCommon from './locales/fr/common.json'
import frAuth from './locales/fr/auth.json'
import frDashboard from './locales/fr/dashboard.json'
import frCompanies from './locales/fr/companies.json'
import frStations from './locales/fr/stations.json'
import frUsers from './locales/fr/users.json'
import frAnnonces from './locales/fr/annonces.json'
import frPermissions from './locales/fr/permissions.json'
import frTags from './locales/fr/tags.json'
import frCandidatures from './locales/fr/candidatures.json'

import enCommon from './locales/en/common.json'
import enAuth from './locales/en/auth.json'
import enDashboard from './locales/en/dashboard.json'
import enCompanies from './locales/en/companies.json'
import enStations from './locales/en/stations.json'
import enUsers from './locales/en/users.json'
import enAnnonces from './locales/en/annonces.json'
import enPermissions from './locales/en/permissions.json'
import enTags from './locales/en/tags.json'
import enCandidatures from './locales/en/candidatures.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: {
        common: frCommon,
        auth: frAuth,
        dashboard: frDashboard,
        companies: frCompanies,
        stations: frStations,
        users: frUsers,
        annonces: frAnnonces,
        permissions: frPermissions,
        tags: frTags,
        candidatures: frCandidatures,
      },
      en: {
        common: enCommon,
        auth: enAuth,
        dashboard: enDashboard,
        companies: enCompanies,
        stations: enStations,
        users: enUsers,
        annonces: enAnnonces,
        permissions: enPermissions,
        tags: enTags,
        candidatures: enCandidatures,
      },
    },
    defaultNS: 'common',
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'en'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'tumavu-office-lang',
    },
  })

export default i18n
