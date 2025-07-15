/**
 * Translation and Formatting Utilities
 * Production-ready internationalization helpers
 */

// Translation dictionary for static content
// In production, this would be loaded from translation files
export const translations = {
  'en-US': {
    // Navigation
    'nav.home': 'Home',
    'nav.flights': 'Flights',
    'nav.hotels': 'Hotels',
    'nav.cars': 'Cars',
    'nav.deals': 'Deals',
    'nav.about': 'About',
    'nav.contact': 'Contact',

    // User Menu
    'user.account': 'Account',
    'user.my_profile': 'My Profile',
    'user.my_trips': 'My Trips',
    'user.saved_flights': 'Saved Flights',
    'user.payment_methods': 'Payment Methods',
    'user.preferences': 'Preferences',
    'user.settings': 'Settings',
    'user.notifications': 'Notifications',
    'user.support': 'Support',
    'user.help_center': 'Help Center',
    'user.travel_insurance': 'Travel Insurance',
    'user.sign_in': 'Sign In',
    'user.sign_out': 'Sign Out',
    'user.guest': 'Guest User',

    // Hero Section
    'hero.title': 'Your AI-Powered Flight Discovery Engine',
    'hero.subtitle':
      'Find the perfect flights with intelligent recommendations, real-time pricing, and seamless booking experience.',
    'hero.cta': "Find Deals Now - It's Free",
    'hero.secondary_cta': 'Watch 60s Demo',
    'hero.trust_badge': '#1 AI Flight Discovery Platform',
    'hero.users_count': '2M+ travelers trust us',
    'hero.savings':
      'Save up to 70% on flights with AI that predicts price drops before they happen',
    'hero.live_deals': 'Live: 347 deals ending in the next 24 hours',
    'hero.ai_prediction': 'AI Price Prediction',
    'hero.ai_accuracy': '99.2% accuracy rate',
    'hero.instant_alerts': 'Instant Alerts',
    'hero.real_time': 'Real-time notifications',
    'hero.price_guarantee': 'Best Price Guarantee',
    'hero.money_back': 'Money back promise',
    'hero.security': 'Bank-level security',
    'hero.rating': '4.9/5 rating (50k+ reviews)',
    'hero.support': 'Award-winning support',
    'hero.average_savings': 'Average savings: $347',

    // Search Form
    'search.from': 'From',
    'search.to': 'To',
    'search.departure': 'Departure',
    'search.return': 'Return',
    'search.passengers': 'Passengers',
    'search.search_flights': 'Search Flights',
    'search.round_trip': 'Round trip',
    'search.one_way': 'One way',
    'search.multi_city': 'Multi-city',
    'search.class': 'Class',
    'search.economy': 'Economy',
    'search.business': 'Business',
    'search.first': 'First',
    'search.stops': 'Stops',
    'search.any_stops': 'Any',
    'search.nonstop': 'Nonstop',
    'search.one_stop': '1 stop',
    'search.two_plus_stops': '2+ stops',

    // Deals
    'deals.loading': 'Loading amazing deals...',
    'deals.error': 'Failed to load deals',
    'deals.no_deals': 'No deals found matching your criteria',
    'deals.try_different': 'Try adjusting your search or check back later',
    'deals.view_details': 'View Details',
    'deals.book_now': 'Book Now',
    'deals.save_amount': 'Save',
    'deals.ai_insight': 'AI Insight',
    'deals.confidence': 'confidence',
    'deals.stops': 'Stops',
    'deals.nonstop': 'Nonstop',
    'deals.one_stop': '1 stop',
    'deals.multi_stop': 'stops',
    'deals.duration': 'Duration',
    'deals.price_trend_up': 'Prices rising',
    'deals.price_trend_down': 'Prices dropping',
    'deals.price_trend_stable': 'Prices stable',
    'deals.book_now_action': 'Book now - prices rising!',
    'deals.wait_action': 'Wait - prices may drop',
    'deals.monitor_action': 'Monitor - stable pricing',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.try_again': 'Try again',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.clear': 'Clear',
    'common.apply': 'Apply',
    'common.reset': 'Reset',
    'common.ok': 'OK',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.select': 'Select',
    'common.required': 'Required',
    'common.optional': 'Optional',

    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Language & Region',
    'settings.currency': 'Currency',
    'settings.preferences': 'Preferences',
    'settings.theme': 'Theme',
    'settings.light': 'Light',
    'settings.dark': 'Dark',
    'settings.system': 'System',
    'settings.notifications': 'Notifications',
    'settings.account': 'Account',
    'settings.privacy': 'Privacy',
    'settings.help': 'Help',

    // Errors
    'error.network': 'Network error. Please check your connection.',
    'error.timeout': 'Request timed out. Please try again.',
    'error.server': 'Server error. Please try again later.',
    'error.not_found': 'Page not found.',
    'error.unauthorized': 'You are not authorized to access this resource.',
    'error.validation': 'Please check your input and try again.',
    'error.generic': 'An unexpected error occurred.',

    // Forms
    'form.required_field': 'This field is required',
    'form.invalid_email': 'Please enter a valid email address',
    'form.invalid_phone': 'Please enter a valid phone number',
    'form.password_too_short': 'Password must be at least 8 characters',
    'form.passwords_dont_match': 'Passwords do not match',
    'form.invalid_date': 'Please select a valid date',
    'form.future_date_required': 'Please select a future date',

    // Auth
    'auth.sign_in': 'Sign In',
    'auth.sign_up': 'Sign Up',
    'auth.sign_out': 'Sign Out',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirm_password': 'Confirm Password',
    'auth.forgot_password': 'Forgot Password?',
    'auth.remember_me': 'Remember me',
    'auth.already_have_account': 'Already have an account?',
    'auth.dont_have_account': "Don't have an account?",

    // Accessibility
    'a11y.skip_to_content': 'Skip to main content',
    'a11y.menu': 'Main menu',
    'a11y.search': 'Search',
    'a11y.user_menu': 'User menu',
    'a11y.settings': 'Settings',
    'a11y.theme_toggle': 'Toggle theme',
    'a11y.language_toggle': 'Change language',
    'a11y.close_dialog': 'Close dialog',
    'a11y.loading': 'Loading content',
    'a11y.error': 'Error message',
    'a11y.success': 'Success message',
    'a11y.warning': 'Warning message',
    'a11y.info': 'Information',
  },
  'es-ES': {
    // Navigation
    'nav.home': 'Inicio',
    'nav.flights': 'Vuelos',
    'nav.hotels': 'Hoteles',
    'nav.cars': 'Coches',
    'nav.deals': 'Ofertas',
    'nav.about': 'Acerca de',
    'nav.contact': 'Contacto',

    // Hero Section
    'hero.title': 'Tu Motor de Descubrimiento de Vuelos con IA',
    'hero.subtitle':
      'Encuentra los vuelos perfectos con recomendaciones inteligentes, precios en tiempo real y una experiencia de reserva fluida.',
    'hero.cta': 'Encuentra Ofertas Ahora - Es Gratis',
    'hero.secondary_cta': 'Ver Demo de 60s',
    'hero.trust_badge': 'Plataforma #1 de Descubrimiento de Vuelos con IA',
    'hero.users_count': 'Más de 2M viajeros confían en nosotros',
    'hero.savings':
      'Ahorra hasta 70% en vuelos con IA que predice caídas de precios antes de que ocurran',
    'hero.live_deals': 'En vivo: 347 ofertas terminan en las próximas 24 horas',
    'hero.ai_prediction': 'Predicción de Precios IA',
    'hero.ai_accuracy': '99.2% de precisión',
    'hero.instant_alerts': 'Alertas Instantáneas',
    'hero.real_time': 'Notificaciones en tiempo real',
    'hero.price_guarantee': 'Garantía del Mejor Precio',
    'hero.money_back': 'Garantía de devolución',
    'hero.security': 'Seguridad bancaria',
    'hero.rating': '4.9/5 calificación (50k+ reseñas)',
    'hero.support': 'Soporte galardonado',
    'hero.average_savings': 'Ahorro promedio: $347',

    // Search Form
    'search.from': 'Desde',
    'search.to': 'Hasta',
    'search.departure': 'Salida',
    'search.return': 'Regreso',
    'search.passengers': 'Pasajeros',
    'search.search_flights': 'Buscar Vuelos',
    'search.round_trip': 'Ida y vuelta',
    'search.one_way': 'Solo ida',
    'search.multi_city': 'Multi-ciudad',
    'search.class': 'Clase',
    'search.economy': 'Económica',
    'search.business': 'Ejecutiva',
    'search.first': 'Primera',
    'search.stops': 'Escalas',
    'search.any_stops': 'Cualquiera',
    'search.nonstop': 'Sin escalas',
    'search.one_stop': '1 escala',
    'search.two_plus_stops': '2+ escalas',

    // Deals
    'deals.loading': 'Cargando ofertas increíbles...',
    'deals.error': 'Error al cargar ofertas',
    'deals.no_deals':
      'No se encontraron ofertas que coincidan con tus criterios',
    'deals.try_different': 'Intenta ajustar tu búsqueda o vuelve más tarde',
    'deals.view_details': 'Ver Detalles',
    'deals.book_now': 'Reservar Ahora',
    'deals.save_amount': 'Ahorrar',
    'deals.ai_insight': 'Información IA',
    'deals.confidence': 'confianza',
    'deals.stops': 'Escalas',
    'deals.nonstop': 'Sin escalas',
    'deals.one_stop': '1 escala',
    'deals.multi_stop': 'escalas',
    'deals.duration': 'Duración',
    'deals.price_trend_up': 'Precios subiendo',
    'deals.price_trend_down': 'Precios bajando',
    'deals.price_trend_stable': 'Precios estables',
    'deals.book_now_action': '¡Reserva ahora - precios subiendo!',
    'deals.wait_action': 'Espera - los precios pueden bajar',
    'deals.monitor_action': 'Monitorear - precios estables',

    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Algo salió mal',
    'common.try_again': 'Intentar de nuevo',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.close': 'Cerrar',
    'common.back': 'Atrás',
    'common.next': 'Siguiente',
    'common.previous': 'Anterior',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.sort': 'Ordenar',
    'common.clear': 'Limpiar',
    'common.apply': 'Aplicar',
    'common.reset': 'Restablecer',
    'common.ok': 'OK',
    'common.yes': 'Sí',
    'common.no': 'No',
    'common.select': 'Seleccionar',
    'common.required': 'Requerido',
    'common.optional': 'Opcional',

    // Settings
    'settings.title': 'Configuración',
    'settings.language': 'Idioma y Región',
    'settings.currency': 'Moneda',
    'settings.preferences': 'Preferencias',
    'settings.theme': 'Tema',
    'settings.light': 'Claro',
    'settings.dark': 'Oscuro',
    'settings.system': 'Sistema',
    'settings.notifications': 'Notificaciones',
    'settings.account': 'Cuenta',
    'settings.privacy': 'Privacidad',
    'settings.help': 'Ayuda',

    // Errors
    'error.network': 'Error de red. Por favor verifica tu conexión.',
    'error.timeout': 'Tiempo de espera agotado. Inténtalo de nuevo.',
    'error.server': 'Error del servidor. Inténtalo más tarde.',
    'error.not_found': 'Página no encontrada.',
    'error.unauthorized': 'No tienes autorización para acceder a este recurso.',
    'error.validation': 'Por favor verifica tu entrada e inténtalo de nuevo.',
    'error.generic': 'Ocurrió un error inesperado.',

    // Forms
    'form.required_field': 'Este campo es requerido',
    'form.invalid_email': 'Por favor ingresa un email válido',
    'form.invalid_phone': 'Por favor ingresa un número de teléfono válido',
    'form.password_too_short': 'La contraseña debe tener al menos 8 caracteres',
    'form.passwords_dont_match': 'Las contraseñas no coinciden',
    'form.invalid_date': 'Por favor selecciona una fecha válida',
    'form.future_date_required': 'Por favor selecciona una fecha futura',

    // Auth
    'auth.sign_in': 'Iniciar Sesión',
    'auth.sign_up': 'Registrarse',
    'auth.sign_out': 'Cerrar Sesión',
    'auth.email': 'Email',
    'auth.password': 'Contraseña',
    'auth.confirm_password': 'Confirmar Contraseña',
    'auth.forgot_password': '¿Olvidaste tu contraseña?',
    'auth.remember_me': 'Recordarme',
    'auth.already_have_account': '¿Ya tienes una cuenta?',
    'auth.dont_have_account': '¿No tienes una cuenta?',

    // User Menu
    'user.profile': 'Perfil',
    'user.bookings': 'Mis Reservas',
    'user.preferences': 'Preferencias',
    'user.notifications': 'Notificaciones',
    'user.help': 'Ayuda y Soporte',
    'user.sign_out': 'Cerrar Sesión',

    // Accessibility
    'a11y.skip_to_content': 'Saltar al contenido principal',
    'a11y.menu': 'Menú principal',
    'a11y.search': 'Buscar',
    'a11y.user_menu': 'Menú de usuario',
    'a11y.settings': 'Configuración',
    'a11y.theme_toggle': 'Cambiar tema',
    'a11y.language_toggle': 'Cambiar idioma',
    'a11y.close_dialog': 'Cerrar diálogo',
    'a11y.loading': 'Cargando contenido',
    'a11y.error': 'Mensaje de error',
    'a11y.success': 'Mensaje de éxito',
    'a11y.warning': 'Mensaje de advertencia',
    'a11y.info': 'Información',
  },
  'fr-FR': {
    // Navigation
    'nav.home': 'Accueil',
    'nav.flights': 'Vols',
    'nav.hotels': 'Hôtels',
    'nav.cars': 'Voitures',
    'nav.deals': 'Offres',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',

    // Hero Section
    'hero.title': 'Votre Moteur de Découverte de Vols IA',
    'hero.subtitle':
      'Trouvez les vols parfaits avec des recommandations intelligentes, des prix en temps réel et une expérience de réservation fluide.',
    'hero.cta': "Trouvez des Offres Maintenant - C'est Gratuit",
    'hero.secondary_cta': 'Voir la Démo 60s',
    'hero.trust_badge': 'Plateforme #1 de Découverte de Vols IA',
    'hero.users_count': 'Plus de 2M voyageurs nous font confiance',
    'hero.savings':
      "Économisez jusqu'à 70% sur les vols avec l'IA qui prédit les baisses de prix avant qu'elles n'arrivent",
    'hero.live_deals':
      'En direct: 347 offres se terminent dans les 24 prochaines heures',
    'hero.ai_prediction': 'Prédiction de Prix IA',
    'hero.ai_accuracy': '99,2% de précision',
    'hero.instant_alerts': 'Alertes Instantanées',
    'hero.real_time': 'Notifications en temps réel',
    'hero.price_guarantee': 'Garantie du Meilleur Prix',
    'hero.money_back': 'Garantie de remboursement',
    'hero.security': 'Sécurité bancaire',
    'hero.rating': '4,9/5 note (50k+ avis)',
    'hero.support': 'Support primé',
    'hero.average_savings': 'Économies moyennes: $347',

    // Search Form
    'search.from': 'De',
    'search.to': 'À',
    'search.departure': 'Départ',
    'search.return': 'Retour',
    'search.passengers': 'Passagers',
    'search.search_flights': 'Rechercher des Vols',
    'search.round_trip': 'Aller-retour',
    'search.one_way': 'Aller simple',
    'search.multi_city': 'Multi-villes',
    'search.class': 'Classe',
    'search.economy': 'Économique',
    'search.business': 'Affaires',
    'search.first': 'Première',
    'search.stops': 'Escales',
    'search.any_stops': 'Toutes',
    'search.nonstop': 'Direct',
    'search.one_stop': '1 escale',
    'search.two_plus_stops': '2+ escales',

    // Deals
    'deals.loading': "Chargement d'offres incroyables...",
    'deals.error': 'Échec du chargement des offres',
    'deals.no_deals': 'Aucune offre trouvée correspondant à vos critères',
    'deals.try_different':
      "Essayez d'ajuster votre recherche ou revenez plus tard",
    'deals.view_details': 'Voir les Détails',
    'deals.book_now': 'Réserver Maintenant',
    'deals.save_amount': 'Économiser',
    'deals.ai_insight': 'Aperçu IA',
    'deals.confidence': 'confiance',
    'deals.stops': 'Escales',
    'deals.nonstop': 'Direct',
    'deals.one_stop': '1 escale',
    'deals.multi_stop': 'escales',
    'deals.duration': 'Durée',
    'deals.price_trend_up': 'Prix en hausse',
    'deals.price_trend_down': 'Prix en baisse',
    'deals.price_trend_stable': 'Prix stables',
    'deals.book_now_action': 'Réservez maintenant - prix en hausse!',
    'deals.wait_action': 'Attendez - les prix peuvent baisser',
    'deals.monitor_action': 'Surveiller - prix stables',

    // Common
    'common.loading': 'Chargement...',
    'common.error': "Quelque chose s'est mal passé",
    'common.try_again': 'Réessayer',
    'common.save': 'Sauvegarder',
    'common.cancel': 'Annuler',
    'common.close': 'Fermer',
    'common.back': 'Retour',
    'common.next': 'Suivant',
    'common.previous': 'Précédent',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.sort': 'Trier',
    'common.clear': 'Effacer',
    'common.apply': 'Appliquer',
    'common.reset': 'Réinitialiser',
    'common.ok': 'OK',
    'common.yes': 'Oui',
    'common.no': 'Non',
    'common.select': 'Sélectionner',
    'common.required': 'Requis',
    'common.optional': 'Optionnel',

    // Settings
    'settings.title': 'Paramètres',
    'settings.language': 'Langue et Région',
    'settings.currency': 'Devise',
    'settings.preferences': 'Préférences',
    'settings.theme': 'Thème',
    'settings.light': 'Clair',
    'settings.dark': 'Sombre',
    'settings.system': 'Système',
    'settings.notifications': 'Notifications',
    'settings.account': 'Compte',
    'settings.privacy': 'Confidentialité',
    'settings.help': 'Aide',

    // Errors
    'error.network': 'Erreur réseau. Veuillez vérifier votre connexion.',
    'error.timeout': "Délai d'attente dépassé. Veuillez réessayer.",
    'error.server': 'Erreur serveur. Veuillez réessayer plus tard.',
    'error.not_found': 'Page non trouvée.',
    'error.unauthorized':
      "Vous n'êtes pas autorisé à accéder à cette ressource.",
    'error.validation': 'Veuillez vérifier votre saisie et réessayer.',
    'error.generic': "Une erreur inattendue s'est produite.",

    // Forms
    'form.required_field': 'Ce champ est requis',
    'form.invalid_email': 'Veuillez saisir une adresse email valide',
    'form.invalid_phone': 'Veuillez saisir un numéro de téléphone valide',
    'form.password_too_short':
      'Le mot de passe doit contenir au moins 8 caractères',
    'form.passwords_dont_match': 'Les mots de passe ne correspondent pas',
    'form.invalid_date': 'Veuillez sélectionner une date valide',
    'form.future_date_required': 'Veuillez sélectionner une date future',

    // Auth
    'auth.sign_in': 'Se Connecter',
    'auth.sign_up': "S'inscrire",
    'auth.sign_out': 'Se Déconnecter',
    'auth.email': 'Email',
    'auth.password': 'Mot de passe',
    'auth.confirm_password': 'Confirmer le mot de passe',
    'auth.forgot_password': 'Mot de passe oublié?',
    'auth.remember_me': 'Se souvenir de moi',
    'auth.already_have_account': 'Vous avez déjà un compte?',
    'auth.dont_have_account': "Vous n'avez pas de compte?",

    // User Menu
    'user.profile': 'Profil',
    'user.bookings': 'Mes Réservations',
    'user.preferences': 'Préférences',
    'user.notifications': 'Notifications',
    'user.help': 'Aide et Support',
    'user.sign_out': 'Se Déconnecter',

    // Accessibility
    'a11y.skip_to_content': 'Aller au contenu principal',
    'a11y.menu': 'Menu principal',
    'a11y.search': 'Rechercher',
    'a11y.user_menu': 'Menu utilisateur',
    'a11y.settings': 'Paramètres',
    'a11y.theme_toggle': 'Basculer le thème',
    'a11y.language_toggle': 'Changer de langue',
    'a11y.close_dialog': 'Fermer la boîte de dialogue',
    'a11y.loading': 'Chargement du contenu',
    'a11y.error': "Message d'erreur",
    'a11y.success': 'Message de succès',
    'a11y.warning': "Message d'avertissement",
    'a11y.info': 'Information',
  },
  'de-DE': {
    // Navigation
    'nav.home': 'Startseite',
    'nav.flights': 'Flüge',
    'nav.hotels': 'Hotels',
    'nav.cars': 'Autos',
    'nav.deals': 'Angebote',
    'nav.about': 'Über uns',
    'nav.contact': 'Kontakt',

    // Hero Section
    'hero.title': 'Ihre KI-gestützte Flugentdeckungsmaschine',
    'hero.subtitle':
      'Finden Sie die perfekten Flüge mit intelligenten Empfehlungen, Echtzeitpreisen und nahtloser Buchungserfahrung.',
    'hero.cta': 'Angebote Jetzt Finden - Kostenlos',
    'hero.secondary_cta': '60s Demo Ansehen',
    'hero.trust_badge': '#1 KI-Flugentdeckungsplattform',
    'hero.users_count': 'Über 2M Reisende vertrauen uns',
    'hero.savings':
      'Sparen Sie bis zu 70% bei Flügen mit KI, die Preisrückgänge vorhersagt, bevor sie passieren',
    'hero.live_deals': 'Live: 347 Angebote enden in den nächsten 24 Stunden',
    'hero.ai_prediction': 'KI-Preisvorhersage',
    'hero.ai_accuracy': '99,2% Genauigkeit',
    'hero.instant_alerts': 'Sofortige Benachrichtigungen',
    'hero.real_time': 'Echtzeit-Benachrichtigungen',
    'hero.price_guarantee': 'Bestpreisgarantie',
    'hero.money_back': 'Geld-zurück-Garantie',
    'hero.security': 'Bank-level Sicherheit',
    'hero.rating': '4,9/5 Bewertung (50k+ Bewertungen)',
    'hero.support': 'Preisgekrönter Support',
    'hero.average_savings': 'Durchschnittliche Ersparnis: $347',

    // Search Form
    'search.from': 'Von',
    'search.to': 'Nach',
    'search.departure': 'Abflug',
    'search.return': 'Rückflug',
    'search.passengers': 'Passagiere',
    'search.search_flights': 'Flüge suchen',
    'search.round_trip': 'Hin- und Rückflug',
    'search.one_way': 'Nur Hinflug',
    'search.multi_city': 'Mehrere Städte',
    'search.class': 'Klasse',
    'search.economy': 'Economy',
    'search.business': 'Business',
    'search.first': 'Erste',
    'search.stops': 'Zwischenstopps',
    'search.any_stops': 'Beliebig',
    'search.nonstop': 'Direktflug',
    'search.one_stop': '1 Stopp',
    'search.two_plus_stops': '2+ Stopps',

    // Deals
    'deals.loading': 'Lade fantastische Angebote...',
    'deals.error': 'Fehler beim Laden der Angebote',
    'deals.no_deals':
      'Keine Angebote gefunden, die Ihren Kriterien entsprechen',
    'deals.try_different':
      'Versuchen Sie, Ihre Suche anzupassen oder schauen Sie später vorbei',
    'deals.view_details': 'Details Anzeigen',
    'deals.book_now': 'Jetzt Buchen',
    'deals.save_amount': 'Sparen',
    'deals.ai_insight': 'KI-Einblick',
    'deals.confidence': 'Vertrauen',
    'deals.stops': 'Stopps',
    'deals.nonstop': 'Direktflug',
    'deals.one_stop': '1 Stopp',
    'deals.multi_stop': 'Stopps',
    'deals.duration': 'Dauer',
    'deals.price_trend_up': 'Preise steigen',
    'deals.price_trend_down': 'Preise fallen',
    'deals.price_trend_stable': 'Preise stabil',
    'deals.book_now_action': 'Jetzt buchen - Preise steigen!',
    'deals.wait_action': 'Warten - Preise könnten fallen',
    'deals.monitor_action': 'Überwachen - stabile Preise',

    // Common
    'common.loading': 'Laden...',
    'common.error': 'Etwas ist schief gelaufen',
    'common.try_again': 'Erneut versuchen',
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'common.close': 'Schließen',
    'common.back': 'Zurück',
    'common.next': 'Weiter',
    'common.previous': 'Vorherige',
    'common.search': 'Suchen',
    'common.filter': 'Filtern',
    'common.sort': 'Sortieren',
    'common.clear': 'Löschen',
    'common.apply': 'Anwenden',
    'common.reset': 'Zurücksetzen',
    'common.ok': 'OK',
    'common.yes': 'Ja',
    'common.no': 'Nein',
    'common.select': 'Auswählen',
    'common.required': 'Erforderlich',
    'common.optional': 'Optional',

    // Settings
    'settings.title': 'Einstellungen',
    'settings.language': 'Sprache und Region',
    'settings.currency': 'Währung',
    'settings.preferences': 'Einstellungen',
    'settings.theme': 'Design',
    'settings.light': 'Hell',
    'settings.dark': 'Dunkel',
    'settings.system': 'System',
    'settings.notifications': 'Benachrichtigungen',
    'settings.account': 'Konto',
    'settings.privacy': 'Datenschutz',
    'settings.help': 'Hilfe',

    // Errors
    'error.network': 'Netzwerkfehler. Bitte überprüfen Sie Ihre Verbindung.',
    'error.timeout': 'Zeitüberschreitung. Bitte versuchen Sie es erneut.',
    'error.server': 'Serverfehler. Bitte versuchen Sie es später erneut.',
    'error.not_found': 'Seite nicht gefunden.',
    'error.unauthorized':
      'Sie sind nicht berechtigt, auf diese Ressource zuzugreifen.',
    'error.validation':
      'Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut.',
    'error.generic': 'Ein unerwarteter Fehler ist aufgetreten.',

    // Forms
    'form.required_field': 'Dieses Feld ist erforderlich',
    'form.invalid_email': 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
    'form.invalid_phone': 'Bitte geben Sie eine gültige Telefonnummer ein',
    'form.password_too_short':
      'Das Passwort muss mindestens 8 Zeichen lang sein',
    'form.passwords_dont_match': 'Die Passwörter stimmen nicht überein',
    'form.invalid_date': 'Bitte wählen Sie ein gültiges Datum',
    'form.future_date_required': 'Bitte wählen Sie ein zukünftiges Datum',

    // Auth
    'auth.sign_in': 'Anmelden',
    'auth.sign_up': 'Registrieren',
    'auth.sign_out': 'Abmelden',
    'auth.email': 'E-Mail',
    'auth.password': 'Passwort',
    'auth.confirm_password': 'Passwort bestätigen',
    'auth.forgot_password': 'Passwort vergessen?',
    'auth.remember_me': 'Angemeldet bleiben',
    'auth.already_have_account': 'Haben Sie bereits ein Konto?',
    'auth.dont_have_account': 'Haben Sie noch kein Konto?',

    // User Menu
    'user.profile': 'Profil',
    'user.bookings': 'Meine Buchungen',
    'user.preferences': 'Einstellungen',
    'user.notifications': 'Benachrichtigungen',
    'user.help': 'Hilfe & Support',
    'user.sign_out': 'Abmelden',

    // Accessibility
    'a11y.skip_to_content': 'Zum Hauptinhalt springen',
    'a11y.menu': 'Hauptmenü',
    'a11y.search': 'Suchen',
    'a11y.user_menu': 'Benutzermenü',
    'a11y.settings': 'Einstellungen',
    'a11y.theme_toggle': 'Design wechseln',
    'a11y.language_toggle': 'Sprache wechseln',
    'a11y.close_dialog': 'Dialog schließen',
    'a11y.loading': 'Inhalt wird geladen',
    'a11y.error': 'Fehlermeldung',
    'a11y.success': 'Erfolgsmeldung',
    'a11y.warning': 'Warnmeldung',
    'a11y.info': 'Information',
  },
} as const;

export type TranslationKey = keyof (typeof translations)['en-US'];

// Translation helper function
export function getTranslation(
  key: TranslationKey,
  locale: string = 'en-US'
): string {
  const localeTranslations = translations[locale as keyof typeof translations];

  if (localeTranslations && key in localeTranslations) {
    return localeTranslations[key as keyof typeof localeTranslations] as string;
  }

  // Fallback to English
  return translations['en-US'][key];
}

// Date formatting presets
export const dateFormats = {
  short: { day: 'numeric', month: 'short' } as Intl.DateTimeFormatOptions,
  medium: {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  } as Intl.DateTimeFormatOptions,
  long: {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  } as Intl.DateTimeFormatOptions,
  time: { hour: '2-digit', minute: '2-digit' } as Intl.DateTimeFormatOptions,
  datetime: {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  } as Intl.DateTimeFormatOptions,
};

// Number formatting presets
export const numberFormats = {
  decimal: {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  } as Intl.NumberFormatOptions,
  integer: {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  } as Intl.NumberFormatOptions,
  percent: {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  } as Intl.NumberFormatOptions,
};

// Distance formatting utility
export function formatDistance(
  distance: number,
  unit: 'km' | 'mi' = 'km',
  localeCode: string = 'en-US'
): string {
  const formatter = new Intl.NumberFormat(localeCode, {
    maximumFractionDigits: 0,
  });
  const formattedDistance = formatter.format(distance);

  return `${formattedDistance} ${unit}`;
}

// Duration formatting utility
export function formatDuration(
  minutes: number,
  _localeCode: string = 'en-US'
): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  const hourLabel = hours === 1 ? 'hr' : 'hrs';
  const minLabel = mins === 1 ? 'min' : 'mins';

  if (hours === 0) {
    return `${mins} ${minLabel}`;
  }

  if (mins === 0) {
    return `${hours} ${hourLabel}`;
  }

  return `${hours} ${hourLabel} ${mins} ${minLabel}`;
}

// Price comparison formatting
export function formatPriceComparison(
  currentPrice: number,
  originalPrice: number,
  currency: string,
  localeCode: string = 'en-US'
): {
  current: string;
  original: string;
  savings: string;
  percentage: string;
} {
  const formatter = new Intl.NumberFormat(localeCode, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const savings = originalPrice - currentPrice;
  const percentage = (savings / originalPrice) * 100;

  return {
    current: formatter.format(currentPrice),
    original: formatter.format(originalPrice),
    savings: formatter.format(savings),
    percentage: `${Math.round(percentage)}%`,
  };
}
