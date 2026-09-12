import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'es';

interface Translations {
  // Navigation
  nav: {
    home: string;
    book: string;
    about: string;
    contact: string;
  };
  // Home Page
  home: {
    heroTitle: string;
    heroSubtitle: string;
    heroCTA: string;
    welcomeTitle: string;
    welcomeText: string;
    featuresTitle: string;
    feature1Title: string;
    feature1Text: string;
    feature2Title: string;
    feature2Text: string;
    feature3Title: string;
    feature3Text: string;
    feature4Title: string;
    feature4Text: string;
    statsBedsAvailable: string;
    statsPrice: string;
    statsPilgrims: string;
    statsRating: string;
    locationTitle: string;
    locationSubtitle: string;
    caminoRoute: string;
    romanRuins: string;
    medievalTowns: string;
    landscapes: string;
    hiking: string;
  };
  // Booking Flow
  booking: {
    title: string;
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    step5: string;
    step6: string;
    step7: string;
    selectDates: string;
    checkIn: string;
    checkOut: string;
    uploadID: string;
    uploadIDText: string;
    personalInfo: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    nationality: string;
    address: string;
    selectBed: string;
    dormitory: string;
    available: string;
    occupied: string;
    selected: string;
    payment: string;
    paymentMethod: string;
    card: string;
    cash: string;
    transfer: string;
    summary: string;
    totalNights: string;
    pricePerNight: string;
    totalPrice: string;
    confirmBooking: string;
    next: string;
    back: string;
  };
  // Dashboard
  dashboard: {
    welcome: string;
    myBooking: string;
    bookingDetails: string;
    checkInDate: string;
    checkOutDate: string;
    bedNumber: string;
    status: string;
    confirmed: string;
    pending: string;
    cancelled: string;
    cancelBooking: string;
    downloadReceipt: string;
  };
  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    confirm: string;
    close: string;
    save: string;
    edit: string;
    delete: string;
    search: string;
    filter: string;
    sort: string;
    perNight: string;
    beds: string;
    nights: string;
  };
}

const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: 'Home',
      book: 'Book Now',
      about: 'About',
      contact: 'Contact',
    },
    home: {
      heroTitle: 'Welcome to Carrascalejo',
      heroSubtitle: 'Your refuge on the Vía de la Plata',
      heroCTA: 'Book Your Stay',
      welcomeTitle: 'A Pilgrim\'s Haven',
      welcomeText: 'Experience authentic hospitality on your Camino journey. Our municipal hostel offers comfortable beds, warm meals, and a community of fellow pilgrims.',
      featuresTitle: 'Why Stay With Us',
      feature1Title: 'Prime Location',
      feature1Text: 'Right on the Vía de la Plata route',
      feature2Title: 'Affordable Rates',
      feature2Text: 'Only €10 per night',
      feature3Title: 'Modern Facilities',
      feature3Text: 'Clean showers, kitchen, and Wi-Fi',
      feature4Title: 'Warm Welcome',
      feature4Text: 'Friendly staff and pilgrim community',
      statsBedsAvailable: 'Beds Available',
      statsPrice: 'Price/Night',
      statsPilgrims: 'Pilgrims Hosted',
      statsRating: 'Rating',
      locationTitle: 'Explore the Area',
      locationSubtitle: 'Discover the beauty of Extremadura',
      caminoRoute: 'The Camino',
      romanRuins: 'Roman Ruins',
      medievalTowns: 'Medieval Towns',
      landscapes: 'Natural Landscapes',
      hiking: 'Hiking & Nature',
    },
    booking: {
      title: 'Book Your Stay',
      step1: 'Select Dates',
      step2: 'Upload ID',
      step3: 'Personal Info',
      step4: 'Choose Bed',
      step5: 'Payment',
      step6: 'Summary',
      step7: 'Confirmation',
      selectDates: 'When are you arriving?',
      checkIn: 'Check-in',
      checkOut: 'Check-out',
      uploadID: 'Upload your ID or Passport',
      uploadIDText: 'Drag and drop your document or click to browse',
      personalInfo: 'Tell us about yourself',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone Number',
      nationality: 'Nationality',
      address: 'Address',
      selectBed: 'Choose your bed',
      dormitory: 'Dormitory',
      available: 'Available',
      occupied: 'Occupied',
      selected: 'Selected',
      payment: 'Payment Method',
      paymentMethod: 'How would you like to pay?',
      card: 'Credit/Debit Card',
      cash: 'Cash on Arrival',
      transfer: 'Bank Transfer',
      summary: 'Review your booking',
      totalNights: 'Total Nights',
      pricePerNight: 'Price per Night',
      totalPrice: 'Total Price',
      confirmBooking: 'Confirm Booking',
      next: 'Next',
      back: 'Back',
    },
    dashboard: {
      welcome: 'Welcome back',
      myBooking: 'My Booking',
      bookingDetails: 'Booking Details',
      checkInDate: 'Check-in',
      checkOutDate: 'Check-out',
      bedNumber: 'Bed Number',
      status: 'Status',
      confirmed: 'Confirmed',
      pending: 'Pending',
      cancelled: 'Cancelled',
      cancelBooking: 'Cancel Booking',
      downloadReceipt: 'Download Receipt',
    },
    common: {
      loading: 'Loading...',
      error: 'Something went wrong',
      success: 'Success!',
      cancel: 'Cancel',
      confirm: 'Confirm',
      close: 'Close',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      perNight: 'per night',
      beds: 'beds',
      nights: 'nights',
    },
  },
  es: {
    nav: {
      home: 'Inicio',
      book: 'Reservar',
      about: 'Acerca de',
      contact: 'Contacto',
    },
    home: {
      heroTitle: 'Bienvenido a Carrascalejo',
      heroSubtitle: 'Tu refugio en la Vía de la Plata',
      heroCTA: 'Reserva tu Estancia',
      welcomeTitle: 'Un Refugio de Peregrinos',
      welcomeText: 'Experimenta la auténtica hospitalidad en tu viaje por el Camino. Nuestro albergue municipal ofrece camas cómodas, comidas calientes y una comunidad de peregrinos.',
      featuresTitle: 'Por Qué Quedarse Con Nosotros',
      feature1Title: 'Ubicación Privilegiada',
      feature1Text: 'Justo en la ruta de la Vía de la Plata',
      feature2Title: 'Tarifas Asequibles',
      feature2Text: 'Solo €10 por noche',
      feature3Title: 'Instalaciones Modernas',
      feature3Text: 'Duchas limpias, cocina y Wi-Fi',
      feature4Title: 'Cálida Bienvenida',
      feature4Text: 'Personal amable y comunidad de peregrinos',
      statsBedsAvailable: 'Camas Disponibles',
      statsPrice: 'Precio/Noche',
      statsPilgrims: 'Peregrinos Alojados',
      statsRating: 'Valoración',
      locationTitle: 'Explora la Zona',
      locationSubtitle: 'Descubre la belleza de Extremadura',
      caminoRoute: 'El Camino',
      romanRuins: 'Ruinas Romanas',
      medievalTowns: 'Pueblos Medievales',
      landscapes: 'Paisajes Naturales',
      hiking: 'Senderismo y Naturaleza',
    },
    booking: {
      title: 'Reserva tu Estancia',
      step1: 'Seleccionar Fechas',
      step2: 'Subir DNI',
      step3: 'Información Personal',
      step4: 'Elegir Cama',
      step5: 'Pago',
      step6: 'Resumen',
      step7: 'Confirmación',
      selectDates: '¿Cuándo llegas?',
      checkIn: 'Entrada',
      checkOut: 'Salida',
      uploadID: 'Sube tu DNI o Pasaporte',
      uploadIDText: 'Arrastra y suelta tu documento o haz clic para buscar',
      personalInfo: 'Cuéntanos sobre ti',
      firstName: 'Nombre',
      lastName: 'Apellidos',
      email: 'Correo Electrónico',
      phone: 'Número de Teléfono',
      nationality: 'Nacionalidad',
      address: 'Dirección',
      selectBed: 'Elige tu cama',
      dormitory: 'Dormitorio',
      available: 'Disponible',
      occupied: 'Ocupada',
      selected: 'Seleccionada',
      payment: 'Método de Pago',
      paymentMethod: '¿Cómo te gustaría pagar?',
      card: 'Tarjeta de Crédito/Débito',
      cash: 'Efectivo a la Llegada',
      transfer: 'Transferencia Bancaria',
      summary: 'Revisa tu reserva',
      totalNights: 'Noches Totales',
      pricePerNight: 'Precio por Noche',
      totalPrice: 'Precio Total',
      confirmBooking: 'Confirmar Reserva',
      next: 'Siguiente',
      back: 'Atrás',
    },
    dashboard: {
      welcome: 'Bienvenido de nuevo',
      myBooking: 'Mi Reserva',
      bookingDetails: 'Detalles de la Reserva',
      checkInDate: 'Entrada',
      checkOutDate: 'Salida',
      bedNumber: 'Número de Cama',
      status: 'Estado',
      confirmed: 'Confirmada',
      pending: 'Pendiente',
      cancelled: 'Cancelada',
      cancelBooking: 'Cancelar Reserva',
      downloadReceipt: 'Descargar Recibo',
    },
    common: {
      loading: 'Cargando...',
      error: 'Algo salió mal',
      success: '¡Éxito!',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      close: 'Cerrar',
      save: 'Guardar',
      edit: 'Editar',
      delete: 'Eliminar',
      search: 'Buscar',
      filter: 'Filtrar',
      sort: 'Ordenar',
      perNight: 'por noche',
      beds: 'camas',
      nights: 'noches',
    },
  },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    // Check localStorage for saved language preference
    const saved = localStorage.getItem('language');
    if (saved === 'en' || saved === 'es') {
      return saved;
    }
    // Default to Spanish for Spain-based hostel
    return 'es';
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const value = {
    language,
    setLanguage: handleSetLanguage,
    t: translations[language],
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
