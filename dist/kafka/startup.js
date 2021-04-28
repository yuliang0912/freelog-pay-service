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
exports.KafkaStartup = void 0;
const client_1 = require("./client");
const decorator_1 = require("@midwayjs/decorator");
const contract_payment_confirm_result_handle_1 = require("../mq-event-handler/contract-payment-confirm-result-handle");
let KafkaStartup = class KafkaStartup {
    /**
     * 启动,连接kafka-producer,订阅topic
     */
    async startUp() {
        await this.subscribeTopics().then(() => {
            console.log('kafka topic 订阅成功!');
        }).catch(error => {
            console.log('kafka topic 订阅失败!', error.toString());
        });
        await this.kafkaClient.producer.connect().catch(error => {
            console.log('kafka producer connect failed,', error);
        });
    }
    /**
     * 订阅
     */
    async subscribeTopics() {
        const topics = [this.contractPaymentConfirmResultHandle];
        return this.kafkaClient.subscribes(topics);
    }
};
__decorate([
    decorator_1.Inject(),
    __metadata("design:type", client_1.KafkaClient)
], KafkaStartup.prototype, "kafkaClient", void 0);
__decorate([
    decorator_1.Inject(),
    __metadata("design:type", contract_payment_confirm_result_handle_1.ContractPaymentConfirmResultHandle)
], KafkaStartup.prototype, "contractPaymentConfirmResultHandle", void 0);
__decorate([
    decorator_1.Init(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KafkaStartup.prototype, "startUp", null);
KafkaStartup = __decorate([
    decorator_1.Provide(),
    decorator_1.Scope(decorator_1.ScopeEnum.Singleton)
], KafkaStartup);
exports.KafkaStartup = KafkaStartup;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhcnR1cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9rYWZrYS9zdGFydHVwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHFDQUFxQztBQUNyQyxtREFBNEU7QUFDNUUsdUhBQThHO0FBSTlHLElBQWEsWUFBWSxHQUF6QixNQUFhLFlBQVk7SUFPckI7O09BRUc7SUFFSCxLQUFLLENBQUMsT0FBTztRQUNULE1BQU0sSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDbkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDdkQsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNwRCxPQUFPLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3pELENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOztPQUVHO0lBQ0gsS0FBSyxDQUFDLGVBQWU7UUFDakIsTUFBTSxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsa0NBQWtDLENBQUMsQ0FBQztRQUN6RCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQy9DLENBQUM7Q0FDSixDQUFBO0FBMUJHO0lBREMsa0JBQU0sRUFBRTs4QkFDSSxvQkFBVztpREFBQztBQUV6QjtJQURDLGtCQUFNLEVBQUU7OEJBQzJCLDJFQUFrQzt3RUFBQztBQU12RTtJQURDLGdCQUFJLEVBQUU7Ozs7MkNBVU47QUFwQlEsWUFBWTtJQUZ4QixtQkFBTyxFQUFFO0lBQ1QsaUJBQUssQ0FBQyxxQkFBUyxDQUFDLFNBQVMsQ0FBQztHQUNkLFlBQVksQ0E2QnhCO0FBN0JZLG9DQUFZIn0=