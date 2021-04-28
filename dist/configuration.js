"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerLifeCycle = void 0;
const decorator_1 = require("@midwayjs/decorator");
const orm = require("@midwayjs/orm");
// import * as assert from 'assert';
let ContainerLifeCycle = class ContainerLifeCycle {
    onReady(container) {
        // assert(true, '111');
        return container.getAsync('kafkaStartup');
    }
    async onStop(container) {
        container.getAsync('kafkaClient').then(kafkaClient => {
            kafkaClient.disconnect();
        });
    }
};
ContainerLifeCycle = __decorate([
    decorator_1.Configuration({ imports: [orm] })
], ContainerLifeCycle);
exports.ContainerLifeCycle = ContainerLifeCycle;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlndXJhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiJEOi/lt6XkvZwvZnJlZWxvZy1wYXktc2VydmljZS9zcmMvIiwic291cmNlcyI6WyJjb25maWd1cmF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLG1EQUFrRDtBQUNsRCxxQ0FBcUM7QUFHckMsb0NBQW9DO0FBR3BDLElBQWEsa0JBQWtCLEdBQS9CLE1BQWEsa0JBQWtCO0lBRTNCLE9BQU8sQ0FBQyxTQUEyQjtRQUMvQix1QkFBdUI7UUFDdkIsT0FBTyxTQUFTLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRCxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQTJCO1FBQ3BDLFNBQVMsQ0FBQyxRQUFRLENBQWMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFO1lBQzlELFdBQVcsQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUM3QixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSixDQUFBO0FBWlksa0JBQWtCO0lBRDlCLHlCQUFhLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUFDO0dBQ25CLGtCQUFrQixDQVk5QjtBQVpZLGdEQUFrQiJ9