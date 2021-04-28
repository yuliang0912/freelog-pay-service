"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRecordInfo = void 0;
const orm_1 = require("@midwayjs/orm");
const typeorm_1 = require("typeorm");
const lodash_1 = require("lodash");
const enum_1 = require("../enum");
/**
 * 交易操作记录信息,一次交易对应一条记录,一条记录一般对应两条流水
 */
let TransactionRecordInfo = class TransactionRecordInfo {
    /**
     * 自定义序列化
     */
    toJSON() {
        return lodash_1.omit(this, ['signature', 'saltValue']);
    }
};
__decorate([
    typeorm_1.PrimaryColumn({ type: 'bigint', comment: '流水ID' }),
    __metadata("design:type", String)
], TransactionRecordInfo.prototype, "recordId", void 0);
__decorate([
    typeorm_1.Index(),
    typeorm_1.Column({ type: 'varchar', length: 32, comment: '账户ID' }),
    __metadata("design:type", Number)
], TransactionRecordInfo.prototype, "accountId", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', comment: '账户类型' }),
    __metadata("design:type", Number)
], TransactionRecordInfo.prototype, "accountType", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', default: '', length: 32, comment: '账户名' }),
    __metadata("design:type", String)
], TransactionRecordInfo.prototype, "accountName", void 0);
__decorate([
    typeorm_1.Index(),
    typeorm_1.Column({ type: 'varchar', length: 32, comment: '对方账户ID' }),
    __metadata("design:type", Number)
], TransactionRecordInfo.prototype, "reciprocalAccountId", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', comment: '账户类型' }),
    __metadata("design:type", Number)
], TransactionRecordInfo.prototype, "reciprocalAccountType", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 32, comment: '对方账户名' }),
    __metadata("design:type", String)
], TransactionRecordInfo.prototype, "reciprocalAccountName", void 0);
__decorate([
    typeorm_1.Column({ type: 'decimal', precision: 10, scale: 2, comment: '交易金额' }),
    __metadata("design:type", Number)
], TransactionRecordInfo.prototype, "transactionAmount", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', default: 1, comment: '交易类型' }),
    __metadata("design:type", Number)
], TransactionRecordInfo.prototype, "transactionType", void 0);
__decorate([
    typeorm_1.Column({ type: 'json', comment: '摘要' }),
    __metadata("design:type", Object)
], TransactionRecordInfo.prototype, "attachInfo", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', default: '', length: 256, comment: '备注' }),
    __metadata("design:type", String)
], TransactionRecordInfo.prototype, "remark", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 1024, comment: '加密盐值' }),
    __metadata("design:type", String)
], TransactionRecordInfo.prototype, "saltValue", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 1024, comment: '数据签名' }),
    __metadata("design:type", String)
], TransactionRecordInfo.prototype, "signature", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 64, comment: '操作者ID' }),
    __metadata("design:type", String)
], TransactionRecordInfo.prototype, "operatorId", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 256, comment: '操作者Name' }),
    __metadata("design:type", String)
], TransactionRecordInfo.prototype, "operatorName", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 256, comment: '授权方式' }),
    __metadata("design:type", String)
], TransactionRecordInfo.prototype, "authorizationType", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ comment: '创建时间' }),
    __metadata("design:type", Date)
], TransactionRecordInfo.prototype, "createDate", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ comment: '更新时间' }),
    __metadata("design:type", Date)
], TransactionRecordInfo.prototype, "updateDate", void 0);
__decorate([
    typeorm_1.Column({ type: 'datetime', nullable: true, comment: '交易确认超时时间' }),
    __metadata("design:type", Date)
], TransactionRecordInfo.prototype, "confirmTimeoutDate", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', default: 1, comment: '状态 1:交易确认中 2:交易成功 3:交易取消 4:交易失败' }),
    __metadata("design:type", Number)
], TransactionRecordInfo.prototype, "status", void 0);
TransactionRecordInfo = __decorate([
    orm_1.EntityModel('account-transaction-records')
], TransactionRecordInfo);
exports.TransactionRecordInfo = TransactionRecordInfo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3VudC10cmFuc2FjdGlvbi1yZWNvcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZW50aXR5L2FjY291bnQtdHJhbnNhY3Rpb24tcmVjb3JkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHVDQUEwQztBQUMxQyxxQ0FBeUY7QUFDekYsbUNBQTRCO0FBQzVCLGtDQUFvRjtBQUVwRjs7R0FFRztBQUVILElBQWEscUJBQXFCLEdBQWxDLE1BQWEscUJBQXFCO0lBNEg5Qjs7T0FFRztJQUNILE1BQU07UUFDRixPQUFPLGFBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUNsRCxDQUFDO0NBQ0osQ0FBQTtBQTVIRztJQURDLHVCQUFhLENBQUMsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUMsQ0FBQzs7dURBQ2hDO0FBT2pCO0lBRkMsZUFBSyxFQUFFO0lBQ1AsZ0JBQU0sQ0FBQyxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFDLENBQUM7O3dEQUNyQztBQU1sQjtJQURDLGdCQUFNLENBQUMsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUMsQ0FBQzs7MERBQ1Y7QUFNN0I7SUFEQyxnQkFBTSxDQUFDLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBQyxDQUFDOzswREFDL0M7QUFPcEI7SUFGQyxlQUFLLEVBQUU7SUFDUCxnQkFBTSxDQUFDLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUMsQ0FBQzs7a0VBQzdCO0FBTTVCO0lBREMsZ0JBQU0sQ0FB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