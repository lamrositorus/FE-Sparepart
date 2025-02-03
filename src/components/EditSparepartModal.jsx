import React, { useEffect, useState } from 'react';

const EditSparepartModal = ({
  isOpen,
  onClose,
  onUpdateSparepart,
  sparepartData,
  kategoriList,
  pemasokList,
}) => {
  const [namaSparepart, setNamaSparepart] = useState('');
  const [harga, setHarga] = useState('');
  const [margin, setMargin] = useState('');
  const [stok, setStok] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('');
  const [selectedPemasok, setSelectedPemasok] = useState('');

  useEffect(() => {
    if (sparepartData) {
      setNamaSparepart(sparepartData.nama_sparepart);
      setHarga(sparepartData.harga);
      setMargin(sparepartData.margin);
      setStok(sparepartData.stok);
      setDeskripsi(sparepartData.deskripsi);
      setSelectedKategori(sparepartData.id_kategori);
      setSelectedPemasok(sparepartData.id_pemasok);
    }
  }, [sparepartData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateSparepart({
      id_sparepart: sparepartData.id_sparepart,
      nama_sparepart: namaSparepart,
      harga,
      margin,
      stok,
      id_kategori: selectedKategori,
      id_pemasok: selectedPemasok,
      deskripsi,
      tanggal_masuk: new Date().toISOString(),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      {' '}
      <div className="bg-base-100 rounded-lg p-6 w-11/12 md:w-1/3">
        {' '}
        <h2 className="text-2xl font-semibold mb-4">Edit Sparepart</h2>{' '}
        <form onSubmit={handleSubmit}>
          {' '}
          <div className="mb-4">
            {' '}
            <label className="label">
              {' '}
              <span className="label-text">Nama Sparepart</span>{' '}
            </label>{' '}
            <input
              type="text"
              value={namaSparepart}
              onChange={(e) => setNamaSparepart(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Enter spare part name"
              required
            />{' '}
          </div>{' '}
          <div className="mb-4">
            {' '}
            <label className="label">
              {' '}
              <span className="label-text">Harga</span>{' '}
            </label>{' '}
            <input
              type="number"
              value={harga}
              onChange={(e) => setHarga(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Enter price"
              required
            />{' '}
          </div>{' '}
          <div className="mb-4">
            {' '}
            <label className="label">
              {' '}
              <span className="label-text">Margin</span>{' '}
            </label>{' '}
            <input
              type="number"
              value={margin}
              onChange={(e) => setMargin(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Enter margin"
              required
            />{' '}
          </div>{' '}
          <div className="mb-4">
            {' '}
            <label className="label">
              {' '}
              <span className="label-text">Stok</span>{' '}
            </label>{' '}
            <input
              type="number"
              value={stok}
              onChange={(e) => setStok(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Enter stock quantity"
              required
            />{' '}
          </div>{' '}
          <div className="mb-4">
            {' '}
            <label className="label">
              {' '}
              <span className="label-text">Deskripsi</span>{' '}
            </label>{' '}
            <textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="textarea textarea-bordered w-full"
              placeholder="Enter description"
              required
            />{' '}
          </div>{' '}
          <div className="mb-4">
            {' '}
            <label className="label">
              {' '}
              <span className="label-text">Kategori</span>{' '}
            </label>{' '}
            <select
              value={selectedKategori}
              onChange={(e) => setSelectedKategori(e.target.value)}
              className="select select-bordered w-full"
              required
            >
              {' '}
              <option value="">Select category</option>{' '}
              {kategoriList.map((kategori) => (
                <option key={kategori.id_kategori} value={kategori.id_kategori}>
                  {' '}
                  {kategori.nama_kategori}{' '}
                </option>
              ))}{' '}
            </select>{' '}
          </div>{' '}
          <div className="mb-4">
            {' '}
            <label className="label">
              {' '}
              <span className="label-text">Pemasok</span>{' '}
            </label>{' '}
            <select
              value={selectedPemasok}
              onChange={(e) => setSelectedPemasok(e.target.value)}
              className="select select-bordered w-full"
              required
            >
              {' '}
              <option value="">Select supplier</option>{' '}
              {pemasokList.map((pemasok) => (
                <option key={pemasok.id_pemasok} value={pemasok.id_pemasok}>
                  {' '}
                  {pemasok.nama_pemasok}{' '}
                </option>
              ))}{' '}
            </select>{' '}
          </div>{' '}
          <div className="flex justify-between">
            {' '}
            <button type="submit" className="btn btn-primary">
              {' '}
              Update Sparepart{' '}
            </button>{' '}
            <button type="button" onClick={onClose} className="btn btn-secondary">
              {' '}
              Cancel{' '}
            </button>{' '}
          </div>{' '}
        </form>{' '}
      </div>{' '}
    </div>
  );
};

export default EditSparepartModal;
