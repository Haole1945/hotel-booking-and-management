import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, DollarSign, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { phuThuService } from '../../services/phuThuService';

const SurchargeManagement = () => {
  const [surcharges, setSurcharges] = useState([]);
  const [surchargePrices, setSurchargePrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [editingSurcharge, setEditingSurcharge] = useState(null);
  const [selectedSurcharge, setSelectedSurcharge] = useState(null);

  const [surchargeForm, setSurchargeForm] = useState({
    idPhuThu: '',
    tenPhuThu: '',
    lyDo: ''
  });

  const [priceForm, setPriceForm] = useState({
    idPhuThu: '',
    ngayApDung: '',
    gia: '',
    idNv: 'NV001' // Default staff ID
  });

  useEffect(() => {
    fetchSurcharges();
  }, []);

  const fetchSurcharges = async () => {
    setLoading(true);
    try {
      const response = await phuThuService.getAllPhuThu();
      if (response.statusCode === 200) {
        setSurcharges(response.phuThuList || []);
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách phụ thu');
      console.error('Error fetching surcharges:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSurchargePrices = async (idPhuThu) => {
    try {
      const response = await phuThuService.getPhuThuPrices(idPhuThu);
      if (response.statusCode === 200) {
        setSurchargePrices(response.giaPhuThuList || []);
      }
    } catch (error) {
      toast.error('Lỗi khi tải lịch sử giá phụ thu');
      console.error('Error fetching surcharge prices:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      if (editingSurcharge) {
        response = await phuThuService.updatePhuThu(editingSurcharge.idPhuThu, surchargeForm);
      } else {
        response = await phuThuService.createPhuThu(surchargeForm);
      }

      if (response.statusCode === 200 || response.statusCode === 201) {
        toast.success(editingSurcharge ? 'Cập nhật phụ thu thành công!' : 'Thêm phụ thu thành công!');
        fetchSurcharges();
        resetForm();
        setShowModal(false);
      } else {
        toast.error(response.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      toast.error('Lỗi khi lưu phụ thu');
      console.error('Error saving surcharge:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await phuThuService.addPhuThuPrice(priceForm);

      if (response.statusCode === 200 || response.statusCode === 201) {
        toast.success('Thêm giá phụ thu thành công!');
        fetchSurchargePrices(priceForm.idPhuThu);
        resetPriceForm();
      } else {
        toast.error(response.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      toast.error('Lỗi khi thêm giá phụ thu');
      console.error('Error adding surcharge price:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (surcharge) => {
    setEditingSurcharge(surcharge);
    setSurchargeForm({
      idPhuThu: surcharge.idPhuThu,
      tenPhuThu: surcharge.tenPhuThu,
      lyDo: surcharge.lyDo
    });
    setShowModal(true);
  };

  const handleDelete = async (idPhuThu) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phụ thu này?')) {
      setLoading(true);
      try {
        const response = await phuThuService.deletePhuThu(idPhuThu);
        if (response.statusCode === 200) {
          toast.success('Xóa phụ thu thành công!');
          fetchSurcharges();
        } else {
          toast.error(response.message || 'Có lỗi xảy ra');
        }
      } catch (error) {
        toast.error('Lỗi khi xóa phụ thu');
        console.error('Error deleting surcharge:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleViewPrices = (surcharge) => {
    setSelectedSurcharge(surcharge);
    setPriceForm({ ...priceForm, idPhuThu: surcharge.idPhuThu });
    fetchSurchargePrices(surcharge.idPhuThu);
    setShowPriceModal(true);
  };

  const resetForm = () => {
    setSurchargeForm({
      idPhuThu: '',
      tenPhuThu: '',
      lyDo: ''
    });
    setEditingSurcharge(null);
  };

  const resetPriceForm = () => {
    setPriceForm({
      idPhuThu: selectedSurcharge?.idPhuThu || '',
      ngayApDung: '',
      gia: '',
      idNv: 'NV001'
    });
  };

  const filteredSurcharges = surcharges.filter(surcharge =>
    surcharge.tenPhuThu?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surcharge.lyDo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Phụ thu</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Thêm phụ thu
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm kiếm phụ thu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full max-w-md"
          />
        </div>
      </div>

      {/* Surcharges Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã phụ thu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên phụ thu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lý do
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                </td>
              </tr>
            ) : filteredSurcharges.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  Không có phụ thu nào
                </td>
              </tr>
            ) : (
              filteredSurcharges.map((surcharge) => (
                <tr key={surcharge.idPhuThu} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {surcharge.idPhuThu}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {surcharge.tenPhuThu}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {surcharge.lyDo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewPrices(surcharge)}
                        className="text-green-600 hover:text-green-900"
                        title="Quản lý giá"
                      >
                        <DollarSign className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(surcharge)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(surcharge.idPhuThu)}
                        className="text-red-600 hover:text-red-900"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Surcharge Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingSurcharge ? 'Chỉnh sửa phụ thu' : 'Thêm phụ thu mới'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã phụ thu
                </label>
                <input
                  type="text"
                  value={surchargeForm.idPhuThu}
                  onChange={(e) => setSurchargeForm({...surchargeForm, idPhuThu: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={editingSurcharge}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên phụ thu
                </label>
                <input
                  type="text"
                  value={surchargeForm.tenPhuThu}
                  onChange={(e) => setSurchargeForm({...surchargeForm, tenPhuThu: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do
                </label>
                <textarea
                  value={surchargeForm.lyDo}
                  onChange={(e) => setSurchargeForm({...surchargeForm, lyDo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Đang lưu...' : (editingSurcharge ? 'Cập nhật' : 'Thêm')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Price Management Modal */}
      {showPriceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Quản lý giá phụ thu: {selectedSurcharge?.tenPhuThu}
              </h2>
              <button
                onClick={() => {
                  setShowPriceModal(false);
                  setSelectedSurcharge(null);
                  setSurchargePrices([]);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Add New Price Form */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-3">Thêm giá mới</h3>
              <form onSubmit={handlePriceSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày áp dụng
                  </label>
                  <input
                    type="date"
                    value={priceForm.ngayApDung}
                    onChange={(e) => setPriceForm({...priceForm, ngayApDung: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá (VND)
                  </label>
                  <input
                    type="number"
                    value={priceForm.gia}
                    onChange={(e) => setPriceForm({...priceForm, gia: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? 'Đang thêm...' : 'Thêm giá'}
                  </button>
                </div>
              </form>
            </div>

            {/* Price History Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <h3 className="text-lg font-semibold p-4 bg-gray-50 border-b">Lịch sử giá</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày áp dụng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giá
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nhân viên
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {surchargePrices.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                        Chưa có lịch sử giá
                      </td>
                    </tr>
                  ) : (
                    surchargePrices.map((price, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(price.ngayApDung)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatPrice(price.gia)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {price.idNv}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurchargeManagement;
