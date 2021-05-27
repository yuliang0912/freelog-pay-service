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
exports.TransactionDetailInfo = void 0;
const orm_1 = require("@midwayjs/orm");
const typeorm_1 = require("typeorm");
const lodash_1 = require("lodash");
const enum_1 = require("../enum");
/**
 * 交易明细.一次交易对应两条流水明细.即交易的双方各产生一条记录
 */
let TransactionDetailInfo = class TransactionDetailInfo {
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
], TransactionDetailInfo.prototype, "serialNo", void 0);
__decorate([
    typeorm_1.Column({ type: 'bigint', comment: '交易记录ID' }),
    __metadata("design:type", String)
], TransactionDetailInfo.prototype, "transactionRecordId", void 0);
__decorate([
    typeorm_1.Index(),
    typeorm_1.Column({ type: 'varchar', length: 32, comment: '账户ID' }),
    __metadata("design:type", Number)
], TransactionDetailInfo.prototype, "accountId", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', comment: '账户类型' }),
    __metadata("design:type", Number)
], TransactionDetailInfo.prototype, "accountType", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', default: '', length: 32, comment: '账户名' }),
    __metadata("design:type", String)
], TransactionDetailInfo.prototype, "accountName", void 0);
__decorate([
    typeorm_1.Index(),
    typeorm_1.Column({ type: 'varchar', length: 32, comment: '对方账户ID' }),
    __metadata("design:type", Number)
], TransactionDetailInfo.prototype, "reciprocalAccountId", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', comment: '账户类型' }),
    __metadata("design:type", Number)
], TransactionDetailInfo.prototype, "reciprocalAccountType", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 32, comment: '对方账户名' }),
    __metadata("design:type", String)
], TransactionDetailInfo.prototype, "reciprocalAccountName", void 0);
__decorate([
    typeorm_1.Column({ type: 'decimal', precision: 10, scale: 2, comment: '交易金额' }),
    __metadata("design:type", Number)
], TransactionDetailInfo.prototype, "transactionAmount", void 0);
__decorate([
    typeorm_1.Column({ type: 'decimal', precision: 10, scale: 2, comment: '交易前的余额' }),
    __metadata("design:type", String)
], TransactionDetailInfo.prototype, "beforeBalance", void 0);
__decorate([
    typeorm_1.Column({ type: 'decimal', precision: 10, scale: 2, comment: '交易后的余额' }),
    __metadata("design:type", String)
], TransactionDetailInfo.prototype, "afterBalance", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', default: 1, comment: '交易类型' }),
    __metadata("design:type", Number)
], TransactionDetailInfo.prototype, "transactionType", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', default: '', length: 256, comment: '摘要' }),
    __metadata("design:type", String)
], TransactionDetailInfo.prototype, "digest", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', default: '', length: 256, comment: '备注' }),
    __metadata("design:type", String)
], TransactionDetailInfo.prototype, "remark", void 0);
__decorate([
    typeorm_1.Column({ type: 'json', comment: '摘要' }),
    __metadata("design:type", Object)
], TransactionDetailInfo.prototype, "attachInfo", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 1024, comment: '加密盐值' }),
    __metadata("design:type", String)
], TransactionDetailInfo.prototype, "saltValue", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 1024, comment: '数据签名' }),
    __metadata("design:type", String)
], TransactionDetailInfo.prototype, "signature", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ comment: '创建时间' }),
    __metadata("design:type", Date)
], TransactionDetailInfo.prototype, "createDate", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ comment: '更新时间' }),
    __metadata("design:type", Date)
], TransactionDetailInfo.prototype, "updateDate", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', default: 1, comment: '状态 1:交易确认中 2:交易成功 3:交易取消 4:交易失败' }),
    __metadata("design:type", Number)
], TransactionDetailInfo.prototype, "status", void 0);
TransactionDetailInfo = __decorate([
    orm_1.EntityModel('account-transaction-details')
], TransactionDetailInfo);
exports.TransactionDetailInfo = TransactionDetailInfo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3VudC10cmFuc2FjdGlvbi1kZXRhaWwuanMiLCJzb3VyY2VSb290IjoiRDov5bel5L2cL2ZyZWVsb2ctcGF5LXNlcnZpY2Uvc3JjLyIsInNvdXJjZXMiOlsiZW50aXR5L2FjY291bnQtdHJhbnNhY3Rpb24tZGV0YWlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHVDQUEwQztBQUMxQyxxQ0FBeUY7QUFDekYsbUNBQTRCO0FBQzVCLGtDQUFvRjtBQUdwRjs7R0FFRztBQUVILElBQWEscUJBQXFCLEdBQWxDLE1BQWEscUJBQXFCO0lBNEg5Qjs7T0FFRztJQUNILE1BQU07UUFDRixPQUFPLGFBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUNsRCxDQUFDO0NBQ0osQ0FBQTtBQTVIRztJQURDLHVCQUFhLENBQUMsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUMsQ0FBQzs7dURBQ2hDO0FBTWpCO0lBREMsZ0JBQU0sQ0FBQyxFQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBQyxDQUFDOztrRUFDaEI7QUFPNUI7SUFGQyxlQUFLLEVBQUU7SUFDUCxnQkFBTSxDQUFDLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUMsQ0FBQzs7d0RBQ3JDO0FBTWxCO0lBREMsZ0JBQU0sQ0FBQyxFQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBQyxDQUFDOzswREFDVjtBQU03QjtJQURDLGdCQUFNLENBQUMsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFDLENBQUM7OzBEQUMvQztBQU9wQjtJQUZDLGVBQUssRUFBRTtJQUNQLGdCQUFN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