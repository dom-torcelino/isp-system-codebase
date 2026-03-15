export type Locale = 'en' | 'es' | 'tl';

export interface TranslationKeys {
  // Common
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    create: string;
    search: string;
    filter: string;
    export: string;
    import: string;
    loading: string;
    error: string;
    success: string;
    confirm: string;
    back: string;
    next: string;
    previous: string;
    close: string;
    submit: string;
    reset: string;
    clear: string;
    apply: string;
    viewAll: string;
    refresh: string;
    yes: string;
    no: string;
  };

  // Navigation
  nav: {
    overview: string;
    tickets: string;
    billing: string;
    revenue: string;
    crm: string;
    technicians: string;
    compliance: string;
    integrations: string;
    reports: string;
    tenants: string;
    portal: string;
    auth: string;
    settings: string;
  };

  // TopBar
  topBar: {
    dateRanges: {
      '7d': string;
      '30d': string;
      '90d': string;
      'ytd': string;
      'all': string;
    };
    notifications: string;
    profile: string;
    logout: string;
    switchTenant: string;
    switchRole: string;
    toggleTheme: string;
    language: string;
  };

  // Roles
  roles: {
    SuperAdmin: string;
    SystemAdmin: string;
    Support: string;
    Technician: string;
  };

  // Dashboard
  dashboard: {
    title: string;
    welcome: string;
    overview: string;
    activeCustomers: string;
    monthlyRevenue: string;
    openTickets: string;
    networkUptime: string;
    recentActivity: string;
    quickActions: string;
  };

  // Tickets
  tickets: {
    title: string;
    newTicket: string;
    allTickets: string;
    myTickets: string;
    status: {
      open: string;
      inProgress: string;
      resolved: string;
      closed: string;
    };
    priority: {
      high: string;
      medium: string;
      low: string;
    };
    assignedTo: string;
    createdBy: string;
    lastUpdated: string;
  };

  // Billing
  billing: {
    title: string;
    invoices: string;
    payments: string;
    overdue: string;
    paid: string;
    pending: string;
    dueDate: string;
    amount: string;
    customer: string;
    generateInvoice: string;
    recordPayment: string;
  };

  // Tenant Management
  tenants: {
    title: string;
    addTenant: string;
    tenantDetails: string;
    companyInfo: string;
    subscriptionPlan: string;
    adminUser: string;
    branding: string;
    status: {
      active: string;
      inactive: string;
      suspended: string;
      trial: string;
    };
    createTenant: string;
    saveDraft: string;
  };

  // Wizard
  wizard: {
    step: string;
    of: string;
    complete: string;
    companyName: string;
    businessAddress: string;
    contactEmail: string;
    contactPhone: string;
    required: string;
    validation: {
      required: string;
      invalidEmail: string;
      invalidPhone: string;
      minLength: string;
    };
  };

  // Settings
  settings: {
    title: string;
    general: string;
    security: string;
    notifications: string;
    appearance: string;
    language: string;
    timezone: string;
    changePassword: string;
    twoFactor: string;
  };

  // Messages
  messages: {
    welcomeBack: string;
    signedOut: string;
    changesSaved: string;
    errorOccurred: string;
    confirmDelete: string;
    noData: string;
    accessDenied: string;
    draftSaved: string;
    gatewayVerified: string;
  };

  // Login
  login: {
    title: string;
    subtitle: string;
    username: string;
    password: string;
    rememberMe: string;
    forgotPassword: string;
    signIn: string;
    demoCredentials: string;
  };

  // Logout
  logout: {
    confirmTitle: string;
    confirmMessage: string;
    confirm: string;
    cancel: string;
  };
}

export const translations: Record<Locale, TranslationKeys> = {
  en: {
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      search: 'Search',
      filter: 'Filter',
      export: 'Export',
      import: 'Import',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      close: 'Close',
      submit: 'Submit',
      reset: 'Reset',
      clear: 'Clear',
      apply: 'Apply',
      viewAll: 'View all',
      refresh: 'Refresh',
      yes: 'Yes',
      no: 'No',
    },
    nav: {
      overview: 'Overview',
      tickets: 'Tickets',
      billing: 'Billing',
      revenue: 'Revenue',
      crm: 'CRM',
      technicians: 'Technicians',
      compliance: 'Compliance',
      integrations: 'Integrations',
      reports: 'Reports',
      tenants: 'Tenants',
      portal: 'Customer Portal',
      auth: 'Auth & Security',
      settings: 'Settings',
    },
    topBar: {
      dateRanges: {
        '7d': 'Last 7 days',
        '30d': 'Last 30 days',
        '90d': 'Last 90 days',
        'ytd': 'Year to date',
        'all': 'All time',
      },
      notifications: 'Notifications',
      profile: 'Profile',
      logout: 'Logout',
      switchTenant: 'Switch tenant',
      switchRole: 'Switch role',
      toggleTheme: 'Toggle theme',
      language: 'Language',
    },
    roles: {
      SuperAdmin: 'Super Admin',
      SystemAdmin: 'System Admin',
      Support: 'Support',
      Technician: 'Technician',
    },
    dashboard: {
      title: 'Dashboard',
      welcome: 'Welcome back',
      overview: 'Overview',
      activeCustomers: 'Active Customers',
      monthlyRevenue: 'Monthly Revenue',
      openTickets: 'Open Tickets',
      networkUptime: 'Network Uptime',
      recentActivity: 'Recent Activity',
      quickActions: 'Quick Actions',
    },
    tickets: {
      title: 'Tickets',
      newTicket: 'New Ticket',
      allTickets: 'All Tickets',
      myTickets: 'My Tickets',
      status: {
        open: 'Open',
        inProgress: 'In Progress',
        resolved: 'Resolved',
        closed: 'Closed',
      },
      priority: {
        high: 'High',
        medium: 'Medium',
        low: 'Low',
      },
      assignedTo: 'Assigned to',
      createdBy: 'Created by',
      lastUpdated: 'Last updated',
    },
    billing: {
      title: 'Billing',
      invoices: 'Invoices',
      payments: 'Payments',
      overdue: 'Overdue',
      paid: 'Paid',
      pending: 'Pending',
      dueDate: 'Due date',
      amount: 'Amount',
      customer: 'Customer',
      generateInvoice: 'Generate Invoice',
      recordPayment: 'Record Payment',
    },
    tenants: {
      title: 'Tenant Management',
      addTenant: 'Add tenant',
      tenantDetails: 'Tenant Details',
      companyInfo: 'Company Information',
      subscriptionPlan: 'Subscription Plan',
      adminUser: 'Admin User',
      branding: 'Branding',
      status: {
        active: 'Active',
        inactive: 'Inactive',
        suspended: 'Suspended',
        trial: 'Trial',
      },
      createTenant: 'Create Tenant',
      saveDraft: 'Save draft',
    },
    wizard: {
      step: 'Step',
      of: 'of',
      complete: 'Complete',
      companyName: 'ISP Company Name',
      businessAddress: 'Business Address',
      contactEmail: 'Contact Email',
      contactPhone: 'Contact Phone',
      required: 'Required',
      validation: {
        required: 'This field is required',
        invalidEmail: 'Valid email is required',
        invalidPhone: 'Valid phone is required',
        minLength: 'Minimum length not met',
      },
    },
    settings: {
      title: 'Settings',
      general: 'General',
      security: 'Security',
      notifications: 'Notifications',
      appearance: 'Appearance',
      language: 'Language',
      timezone: 'Timezone',
      changePassword: 'Change Password',
      twoFactor: 'Two-Factor Auth',
    },
    messages: {
      welcomeBack: 'Welcome back!',
      signedOut: 'Signed out',
      changesSaved: 'Changes saved',
      errorOccurred: 'An error occurred',
      confirmDelete: 'Are you sure you want to delete this?',
      noData: 'No data available',
      accessDenied: 'Access denied',
      draftSaved: 'Draft saved',
      gatewayVerified: 'Gateway verified',
    },
    login: {
      title: 'ISP Management Platform',
      subtitle: 'Sign in to your account',
      username: 'Username',
      password: 'Password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      signIn: 'Sign in',
      demoCredentials: 'Demo credentials',
    },
    logout: {
      confirmTitle: 'Sign Out',
      confirmMessage: 'Are you sure you want to sign out?',
      confirm: 'Sign out',
      cancel: 'Cancel',
    },
  },
  es: {
    common: {
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      create: 'Crear',
      search: 'Buscar',
      filter: 'Filtrar',
      export: 'Exportar',
      import: 'Importar',
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      confirm: 'Confirmar',
      back: 'Atrás',
      next: 'Siguiente',
      previous: 'Anterior',
      close: 'Cerrar',
      submit: 'Enviar',
      reset: 'Restablecer',
      clear: 'Limpiar',
      apply: 'Aplicar',
      viewAll: 'Ver todo',
      refresh: 'Actualizar',
      yes: 'Sí',
      no: 'No',
    },
    nav: {
      overview: 'Resumen',
      tickets: 'Tickets',
      billing: 'Facturación',
      revenue: 'Ingresos',
      crm: 'CRM',
      technicians: 'Técnicos',
      compliance: 'Cumplimiento',
      integrations: 'Integraciones',
      reports: 'Informes',
      tenants: 'Inquilinos',
      portal: 'Portal de Cliente',
      auth: 'Auth y Seguridad',
      settings: 'Configuración',
    },
    topBar: {
      dateRanges: {
        '7d': 'Últimos 7 días',
        '30d': 'Últimos 30 días',
        '90d': 'Últimos 90 días',
        'ytd': 'Año hasta la fecha',
        'all': 'Todo el tiempo',
      },
      notifications: 'Notificaciones',
      profile: 'Perfil',
      logout: 'Cerrar sesión',
      switchTenant: 'Cambiar inquilino',
      switchRole: 'Cambiar rol',
      toggleTheme: 'Cambiar tema',
      language: 'Idioma',
    },
    roles: {
      SuperAdmin: 'Super Administrador',
      SystemAdmin: 'Administrador del Sistema',
      Support: 'Soporte',
      Technician: 'Técnico',
    },
    dashboard: {
      title: 'Panel de Control',
      welcome: 'Bienvenido de nuevo',
      overview: 'Resumen',
      activeCustomers: 'Clientes Activos',
      monthlyRevenue: 'Ingresos Mensuales',
      openTickets: 'Tickets Abiertos',
      networkUptime: 'Tiempo de Actividad',
      recentActivity: 'Actividad Reciente',
      quickActions: 'Acciones Rápidas',
    },
    tickets: {
      title: 'Tickets',
      newTicket: 'Nuevo Ticket',
      allTickets: 'Todos los Tickets',
      myTickets: 'Mis Tickets',
      status: {
        open: 'Abierto',
        inProgress: 'En Progreso',
        resolved: 'Resuelto',
        closed: 'Cerrado',
      },
      priority: {
        high: 'Alta',
        medium: 'Media',
        low: 'Baja',
      },
      assignedTo: 'Asignado a',
      createdBy: 'Creado por',
      lastUpdated: 'Última actualización',
    },
    billing: {
      title: 'Facturación',
      invoices: 'Facturas',
      payments: 'Pagos',
      overdue: 'Vencido',
      paid: 'Pagado',
      pending: 'Pendiente',
      dueDate: 'Fecha de vencimiento',
      amount: 'Monto',
      customer: 'Cliente',
      generateInvoice: 'Generar Factura',
      recordPayment: 'Registrar Pago',
    },
    tenants: {
      title: 'Gestión de Inquilinos',
      addTenant: 'Agregar inquilino',
      tenantDetails: 'Detalles del Inquilino',
      companyInfo: 'Información de la Empresa',
      subscriptionPlan: 'Plan de Suscripción',
      adminUser: 'Usuario Administrador',
      branding: 'Marca',
      status: {
        active: 'Activo',
        inactive: 'Inactivo',
        suspended: 'Suspendido',
        trial: 'Prueba',
      },
      createTenant: 'Crear Inquilino',
      saveDraft: 'Guardar borrador',
    },
    wizard: {
      step: 'Paso',
      of: 'de',
      complete: 'Completar',
      companyName: 'Nombre de la Empresa ISP',
      businessAddress: 'Dirección Comercial',
      contactEmail: 'Correo de Contacto',
      contactPhone: 'Teléfono de Contacto',
      required: 'Obligatorio',
      validation: {
        required: 'Este campo es obligatorio',
        invalidEmail: 'Se requiere un correo válido',
        invalidPhone: 'Se requiere un teléfono válido',
        minLength: 'Longitud mínima no alcanzada',
      },
    },
    settings: {
      title: 'Configuración',
      general: 'General',
      security: 'Seguridad',
      notifications: 'Notificaciones',
      appearance: 'Apariencia',
      language: 'Idioma',
      timezone: 'Zona Horaria',
      changePassword: 'Cambiar Contraseña',
      twoFactor: 'Autenticación de Dos Factores',
    },
    messages: {
      welcomeBack: '¡Bienvenido de nuevo!',
      signedOut: 'Sesión cerrada',
      changesSaved: 'Cambios guardados',
      errorOccurred: 'Ocurrió un error',
      confirmDelete: '¿Está seguro de que desea eliminar esto?',
      noData: 'No hay datos disponibles',
      accessDenied: 'Acceso denegado',
      draftSaved: 'Borrador guardado',
      gatewayVerified: 'Puerta de enlace verificada',
    },
    login: {
      title: 'Plataforma de Gestión ISP',
      subtitle: 'Inicie sesión en su cuenta',
      username: 'Usuario',
      password: 'Contraseña',
      rememberMe: 'Recordarme',
      forgotPassword: '¿Olvidó su contraseña?',
      signIn: 'Iniciar sesión',
      demoCredentials: 'Credenciales de demostración',
    },
    logout: {
      confirmTitle: 'Cerrar Sesión',
      confirmMessage: '¿Está seguro de que desea cerrar sesión?',
      confirm: 'Cerrar sesión',
      cancel: 'Cancelar',
    },
  },
  tl: {
    common: {
      save: 'I-save',
      cancel: 'Kanselahin',
      delete: 'Tanggalin',
      edit: 'I-edit',
      create: 'Lumikha',
      search: 'Maghanap',
      filter: 'I-filter',
      export: 'I-export',
      import: 'I-import',
      loading: 'Naglo-load...',
      error: 'Error',
      success: 'Tagumpay',
      confirm: 'Kumpirmahin',
      back: 'Bumalik',
      next: 'Susunod',
      previous: 'Nakaraan',
      close: 'Isara',
      submit: 'Isumite',
      reset: 'I-reset',
      clear: 'Linisin',
      apply: 'Ilapat',
      viewAll: 'Tingnan lahat',
      refresh: 'I-refresh',
      yes: 'Oo',
      no: 'Hindi',
    },
    nav: {
      overview: 'Pangkalahatang-ideya',
      tickets: 'Mga Ticket',
      billing: 'Pagsingil',
      revenue: 'Kita',
      crm: 'CRM',
      technicians: 'Mga Teknisyan',
      compliance: 'Pagsunod',
      integrations: 'Mga Integrasyon',
      reports: 'Mga Ulat',
      tenants: 'Mga Tenant',
      portal: 'Portal ng Customer',
      auth: 'Auth at Seguridad',
      settings: 'Mga Setting',
    },
    topBar: {
      dateRanges: {
        '7d': 'Huling 7 araw',
        '30d': 'Huling 30 araw',
        '90d': 'Huling 90 araw',
        'ytd': 'Taon hanggang ngayon',
        'all': 'Lahat ng oras',
      },
      notifications: 'Mga Notipikasyon',
      profile: 'Profile',
      logout: 'Mag-logout',
      switchTenant: 'Magpalit ng tenant',
      switchRole: 'Magpalit ng role',
      toggleTheme: 'Palitan ang tema',
      language: 'Wika',
    },
    roles: {
      SuperAdmin: 'Super Admin',
      SystemAdmin: 'System Admin',
      Support: 'Suporta',
      Technician: 'Teknisyan',
    },
    dashboard: {
      title: 'Dashboard',
      welcome: 'Maligayang pagbabalik',
      overview: 'Pangkalahatang-ideya',
      activeCustomers: 'Aktibong Mga Customer',
      monthlyRevenue: 'Buwanang Kita',
      openTickets: 'Bukas na Tickets',
      networkUptime: 'Network Uptime',
      recentActivity: 'Kamakailang Aktibidad',
      quickActions: 'Mabilis na Aksyon',
    },
    tickets: {
      title: 'Mga Ticket',
      newTicket: 'Bagong Ticket',
      allTickets: 'Lahat ng Tickets',
      myTickets: 'Aking Mga Ticket',
      status: {
        open: 'Bukas',
        inProgress: 'Isinasagawa',
        resolved: 'Nalutas',
        closed: 'Sarado',
      },
      priority: {
        high: 'Mataas',
        medium: 'Katamtaman',
        low: 'Mababa',
      },
      assignedTo: 'Nakatalaga sa',
      createdBy: 'Nilikha ni',
      lastUpdated: 'Huling na-update',
    },
    billing: {
      title: 'Pagsingil',
      invoices: 'Mga Invoice',
      payments: 'Mga Bayad',
      overdue: 'Nakaraang Deadline',
      paid: 'Bayad',
      pending: 'Nakabinbin',
      dueDate: 'Petsa ng deadline',
      amount: 'Halaga',
      customer: 'Customer',
      generateInvoice: 'Lumikha ng Invoice',
      recordPayment: 'I-record ang Bayad',
    },
    tenants: {
      title: 'Pamamahala ng Tenant',
      addTenant: 'Magdagdag ng tenant',
      tenantDetails: 'Mga Detalye ng Tenant',
      companyInfo: 'Impormasyon ng Kumpanya',
      subscriptionPlan: 'Plano ng Subscription',
      adminUser: 'Admin User',
      branding: 'Branding',
      status: {
        active: 'Aktibo',
        inactive: 'Hindi Aktibo',
        suspended: 'Suspendido',
        trial: 'Trial',
      },
      createTenant: 'Lumikha ng Tenant',
      saveDraft: 'I-save ang draft',
    },
    wizard: {
      step: 'Hakbang',
      of: 'ng',
      complete: 'Kumpletuhin',
      companyName: 'Pangalan ng Kumpanyang ISP',
      businessAddress: 'Address ng Negosyo',
      contactEmail: 'Email ng Contact',
      contactPhone: 'Telepono ng Contact',
      required: 'Kinakailangan',
      validation: {
        required: 'Kinakailangan ang field na ito',
        invalidEmail: 'Kailangan ng valid na email',
        invalidPhone: 'Kailangan ng valid na telepono',
        minLength: 'Hindi umabot sa minimum na haba',
      },
    },
    settings: {
      title: 'Mga Setting',
      general: 'Pangkalahatan',
      security: 'Seguridad',
      notifications: 'Mga Notipikasyon',
      appearance: 'Hitsura',
      language: 'Wika',
      timezone: 'Timezone',
      changePassword: 'Palitan ang Password',
      twoFactor: 'Two-Factor Auth',
    },
    messages: {
      welcomeBack: 'Maligayang pagbabalik!',
      signedOut: 'Nag-sign out na',
      changesSaved: 'Nai-save ang mga pagbabago',
      errorOccurred: 'May naganap na error',
      confirmDelete: 'Sigurado ka bang gusto mong tanggalin ito?',
      noData: 'Walang available na data',
      accessDenied: 'Hindi pinapayagan ang access',
      draftSaved: 'Nai-save ang draft',
      gatewayVerified: 'Na-verify ang gateway',
    },
    login: {
      title: 'Platform ng Pamamahala ng ISP',
      subtitle: 'Mag-sign in sa iyong account',
      username: 'Username',
      password: 'Password',
      rememberMe: 'Tandaan ako',
      forgotPassword: 'Nakalimutan ang password?',
      signIn: 'Mag-sign in',
      demoCredentials: 'Mga demo credentials',
    },
    logout: {
      confirmTitle: 'Mag-Sign Out',
      confirmMessage: 'Sigurado ka bang gusto mong mag-sign out?',
      confirm: 'Mag-sign out',
      cancel: 'Kanselahin',
    },
  },
};

export function getTranslation(locale: Locale): TranslationKeys {
  return translations[locale] || translations.en;
}

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  tl: 'Tagalog',
};
