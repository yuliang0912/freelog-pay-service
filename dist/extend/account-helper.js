"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AccountHelper_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountHelper = void 0;
const uuid_1 = require("uuid");
const lodash_1 = require("lodash");
const enum_1 = require("../enum");
const egg_freelog_base_1 = require("egg-freelog-base");
const decorator_1 = require("@midwayjs/decorator");
const crypto_helper_1 = require("egg-freelog-base/lib/crypto-helper");
let AccountHelper = AccountHelper_1 = class AccountHelper {
    /**
     * 生成加密盐值
     */
    generateSaltValue() {
        return (uuid_1.v4() + uuid_1.v4()).replace(/-/g, '');
    }
    /**
     * 生成账户ID
     * @param accountType
     * @param ownerId
     */
    generateAccountId(accountType, ownerId) {
        const hashCode = AccountHelper_1.GetHashCode(`FreelogAccount_${accountType}_${ownerId}_${new Date().toDateString()}`).toString().substr(0, 8);
        const numberSections = AccountHelper_1.GetNumberSection(accountType);
        const numberSection = numberSections[lodash_1.random(0, numberSections.length - 1)];
        const randomNum = lodash_1.random(1000, 9999);
        return parseInt(`${numberSection}${hashCode}${randomNum}`, 10);
    }
    /**
     * 签名账户信息,后期可以考虑修改成RSA私钥签名,公钥校验
     * @param accountInfo
     */
    accountInfoSignature(accountInfo) {
        const signFields = ['accountId', 'accountType', 'ownerId', 'balance', 'freezeBalance', 'status'];
        const signModel = lodash_1.pick(accountInfo, signFields);
        const signModelKeys = Object.keys(signModel).sort();
        if (signModelKeys.length !== signFields.length) {
            throw new Error('账户信息不全,缺少加密用的必要字段');
        }
        const signString = signModelKeys.reduce((acc, field) => `${acc}_${field}:${signModel[field]}`, 'account_sign_string');
        return accountInfo.signature = crypto_helper_1.hmacSha1(crypto_helper_1.md5(signString), accountInfo.saltValue);
    }
    /**
     * 校验账户签名信息是否正确
     * @param accountInfo
     */
    accountSignatureVerify(accountInfo) {
        const signature = accountInfo.signature;
        return signature === this.accountInfoSignature(accountInfo);
    }
    /**
     * 生成加密密码
     * @param accountId
     * @param accountSaltValue
     * @param ownerId
     * @param password
     */
    generateAccountPassword(accountId, accountSaltValue, ownerId, password) {
        if (!/^\d{6}$/.test(password?.toString())) {
            throw new Error('交易密码必须是6位数字');
        }
        return crypto_helper_1.hmacSha1(`transaction-password@${accountId}-${ownerId}-${password}`, accountSaltValue);
    }
    /**
     * 加密key(公钥,所以只用简单的做base64转换即可)
     * @param publicKey
     */
    encryptPublicKey(publicKey) {
        return crypto_helper_1.base64Encode(publicKey);
    }
    /**
     * 解密publicKey
     * @param encryptedPublicKey
     */
    decryptPublicKey(encryptedPublicKey) {
        return crypto_helper_1.base64Decode(encryptedPublicKey);
    }
    /**
     * 校验账户交易密码
     * @param accountInfo
     * @param originalPassword
     */
    verifyAccountPassword(accountInfo, originalPassword) {
        return accountInfo.password === this.generateAccountPassword(accountInfo.accountId, accountInfo.saltValue, accountInfo.ownerId, originalPassword);
    }
    /**
     * 根据账户类型获取号段范围
     * @param accountType
     */
    static GetNumberSection(accountType) {
        switch (accountType) {
            case enum_1.AccountTypeEnum.IndividualAccount:
                return [233]; // '109', '331', '209', '102'
            case enum_1.AccountTypeEnum.ContractAccount:
                return [305]; // '212', '816', '573', '119'
            case enum_1.AccountTypeEnum.NodeAccount:
                return [706]; // '912', '107', '227', '339'
            case enum_1.AccountTypeEnum.OrganizationAccount:
                return [508];
            default:
                throw new egg_freelog_base_1.LogicError('不支持的账号类型');
        }
    }
    /**
     * 获取hashcode
     * @param string
     */
    static GetHashCode(string) {
        let hash = 0, i;
        for (i = 0; i < string?.length; i++) {
            hash = (((hash << 5) - hash) + string.charCodeAt(i)) & 0xFFFFFFFF;
        }
        return Math.abs(hash);
    }
};
AccountHelper = AccountHelper_1 = __decorate([
    decorator_1.Provide(),
    decorator_1.Scope(decorator_1.ScopeEnum.Singleton)
], AccountHelper);
exports.AccountHelper = AccountHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3VudC1oZWxwZXIuanMiLCJzb3VyY2VSb290IjoiRDov5bel5L2cL2ZyZWVsb2ctcGF5LXNlcnZpY2Uvc3JjLyIsInNvdXJjZXMiOlsiZXh0ZW5kL2FjY291bnQtaGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSwrQkFBd0I7QUFFeEIsbUNBQW9DO0FBQ3BDLGtDQUF3QztBQUN4Qyx1REFBNEM7QUFDNUMsbURBQThEO0FBQzlELHNFQUE2RjtBQUk3RixJQUFhLGFBQWEscUJBQTFCLE1BQWEsYUFBYTtJQUV0Qjs7T0FFRztJQUNILGlCQUFpQjtRQUNiLE9BQU8sQ0FBQyxTQUFFLEVBQUUsR0FBRyxTQUFFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxpQkFBaUIsQ0FBQyxXQUE0QixFQUFFLE9BQXdCO1FBQ3BFLE1BQU0sUUFBUSxHQUFHLGVBQWEsQ0FBQyxXQUFXLENBQUMsa0JBQWtCLFdBQVcsSUFBSSxPQUFPLElBQUksSUFBSSxJQUFJLEVBQUUsQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1SSxNQUFNLGNBQWMsR0FBRyxlQUFhLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDbkUsTUFBTSxhQUFhLEdBQUcsY0FBYyxDQUFDLGVBQU0sQ0FBQyxDQUFDLEVBQUUsY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNFLE1BQU0sU0FBUyxHQUFHLGVBQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDckMsT0FBTyxRQUFRLENBQUMsR0FBRyxhQUFhLEdBQUcsUUFBUSxHQUFHLFNBQVMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFRDs7O09BR0c7SUFDSCxvQkFBb0IsQ0FBQyxXQUF3QjtRQUV6QyxNQUFNLFVBQVUsR0FBRyxDQUFDLFdBQVcsRUFBRSxhQUFhLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxlQUFlLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDakcsTUFBTSxTQUFTLEdBQUcsYUFBSSxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNoRCxNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBRXBELElBQUksYUFBYSxDQUFDLE1BQU0sS0FBSyxVQUFVLENBQUMsTUFBTSxFQUFFO1lBQzVDLE1BQU0sSUFBSSxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQztTQUN4QztRQUVELE1BQU0sVUFBVSxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxLQUFLLElBQUksU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUscUJBQXFCLENBQUMsQ0FBQztRQUV0SCxPQUFPLFdBQVcsQ0FBQyxTQUFTLEdBQUcsd0JBQVEsQ0FBQyxtQkFBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNwRixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsc0JBQXNCLENBQUMsV0FBd0I7UUFDM0MsTUFBTSxTQUFTLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQztRQUN4QyxPQUFPLFNBQVMsS0FBSyxJQUFJLENBQUMsb0JBQW9CLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILHVCQUF1QixDQUFDLFNBQWlCLEVBQUUsZ0JBQXdCLEVBQUUsT0FBZSxFQUFFLFFBQWdCO1FBQ2xHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFO1lBQ3ZDLE1BQU0sSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDbEM7UUFDRCxPQUFPLHdCQUFRLENBQUMsd0JBQXdCLFNBQVMsSUFBSSxPQUFPLElBQUksUUFBUSxFQUFFLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUNsRyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsZ0JBQWdCLENBQUMsU0FBaUI7UUFDOUIsT0FBTyw0QkFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFRDs7O09BR0c7SUFDSCxnQkFBZ0IsQ0FBQyxrQkFBMEI7UUFDdkMsT0FBTyw0QkFBWSxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxxQkFBcUIsQ0FBQyxXQUF3QixFQUFFLGdCQUF3QjtRQUNwRSxPQUFPLFdBQVcsQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDLHVCQUF1QixDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsT0FBTyxFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDdEosQ0FBQztJQUVEOzs7T0FHRztJQUNLLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxXQUE0QjtRQUN4RCxRQUFRLFdBQVcsRUFBRTtZQUNqQixLQUFLLHNCQUFlLENBQUMsaUJBQWlCO2dCQUNsQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyw2QkFBNkI7WUFDL0MsS0FBSyxzQkFBZSxDQUFDLGVBQWU7Z0JBQ2hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLDZCQUE2QjtZQUMvQyxLQUFLLHNCQUFlLENBQUMsV0FBVztnQkFDNUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsNkJBQTZCO1lBQy9DLEtBQUssc0JBQWUsQ0FBQyxtQkFBbUI7Z0JBQ3BDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqQjtnQkFDSSxNQUFNLElBQUksNkJBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUN4QztJQUNMLENBQUM7SUFFRDs7O09BR0c7SUFDSyxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQWM7UUFDckMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNoQixLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDakMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDO1NBQ3JFO1FBQ0QsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFCLENBQUM7Q0FDSixDQUFBO0FBdkhZLGFBQWE7SUFGekIsbUJBQU8sRUFBRTtJQUNULGlCQUFLLENBQUMscUJBQVMsQ0FBQyxTQUFTLENBQUM7R0FDZCxhQUFhLENBdUh6QjtBQXZIWSxzQ0FBYSJ9