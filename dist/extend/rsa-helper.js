"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RsaHelper = void 0;
const NodeRSA = require("node-rsa");
const egg_freelog_base_1 = require("egg-freelog-base");
const decorator_1 = require("@midwayjs/decorator");
let RsaHelper = class RsaHelper {
    constructor() {
        this.nodeRSA = new NodeRSA();
    }
    /**
     * 构建秘钥
     * @param publicKey
     * @param privateKey
     */
    build(publicKey, privateKey) {
        if (publicKey) {
            this.nodeRSA.importKey(publicKey);
        }
        if (privateKey) {
            this.nodeRSA.importKey(privateKey);
        }
        if (this.nodeRSA.isEmpty()) {
            throw new egg_freelog_base_1.ApplicationError('私钥或公钥最少需要一个');
        }
        return this;
    }
    /**
     * 验证签名
     * @param text
     * @param sign
     * @param sourceEncoding
     * @param signatureEncoding
     */
    verifySign(text, sign, sourceEncoding = 'utf8', signatureEncoding = 'base64') {
        if (this.nodeRSA?.isEmpty()) {
            throw new egg_freelog_base_1.ApplicationError('没有提供任何秘钥信息');
        }
        return this.nodeRSA.verify(text, sign, sourceEncoding, signatureEncoding);
    }
    /**
     * 公钥加密
     * @param text
     * @param encoding
     * @param sourceEncoding
     */
    publicKeyEncrypt(text, encoding = 'base64', sourceEncoding = 'utf8') {
        if (!this.nodeRSA?.isPublic()) {
            throw new egg_freelog_base_1.ApplicationError('没有提供公钥信息');
        }
        return this.nodeRSA.encrypt(text, encoding, sourceEncoding);
    }
    /**
     * 公钥解密
     * @param text
     * @param encoding
     */
    publicKeyDecrypt(text, encoding = 'utf8') {
        if (!this.nodeRSA?.isPublic()) {
            throw new egg_freelog_base_1.ApplicationError('没有提供公钥信息');
        }
        return this.nodeRSA.decryptPublic(text, encoding);
    }
    /**
     * 私钥加密
     * @param text
     * @param encoding
     * @param sourceEncoding
     */
    privateKeyEncrypt(text, encoding = 'base64', sourceEncoding = 'utf8') {
        if (!this.nodeRSA?.isPrivate()) {
            throw new egg_freelog_base_1.ApplicationError('没有提供私钥信息');
        }
        return this.nodeRSA.encryptPrivate(text, encoding, sourceEncoding);
    }
    /**
     * 私钥解密
     * @param text
     * @param encoding
     */
    privateKeyDecrypt(text, encoding = 'utf8') {
        if (!this.nodeRSA?.isPrivate()) {
            throw new egg_freelog_base_1.ApplicationError('没有提供私钥信息');
        }
        return this.nodeRSA.decrypt(text, encoding);
    }
    /**
     * 私钥签名
     * @param text
     * @param encoding
     * @param sourceEncoding
     */
    sign(text, encoding = 'base64', sourceEncoding = 'utf8') {
        if (!this.nodeRSA?.isPrivate()) {
            throw new egg_freelog_base_1.ApplicationError('没有提供私钥信息');
        }
        return this.nodeRSA.sign(text, encoding, sourceEncoding);
    }
    /**
     * 测试使用的nodeRSA实例
     */
    get testInstance() {
        const publicKey = `-----BEGIN RSA PUBLIC KEY-----
                            MIIBCgKCAQEArODgmmq9Vi50EM9HoD5L+sHNUQumvTweyzDihnm20xvr8I68lzwz
                            o/rzkUVNRwRoebWblKV8yHM/17lJfyF1/P9m0p2i3/sihfZT3WDf80/CrjcfMYFE
                            adwMVQoq8T6TEUxQJHwdcsqSuS9Hj56fWi+Myqs7kX0v9neyExya4bQ7TnziRhQ3
                            LNEN/EJOrX4UYhSy4FUuK6nC6POomsbcN4qBZbSDb/9xw9pxpjmkdjH8yCfFmvKJ
                            tKy64sr5if5OlCBdQ08yC+OQlvHM4rFNbgYz6c7Ozw1GL2N/nGtxH4+ktAQs3/c5
                            gY+XlHB5bChu2guYCNSR7zJ1Bmr+ol1LmwIDAQAB
                            -----END RSA PUBLIC KEY-----`;
        const privateKey = `-----BEGIN RSA PRIVATE KEY-----
                            MIIEpAIBAAKCAQEArODgmmq9Vi50EM9HoD5L+sHNUQumvTweyzDihnm20xvr8I68
                            lzwzo/rzkUVNRwRoebWblKV8yHM/17lJfyF1/P9m0p2i3/sihfZT3WDf80/Crjcf
                            MYFEadwMVQoq8T6TEUxQJHwdcsqSuS9Hj56fWi+Myqs7kX0v9neyExya4bQ7Tnzi
                            RhQ3LNEN/EJOrX4UYhSy4FUuK6nC6POomsbcN4qBZbSDb/9xw9pxpjmkdjH8yCfF
                            mvKJtKy64sr5if5OlCBdQ08yC+OQlvHM4rFNbgYz6c7Ozw1GL2N/nGtxH4+ktAQs
                            3/c5gY+XlHB5bChu2guYCNSR7zJ1Bmr+ol1LmwIDAQABAoIBAQCFBSdtSbJT7Lx7
                            7rIjN6wIzzRnJvruYqMjH4M9i8vEFpjt6TZte/IUO9VMMzHp8hddhwKmVst0BVHb
                            cIN/4cRCnlaEuqyHgVooD8ip74+CTR30JQ/IbLmyZpHKoV83bzmENt73o9SY7gwF
                            l76NYLUmlK3Vh/n20YelMqZ/lCQMg/dZGOUgelGKER/hDL70mm3LtjID8xqB2miO
                            kXdmc8t/e79ti+HAZiiXiGQYQ8qFVvxecmzQ8WRDKbCJCuj+Mh1kwLmlsXFNhO0l
                            +wDCV0ArLutqP3s6TnwdS6Hp3RIuiKTl6mbJ+j6FuzcKWykn9I2qIeeuYrBs9foq
                            Xb5HWerhAoGBAOew2FGxfnTrFBZqlCZdGTYWJFl1VActGx49PXQS2v4m3ck5qurB
                            61DF3BjWPe8a8JHelzvyY1dhRp+yj/xjkEVzuHwmC7UVAX5ztUG+i8+Ye6PDpM1k
                            Q8BNl3iPUhpF2zgdT+k2+PwBAkB0rv9vJ4GQ9pwR7c+BEXRZkEfSfjYRAoGBAL8E
                            WOLV3QJrJmoSaSP03X9gvOi17M7RfgPg1rYL9sMd7GlV1kZr82EltU5YnJAiQzYO
                            pT0r/NIUdXbvVVoJdkG/QN+au4KdaT+VkR3epva2Qi6r60LHr6pdKScIEW9H/uv4
                            Epw0fn0vCF0kXUVmE5CwZiKm7/GwwgH/m/VbFQrrAoGBAJ01tQJxsoG5BQ9U0CPb
                            5gB6M73zy8l2xMDXAvzg0nHDg5hHpf7XCEnth7Peo3W7zOLdq7bEeL3QxrAT5Hl4
                            QWuu4s5yrlz33OSltKbgmVOKftKXLRsk3of83juy3B3xqpc/5Ho1j+rG8HU194xh
                            KuhSqdMqoze6t1JAd5MUdAlRAoGAd9dlYONmZqcNEc19M3bkJI9v1dyVtugOVKaS
                            buKwrZevhCK7bbE6n7+FsaK8j10/p8Gmf+uCEdeOHtFnTjbTf8pbDC7K59aUerT+
                            t6vCOtT8TsXDs0EPACa0s+1G6vdTg34/RstUdHu2lqFC91BkhAl3+tObhJouDgzt
                            LxE28YMCgYAEQWnPAre6XuWSNEXhIVdVfuU7foQi60szo/qPfvL8hx+B7xjqeb9z
                            akMbdN0vU/WRchUKN+yAE+bDkNfhACKAFL9byw5xs7dFPenLC87/PzPBnHCNqJVF
                            XoqyriVhCSM71Dvmt1NBTdUjq72FVgVptKK9c9A8PSqUfoiMWGw1FA==
                            -----END RSA PRIVATE KEY-----`;
        return this.build(publicKey, privateKey);
    }
};
RsaHelper = __decorate([
    decorator_1.Provide()
], RsaHelper);
exports.RsaHelper = RsaHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnNhLWhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiJEOi/lt6XkvZwvZnJlZWxvZy1wYXktc2VydmljZS9zcmMvIiwic291cmNlcyI6WyJleHRlbmQvcnNhLWhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxvQ0FBb0M7QUFDcEMsdURBQWtEO0FBQ2xELG1EQUE0QztBQUc1QyxJQUFhLFNBQVMsR0FBdEIsTUFBYSxTQUFTO0lBQXRCO1FBRUksWUFBTyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7SUEwSTVCLENBQUM7SUF4SUc7Ozs7T0FJRztJQUNILEtBQUssQ0FBQyxTQUFrQixFQUFFLFVBQW1CO1FBQ3pDLElBQUksU0FBUyxFQUFFO1lBQ1gsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDckM7UUFDRCxJQUFJLFVBQVUsRUFBRTtZQUNaLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ3RDO1FBQ0QsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQ3hCLE1BQU0sSUFBSSxtQ0FBZ0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUM3QztRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxVQUFVLENBQUMsSUFBWSxFQUFFLElBQVksRUFBRSxjQUFjLEdBQUcsTUFBTSxFQUFFLGlCQUFpQixHQUFHLFFBQVE7UUFDeEYsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxFQUFFO1lBQ3pCLE1BQU0sSUFBSSxtQ0FBZ0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUM1QztRQUNELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztJQUM5RSxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxnQkFBZ0IsQ0FBQyxJQUFZLEVBQUUsUUFBUSxHQUFHLFFBQVEsRUFBRSxjQUFjLEdBQUcsTUFBTTtRQUN2RSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFBRTtZQUMzQixNQUFNLElBQUksbUNBQWdCLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDMUM7UUFDRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxnQkFBZ0IsQ0FBQyxJQUFZLEVBQUUsUUFBUSxHQUFHLE1BQU07UUFDNUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQUU7WUFDM0IsTUFBTSxJQUFJLG1DQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQzFDO1FBQ0QsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsaUJBQWlCLENBQUMsSUFBWSxFQUFFLFFBQVEsR0FBRyxRQUFRLEVBQUUsY0FBYyxHQUFHLE1BQU07UUFDeEUsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUU7WUFDNUIsTUFBTSxJQUFJLG1DQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQzFDO1FBQ0QsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsaUJBQWlCLENBQUMsSUFBWSxFQUFFLFFBQVEsR0FBRyxNQUFNO1FBQzdDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxFQUFFO1lBQzVCLE1BQU0sSUFBSSxtQ0FBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUMxQztRQUNELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILElBQUksQ0FBQyxJQUFZLEVBQUUsUUFBUSxHQUFHLFFBQVEsRUFBRSxjQUFjLEdBQUcsTUFBTTtRQUMzRCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsRUFBRTtZQUM1QixNQUFNLElBQUksbUNBQWdCLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDMUM7UUFDRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVEOztPQUVHO0lBQ0gsSUFBSSxZQUFZO1FBQ1osTUFBTSxTQUFTLEdBQUc7Ozs7Ozs7eURBTytCLENBQUM7UUFDbEQsTUFBTSxVQUFVLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzBEQTBCK0IsQ0FBQztRQUNuRCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzdDLENBQUM7Q0FDSixDQUFBO0FBNUlZLFNBQVM7SUFEckIsbUJBQU8sRUFBRTtHQUNHLFNBQVMsQ0E0SXJCO0FBNUlZLDhCQUFTIn0=