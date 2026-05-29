import React, { useEffect } from 'react';

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-paper pt-44 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-5xl md:text-7xl font-serif italic text-slate-900 mb-8"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Quy định sử dụng
        </h1>
        <p className="text-slate-500 mb-10">
          Vui long doc ky cac dieu khoan ben duoi truoc khi su dung dich vu tai Uy Nam Luxury Hotel.
        </p>

        <div className="space-y-8 text-slate-700 leading-7">
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">1. Dat phong va thanh toan</h2>
            <p>
              Cac yeu cau dat phong chi duoc xac nhan sau khi quy khach nhan thong bao xac nhan tu he thong.
              Gia phong, chinh sach huy va dieu kien thanh toan se duoc hien thi ro tai thoi diem dat phong.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">2. Trach nhiem su dung</h2>
            <p>
              Quy khach cam ket cung cap thong tin chinh xac va khong su dung dich vu voi muc dich vi pham
              phap luat hoac gay anh huong den trai nghiem cua khach luu tru khac.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">3. Dieu chinh noi dung</h2>
            <p>
              Uy Nam co quyen cap nhat thong tin dich vu, gia va noi dung tren website theo tinh hinh van hanh.
              Cac thay doi co hieu luc ngay khi duoc cong bo.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;

