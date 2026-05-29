import React, { useEffect } from 'react';

const Privacy = () => {
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
          Chinh sach bao mat
        </h1>
        <p className="text-slate-500 mb-10">
          Chung toi ton trong quyen rieng tu cua quy khach va chi thu thap du lieu can thiet de van hanh dich vu.
        </p>

        <div className="space-y-8 text-slate-700 leading-7">
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">1. Du lieu duoc thu thap</h2>
            <p>
              He thong co the thu thap thong tin lien he, thong tin dat phong va du lieu tuong tac co ban
              de ho tro quy trinh phuc vu khach hang va cai thien trai nghiem su dung.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">2. Muc dich su dung</h2>
            <p>
              Du lieu duoc dung cho xac nhan dat phong, cham soc khach hang, gui thong bao lien quan den
              dich vu va dam bao an toan van hanh he thong.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">3. Bao ve thong tin</h2>
            <p>
              Chung toi ap dung cac bien phap ky thuat va quy trinh quan tri phu hop de bao ve du lieu ca nhan,
              han che truy cap trai phep va ngua ro ri thong tin.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;

