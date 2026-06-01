require('dotenv').config();
const { sequelize } = require('./config/db.js');
const Article = require('./models/Article.js');

const richContent1 = `
<h2>Ngày 1: Khám phá Bắc Đảo - Khởi đầu hoàn hảo</h2>
<p><span style="font-size: 2.5em; float: left; margin-right: 12px; color: #d97706; font-weight: bold; line-height: 0.8; font-family: serif;">P</span>hú Quốc chào đón chúng tôi bằng một buổi sáng ngập nắng. Điểm đến đầu tiên trong hành trình 3 ngày 2 đêm này chính là khu vực Bắc Đảo, nơi tập trung nhiều tổ hợp vui chơi giải trí hoành tráng bậc nhất.</p>
<p>Buổi sáng, chúng tôi dành toàn bộ thời gian tại <strong>VinWonders</strong> và <strong>Vinpearl Safari</strong>. Việc ngồi trên xe bus chuyên dụng đi giữa bầy động vật hoang dã thực sự là một trải nghiệm khó quên. Bạn nên đi Safari vào buổi sáng sớm khi các loài động vật hoạt động mạnh nhất.</p>
<img src="https://images.unsplash.com/photo-1542314831-c6a4d1407287?q=80&w=2070&auto=format&fit=crop" alt="Safari" style="border-radius: 12px; margin: 32px 0; width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.1);" />
<p>Buổi chiều, chúng tôi thuê xe máy dạo quanh <em>Mũi Gành Dầu</em>. Đứng từ đây, bạn có thể nhìn thấy đường biên giới trên biển với nước bạn Campuchia. Hoàng hôn ở Mũi Gành Dầu mang một vẻ đẹp tĩnh lặng, nguyên sơ khác hẳn với sự nhộn nhịp của trung tâm thị trấn Dương Đông.</p>

<blockquote style="border-left: 4px solid #d97706; padding-left: 20px; font-style: italic; color: #475569; margin: 40px 0; background: #fffbeb; padding: 24px; border-radius: 0 12px 12px 0;">
  "Hoàng hôn Phú Quốc không chỉ là sự chuyển giao của đất trời, mà là một bản tình ca bằng màu sắc, nơi mặt trời từ từ chìm xuống mặt biển phẳng lặng như gương."
</blockquote>

<h2>Ngày 2: Lênh đênh trên biển Nam Đảo</h2>
<p>Nam Đảo nổi tiếng với những hòn đảo nhỏ tuyệt đẹp như Hòn Móng Tay, Hòn Gầm Ghì, Hòn Mây Rút. Chúng tôi quyết định mua <strong>Tour 4 đảo</strong> kết hợp câu cá và lặn ngắm san hô.</p>
<ul>
  <li><strong>Hòn Gầm Ghì:</strong> Nơi có rạn san hô tự nhiên đẹp nhất. Nước biển trong vắt đến mức chỉ cần úp mặt xuống nước là thấy cả một thế giới sinh vật biển đầy màu sắc.</li>
  <li><strong>Hòn Móng Tay:</strong> Được mệnh danh là "Maldives thu nhỏ" của Việt Nam với bãi cát trắng mịn và hàng dừa xanh mát.</li>
  <li><strong>Hòn Mây Rút:</strong> Điểm dừng chân ăn trưa lý tưởng với các món hải sản tươi sống nướng mỡ hành thơm nức mũi.</li>
</ul>
<p>Tối đến, không gì tuyệt vời hơn là lượn lờ <strong>Chợ đêm Dinh Cậu</strong>. Bánh tráng nướng, hải sản nướng, kem cuộn Thái Lan... tất cả tạo nên một thiên đường ẩm thực đường phố níu chân bất cứ du khách nào.</p>
<img src="https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?q=80&w=2070&auto=format&fit=crop" alt="Đảo ngọc" style="border-radius: 12px; margin: 32px 0; width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.1);" />

<h2>Ngày 3: Đặc sản và những món quà kỷ niệm</h2>
<p>Ngày cuối cùng luôn là khoảng thời gian dồn dập với lịch trình mua sắm và tham quan các làng nghề truyền thống. Những điểm không thể bỏ qua:</p>
<p>Vườn tiêu Phú Quốc với những hàng tiêu xanh mướt, thẳng tắp. Tiêu ở đây nổi tiếng thơm và cay nồng. Cơ sở sản xuất nước mắm truyền thống - nơi bạn có thể tìm hiểu quy trình ủ chượp để cho ra những giọt nước mắm nhĩ hảo hạng.</p>
<p><em>Kết thúc hành trình, Phú Quốc để lại trong tôi không chỉ là những bức ảnh đẹp, mà còn là hương vị biển cả, sự nhiệt thành của người dân đảo ngọc và một khao khát được quay trở lại vào một ngày không xa.</em></p>
`;

const richContent2 = `
<h2>1. Thời điểm lý tưởng đi Đà Lạt</h2>
<p><span style="font-size: 2.5em; float: left; margin-right: 12px; color: #d97706; font-weight: bold; line-height: 0.8; font-family: serif;">Đ</span>à Lạt đẹp quanh năm nhưng thời gian từ tháng 11 đến tháng 3 năm sau là tuyệt vời nhất vì lúc này tiết trời se lạnh, ít mưa và hoa nở rộ.</p>
<img src="https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Da Lat" style="border-radius: 12px; margin: 32px 0; width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.1);" />
<h2>2. Những địa điểm không thể bỏ lỡ</h2>
<ul>
    <li>Hồ Xuân Hương</li>
    <li>Quảng trường Lâm Viên</li>
    <li>Thung lũng Tình Yêu</li>
    <li>Đỉnh Langbiang</li>
</ul>
<blockquote style="border-left: 4px solid #d97706; padding-left: 20px; font-style: italic; color: #475569; margin: 40px 0; background: #fffbeb; padding: 24px; border-radius: 0 12px 12px 0;">
  "Đà Lạt mang một vẻ đẹp buồn lãng mạn, nơi mỗi góc phố đều kể một câu chuyện tình."
</blockquote>
<h2>3. Ẩm thực đặc sắc</h2>
<p>Bạn không nên bỏ qua lẩu gà lá é, bánh tráng nướng, sữa đậu nành và kem bơ khi đến đây.</p>
`;

async function updateArticles() {
  await sequelize.authenticate();
  console.log('Connected.');
  await Article.update({ content: richContent1 }, { where: { slug: 'kinh-nghiem-du-lich-phu-quoc-3-ngay-2-dem' } });
  await Article.update({ content: richContent2 }, { where: { slug: 'cam-nang-du-lich-da-lat-tu-a-z' } });
  console.log('Updated articles.');
  process.exit(0);
}
updateArticles();
