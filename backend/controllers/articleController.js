const Article = require('../models/Article');

const getAllArticles = async (req, res) => {
    try {
        const { status } = req.query;
        const whereClause = status ? { status } : {};
        const articles = await Article.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(articles);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy danh sách bài viết", error: error.message });
    }
};

const getArticleBySlug = async (req, res) => {
    try {
        const article = await Article.findOne({ where: { slug: req.params.slug } });
        if (!article) return res.status(404).json({ message: "Không tìm thấy bài viết" });
        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy bài viết", error: error.message });
    }
};

const createArticle = async (req, res) => {
    try {
        const { title, slug, content, status, tags } = req.body;
        const thumbnail = req.file ? `/uploads/${req.file.filename}` : null;
        
        const newArticle = await Article.create({ title, slug, content, thumbnail, status, tags });
        res.status(201).json(newArticle);
    } catch (error) {
        res.status(500).json({ message: "Lỗi tạo bài viết", error: error.message });
    }
};

const updateArticle = async (req, res) => {
    try {
        const { title, slug, content, status, tags } = req.body;
        const article = await Article.findByPk(req.params.id);
        if (!article) return res.status(404).json({ message: "Không tìm thấy bài viết" });

        const thumbnail = req.file ? `/uploads/${req.file.filename}` : article.thumbnail;

        await article.update({ title, slug, content, thumbnail, status, tags });
        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ message: "Lỗi cập nhật bài viết", error: error.message });
    }
};

const deleteArticle = async (req, res) => {
    try {
        const article = await Article.findByPk(req.params.id);
        if (!article) return res.status(404).json({ message: "Không tìm thấy bài viết" });

        await article.destroy();
        res.status(200).json({ message: "Đã xóa bài viết thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi xóa bài viết", error: error.message });
    }
};

module.exports = {
    getAllArticles,
    getArticleBySlug,
    createArticle,
    updateArticle,
    deleteArticle
};
