export type Locale = "en" | "id";

export const translations = {
  en: {
    // Common
    common: {
      save: "Save",
      cancel: "Cancel",
      confirm: "Confirm",
      delete: "Delete",
      edit: "Edit",
      close: "Close",
      loading: "Loading",
      search: "Search",
      settings: "Settings",
      continue: "Continue",
      understand: "Understand",
      yes: "Yes",
      no: "No",
      restartOnboarding: "Restart Onboarding Tour",
    },

    // Navbar
    navbar: {
      search: "Search",
      notifications: "Notifications",
      profile: "Profile",
      signOut: "Sign Out",
      language: "Language",
    },

    // Sidebar
    sidebar: {
      dashboard: "Dashboard",
      stokAlat: "Stok Alat",
      editor: "Editor",
      rekapan: "Rekapan",
      generateRekapan: "Generate Rekapan",
      additionalServices: "Additional Services",
      analytics: "Analytics",
      dashboardElements: "Dashboard Elements",
      services: "Services",
      firstService: "Stok Alat Editor",
      bikinTagihan: "Bikin Tagihan",
      addHarga: "Add Harga",
      allInOne: "All in One",
      cleanup: "Cleanup",
    },

    // Dashboard
    dashboard: {
      title: "Dashboard",
      subtitle: "Choose what to work on",

      // Service descriptions
      editorDescription: "Edit and manage equipment stock data",
      addHargaDescription: "Manage equipment rental prices",
      generateRekapanDescription: "Generate summary reports for multiple months",
      bikinTagihanDescription: "Create invoices and billing documents",
      allInOneDescription: "Access all features in one place",

      onboarding: {
        welcome: "Welcome! Let's get you started. Click 'Next' and then navigate to the Editor to begin managing your equipment stock data.",
      },
    },

    // Generate Rekapan Page
    generateRekapan: {
      title: "Generate Rekapan",
      subtitle: "Generate summary reports for equipment rental data across multiple months",
      goToEditor: "Go to Stok Alat Editor",

      // Onboarding steps
      onboarding: {
        step1: "First, select the start month (Bulan Mulai). This determines which month the rekapan generation will begin from.",
        step2: "After selecting a start month, you can optionally click this button to set initial Total Sewa Alat values. These represent equipment already rented out before the start month. You can ignore this by default if all equipment starts from zero.",
        step3: "Next, select the end month (Bulan Akhir). The system will generate rekapans for all months in this date range.",
        step4: "Finally, click this button to generate all rekapans for the selected date range. The system will create Excel files for each month.",
      },

      // Over Time Section
      overTime: {
        title: "Generate Over Time Rekapan",
        subtitle: "Generate summary reports for multiple months across a date range",
        optionalSettings: "Optional settings and configurations",
      },

      // Single Month Section
      singleMonth: {
        title: "Generate Single Month Rekapan",
        subtitle: "Quick generation for a specific month",
        infoText: "This generates a rekapan for a single month only. Use this for quick exports instead of generating multiple months. The start date from the settings above will be used as the reference date.",
        selectMonth: "Select Month",
        selectMonthPlaceholder: "Select a month...",
        generating: "Generating...",
        generateButton: "Generate Single Month Rekapan",
      },

      // Toast Messages
      toast: {
        pleaseSelectMonth: "Please select both a month and ensure start date is set",
        generatingSingle: "Generating single month rekapan...",
        singleSuccess: "Single rekapan generated and downloaded successfully!",
        singleFailed: "Failed to generate single rekapan",
      },

      // Info Modal
      infoModal: {
        title: "What is Generate Rekapan?",
        description: "Generate Rekapan is an automatic service that generates summary (recap) reports based on data from the main editor service.",
        mainFunctions: "Main Functions:",
        function1: "Collects equipment rental data from database for selected date range",
        function2: "Groups data by company name and equipment name",
        function3: "Creates structured Excel reports with automatic calculations",
        function4: "Maintains data continuity between months (previous month data carries forward)",
        note: "Note:",
        noteText: "This service takes data that has been input through the main editor (first service) and processes it into ready-to-use summary reports.",
      },

      // Settings
      settings: {
        rekapanSettings: "Rekapan Settings",
        selectDateRange: "Select date range",
        startMonth: "Start Month",
        endMonth: "End Month",
        selectStartMonth: "Select start month...",
        selectEndMonth: "Select end month...",
        selected: "Selected",
        pleaseSelectStart: "Please select a start date",
        pleaseSelectEnd: "Please select an end date",

        advancedSettings: "Advanced Settings",
        configureOptions: "Configure options",
        groupCompanyTypos: "Group Company Typos",
        migration: "Migration",
        groupCompanyTyposDesc: "Group similar company names to handle typos from old Excel data",
        groupCompanyTyposInfo: "You will be asked to verify automatic company name grouping to ensure data standardization.",
      },

      // Status
      status: {
        readyToGenerate: "Ready to Generate",
        willGenerateFrom: "You will generate rekapans from",
        to: "to",
        warningStartAfterEnd: "Warning: Start date is after end date!",
      },

      // Button
      generateButton: "Generate all rekapans",

      // Initial Total Sewa Alat Modal
      initialTotalSewaAlat: {
        buttonText: "Set Initial Total Sewa Alat",
        modalTitle: "Initial Total Sewa Alat Periode",
        modalDescription: "Set the starting baseline for each equipment type. These values represent equipment already rented out before the start month.",
        foundEquipment: "Found",
        equipmentTypes: "equipment types",
        setInitialTotals: "Set initial totals below (defaults to 0).",
        currentValue: "Current value:",
        units: "units",
        note: "Note:",
        noteText: "These values only apply to the first month of generation. Subsequent months will use calculated totals from previous months.",
        noData: "No equipment data found for the selected start month. Please add data to the Stok Alat Editor first.",
        errorLoading: "Error loading alat names:",
      },

      // Example Modal
      exampleModal: {
        title: "Generate Rekapan Example",
        description: "This example demonstrates how Stok Alat data is transformed into Generate Rekapan summaries.",
        stokAlatData: "Stok Alat Data",
        input: "Input",
        generatedRekapan: "Generated Rekapan",
        output: "Output",
        date: "Date",
        company: "Company",
        in: "In",
        out: "Out",
        totalSewaPeriode: "Total Sewa Periode",
      },
    },

    // Company Typo Grouping Modal
    companyTypoGrouping: {
      title: "Company Name Grouping",

      // Info section
      info: {
        whyImportant: "Why is this step important?",
        explanation1: "During the migration from the old Excel system, there may be typos in company names. The Generate Rekapan service groups data by name - if there are typos, the system cannot combine data that is actually the same.",
        explanation2: "The system has automatically grouped similar names (maximum 2 character difference). Your task is to verify these groupings and correct the standardized names.",
        eachGroupShows: "Each group displays:",
        nameVariations: "Name Variations:",
        nameVariationsDesc: "All spelling variations found in the data",
        standardizedName: "Standardized Name:",
        standardizedNameDesc: "The correct name to use (editable)",
        previousMonth: "Previous Month:",
        previousMonthDesc: "Name used last month (if available)",
        note: "Note:",
        noteText: "This verification step is only necessary during the migration period from the old non-systematic Excel sheets. Once data is standardized, this process will be simpler.",
      },

      // Stats
      stats: {
        totalGroups: "Total Groups",
        autoSuggested: "Auto-Suggested",
        needReview: "Need Review",
      },

      // Advanced mode
      advanced: {
        advancedMode: "Advanced Mode",
        advancedModeDesc: "Enable to manually move variations between groups",
        moveVariations: "Move Variations",
        enableMoveMode: "Enable Move Mode",
        moving: "Moving:",
        toGroup: "To Group:",
        step1: "Step 1: Click a variation name in the table to select it for moving",
        step2: "Step 2: Click a group to move to, or create a new group",
        createNewGroup: "Create New Group",
        confirmMove: "Confirm Move",
        confirmNewGroup: "Confirm New Group",
        cancelMove: "Cancel Move",
      },

      // Table
      table: {
        select: "Select",
        nameVariations: "Name Variations",
        standardizedName: "Standardized Name",
        previousMonth: "Previous Month",
        noSuggestion: "No suggestion",
        variations: "variations",
      },

      // Buttons
      confirmAndContinue: "Confirm and Continue",
    },

    // Validation messages
    validation: {
      mutualExclusivity: "Validation Error: Masuk and Keluar are mutually exclusive. Only one field can have a value, the other must be 0 or empty.",
      cannotSave: "Cannot save:",
      rowsWithBothValues: "row(s) have both Masuk and Keluar with values. Please fix these rows first.",
    },

    // Warnings Panel
    warnings: {
      title: "Warnings",
      bothHaveValues: "Both Masuk and Keluar have values:",
      unregisteredCompany: "Unregistered company name",
      row: "Row",
      masuk: "Masuk:",
      keluar: "Keluar:",
    },

    // Stok Alat Editor Info Modal
    stokAlatEditor: {
      // Page title
      learnMore: "Learn more about Stok Alat Editor",
      manageEquipmentData: "Manage equipment stock data for",
      allEquipment: "all equipment",
      equipmentStockData: "Equipment Stock Data",
      editingWorksheet: "Editing:",
      selectWorkbook: "Select a workbook to begin",
      viewDataInstructions: "You can view each alat's data per month by",
      selecting: "selecting",
      theDropdown: "the",
      selectWorkbookDropdown: '"Select your workbook"',
      dropdown: "dropdown.",

      // Onboarding steps
      onboarding: {
        step1: "First, select the date/month you want to work with. This determines which month's data you'll be editing.",
        step2: "Next, select the workbook (equipment type) you want to manage. Each workbook represents a different piece of equipment.",
        step3: "This is the main editor where you can add, edit, and delete stock movement records. You can track equipment moving in and out to different companies.",
        step4: "Use this button to manage company names. You can add new companies or view existing ones. Only registered company names can be used in the editor.",
        step5: "Finally, when you're done editing, click here to generate summary reports (Rekapan) for your data. This is how you create the final documents.",
      },

      infoModal: {
        title: "About Stok Alat Editor",
        description: "The Stok Alat Editor is used for tracking the movement of stok alats between companies. Data is organized per month.",
        howToUse: "How to Use:",
        viewData: "You can view each alat's data per month by selecting the \"Select your workbook\" dropdown.",
        features: "Features:",
        feature1Title: "Safe Company Names:",
        feature1Desc: "Register company names in Manage Company Names. Only these names can be used in the Company Name cell, which prevents any typos from occurring and ensures consistent correct data.",
        feature2Title: "Mutual Exclusivity Validation:",
        feature2Desc: "Masuk (incoming) and Keluar (outgoing) are mutually exclusive - a row cannot have values for both. The system will prevent saving if this rule is violated.",
        gotIt: "Got it",
      },

      newDataModal: {
        title: "New Data Added",
        description: "New data has been added to this worksheet by the scanner. Please refresh to see the latest data.",
        refresh: "Refresh Page",
        refreshed: "Data refreshed successfully",
      },
    },

    // Dashboard Elements
    dashboardElements: {
      title: "Dashboard Elements",
      subtitle: "Overview of business metrics and equipment rental analytics",

      // Summary Cards
      cards: {
        totalEquipment: "Total Equipment",
        equipmentTypes: "Equipment Types",
        activeRentals: "Active Rentals",
        fromLastMonth: "from last month",
        totalCompanies: "Total Companies",
        activeClients: "Active Clients",
        monthlyRevenue: "Monthly Revenue",
        utilizationRate: "Utilization Rate",
        equipmentInUse: "Equipment in Use",
        pendingInvoices: "Pending Invoices",
        requiresAttention: "Requires Attention",
      },

      // Charts
      charts: {
        rentalTrends: "Rental Trends (Last 6 Months)",
        month: "Month",
        quantity: "Quantity",
        equipmentOut: "Equipment Out (Keluar)",
        equipmentIn: "Equipment In (Masuk)",
        topEquipment: "Top Equipment by Usage",
        totalRented: "Total Units Rented",
        equipment: "Equipment",
        unitsRented: "Units Rented",
        revenueByCompany: "Revenue Distribution by Company",
        others: "Others",
        monthlyRevenue: "Monthly Revenue Trend",
        revenue: "Revenue (IDR Million)",
      },
    },
  },

  id: {
    // Common
    common: {
      save: "Simpan",
      cancel: "Batal",
      confirm: "Konfirmasi",
      delete: "Hapus",
      edit: "Edit",
      close: "Tutup",
      loading: "Memuat",
      search: "Cari",
      settings: "Pengaturan",
      continue: "Lanjutkan",
      understand: "Mengerti",
      yes: "Ya",
      no: "Tidak",
      restartOnboarding: "Mulai Ulang Tutorial",
    },

    // Navbar
    navbar: {
      search: "Cari",
      notifications: "Notifikasi",
      profile: "Profil",
      signOut: "Keluar",
      language: "Bahasa",
    },

    // Sidebar
    sidebar: {
      dashboard: "Dasbor",
      stokAlat: "Stok Alat",
      editor: "Editor",
      rekapan: "Rekapan",
      generateRekapan: "Generate Rekapan",
      additionalServices: "Layanan Tambahan",
      analytics: "Analitik",
      dashboardElements: "Elemen Dasbor",
      services: "Layanan",
      firstService: "Editor Stok Alat",
      bikinTagihan: "Bikin Tagihan",
      addHarga: "Tambah Harga",
      allInOne: "Semua dalam Satu",
      cleanup: "Cleanup",
    },

    // Dashboard
    dashboard: {
      title: "Dasbor",
      subtitle: "Pilih apa yang ingin dikerjakan",

      // Service descriptions
      editorDescription: "Edit dan kelola data stok alat",
      addHargaDescription: "Kelola harga sewa alat",
      generateRekapanDescription: "Buat laporan ringkasan untuk beberapa bulan",
      bikinTagihanDescription: "Buat faktur dan dokumen penagihan",
      allInOneDescription: "Akses semua fitur dalam satu tempat",

      onboarding: {
        welcome: "Selamat datang! Mari kita mulai. Klik 'Next' lalu navigasi ke Editor untuk mulai mengelola data stok alat Anda.",
      },
    },

    // Generate Rekapan Page
    generateRekapan: {
      title: "Generate Rekapan",
      subtitle: "Buat laporan ringkasan untuk data sewa alat dari beberapa bulan",
      goToEditor: "Buka Editor Stok Alat",

      // Onboarding steps
      onboarding: {
        step1: "Pertama, pilih bulan mulai (Bulan Mulai). Ini menentukan dari bulan mana pembuatan rekapan akan dimulai.",
        step2: "Setelah memilih bulan mulai, Anda dapat secara opsional mengklik tombol ini untuk mengatur nilai Total Sewa Alat awal. Nilai-nilai ini merepresentasikan alat yang sudah disewakan sebelum bulan mulai. Anda dapat mengabaikan ini secara default jika semua alat dimulai dari nol.",
        step3: "Selanjutnya, pilih bulan akhir (Bulan Akhir). Sistem akan membuat rekapan untuk semua bulan dalam rentang tanggal ini.",
        step4: "Terakhir, klik tombol ini untuk membuat semua rekapan untuk rentang tanggal yang dipilih. Sistem akan membuat file Excel untuk setiap bulan.",
      },

      // Over Time Section
      overTime: {
        title: "Generate Rekapan Sepanjang Waktu",
        subtitle: "Buat laporan ringkasan untuk beberapa bulan dalam rentang tanggal",
        optionalSettings: "Pengaturan dan konfigurasi opsional",
      },

      // Single Month Section
      singleMonth: {
        title: "Generate Rekapan Bulan Tunggal",
        subtitle: "Pembuatan cepat untuk bulan tertentu",
        infoText: "Ini menghasilkan rekapan untuk satu bulan saja. Gunakan untuk ekspor cepat daripada membuat beberapa bulan. Tanggal mulai dari pengaturan di atas akan digunakan sebagai referensi.",
        selectMonth: "Pilih Bulan",
        selectMonthPlaceholder: "Pilih bulan...",
        generating: "Membuat...",
        generateButton: "Generate Rekapan Bulan Tunggal",
      },

      // Toast Messages
      toast: {
        pleaseSelectMonth: "Silakan pilih bulan dan pastikan tanggal mulai sudah diatur",
        generatingSingle: "Membuat rekapan bulan tunggal...",
        singleSuccess: "Rekapan tunggal berhasil dibuat dan diunduh!",
        singleFailed: "Gagal membuat rekapan tunggal",
      },

      // Info Modal
      infoModal: {
        title: "Apa itu Generate Rekapan?",
        description: "Generate Rekapan adalah layanan otomatis yang menghasilkan laporan rekapitulasi (ringkasan) berdasarkan data dari layanan editor utama.",
        mainFunctions: "Fungsi Utama:",
        function1: "Mengumpulkan data sewa alat dari database untuk rentang bulan yang dipilih",
        function2: "Mengelompokkan data berdasarkan nama perusahaan dan nama alat",
        function3: "Membuat laporan Excel yang terstruktur dengan perhitungan otomatis",
        function4: "Menyimpan kontinuitas data antar bulan (data bulan sebelumnya dibawa ke bulan berikutnya)",
        note: "Catatan:",
        noteText: "Layanan ini mengambil data yang telah diinput melalui editor utama (layanan pertama) dan mengolahnya menjadi laporan rekapitulasi yang siap digunakan.",
      },

      // Settings
      settings: {
        rekapanSettings: "Pengaturan Rekapan",
        selectDateRange: "Pilih rentang tanggal",
        startMonth: "Bulan Mulai",
        endMonth: "Bulan Akhir",
        selectStartMonth: "Pilih bulan mulai...",
        selectEndMonth: "Pilih bulan akhir...",
        selected: "Dipilih",
        pleaseSelectStart: "Silakan pilih tanggal mulai",
        pleaseSelectEnd: "Silakan pilih tanggal akhir",

        advancedSettings: "Pengaturan Lanjutan",
        configureOptions: "Konfigurasi opsi",
        groupCompanyTypos: "Kelompokkan Typo Nama Perusahaan",
        migration: "Migrasi",
        groupCompanyTyposDesc: "Kelompokkan nama perusahaan yang mirip untuk menangani typo dari data Excel lama",
        groupCompanyTyposInfo: "Anda akan diminta memverifikasi pengelompokan nama perusahaan untuk memastikan standardisasi data.",
      },

      // Status
      status: {
        readyToGenerate: "Siap untuk Generate",
        willGenerateFrom: "Anda akan membuat rekapan dari",
        to: "hingga",
        warningStartAfterEnd: "Peringatan: Tanggal mulai setelah tanggal akhir!",
      },

      // Button
      generateButton: "Generate semua rekapan",

      // Initial Total Sewa Alat Modal
      initialTotalSewaAlat: {
        buttonText: "Atur Total Sewa Alat Awal",
        modalTitle: "Total Sewa Alat Periode Awal",
        modalDescription: "Atur nilai dasar awal untuk setiap jenis alat. Nilai-nilai ini merepresentasikan alat yang sudah disewakan sebelum bulan mulai.",
        foundEquipment: "Ditemukan",
        equipmentTypes: "jenis alat",
        setInitialTotals: "Atur total awal di bawah (default: 0).",
        currentValue: "Nilai saat ini:",
        units: "unit",
        note: "Catatan:",
        noteText: "Nilai-nilai ini hanya berlaku untuk bulan pertama pembuatan rekapan. Bulan-bulan berikutnya akan menggunakan total yang dihitung dari bulan sebelumnya.",
        noData: "Tidak ada data alat untuk bulan mulai yang dipilih. Silakan tambahkan data di Editor Stok Alat terlebih dahulu.",
        errorLoading: "Error memuat nama alat:",
      },

      // Example Modal
      exampleModal: {
        title: "Contoh Generate Rekapan",
        description: "Contoh ini mendemonstrasikan bagaimana data Stok Alat ditransformasi menjadi ringkasan Generate Rekapan.",
        stokAlatData: "Data Stok Alat",
        input: "Input",
        generatedRekapan: "Rekapan yang Dihasilkan",
        output: "Output",
        date: "Tanggal",
        company: "Perusahaan",
        in: "Masuk",
        out: "Keluar",
        totalSewaPeriode: "Total Sewa Periode",
      },
    },

    // Company Typo Grouping Modal
    companyTypoGrouping: {
      title: "Pengelompokan Nama Perusahaan",

      // Info section
      info: {
        whyImportant: "Mengapa langkah ini penting?",
        explanation1: "Dalam proses migrasi dari sistem Excel lama, terdapat kemungkinan kesalahan ketik (typo) pada nama-nama perusahaan. Layanan Generate Rekapan mengelompokkan data berdasarkan nama - jika terdapat typo, sistem tidak dapat menggabungkan data yang sebenarnya sama.",
        explanation2: "Sistem telah secara otomatis mengelompokkan nama-nama yang mirip (perbedaan maksimal 2 karakter). Tugas Anda adalah memverifikasi pengelompokan ini dan mengoreksi nama yang telah distandardisasi.",
        eachGroupShows: "Setiap kelompok menampilkan:",
        nameVariations: "Variasi Nama:",
        nameVariationsDesc: "Semua variasi ejaan yang ditemukan dalam data",
        standardizedName: "Nama Terstandarisasi:",
        standardizedNameDesc: "Nama yang benar untuk digunakan (dapat diedit)",
        previousMonth: "Bulan Sebelumnya:",
        previousMonthDesc: "Nama yang digunakan bulan lalu (jika tersedia)",
        note: "Catatan:",
        noteText: "Langkah verifikasi ini hanya diperlukan selama periode migrasi dari sistem Excel lama yang tidak sistematis. Setelah data terstandarisasi, proses ini akan lebih sederhana.",
      },

      // Stats
      stats: {
        totalGroups: "Total Kelompok",
        autoSuggested: "Saran Otomatis",
        needReview: "Perlu Ditinjau",
      },

      // Advanced mode
      advanced: {
        advancedMode: "Mode Lanjutan",
        advancedModeDesc: "Aktifkan untuk memindahkan variasi antar kelompok secara manual",
        moveVariations: "Pindahkan Variasi",
        enableMoveMode: "Aktifkan Mode Pindah",
        moving: "Memindahkan:",
        toGroup: "Ke Kelompok:",
        step1: "Langkah 1: Klik nama variasi di tabel untuk memilihnya",
        step2: "Langkah 2: Klik kelompok tujuan, atau buat kelompok baru",
        createNewGroup: "Buat Kelompok Baru",
        confirmMove: "Konfirmasi Pindah",
        confirmNewGroup: "Konfirmasi Kelompok Baru",
        cancelMove: "Batal Pindah",
      },

      // Table
      table: {
        select: "Pilih",
        nameVariations: "Variasi Nama",
        standardizedName: "Nama Terstandarisasi",
        previousMonth: "Bulan Sebelumnya",
        noSuggestion: "Tidak ada saran",
        variations: "variasi",
      },

      // Buttons
      confirmAndContinue: "Konfirmasi dan Lanjutkan",
    },

    // Validation messages
    validation: {
      mutualExclusivity: "Error Validasi: Masuk dan Keluar bersifat eksklusif. Hanya satu field yang boleh memiliki nilai, yang lain harus 0 atau kosong.",
      cannotSave: "Tidak dapat menyimpan:",
      rowsWithBothValues: "baris memiliki nilai Masuk dan Keluar. Silakan perbaiki baris ini terlebih dahulu.",
    },

    // Warnings Panel
    warnings: {
      title: "Peringatan",
      bothHaveValues: "Masuk dan Keluar keduanya memiliki nilai:",
      unregisteredCompany: "Nama perusahaan belum terdaftar",
      row: "Baris",
      masuk: "Masuk:",
      keluar: "Keluar:",
    },

    // Stok Alat Editor Info Modal
    stokAlatEditor: {
      // Page title
      learnMore: "Pelajari lebih lanjut tentang Editor Stok Alat",
      manageEquipmentData: "Kelola data stok alat untuk",
      allEquipment: "semua alat",
      equipmentStockData: "Data Stok Alat",
      editingWorksheet: "Mengedit:",
      selectWorkbook: "Pilih workbook untuk memulai",
      viewDataInstructions: "Anda dapat melihat data setiap alat per bulan dengan",
      selecting: "memilih",
      theDropdown: "",
      selectWorkbookDropdown: '"Pilih workbook Anda"',
      dropdown: "dropdown.",

      // Onboarding steps
      onboarding: {
        step1: "Pertama, pilih tanggal/bulan yang ingin Anda kerjakan. Ini menentukan data bulan mana yang akan Anda edit.",
        step2: "Selanjutnya, pilih workbook (jenis alat) yang ingin Anda kelola. Setiap workbook mewakili alat yang berbeda.",
        step3: "Ini adalah editor utama di mana Anda dapat menambah, mengedit, dan menghapus catatan pergerakan stok. Anda dapat melacak alat yang masuk dan keluar ke berbagai perusahaan.",
        step4: "Gunakan tombol ini untuk mengelola nama perusahaan. Anda dapat menambahkan perusahaan baru atau melihat yang sudah ada. Hanya nama perusahaan yang terdaftar yang dapat digunakan di editor.",
        step5: "Terakhir, ketika Anda selesai mengedit, klik di sini untuk membuat laporan ringkasan (Rekapan) untuk data Anda. Ini adalah cara Anda membuat dokumen final.",
      },

      infoModal: {
        title: "Tentang Editor Stok Alat",
        description: "Editor Stok Alat digunakan untuk melacak pergerakan stok alat antar perusahaan. Data diorganisir per bulan.",
        howToUse: "Cara Menggunakan:",
        viewData: "Anda dapat melihat data setiap alat per bulan dengan memilih dropdown \"Pilih workbook Anda\".",
        features: "Fitur:",
        feature1Title: "Nama Perusahaan Aman:",
        feature1Desc: "Daftarkan nama perusahaan di Kelola Nama Perusahaan. Hanya nama-nama ini yang dapat digunakan di sel Nama Perusahaan, yang mencegah terjadinya typo dan memastikan data yang konsisten dan benar.",
        feature2Title: "Validasi Eksklusif Bersama:",
        feature2Desc: "Masuk dan Keluar bersifat eksklusif - satu baris tidak dapat memiliki nilai untuk keduanya. Sistem akan mencegah penyimpanan jika aturan ini dilanggar.",
        gotIt: "Mengerti",
      },

      newDataModal: {
        title: "Data Baru Ditambahkan",
        description: "Data baru telah ditambahkan ke worksheet ini oleh scanner. Silakan refresh untuk melihat data terbaru.",
        refresh: "Refresh Halaman",
        refreshed: "Data berhasil diperbarui",
      },
    },

    // Dashboard Elements
    dashboardElements: {
      title: "Elemen Dasbor",
      subtitle: "Ringkasan metrik bisnis dan analitik sewa alat",

      // Summary Cards
      cards: {
        totalEquipment: "Total Alat",
        equipmentTypes: "Jenis Alat",
        activeRentals: "Sewa Aktif",
        fromLastMonth: "dari bulan lalu",
        totalCompanies: "Total Perusahaan",
        activeClients: "Klien Aktif",
        monthlyRevenue: "Pendapatan Bulanan",
        utilizationRate: "Tingkat Pemanfaatan",
        equipmentInUse: "Alat yang Digunakan",
        pendingInvoices: "Tagihan Tertunda",
        requiresAttention: "Perlu Perhatian",
      },

      // Charts
      charts: {
        rentalTrends: "Tren Sewa (6 Bulan Terakhir)",
        month: "Bulan",
        quantity: "Kuantitas",
        equipmentOut: "Alat Keluar (Keluar)",
        equipmentIn: "Alat Masuk (Masuk)",
        topEquipment: "Alat Teratas Berdasarkan Penggunaan",
        totalRented: "Total Unit Disewa",
        equipment: "Alat",
        unitsRented: "Unit Disewa",
        revenueByCompany: "Distribusi Pendapatan per Perusahaan",
        others: "Lainnya",
        monthlyRevenue: "Tren Pendapatan Bulanan",
        revenue: "Pendapatan (Juta IDR)",
      },
    },
  },
} as const;
