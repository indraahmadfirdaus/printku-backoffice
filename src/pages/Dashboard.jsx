const Dashboard = () => {
  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white mb-6">
        <h1 className="text-3xl font-bold mb-2">Selamat Datang, Admin!</h1>
        <p className="text-white/80">Kelola sistem BlackBoxZ dengan mudah dari dashboard ini</p>
      </div>
      
      <div className="bg-base-100 rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-4">Petunjuk Penggunaan Dashboard</h2>
        <p className="text-base-content/70 mb-6">Panduan lengkap untuk mengelola sistem kiosk printing BlackBoxZ</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Manajemen Customer */}
          <div className="bg-base-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Manajemen Customer</h3>
            </div>
            <ul className="space-y-2 text-sm text-base-content/80">
              <li>• Pantau data customer dan aktivitas print job</li>
              <li>• Filter berdasarkan tanggal bergabung, nomor telepon, atau total print job</li>
              <li>• Lihat statistik customer dan riwayat transaksi</li>
            </ul>
          </div>

          {/* Manajemen Kiosk */}
          <div className="bg-base-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Manajemen Kiosk</h3>
            </div>
            <ul className="space-y-2 text-sm text-base-content/80">
              <li>• Tambah, edit, dan hapus kiosk beserta printer</li>
              <li>• Monitor status online/offline kiosk secara real-time</li>
              <li>• Filter berdasarkan status dan lokasi kiosk</li>
              <li>• Kelola printer dokumen dengan kapasitas kertas</li>
            </ul>
          </div>

          {/* Manajemen Pricing */}
          <div className="bg-base-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Pengaturan Harga</h3>
            </div>
            <ul className="space-y-2 text-sm text-base-content/80">
              <li>• Atur harga per halaman untuk dokumen (hitam putih & warna)</li>
              <li>• Kelola harga cetak foto berbagai ukuran (2R, 3R, 4R, 5R, 6R)</li>
              <li>• Update harga secara real-time untuk semua kiosk</li>
              <li>• Informasi biaya QRIS 0.63% dari Xendit sudah tercantum</li>
            </ul>
          </div>

          {/* Manajemen Iklan */}
          <div className="bg-base-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Manajemen Iklan</h3>
            </div>
            <ul className="space-y-2 text-sm text-base-content/80">
              <li>• Upload gambar atau video YouTube untuk iklan</li>
              <li>• Atur urutan tampilan dan status aktif/nonaktif</li>
              <li>• Pantau view count dan analytics iklan</li>
              <li>• Kelola konten promosi yang ditampilkan di kiosk</li>
            </ul>
          </div>

          {/* Manajemen Transaksi */}
          <div className="bg-base-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Manajemen Transaksi</h3>
            </div>
            <ul className="space-y-2 text-sm text-base-content/80">
              <li>• Monitor semua transaksi dari seluruh kiosk</li>
              <li>• Lihat detail lengkap transaksi, customer, dan printer</li>
              <li>• Pantau status pembayaran dan webhook Xendit</li>
              <li>• Export data transaksi untuk laporan keuangan</li>
              <li>• Statistik pendapatan harian dan total</li>
            </ul>
          </div>

          {/* Manajemen Admin */}
          <div className="bg-base-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Manajemen Admin</h3>
            </div>
            <ul className="space-y-2 text-sm text-base-content/80">
              <li>• Lihat profil admin yang sedang login</li>
              <li>• Tambah, edit, dan hapus akun admin (khusus Super Admin)</li>
              <li>• Kelola role dan permission admin</li>
              <li>• Riwayat aktivitas admin dalam sistem</li>
            </ul>
          </div>
        </div>

        {/* Tips Penting */}
        <div className="mt-8 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 border border-primary/20">
          <h3 className="text-lg font-semibold mb-4 text-primary">💡 Tips Penting untuk Admin</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">🔧 Pemeliharaan Sistem:</h4>
              <ul className="space-y-1 text-base-content/80">
                <li>• Monitor status kiosk secara berkala</li>
                <li>• Pastikan printer memiliki stok kertas yang cukup</li>
                <li>• Periksa koneksi internet kiosk</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">📊 Monitoring Bisnis:</h4>
              <ul className="space-y-1 text-base-content/80">
                <li>• Pantau transaksi harian dan pendapatan</li>
                <li>• Analisis lokasi kiosk dengan performa terbaik</li>
                <li>• Update harga sesuai kondisi pasar</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">🛡️ Keamanan:</h4>
              <ul className="space-y-1 text-base-content/80">
                <li>• Logout setelah selesai menggunakan sistem</li>
                <li>• Jangan bagikan kredensial login</li>
                <li>• Laporkan aktivitas mencurigakan</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">💰 Pembayaran:</h4>
              <ul className="space-y-1 text-base-content/80">
                <li>• Biaya QRIS 0.63% sudah termasuk dalam sistem</li>
                <li>• Monitor webhook pembayaran Xendit</li>
                <li>• Export laporan untuk rekonsiliasi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="btn btn-primary btn-sm" onClick={() => window.location.href = '/customer'}>
            📊 Lihat Customer
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => window.location.href = '/setup/kiosk'}>
            🖥️ Kelola Kiosk
          </button>
          <button className="btn btn-accent btn-sm" onClick={() => window.location.href = '/transaksi'}>
            💳 Lihat Transaksi
          </button>
          <button className="btn btn-info btn-sm" onClick={() => window.location.href = '/setup/pricing'}>
            💰 Atur Harga
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard