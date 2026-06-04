require('dotenv').config();
const { sequelize } = require('../config/db.js');
const Article = require('../models/Article.js');

const templates = [
  `
<h2>Hành trình khám phá trọn vẹn</h2>
<p><span style="font-size: 2.5em; float: left; margin-right: 12px; color: #d97706; font-weight: bold; line-height: 0.8; font-family: serif;">M</span>ột chuyến đi tuyệt vời luôn bắt đầu bằng những trải nghiệm độc đáo và những khám phá bất ngờ. Nơi đây không chỉ có cảnh quan thiên nhiên tráng lệ mà còn có bề dày văn hóa khiến bất cứ du khách nào cũng phải say đắm.</p>
<p>Buổi sáng sớm, khi những giọt sương còn vương trên lá, hãy dành thời gian dạo bước qua những con phố yên tĩnh. Không khí trong lành và tiết trời se lạnh sẽ làm bừng tỉnh mọi giác quan của bạn.</p>
<img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop" alt="Phong cảnh" style="border-radius: 12px; margin: 32px 0; width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.1);" />
<blockquote style="border-left: 4px solid #d97706; padding-left: 20px; font-style: italic; color: #475569; margin: 40px 0; background: #fffbeb; padding: 24px; border-radius: 0 12px 12px 0;">
  "Cuộc hành trình ngàn dặm luôn bắt đầu bằng một bước đi nhỏ. Đừng chần chừ mà hãy xách ba lô lên và đi."
</blockquote>
<h2>Những điểm đến không thể bỏ qua</h2>
<ul>
  <li><strong>Khu bảo tồn thiên nhiên:</strong> Nơi lưu giữ hàng trăm loài động thực vật quý hiếm với hệ sinh thái hoang sơ chưa từng bị tác động.</li>
  <li><strong>Làng nghề truyền thống:</strong> Trải nghiệm quy trình làm ra những sản phẩm thủ công tinh xảo qua bàn tay khéo léo của các nghệ nhân lão làng.</li>
  <li><strong>Chợ đêm sầm uất:</strong> Thiên đường ẩm thực và mua sắm, nơi bạn có thể tìm thấy mọi đặc sản địa phương với giá cả vô cùng phải chăng.</li>
</ul>
<p>Tối đến, không gì tuyệt vời hơn là nhâm nhi một tách trà nóng, ngắm nhìn thành phố lên đèn và cảm nhận nhịp sống êm đềm nhưng không kém phần rực rỡ.</p>
  `,
  `
<h2>Tuyệt tác của thiên nhiên và con người</h2>
<p><span style="font-size: 2.5em; float: left; margin-right: 12px; color: #d97706; font-weight: bold; line-height: 0.8; font-family: serif;">D</span>ù bạn là người yêu thích sự tĩnh lặng hay khao khát những hoạt động mạnh mẽ, nơi đây đều có đủ những yếu tố để đáp ứng kỳ vọng của bạn. Hãy để chúng tôi dẫn bạn đi qua những cung đường đẹp nhất.</p>
<img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop" alt="Biển xanh" style="border-radius: 12px; margin: 32px 0; width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.1);" />
<h2>Hoạt động nổi bật</h2>
<p>Đừng để thời gian trôi qua vô ích. Hãy thuê một chiếc xe máy và rong ruổi khắp các nẻo đường ven biển, tận hưởng làn gió mát rượi và vị mặn mòi của đại dương.</p>
<blockquote style="border-left: 4px solid #d97706; padding-left: 20px; font-style: italic; color: #475569; margin: 40px 0; background: #fffbeb; padding: 24px; border-radius: 0 12px 12px 0;">
  "Biển xanh, cát trắng, nắng vàng - Bộ ba hoàn hảo để gột rửa mọi muộn phiền của cuộc sống tấp nập."
</blockquote>
<p>Hãy dừng chân tại một quán hải sản ven biển để thưởng thức tôm hùm, cua hoàng đế hay những con mực tươi rói vừa được đánh bắt. Đó chắc chắn sẽ là một bữa tiệc vị giác mà bạn không bao giờ quên.</p>
  `
];

async function updateAllArticles() {
  await sequelize.authenticate();
  console.log('Connected.');

  const articles = await Article.findAll();
  console.log('Found ' + articles.length + ' articles.');

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    if (article.slug === 'kinh-nghiem-du-lich-phu-quoc-3-ngay-2-dem' || article.slug === 'cam-nang-du-lich-da-lat-tu-a-z') {
      continue;
    }

    const template = templates[i % templates.length];
    await article.update({ content: template });
    console.log('Updated: ' + article.title);
  }

  console.log('Finished updating all articles.');
  process.exit(0);
}

updateAllArticles();
