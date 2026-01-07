const { Content } = require('../models');

class ContentController {
  // Get content by type
  static async getContent(req, res, next) {
    try {
      const { type } = req.params;
      const { lang = 'id' } = req.query;
      
      const content = await Content.findOne({
        where: { 
          type: type,
          status: 'active'
        }
      });

      if (!content) {
        return res.status(404).json({
          success: false,
          message: 'Content not found'
        });
      }

      // Return all fields for CMS management
      const responseData = {
        id: content.id,
        type: content.type,
        title_id: content.title_id,
        title_en: content.title_en,
        content_id: content.content_id,
        content_en: content.content_en,
        meta_description_id: content.meta_description_id,
        meta_description_en: content.meta_description_en,
        meta_keywords_id: content.meta_keywords_id,
        meta_keywords_en: content.meta_keywords_en,
        status: content.status,
        createdAt: content.createdAt,
        updatedAt: content.updatedAt
      };

      res.status(200).json({
        success: true,
        data: responseData
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all contents
  static async getAllContents(req, res, next) {
    try {
      const { page = 1, limit = 10, status = 'active' } = req.query;
      const offset = (page - 1) * limit;

      const whereCondition = status !== 'all' ? { status } : {};

      const { count, rows } = await Content.findAndCountAll({
        where: whereCondition,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['updatedAt', 'DESC']]
      });

      res.status(200).json({
        success: true,
        data: {
          contents: rows,
          totalItems: count,
          totalPages: Math.ceil(count / limit),
          currentPage: parseInt(page)
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Create or update content
  static async upsertContent(req, res, next) {
    try {
      const { type } = req.params;
      const {
        title_id,
        title_en,
        content_id,
        content_en,
        status = 'active',
        meta_description_id,
        meta_description_en,
        meta_keywords_id,
        meta_keywords_en
      } = req.body;

      const [content, created] = await Content.upsert({
        type,
        title_id,
        title_en,
        content_id,
        content_en,
        status,
        meta_description_id,
        meta_description_en,
        meta_keywords_id,
        meta_keywords_en
      }, {
        where: { type },
        returning: true
      });

      res.status(created ? 201 : 200).json({
        success: true,
        message: created ? 'Content created successfully' : 'Content updated successfully',
        data: content
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete content
  static async deleteContent(req, res, next) {
    try {
      const { type } = req.params;
      
      const deleted = await Content.destroy({
        where: { type }
      });

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Content not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Content deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Update content status
  static async updateContentStatus(req, res, next) {
    try {
      const { type } = req.params;
      const { status } = req.body;

      if (!['active', 'inactive'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Must be active or inactive'
        });
      }

      const [updatedRowsCount] = await Content.update(
        { status },
        { where: { type } }
      );

      if (updatedRowsCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Content not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Content status updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ContentController;
