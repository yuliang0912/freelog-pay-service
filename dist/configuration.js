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
let ContainerLifeCycle = class ContainerLifeCycle {
    onReady(container) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlndXJhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiJEOi/lt6XkvZwvZnJlZWxvZy1wYXktc2VydmljZS9zcmMvIiwic291cmNlcyI6WyJjb25maWd1cmF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLG1EQUFrRDtBQUNsRCxxQ0FBcUM7QUFLckMsSUFBYSxrQkFBa0IsR0FBL0IsTUFBYSxrQkFBa0I7SUFFM0IsT0FBTyxDQUFDLFNBQTJCO1FBQy9CLE9BQU8sU0FBUyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUEyQjtRQUNwQyxTQUFTLENBQUMsUUFBUSxDQUFjLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRTtZQUM5RCxXQUFXLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDN0IsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0osQ0FBQTtBQVhZLGtCQUFrQjtJQUQ5Qix5QkFBYSxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUMsQ0FBQztHQUNuQixrQkFBa0IsQ0FXOUI7QUFYWSxnREFBa0IifQ==