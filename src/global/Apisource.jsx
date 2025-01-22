import { Endpoint } from './Enpoint';

export class API_Source {
  /* users */
  static async login(username, password) {
    try {
      const response = await fetch(Endpoint.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), // Mengirimkan username dan password
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.payload.message);
      }

      const data = await response.json();
      console.log('Login successful:', data);
      const token = data.payload.data.token;
      localStorage.setItem('token', token);
      console.log('Token:', token);
      const userId = data.payload.data.userid;
      localStorage.setItem('userId', userId);
      return data.payload.data; // Mengembalikan data dari payload
    } catch (error) {
      console.error('Login error:', error);
      const errorData = error.message;
      throw errorData; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }
  static async signup(username, password, email, role) {
    try {
      const response = await fetch(Endpoint.signup, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email, role }), // Mengirimkan username, password, email, dan role
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.payload.message);
      }

      const data = await response.json();
      console.log('Signup successful:', data);
      return data; // Mengembalikan data dari respons
    } catch (error) {
      console.error('Signup error:', error);
      const errorData = error.message;
      throw errorData; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }

  /* kategori */
  static async getKategori() {
    try {
      const response = await fetch(Endpoint.kategori, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.payload.message);
      }

      const data = await response.json();
      console.log('Kategori data:', data);
      return data.payload.data; // Mengembalikan data dari respons
    } catch (error) {
      console.error('Error fetching kategori:', error);
      const errorData = error.message;
      throw errorData; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }
  static async postKategori(nama_kategori, deskripsi) {
    try {
      const response = await fetch(Endpoint.kategori, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ nama_kategori, deskripsi }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.payload.message);
      }
      const data = await response.json();
      return data.payload.data; // Mengembalikan data dari respons
    } catch (error) {
      console.error('Error posting kategori:', error);
      const errorData = error.message;
      throw errorData; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }
  static async getDetailKategori(id) {
    const response = await fetch(Endpoint.detailKategori(id), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response) {
      const Errordata = await response.json();
      throw new Error(Errordata.payload.message);
    }
    const data = await response.json();
    console.log('detail kategori: ', data);
    return data.payload.data;
  }
  static async deleteKategori(id) {
    const response = await fetch(Endpoint.detailKategori(id), {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response) {
      const Errordata = await response.json();
      throw new Error(Errordata.payload.message);
    }
    const data = await response.json();
    console.log('delete kategori: ', data);
    return data.payload.data;
  }
  static async updatedKategori(id, nama_kategori, deskripsi) {
    try {
      const response = await fetch(Endpoint.detailKategori(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ nama_kategori, deskripsi }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.payload.message);
      }
      const data = await response.json();
      return data.payload.data; // Mengembalikan data dari respons
    } catch (error) {
      console.error('Error posting kategori:', error);
      const errorData = error.message;
      throw errorData; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }

  /* pemasok */

  static async getPemasok() {
    try {
      const response = await fetch(Endpoint.pemasok, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.payload.message);
      }

      const data = await response.json();
      console.log('Pemasok data:', data);
      return data.payload.data; // Mengembalikan data dari respons
    } catch (error) {
      console.error('Error fetching pemasok:', error);
      const errorData = error.message;
      throw errorData; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }
  static async postPemasok(nama_pemasok, alamat, telepon, email) {
    try{
    const response = await fetch(Endpoint.pemasok, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        nama_pemasok,
        alamat,
        telepon,
        email,
      }),
    });
    if (!response) {
      const errorData = await response.json();
      throw new Error(errorData.payload.message);
    }
    const data = await response.json();
    return data.message;
  }catch (error) {
    console.error('Error posting pemasok:', error);
    const errorData = error.message;
    throw errorData; // Melemparkan error agar bisa ditangani di tempat lain
  }
  }
  static async getDetailPemasok(id) {
    try {
      const response = await fetch(`${Endpoint.detailPemasok}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.payload.message);
      }

      const data = await response.json();
      return data.payload.data;
    } catch (error) {
      console.error('Error fetching detail pemasok:', error);
      const errorData = error.message;
      throw errorData; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }

  /* customer */

  static async getCustomer() {
    try {
      const response = await fetch(Endpoint.customer, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.payload.message);
      }
      const data = await response.json();
      console.log('Customer data:', data);
      return data.payload.data; // Mengembalikan data dari respons
    } catch (error) {
      console.error('Error fetching customer:', error);
      const errorData = error.message;
      throw errorData; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }
  static async postCustomer(nama_customer, alamat, telepon, email) {
    const response = await fetch(Endpoint.customer, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        nama_customer,
        alamat,
        telepon,
        email,
      }),
    });
    if (!response) {
      const errorData = await response.json();
      throw new Error(errorData.payload.message);
    }
    const data = await response.json();
    return data.payload.data;
  }
  static async getDetailCustomer(id) {
    try {
      const response = await fetch(`${Endpoint.detailCustomer}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.payload.message);
      }

      const data = await response.json();
      return data.payload.data;
    } catch (error) {
      console.error('Error fetching detail customer:', error);
      const errorData = error.message;
      throw errorData; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }
  static async deleteCustomer(id) {
    try {
      const response = await fetch(Endpoint.detailCustomer(id), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.payload.message);
      }
      const data = await response.json();
      return data.payload.data;
    } catch (error) {
      console.error('Error deleting customer:', error);
      const errorData = error.message;
      throw errorData; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }
  static async updateCustomer(id, nama_customer, alamat, telepon, email) {
    try {
      const response = await fetch(Endpoint.detailCustomer(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          nama_customer,
          alamat,
          telepon,
          email,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.payload.message);
      }
      const data = await response.json();
      return data.payload.data;
    } catch (error) {
      console.error('Error updating customer:', error);
      const errorData = error.message;
      throw errorData; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }

  /* pembelian */
  static async getPembelian() {
    try {
      const response = await fetch(Endpoint.pembelian, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.payload.message);
      }
      const data = await response.json();
      console.log('Pembelian data:', data);
      return data.payload.data; // Mengembalikan data dari respons
    } catch (error) {
      console.error('Error fetching pembelian:', error);
      const errorData = error.message;
      throw errorData; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }
  static async postPembelian(id_sparepart, id_pemasok, tanggal, jumlah, status) {
    const response = await fetch(Endpoint.pembelian, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        id_sparepart,
        id_pemasok,
        tanggal,
        jumlah,
        status,
      }),
    });
    console.log(response);
    if (!response) {
      const errorData = await response.json();
      console.log(errorData.payload.message);
      throw new Error(errorData.payload.message);
    }
    const data = await response.json();
    return data.payload.data;
  }
  static async getDetailPembelian(id) {
    try {
      const response = await fetch(Endpoint.detailPembelian(id), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.payload.message);
      }

      const data = await response.json();
      return data.payload.data;
    } catch (error) {
      console.error('Error fetching detail penjualan:', error);
      const errorData = error.message;
      throw errorData; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }
  /* penjualn */
  static async getPenjualan() {
    try {
      const response = await fetch(Endpoint.penjualan, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.payload.message);
      }
      const data = await response.json();
      console.log('Penjualan data:', data);
      return data.payload.data; // Mengembalikan data dari respons
    } catch (error) {
      console.error('Error fetching penjualan:', error);
      const errorData = error.message;
      throw errorData; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }
  static async postPenjualan(id_sparepart, id_customer, tanggal, jumlah, metode_pembayaran) {
    const response = await fetch(Endpoint.penjualan, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        id_sparepart,
        id_customer,
        tanggal,
        jumlah,
        metode_pembayaran,
      }),
    });
    if (!response) {
      const errorData = await response.json();
      throw new Error(errorData.payload.message);
    }
    const data = await response.json();
    return data.payload.data;
  }
  static async getDetailPenjualan(id) {
    const response = await fetch(Endpoint.detailPenjualan(id), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response) {
      const Errordata = await response.json();
      throw new Error(Errordata.payload.message);
    }
    const data = await response.json();
    console.log('detail sparepart: ', data);
    return data.payload.data;
  }

  /* sparepart */
  static async getSparepart() {
    try {
      const response = await fetch(Endpoint.sparepart, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.payload.message);
      }
      const data = await response.json();
      console.log('Sparepart data:', data);
      return data.payload.data; // Mengembalikan data dari respons
    } catch (error) {
      console.error('Error fetching sparepart:', error);
      const errorData = error.message;
      throw errorData; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }
  static async getDetailSparepart(id) {
    const response = await fetch(Endpoint.detailSparepart(id), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response) {
      const Errordata = await response.json();
      throw new Error(Errordata.payload.message);
    }
    const data = await response.json();
    console.log('detail sparepart: ', data);
    return data.payload.data;
  }
  static async postSparepart(
    nama_sparepart,
    harga,
    margin,
    stok,
    id_kategori,
    id_pemasok,
    deskripsi,
    tanggal_masuk
  ) {
    const response = await fetch(Endpoint.sparepart, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        nama_sparepart,
        harga,
        margin,
        stok,
        id_kategori,
        id_pemasok,
        deskripsi,
        tanggal_masuk,
      }),
    });
    if (!response) {
      const Errordata = await response.json();
      console.log('error', Errordata.payload.message);
      throw new Error(Errordata.payload.message);
    }
    const data = await response.json();
    console.log('detail sparepart: ', data);
    return data.payload.data;
  }
  static async deleteSparepart(id) {
    const response = await fetch(Endpoint.detailSparepart(id), {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response) {
      const Errordata = await response.json();
      throw new Error(Errordata.payload.message);
    }
    const data = await response.json();
    console.log('delete sparepart: ', data);
    return data.payload.data;
  }
  static async updatedSparepart(
    id,
    nama_sparepart,
    harga,
    margin,
    stok,
    id_kategori,
    id_pemasok,
    deskripsi,
    tanggal_masuk
  ) {
    try {
      const response = await fetch(Endpoint.detailSparepart(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          nama_sparepart,
          harga,
          margin,
          stok,
          id_kategori,
          id_pemasok,
          deskripsi,
          tanggal_masuk,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.payload.message);
      }
      const data = await response.json();
      return data.payload.data; // Mengembalikan data dari respons
    } catch (error) {
      console.error('Error posting sparepart:', error);
    }
  }

  /* history penjualan */
  static async getHistoryPenjualan() {
    try {
      const response = await fetch(Endpoint.historyPenjualan, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.payload.message);
      }
      const data = await response.json();
      console.log('History Penjualan data:', data);
      return data.payload.data; // Mengembalikan data dari respons
    } catch (error) {
      console.error('Error fetching history penjualan:', error);
      const errorData = error.message;
      throw errorData; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }
  static async getDetailHistoryPenjualan(id) {
    const response = await fetch(Endpoint.detailHistoryPenjualan(id), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response) {
      const Errordata = await response.json();
      throw new Error(Errordata.payload.message);
    }
    const data = await response.json();
    console.log('detail history penjualan: ', data);
    return data.payload.data;
  }
  static async getHistoryPembelian() {
    try {
      const response = await fetch(Endpoint.historyPembelian, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.payload.message);
      }
      const data = await response.json();
      console.log('History Pembelian data:', data);
      return data.payload.data; // Mengembalikan data dari respons
    } catch (error) {
      console.error('Error fetching history pembelian:', error);
      const errorData = error.message;
      throw errorData; // Melemparkan error agar bisa ditangani di tempat lain
    }
  }

  
}
