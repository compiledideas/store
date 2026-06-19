import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
  
} from 'react'
import type {ReactNode} from 'react';

export type Locale = 'en' | 'fr' | 'ar'

export const LOCALES: { code: Locale; label: string; dir: 'ltr' | 'rtl' }[] = [
  { code: 'en', label: 'EN', dir: 'ltr' },
  { code: 'fr', label: 'FR', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
]

export function localeDir(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr'
}

/* ------------------------------------------------------------------ */
/*  Dictionaries (UI chrome only — product/content text comes from API */
/* ------------------------------------------------------------------ */
export const dictionaries = {
  en: {
    brand: {
      tagline: 'Curated essentials, delivered with care',
      announcement:
        'Free shipping on orders over 80 DH — Cash on delivery available',
    },
    nav: {
      home: 'Home',
      shop: 'Shop',
      categories: 'Categories',
      promos: 'Offers',
      about: 'About',
      faq: 'Help & FAQ',
      stores: 'Stores',
      search: 'Search products',
    },
    actions: {
      addToCart: 'Add to cart',
      buyNow: 'Buy now',
      checkout: 'Checkout',
      viewAll: 'View all',
      viewProduct: 'View product',
      continueShopping: 'Continue shopping',
      apply: 'Apply',
      remove: 'Remove',
      clear: 'Clear cart',
      placeOrder: 'Place order',
      backToShop: 'Back to shop',
      backToHome: 'Back to home',
      readMore: 'Read more',
    },
    product: {
      from: 'From',
      save: 'Save',
      off: 'OFF',
      inStock: 'In stock',
      lowStock: 'Only {n} left',
      outOfStock: 'Out of stock',
      new: 'New',
      sale: 'Sale',
      sold: 'sold',
      description: 'Description',
      details: 'Details',
      quantity: 'Quantity',
      selectSize: 'Select size',
      selectVariant: 'Choose an option',
      sku: 'SKU',
      ageGroup: 'Age group',
      gender: 'Gender',
      relatedProducts: 'You may also like',
      reviews: 'reviews',
    },
    home: {
      heroCta: 'Shop the collection',
      heroSecondary: 'Explore offers',
      shopByCategory: 'Shop by category',
      featured: 'Featured products',
      featuredSub: 'Hand-picked favourites our customers love',
      topSelling: 'Best sellers',
      topSellingSub: 'Most-loved products this season',
      promo: 'Limited-time offers',
      promoSub: 'Save big while stocks last',
      statsProducts: 'Products',
      statsStock: 'In stock',
      statsDelivered: 'Orders delivered',
      statsOnline: 'Online orders',
      joinCta: 'Ready to find something you love?',
      joinSub: 'Browse the full catalogue or reach out — we are here to help.',
    },
    shop: {
      title: 'All products',
      filters: 'Filters',
      sort: 'Sort',
      price: 'Price',
      category: 'Category',
      searchPlaceholder: 'Search products',
      results: '{count} products',
      noResults: 'No products match your filters.',
      reset: 'Reset filters',
      loadMore: 'Load more',
      showing: 'Showing {from}–{to} of {total}',
    },
    sort: {
      'name-asc': 'Name: A to Z',
      'price-asc': 'Price: low to high',
      'price-desc': 'Price: high to low',
      'createdAt-desc': 'Newest',
    },
    cart: {
      title: 'Your cart',
      empty: 'Your cart is empty',
      emptySub: 'Add some products to get started.',
      subtotal: 'Subtotal',
      total: 'Total',
      discount: 'Discount',
      shipping: 'Shipping',
      shippingNote: 'Calculated at checkout',
      taxNote: 'Taxes included',
      freeShip: 'You qualify for free shipping',
      items: '{count} items',
      item: '{count} item',
    },
    checkout: {
      title: 'Checkout',
      contact: 'Contact details',
      shipping: 'Shipping address',
      payment: 'Payment',
      name: 'Full name',
      phone: 'Phone number',
      email: 'Email (optional)',
      address: 'Shipping address',
      city: 'City',
      coupon: 'Coupon code',
      couponApplied: 'Coupon {code} applied',
      couponInvalid: 'Coupon is invalid',
      removeCoupon: 'Remove coupon',
      summary: 'Order summary',
      cod: 'Cash on delivery',
      codNote: 'Pay with cash when your order arrives.',
      successTitle: 'Order confirmed!',
      successSub: 'Thank you for your purchase.',
      orderNumber: 'Order number',
      orderTotal: 'Total paid',
      emptyError: 'Your cart is empty.',
    },
    states: {
      loading: 'Loading…',
      error: 'Something went wrong',
      errorSub: 'Please try again in a moment.',
      retry: 'Retry',
      searchEmpty: 'No results found',
    },
    faq: {
      title: 'Frequently asked questions',
      sub: 'Everything you need to know before you order.',
    },
    stores: {
      title: 'Our stores',
      sub: 'Visit us in person — we would love to see you.',
      hours: 'Working hours',
      contact: 'Contact',
    },
    about: {
      title: 'About us',
    },
    footer: {
      shop: 'Shop',
      company: 'Company',
      support: 'Support',
      newsletter: 'Stay in the loop',
      newsletterSub: 'Subscribe for new arrivals and exclusive offers.',
      subscribe: 'Subscribe',
      emailPlaceholder: 'Your email',
      rights: 'All rights reserved.',
      madeWith: 'Built with the Rackvise Storefront SDK',
    },
    common: {
      currency: 'MAD',
      locale: 'en-MA',
    },
  },
  fr: {
    brand: {
      tagline: "L'essentiel, livré avec soin",
      announcement:
        'Livraison gratuite dès 80 DH — Paiement à la livraison disponible',
    },
    nav: {
      home: 'Accueil',
      shop: 'Boutique',
      categories: 'Catégories',
      promos: 'Offres',
      about: 'À propos',
      faq: 'Aide & FAQ',
      stores: 'Boutiques',
      search: 'Rechercher des produits',
    },
    actions: {
      addToCart: 'Ajouter au panier',
      buyNow: 'Acheter maintenant',
      checkout: 'Commander',
      viewAll: 'Voir tout',
      viewProduct: 'Voir le produit',
      continueShopping: 'Continuer mes achats',
      apply: 'Appliquer',
      remove: 'Retirer',
      clear: 'Vider le panier',
      placeOrder: 'Valider la commande',
      backToShop: 'Retour à la boutique',
      backToHome: "Retour à l'accueil",
      readMore: 'Lire la suite',
    },
    product: {
      from: 'Dès',
      save: 'Économisez',
      off: 'RÉDUC',
      inStock: 'En stock',
      lowStock: 'Plus que {n}',
      outOfStock: 'Épuisé',
      new: 'Nouveau',
      sale: 'Promo',
      sold: 'vendus',
      description: 'Description',
      details: 'Détails',
      quantity: 'Quantité',
      selectSize: 'Choisir la taille',
      selectVariant: 'Choisir une option',
      sku: 'Réf.',
      ageGroup: "Tranche d'âge",
      gender: 'Genre',
      relatedProducts: 'Vous aimerez aussi',
      reviews: 'avis',
    },
    home: {
      heroCta: "Voir la collection",
      heroSecondary: 'Découvrir les offres',
      shopByCategory: 'Acheter par catégorie',
      featured: 'Produits en vedette',
      featuredSub: 'Nos coups de cœur préférés',
      topSelling: 'Meilleures ventes',
      topSellingSub: 'Les plus populaires cette saison',
      promo: 'Offres limitées',
      promoSub: 'Profitez-en tant que stock disponible',
      statsProducts: 'Produits',
      statsStock: 'En stock',
      statsDelivered: 'Commandes livrées',
      statsOnline: 'Commandes en ligne',
      joinCta: 'Prêt à trouver votre coup de cœur ?',
      joinSub:
        'Parcourez le catalogue ou contactez-nous — nous sommes là pour vous.',
    },
    shop: {
      title: 'Tous les produits',
      filters: 'Filtres',
      sort: 'Trier',
      price: 'Prix',
      category: 'Catégorie',
      searchPlaceholder: 'Rechercher des produits',
      results: '{count} produits',
      noResults: 'Aucun produit ne correspond à vos filtres.',
      reset: 'Réinitialiser',
      loadMore: 'Charger plus',
      showing: '{from}–{to} sur {total}',
    },
    sort: {
      'name-asc': 'Nom : A à Z',
      'price-asc': 'Prix : croissant',
      'price-desc': 'Prix : décroissant',
      'createdAt-desc': 'Nouveautés',
    },
    cart: {
      title: 'Votre panier',
      empty: 'Votre panier est vide',
      emptySub: 'Ajoutez des produits pour commencer.',
      subtotal: 'Sous-total',
      total: 'Total',
      discount: 'Remise',
      shipping: 'Livraison',
      shippingNote: 'Calculée à la commande',
      taxNote: 'Taxes incluses',
      freeShip: 'Livraison gratuite incluse',
      items: '{count} articles',
      item: '{count} article',
    },
    checkout: {
      title: 'Commander',
      contact: 'Coordonnées',
      shipping: 'Adresse de livraison',
      payment: 'Paiement',
      name: 'Nom complet',
      phone: 'Téléphone',
      email: 'E-mail (facultatif)',
      address: 'Adresse de livraison',
      city: 'Ville',
      coupon: 'Code promo',
      couponApplied: 'Code {code} appliqué',
      couponInvalid: 'Code invalide',
      removeCoupon: 'Retirer le code',
      summary: 'Récapitulatif',
      cod: 'Paiement à la livraison',
      codNote: 'Payez en espèces à la réception.',
      successTitle: 'Commande confirmée !',
      successSub: 'Merci pour votre achat.',
      orderNumber: 'Numéro de commande',
      orderTotal: 'Total payé',
      emptyError: 'Votre panier est vide.',
    },
    states: {
      loading: 'Chargement…',
      error: 'Une erreur est survenue',
      errorSub: 'Veuillez réessayer dans un instant.',
      retry: 'Réessayer',
      searchEmpty: 'Aucun résultat',
    },
    faq: {
      title: 'Questions fréquentes',
      sub: 'Tout ce qu’il faut savoir avant de commander.',
    },
    stores: {
      title: 'Nos boutiques',
      sub: 'Rendez-nous visite — nous serons ravis de vous accueillir.',
      hours: "Horaires d'ouverture",
      contact: 'Contact',
    },
    about: {
      title: 'À propos',
    },
    footer: {
      shop: 'Boutique',
      company: 'Société',
      support: 'Aide',
      newsletter: 'Restez informé',
      newsletterSub: 'Inscrivez-vous pour les nouveautés et offres exclusives.',
      subscribe: "S'inscrire",
      emailPlaceholder: 'Votre e-mail',
      rights: 'Tous droits réservés.',
      madeWith: 'Construit avec le SDK Rackvise Storefront',
    },
    common: {
      currency: 'MAD',
      locale: 'fr-MA',
    },
  },
  ar: {
    brand: {
      tagline: 'أساسيات مختارة بعناية، تُسلَّم بعناية',
      announcement: 'شحن مجاني للطلبات فوق ٨٠ د.م. — الدفع عند الاستلام متاح',
    },
    nav: {
      home: 'الرئيسية',
      shop: 'المتجر',
      categories: 'الفئات',
      promos: 'العروض',
      about: 'من نحن',
      faq: 'المساعدة والأسئلة',
      stores: 'الفروع',
      search: 'ابحث عن منتجات',
    },
    actions: {
      addToCart: 'أضف إلى السلة',
      buyNow: 'اشترِ الآن',
      checkout: 'إتمام الطلب',
      viewAll: 'عرض الكل',
      viewProduct: 'عرض المنتج',
      continueShopping: 'متابعة التسوق',
      apply: 'تطبيق',
      remove: 'إزالة',
      clear: 'إفراغ السلة',
      placeOrder: 'تأكيد الطلب',
      backToShop: 'العودة للمتجر',
      backToHome: 'العودة للرئيسية',
      readMore: 'اقرأ المزيد',
    },
    product: {
      from: 'من',
      save: 'وفّر',
      off: 'خصم',
      inStock: 'متوفر',
      lowStock: 'بقي {n} فقط',
      outOfStock: 'نفد المخزون',
      new: 'جديد',
      sale: 'تخفيض',
      sold: 'مُباع',
      description: 'الوصف',
      details: 'التفاصيل',
      quantity: 'الكمية',
      selectSize: 'اختر المقاس',
      selectVariant: 'اختر خيارًا',
      sku: 'الرمز',
      ageGroup: 'الفئة العمرية',
      gender: 'الجنس',
      relatedProducts: 'قد يعجبك أيضًا',
      reviews: 'تقييم',
    },
    home: {
      heroCta: 'تسوّق المجموعة',
      heroSecondary: 'استكشف العروض',
      shopByCategory: 'تسوّق حسب الفئة',
      featured: 'منتجات مميزة',
      featuredSub: 'مختارات يحبها عملاؤنا',
      topSelling: 'الأكثر مبيعًا',
      topSellingSub: 'المنتجات الأكثر شعبية هذا الموسم',
      promo: 'عروض لفترة محدودة',
      promoSub: 'وفّر أكثر بينما المخزون متاح',
      statsProducts: 'منتج',
      statsStock: 'متوفر',
      statsDelivered: 'طلب تم توصيله',
      statsOnline: 'طلب عبر الإنترنت',
      joinCta: 'جاهز لتجد ما تحب؟',
      joinSub: 'تصفّح الكتالوج كاملًا أو تواصل معنا — نحن هنا لمساعدتك.',
    },
    shop: {
      title: 'كل المنتجات',
      filters: 'تصفية',
      sort: 'ترتيب',
      price: 'السعر',
      category: 'الفئة',
      searchPlaceholder: 'ابحث عن منتجات',
      results: '{count} منتج',
      noResults: 'لا توجد منتجات مطابقة لعوامل التصفية.',
      reset: 'إعادة التعيين',
      loadMore: 'تحميل المزيد',
      showing: '{from}–{to} من {total}',
    },
    sort: {
      'name-asc': 'الاسم: من الألف إلى الياء',
      'price-asc': 'السعر: من الأقل للأعلى',
      'price-desc': 'السعر: من الأعلى للأقل',
      'createdAt-desc': 'الأحدث',
    },
    cart: {
      title: 'سلتك',
      empty: 'سلتك فارغة',
      emptySub: 'أضف بعض المنتجات للبدء.',
      subtotal: 'المجموع الفرعي',
      total: 'الإجمالي',
      discount: 'الخصم',
      shipping: 'الشحن',
      shippingNote: 'يُحسب عند الدفع',
      taxNote: 'شامل الضرائب',
      freeShip: 'تؤهل للشحن المجاني',
      items: '{count} عنصر',
      item: '{count} عنصر',
    },
    checkout: {
      title: 'إتمام الطلب',
      contact: 'بيانات التواصل',
      shipping: 'عنوان الشحن',
      payment: 'الدفع',
      name: 'الاسم الكامل',
      phone: 'رقم الهاتف',
      email: 'البريد الإلكتروني (اختياري)',
      address: 'عنوان الشحن',
      city: 'المدينة',
      coupon: 'رمز الخصم',
      couponApplied: 'تم تطبيق الرمز {code}',
      couponInvalid: 'الرمز غير صالح',
      removeCoupon: 'إزالة الرمز',
      summary: 'ملخص الطلب',
      cod: 'الدفع عند الاستلام',
      codNote: 'ادفع نقدًا عند وصول طلبك.',
      successTitle: 'تم تأكيد الطلب!',
      successSub: 'شكرًا على شرائك.',
      orderNumber: 'رقم الطلب',
      orderTotal: 'الإجمالي المدفوع',
      emptyError: 'سلتك فارغة.',
    },
    states: {
      loading: 'جارٍ التحميل…',
      error: 'حدث خطأ ما',
      errorSub: 'يرجى المحاولة مرة أخرى بعد قليل.',
      retry: 'إعادة المحاولة',
      searchEmpty: 'لا توجد نتائج',
    },
    faq: {
      title: 'الأسئلة الشائعة',
      sub: 'كل ما تحتاج معرفته قبل الطلب.',
    },
    stores: {
      title: 'فروعنا',
      sub: 'زرنا شخصيًا — يسعدنا رؤيتك.',
      hours: 'ساعات العمل',
      contact: 'تواصل',
    },
    about: {
      title: 'من نحن',
    },
    footer: {
      shop: 'المتجر',
      company: 'الشركة',
      support: 'الدعم',
      newsletter: 'ابقَ على اطلاع',
      newsletterSub: 'اشترك لتصلك الجديد والعروض الحصرية.',
      subscribe: 'اشترك',
      emailPlaceholder: 'بريدك الإلكتروني',
      rights: 'جميع الحقوق محفوظة.',
      madeWith: 'بُني باستخدام SDK Rackvise Storefront',
    },
    common: {
      currency: 'MAD',
      locale: 'ar-MA',
    },
  },
}

export type Dictionary = (typeof dictionaries)['en']

interface LocaleContextValue {
  locale: Locale
  dir: 'ltr' | 'rtl'
  setLocale: (locale: Locale) => void
  t: Dictionary
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

const STORAGE_KEY = 'rackvise_locale'

function detectInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'en'
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null
    if (stored && ['en', 'fr', 'ar'].includes(stored)) return stored
  } catch {
    /* ignore */
  }
  const nav = window.navigator.language.slice(0, 2).toLowerCase()
  if (nav === 'fr') return 'fr'
  if (nav === 'ar') return 'ar'
  return 'en'
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    setLocaleState(detectInitialLocale())
  }, [])

  useEffect(() => {
    const dir = localeDir(locale)
    const root = document.documentElement
    root.lang = locale
    root.dir = dir
    try {
      window.localStorage.setItem(STORAGE_KEY, locale)
    } catch {
      /* ignore */
    }
  }, [locale])

  const setLocale = useCallback((next: Locale) => setLocaleState(next), [])

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      dir: localeDir(locale),
      setLocale,
      t: dictionaries[locale],
    }),
    [locale, setLocale],
  )

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  )
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within a LocaleProvider')
  return ctx
}

/** Shorthand for the dictionary. */
export function useT(): Dictionary {
  return useLocale().t
}

/**
 * Interpolate {name} placeholders into a template string.
 */
export function interpolate(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in vars ? String(vars[key]) : `{${key}}`,
  )
}

/**
 * Pick the right localized field off an API object that exposes
 * `fieldEN` / `fieldFR` / `fieldAR`, falling back to EN then AR.
 */
export function localized<T extends object>(
  obj: T | null | undefined,
  field: string,
  locale: Locale,
): string {
  if (!obj) return ''
  const record = obj as Record<string, unknown>
  const suffix = locale === 'en' ? 'EN' : locale === 'fr' ? 'FR' : 'AR'
  const candidates = [
    record[`${field}${suffix}`],
    record[`${field}EN`],
    record[`${field}FR`],
    record[`${field}AR`],
  ]
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) return c
  }
  return ''
}
