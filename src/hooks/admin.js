'use client';

// Fungsi untuk mengambil data statistik warga
export const fetchWargaStats = (setWargaStats) => {
  const dummyWargaStats = [
    { label: "Populasi Warga", value: "1,245" },
    { label: "Total Pengajuan Surat", value: "432" },
    { label: "Total Pengajuan Dalam Proses", value: "87" },
    { label: "Total Pengajuan Menunggu Tindakan", value: "12" },
  ];

  setTimeout(() => {
    setWargaStats(dummyWargaStats);
  }, 1000);

  return true;
};

// Fungsi untuk mengambil data statistik RT/RW
export const fetchRtRwStats = (setRtRwStats) => {
  const dummyRtRwStats = [
    { label: "Populasi Staff", value: "24" },
    { label: "Total Pengajuan Surat", value: "432" }, 
    { label: "Total Pengajuan Dalam Proses", value: "87" },
    { label: "Total Pengajuan Menunggu Tindakan", value: "12" },
  ];

  setTimeout(() => {
    setRtRwStats(dummyRtRwStats);
  }, 1000);

  return true;
};

// Fungsi untuk mengambil data pengajuan warga yang menunggu persetujuan
export const fetchWargaPendingData = (setDataWarga, setIsLoading) => {
  const dummyWargaData = [
    {
      id: 1,
      nama: "Ahmad Santoso",
      nik_warga: "3302021509780001",
      no_rt: "02",
      no_rw: "06",
      approved: null,
      alamat: "Jl. Kenanga No. 5, RT 02 RW 06",
      created_at: "2023-06-15T08:30:00.000Z"
    },
    {
      id: 2,
      nama: "Siti Rahayu",
      nik_warga: "3302025507820002",
      no_rt: "03",
      no_rw: "06",
      approved: null,
      alamat: "Jl. Melati No. 12, RT 03 RW 06",
      created_at: "2023-06-16T10:15:00.000Z"
    },
    {
      id: 3,
      nama: "Budi Prakoso",
      nik_warga: "3302023004850003",
      no_rt: "01",
      no_rw: "06",
      approved: null,
      alamat: "Jl. Mawar No. 8, RT 01 RW 06",
      created_at: "2023-06-17T14:45:00.000Z"
    }
  ];

  setTimeout(() => {
    setDataWarga(dummyWargaData);
    setIsLoading(false);
  }, 1500);

  return true;
};

// Fungsi untuk mengambil data biodata RT, RW, dan Warga
export const fetchBiodataUserData = (setDataRT, setDataRW, setDataWarga, setLoading) => {
  const dummyRTData = [
    {
      id_rt: 1,
      nama: "Bambang Suratman",
      email: "bambang@example.com",
      periode: "2022-2025",
      penanggung_jawab_rt: "Ketua RT 01",
      no_rw: "RW 01",
      alamat: "Jl. Kenanga No. 1, RT 01 RW 01"
    },
    {
      id_rt: 2,
      nama: "Dodi Sudrajat",
      email: "dodi@example.com",
      periode: "2023-2026",
      penanggung_jawab_rt: "Ketua RT 02",
      no_rw: "RW 01",
      alamat: "Jl. Melati No. 5, RT 02 RW 01"
    },
    {
      id_rt: 3,
      nama: "Agus Hermawan",
      email: "agus@example.com",
      periode: "2023-2026",
      penanggung_jawab_rt: "Ketua RT 03",
      no_rw: "RW 02",
      alamat: "Jl. Anggrek No. 7, RT 03 RW 02"
    }
  ];

  const dummyRWData = [
    {
      id_rw: 1,
      nama: "Haryanto",
      email: "haryanto@example.com",
      periode: "2022-2025",
      penanggung_jawab_rw: "Ketua RW 01",
      alamat: "Jl. Kenanga No. 10, RT 01 RW 01",
      jumlah_rt: 3
    },
    {
      id_rw: 2,
      nama: "Surya Wijaya",
      email: "surya@example.com",
      periode: "2023-2026",
      penanggung_jawab_rw: "Ketua RW 02",
      alamat: "Jl. Mawar No. 15, RT 01 RW 02",
      jumlah_rt: 2
    }
  ];

  const dummyWargaData = [
    {
      id_warga: 1,
      nama: "Ahmad Santoso",
      nik: "3302021509780001",
      no_kk: "3302021509780001001",
      no_rt: "01",
      no_rw: "01",
      jenis_kelamin: "L",
      tempat_tanggal_lahir: "Jakarta, 15 September 1978",
      agama: "Islam",
      alamat: "Jl. Kenanga No. 5, RT 01 RW 01"
    },
    {
      id_warga: 2,
      nama: "Siti Rahayu",
      nik: "3302025507820002",
      no_kk: "3302025507820002001",
      no_rt: "02",
      no_rw: "01",
      jenis_kelamin: "P",
      tempat_tanggal_lahir: "Bandung, 25 Mei 1982",
      agama: "Islam",
      alamat: "Jl. Melati No. 12, RT 02 RW 01"
    },
    {
      id_warga: 3,
      nama: "Budi Prakoso",
      nik: "3302023004850003",
      no_kk: "3302023004850003001",
      no_rt: "03",
      no_rw: "02",
      jenis_kelamin: "L",
      tempat_tanggal_lahir: "Surabaya, 30 April 1985",
      agama: "Kristen",
      alamat: "Jl. Mawar No. 8, RT 03 RW 02"
    },
    {
      id_warga: 4,
      nama: "Rina Wulandari",
      nik: "3302021102900004",
      no_kk: "3302021102900004001",
      no_rt: "01",
      no_rw: "01",
      jenis_kelamin: "P",
      tempat_tanggal_lahir: "Semarang, 11 Februari 1990",
      agama: "Islam",
      alamat: "Jl. Kenanga No. 7, RT 01 RW 01"
    },
    {
      id_warga: 5,
      nama: "Joko Widodo",
      nik: "3302020506770005",
      no_kk: "3302020506770005001",
      no_rt: "02",
      no_rw: "01",
      jenis_kelamin: "L",
      tempat_tanggal_lahir: "Solo, 5 Juni 1977",
      agama: "Islam",
      alamat: "Jl. Melati No. 9, RT 02 RW 01"
    }
  ];

  setTimeout(() => {
    setDataRT(dummyRTData);
    setDataRW(dummyRWData);
    setDataWarga(dummyWargaData);
    setLoading(false);
  }, 1000);

  return true;
};

// Fungsi untuk mengambil rekap pengajuan surat
export const fetchRekapPengajuanData = (setRekapSurat) => {
  const dummyRekapData = {
    data: [
      {
        id_pengajuan_surat: 1,
        nama_warga: "Ahmad Santoso",
        nik_warga: "3302021509780001",
        no_kk_warga: "3302021509780001001",
        alamat_warga: "Jl. Kenanga No. 5, RT 01 RW 01",
        nama_pemohon: "Ahmad Santoso",
        nik_pemohon: "3302021509780001",
        jenis_kelamin_pemohon: "L",
        agama_pemohon: "Islam",
        tempat_tanggal_lahir_pemohon: "Jakarta, 15 September 1978",
        alamat_pemohon: "Jl. Kenanga No. 5, RT 01 RW 01",
        jenis_surat: "Pengantar KTP",
        deskripsi: "Penggantian KTP yang hilang",
        status_rt: "approved",
        status_rw: "approved",
        status_approval: "approved",
        penanggung_jawab_rt: "Ketua RT 01",
        penanggung_jawab_rw: "Ketua RW 01",
        alamat: "Kelurahan Desa Sarimi",
        created_at: "2023-06-15T08:30:00.000Z",
        updated_at: "2023-06-16T14:20:00.000Z"
      },
      {
        id_pengajuan_surat: 2,
        nama_warga: "Siti Rahayu",
        nik_warga: "3302025507820002",
        no_kk_warga: "3302025507820002001",
        alamat_warga: "Jl. Melati No. 12, RT 02 RW 01",
        nama_pemohon: "Siti Rahayu",
        nik_pemohon: "3302025507820002",
        jenis_kelamin_pemohon: "P",
        agama_pemohon: "Islam",
        tempat_tanggal_lahir_pemohon: "Bandung, 25 Mei 1982",
        alamat_pemohon: "Jl. Melati No. 12, RT 02 RW 01",
        jenis_surat: "Surat Keterangan Tidak Mampu",
        deskripsi: "Untuk keperluan pengajuan keringanan biaya sekolah",
        status_rt: "approved",
        status_rw: "approved",
        status_approval: "approved",
        penanggung_jawab_rt: "Ketua RT 02",
        penanggung_jawab_rw: "Ketua RW 01",
        alamat: "Kelurahan Desa Sarimi",
        created_at: "2023-06-18T09:15:00.000Z",
        updated_at: "2023-06-19T13:45:00.000Z"
      },
      {
        id_pengajuan_surat: 3,
        nama_warga: "Budi Prakoso",
        nik_warga: "3302023004850003",
        no_kk_warga: "3302023004850003001",
        alamat_warga: "Jl. Mawar No. 8, RT 03 RW 02",
        nama_pemohon: "Budi Prakoso",
        nik_pemohon: "3302023004850003",
        jenis_kelamin_pemohon: "L",
        agama_pemohon: "Kristen",
        tempat_tanggal_lahir_pemohon: "Surabaya, 30 April 1985",
        alamat_pemohon: "Jl. Mawar No. 8, RT 03 RW 02",
        jenis_surat: "Surat Pengantar Nikah",
        deskripsi: "Untuk keperluan pengurusan pernikahan",
        status_rt: "approved",
        status_rw: "pending",
        status_approval: "pending",
        penanggung_jawab_rt: "Ketua RT 03",
        penanggung_jawab_rw: "Ketua RW 02",
        alamat: "Kelurahan Desa Sarimi",
        created_at: "2023-06-20T10:30:00.000Z",
        updated_at: "2023-06-21T11:20:00.000Z"
      },
      {
        id_pengajuan_surat: 4,
        nama_warga: "Rina Wulandari",
        nik_warga: "3302021102900004",
        no_kk_warga: "3302021102900004001",
        alamat_warga: "Jl. Kenanga No. 7, RT 01 RW 01",
        nama_pemohon: "Rina Wulandari",
        nik_pemohon: "3302021102900004",
        jenis_kelamin_pemohon: "P",
        agama_pemohon: "Islam",
        tempat_tanggal_lahir_pemohon: "Semarang, 11 Februari 1990",
        alamat_pemohon: "Jl. Kenanga No. 7, RT 01 RW 01",
        jenis_surat: "Surat Domisili Tempat tinggal",
        deskripsi: "Untuk keperluan pekerjaan",
        status_rt: "rejected",
        status_rw: "rejected",
        status_approval: "rejected",
        penanggung_jawab_rt: "Ketua RT 01",
        penanggung_jawab_rw: "Ketua RW 01",
        alamat: "Kelurahan Desa Sarimi",
        created_at: "2023-06-22T14:45:00.000Z",
        updated_at: "2023-06-23T16:30:00.000Z"
      },
      {
        id_pengajuan_surat: 5,
        nama_warga: "Joko Widodo",
        nik_warga: "3302020506770005",
        no_kk_warga: "3302020506770005001",
        alamat_warga: "Jl. Melati No. 9, RT 02 RW 01",
        nama_pemohon: "Joko Widodo",
        nik_pemohon: "3302020506770005",
        jenis_kelamin_pemohon: "L",
        agama_pemohon: "Islam",
        tempat_tanggal_lahir_pemohon: "Solo, 5 Juni 1977",
        alamat_pemohon: "Jl. Melati No. 9, RT 02 RW 01",
        jenis_surat: "Surat SKCK",
        deskripsi: "Untuk keperluan melamar pekerjaan",
        status_rt: "pending",
        status_rw: "pending",
        status_approval: "pending",
        penanggung_jawab_rt: "Ketua RT 02",
        penanggung_jawab_rw: "Ketua RW 01",
        alamat: "Kelurahan Desa Sarimi",
        created_at: "2023-06-24T11:20:00.000Z",
        updated_at: "2023-06-24T11:20:00.000Z"
      }
    ]
  };

  setTimeout(() => {
    setRekapSurat(dummyRekapData);
  }, 1200);

  return true;
};

// Fungsi untuk mengambil data approval role warga
export const fetchApprovalRoleData = (setIsLoading, setDataWarga) => {
  const dummyApprovalData = [
    {
      nik_warga: "3302021509780001",
      nama: "Ahmad Santoso",
      nomer_kk: "3302021509780001001",
      jenis_kelamin: "L",
      phone: "081234567890",
      tempat_dan_tanggal_lahir: "Jakarta, 15 September 1978",
      alamat: "Jl. Kenanga No. 5, RT 01 RW 01, Kelurahan Desa Sarimi, Kecamatan Sarimi, Kota Sarimi, Provinsi Jawa Tengah",
      approved: null, // null = pending, 1 = approved, 0 = rejected
      no_rt: "01",
      no_rw: "01"
    },
    {
      nik_warga: "3302025507820002",
      nama: "Siti Rahayu",
      nomer_kk: "3302025507820002001",
      jenis_kelamin: "P",
      phone: "081234567891",
      tempat_dan_tanggal_lahir: "Bandung, 25 Mei 1982",
      alamat: "Jl. Melati No. 12, RT 02 RW 01, Kelurahan Desa Sarimi, Kecamatan Sarimi, Kota Sarimi, Provinsi Jawa Tengah",
      approved: null,
      no_rt: "02",
      no_rw: "01"
    },
    {
      nik_warga: "3302023004850003",
      nama: "Budi Prakoso",
      nomer_kk: "3302023004850003001",
      jenis_kelamin: "L",
      phone: "081234567892",
      tempat_dan_tanggal_lahir: "Surabaya, 30 April 1985",
      alamat: "Jl. Mawar No. 8, RT 03 RW 02, Kelurahan Desa Sarimi, Kecamatan Sarimi, Kota Sarimi, Provinsi Jawa Tengah",
      approved: 1, // sudah disetujui
      no_rt: "03",
      no_rw: "02"
    },
    {
      nik_warga: "3302021102900004",
      nama: "Rina Wulandari",
      nomer_kk: "3302021102900004001",
      jenis_kelamin: "P",
      phone: "081234567893",
      tempat_dan_tanggal_lahir: "Semarang, 11 Februari 1990",
      alamat: "Jl. Kenanga No. 7, RT 01 RW 01, Kelurahan Desa Sarimi, Kecamatan Sarimi, Kota Sarimi, Provinsi Jawa Tengah",
      approved: 0, // ditolak
      no_rt: "01",
      no_rw: "01"
    },
    {
      nik_warga: "3302020506770005",
      nama: "Joko Widodo",
      nomer_kk: "3302020506770005001",
      jenis_kelamin: "L",
      phone: "081234567894",
      tempat_dan_tanggal_lahir: "Solo, 5 Juni 1977",
      alamat: "Jl. Melati No. 9, RT 02 RW 01, Kelurahan Desa Sarimi, Kecamatan Sarimi, Kota Sarimi, Provinsi Jawa Tengah",
      approved: null,
      no_rt: "02",
      no_rw: "01"
    }
  ];

  setTimeout(() => {
    setDataWarga(dummyApprovalData);
    setIsLoading(false);
  }, 1500);

  return true;
}; 