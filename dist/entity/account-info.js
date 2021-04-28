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
exports.AccountInfo = void 0;
const orm_1 = require("@midwayjs/orm");
const typeorm_1 = require("typeorm");
const lodash_1 = require("lodash");
const enum_1 = require("../enum");
/**
 * 平台代币账户
 */
let AccountInfo = class AccountInfo {
    /**
     * 自定义序列化
     */
    toJSON() {
        return lodash_1.omit(this, ['password', 'signature', 'saltValue']);
    }
};
__decorate([
    typeorm_1.PrimaryColumn({ type: 'varchar', length: 32, comment: '账户ID' }),
    __metadata("design:type", Number)
], AccountInfo.prototype, "accountId", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', default: '', length: 32, comment: '账户名' }),
    __metadata("design:type", String)
], AccountInfo.prototype, "accountName", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', comment: '账户类型' }),
    __metadata("design:type", Number)
], AccountInfo.prototype, "accountType", void 0);
__decorate([
    typeorm_1.Index(),
    typeorm_1.Column({ type: 'varchar', comment: '账户所属者ID' }),
    __metadata("design:type", String)
], AccountInfo.prototype, "ownerId", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', default: '', comment: '账户所属者用户名' }),
    __metadata("design:type", String)
], AccountInfo.prototype, "ownerName", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', default: 0, comment: '账户所属人用户ID' }),
    __metadata("design:type", Number)
], AccountInfo.prototype, "ownerUserId", void 0);
__decorate([
    typeorm_1.Column({ type: 'decimal', default: 0, precision: 10, scale: 2, comment: '账户余额(最小货币单位)' }),
    __metadata("design:type", String)
], AccountInfo.prototype, "balance", void 0);
__decorate([
    typeorm_1.Column({ type: 'decimal', default: 0, precision: 10, scale: 2, comment: '冻结金额' }),
    __metadata("design:type", String)
], AccountInfo.prototype, "freezeBalance", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 1024, comment: '密码' }),
    __metadata("design:type", String)
], AccountInfo.prototype, "password", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 256, comment: '加密盐值' }),
    __metadata("design:type", String)
], AccountInfo.prototype, "saltValue", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 256, comment: '数据签名' }),
    __metadata("design:type", String)
], AccountInfo.prototype, "signature", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', default: 1, comment: '状态 1:正常 2:冻结' }),
    __metadata("design:type", Number)
], AccountInfo.prototype, "status", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ comment: '创建时间' }),
    __metadata("design:type", Date)
], AccountInfo.prototype, "createDate", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ comment: '更新时间' }),
    __metadata("design:type", Date)
], AccountInfo.prototype, "updateDate", void 0);
AccountInfo = __decorate([
    orm_1.EntityModel('accounts')
], AccountInfo);
exports.AccountInfo = AccountInfo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3VudC1pbmZvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2VudGl0eS9hY2NvdW50LWluZm8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsdUNBQTBDO0FBQzFDLHFDQUF5RjtBQUN6RixtQ0FBNEI7QUFDNUIsa0NBQXdDO0FBRXhDOztHQUVHO0FBRUgsSUFBYSxXQUFXLEdBQXhCLE1BQWEsV0FBVztJQXVGcEI7O09BRUc7SUFDSCxNQUFNO1FBQ0YsT0FBTyxhQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsVUFBVSxFQUFFLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO0lBQzlELENBQUM7Q0FDSixDQUFBO0FBdkZHO0lBREMsdUJBQWEsQ0FBQyxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFDLENBQUM7OzhDQUM1QztBQU1sQjtJQURDLGdCQUFNLENBQUMsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFDLENBQUM7O2dEQUMvQztBQU1wQjtJQURDLGdCQUFNLENBQUMsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUMsQ0FBQzs7Z0RBQ1Y7QUFPN0I7SUFGQyxlQUFLLEVBQUU7SUFDUCxnQkFBTSxDQUFDLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFDLENBQUM7OzRDQUM5QjtBQU1oQjtJQURDLGdCQUFNLENBQUMsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBQyxDQUFDOzs4Q0FDMUM7QUFNbEI7SUFEQyxnQkFBTSxDQUFDLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUMsQ0FBQzs7Z0RBQ3BDO0FBTXBCO0lBREMsZ0JBQU0sQ0FBQyxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBQyxDQUFDOzs0Q0FDeEU7QUFNaEI7SUFEQyxnQkFBTSxDQUFDLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFDLENBQUM7O2tEQUMxRDtBQU10QjtJQURDLGdCQUFNLENBQUMsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBQyxDQUFDOzs2Q0FDdEM7QUFNakI7SUFEQyxnQkFBTSxDQUFDLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUMsQ0FBQzs7OENBQ3RDO0FBTWxCO0lBREMsZ0JBQU0sQ0FBQyxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFDLENBQUM7OzhDQUN0QztBQU1sQjtJQURDLGdCQUFNLENBQUMsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBQyxDQUFDOzsyQ0FDNUM7QUFNZjtJQURDLDBCQUFnQixDQUFDLEVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBQyxDQUFDOzhCQUN4QixJQUFJOytDQUFDO0FBTWpCO0lBREMsMEJBQWdCLENBQUMsRUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFDLENBQUM7OEJBQ3hCLElBQUk7K0NBQUM7QUFyRlIsV0FBVztJQUR2QixpQkFBVyxDQUFDLFVBQVUsQ0FBQztHQUNYLFdBQVcsQ0E2RnZCO0FBN0ZZLGtDQUFXIn0=