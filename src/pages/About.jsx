import React from 'react';

export const About = () => {
  return (
    <div className="container mx-auto p-6">
      <header className="text-center mb-6">
        <h1 className="text-5xl font-bold">Tentang Sparepart Mobil</h1>
        <p className="mt-2 text-lg">
          Kami adalah penyedia sparepart mobil terkemuka dengan kualitas terbaik.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <figure>
            <img
              src="https://images.unsplash.com/photo-1593699199342-59b40e08f0ac?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Kualitas Terjamin"
              className="h-full w-full "
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Kualitas Terjamin</h2>
            <p>
              Setiap sparepart yang kami tawarkan telah melalui proses seleksi ketat untuk
              memastikan kualitas dan keandalannya.
            </p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <figure>
            <img
              src="https://plus.unsplash.com/premium_photo-1661717357358-67ae75ca57cd?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Layanan"
              className="h-full w-full "
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Layanan Pelanggan</h2>
            <p>
              Kami menyediakan layanan pelanggan yang responsif dan siap membantu Anda dalam memilih
              sparepart yang tepat.
            </p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <figure>
            <img
              src="https://plus.unsplash.com/premium_photo-1661604017235-a648ad87ff56?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Pengiriman"
              className="h-full w-full "
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Pengiriman Cepat</h2>
            <p>
              Dengan sistem logistik yang efisien, kami menjamin pengiriman sparepart tepat waktu ke
              lokasi Anda.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-3xl font-bold text-center mb-4">Mengapa Memilih Kami?</h2>
        <p className="text-center mb-6">
          Kami berkomitmen untuk memberikan produk dan layanan terbaik kepada pelanggan kami.
          Berikut adalah beberapa alasan mengapa Anda harus memilih kami:
        </p>
        <ul className="list-disc list-inside mx-auto max-w-2xl">
          <li className="mb-2">✅ Sparepart berkualitas tinggi</li>
          <li className="mb-2">✅ Harga yang kompetitif</li>
          <li className="mb-2">✅ Layanan pelanggan yang ramah dan profesional</li>
          <li className="mb-2">✅ Pengiriman cepat dan aman</li>
          <li className="mb-2">✅ Garansi produk</li>
        </ul>
      </section>

      <section className="mt-10 text-center">
        <h2 className="text-3xl font-bold mb-4">Hubungi Kami</h2>
        <p className="mb-2">
          Jika Anda memiliki pertanyaan atau ingin mengetahui lebih lanjut, jangan ragu untuk
          menghubungi kami.
        </p>
        <a href="mailto:info@sparepartmobil.com" className="btn btn-primary">
          Kirim Email
        </a>
      </section>
    </div>
  );
};

export default About;
