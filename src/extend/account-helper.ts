import {v4} from 'uuid';
import {AccountInfo} from '..';
import {pick, random} from 'lodash';
import {AccountTypeEnum} from '../enum';
import {LogicError} from 'egg-freelog-base';
import {Provide, Scope, ScopeEnum} from '@midwayjs/decorator';
import {base64Decode, base64Encode, hmacSha1, md5} from 'egg-freelog-base/lib/crypto-helper';

@Provide()
@Scope(ScopeEnum.Singleton)
export class AccountHelper {

    /**
     * 生成加密盐值
     */
    generateSaltValue(): string {
        return (v4() + v4()).replace(/-/g, '');
    }

    /**
     * 生成账户ID
     * @param accountType
     * @param ownerId
     */
    generateAccountId(accountType: AccountTypeEnum, ownerId: number | string): number {
        const hashCode = AccountHelper.GetHashCode(`FreelogAccount_${accountType}_${ownerId}_${new Date().toDateString()}`).toString().substr(0, 8);
        const numberSections = AccountHelper.GetNumberSection(accountType);
        const numberSection = numberSections[random(0, numberSections.length - 1)];
        const randomNum = random(1000, 9999);
        return parseInt(`${numberSection}${hashCode}${randomNum}`, 10);
    }

    /**
     * 签名账户信息,后期可以考虑修改成RSA私钥签名,公钥校验
     * @param accountInfo
     */
    accountInfoSignature(accountInfo: AccountInfo): string {

        const signFields = ['accountId', 'accountType', 'ownerId', 'balance', 'freezeBalance', 'status'];
        const signModel = pick(accountInfo, signFields);
        const signModelKeys = Object.keys(signModel).sort();

        if (signModelKeys.length !== signFields.length) {
            throw new Error('账户信息不全,缺少加密用的必要字段');
        }

        const signString = signModelKeys.reduce((acc, field) => `${acc}_${field}:${signModel[field]}`, 'account_sign_string');
        console.log(signString);
        return accountInfo.signature = hmacSha1(md5(signString), accountInfo.saltValue);
    }

    /**
     * 校验账户签名信息是否正确
     * @param accountInfo
     */
    accountSignatureVerify(accountInfo: AccountInfo): boolean {
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
    generateAccountPassword(accountId: number, accountSaltValue: string, ownerId: string, password: string): string {
        if (!/^\d{6}$/.test(password?.toString())) {
            throw new Error('交易密码必须是6位数字');
        }
        return hmacSha1(`transaction-password@${accountId}-${ownerId}-${password}`, accountSaltValue);
    }

    /**
     * 加密key(公钥,所以只用简单的做base64转换即可)
     * @param publicKey
     */
    encryptPublicKey(publicKey: string): string {
        return base64Encode(publicKey);
    }

    /**
     * 解密publicKey
     * @param encryptedPublicKey
     */
    decryptPublicKey(encryptedPublicKey: string): string {
        return base64Decode(encryptedPublicKey);
    }

    /**
     * 校验账户交易密码
     * @param accountInfo
     * @param originalPassword
     */
    verifyAccountPassword(accountInfo: AccountInfo, originalPassword: string): boolean {
        return accountInfo.password === this.generateAccountPassword(accountInfo.accountId, accountInfo.saltValue, accountInfo.ownerId, originalPassword);
    }

    /**
     * 根据账户类型获取号段范围
     * @param accountType
     */
    private static GetNumberSection(accountType: AccountTypeEnum): number[] {
        switch (accountType) {
            case AccountTypeEnum.IndividualAccount:
                return [233]; // '109', '331', '209', '102'
            case AccountTypeEnum.ContractAccount:
                return [305]; // '212', '816', '573', '119'
            case AccountTypeEnum.NodeAccount:
                return [706]; // '912', '107', '227', '339'
            case AccountTypeEnum.OrganizationAccount:
                return [508];
            default:
                throw new LogicError('不支持的账号类型');
        }
    }

    /**
     * 获取hashcode
     * @param string
     */
    private static GetHashCode(string: string): number {
        let hash = 0, i;
        for (i = 0; i < string?.length; i++) {
            hash = (((hash << 5) - hash) + string.charCodeAt(i)) & 0xFFFFFFFF;
        }
        return Math.abs(hash);
    }
}
