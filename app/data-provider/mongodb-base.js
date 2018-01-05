'use strict'


module.exports = class MongodbBase {

    constructor(app, mongoSchema) {
        this.app = app
        this.type = app.type
        this.mongoSchema = mongoSchema
    }

    /**
     * 创建实体
     * @param model
     */
    create(model) {

        if (!this.type.object(model)) {
            return Promise.reject(new Error("model must be object"))
        }

        return this.mongoSchema.create(model)
    }


    /**
     * 批量新增交易信息
     * @param models
     */
    batchCreate(models) {

        if (!Array.isArray(models)) {
            return Promise.reject(new Error("models must be array"))
        }

        if (models.length < 1) {
            return Promise.resolve([])
        }

        return this.mongoSchema.insertMany(models)
    }

    /**
     * 查询数量
     * @param condition
     */
    count(condition) {

        if (!this.type.object(condition)) {
            return Promise.reject(new Error("condition must be object"))
        }

        return this.mongoSchema.count(condition)
    }

    /**
     * 获取单个实体
     * @param condition
     * @returns {*}
     */
    getModel(condition) {

        if (!this.type.object(condition)) {
            return Promise.reject(new Error("condition must be object"))
        }

        return this.mongoSchema.findOne(condition)
    }

    /**
     * 获取列表
     * @param condition
     * @returns {*}
     */
    getModelList(condition, projection, options) {

        if (!this.type.object(condition)) {
            return Promise.reject(new Error("condition must be object"))
        }

        return this.mongoSchema.find(condition, projection, options)
    }


    /**
     * 更新数据
     * @param model
     * @param condition
     * @returns {Promise<never>}
     */
    update(model, condition) {

        if (!this.type.object(model)) {
            return Promise.reject(new Error("model must be object"))
        }

        if (!this.type.object(condition)) {
            return Promise.reject(new Error("condition must be object"))
        }

        return this.mongoSchema.update(condition, model)
    }

    /**
     * 删除数据
     * @param condition
     * @returns {Promise<never>}
     */
    deleteOne(condition) {

        if (!this.type.object(condition)) {
            return Promise.reject(new Error("condition must be object"))
        }

        return this.mongoSchema.deleteOne(condition)
    }
}