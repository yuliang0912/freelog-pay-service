"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
exports.default = () => {
    const config = {};
    config.cluster = {
        listen: {
            port: 5056
        }
    };
    config.orm = {
        type: 'mysql',
        host: 'mysql-test.common',
        port: 3306,
        username: 'root',
        password: 'f233109!',
        database: 'freelog-accounts',
        synchronize: true,
        logging: true,
        timezone: '+08:00',
    };
    config.kafka = {
        enable: true,
        clientId: 'freelog-pay-service',
        logLevel: kafkajs_1.logLevel.ERROR,
        brokers: ['kafka-svc.common:9093']
    };
    return config;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLnRlc3QuanMiLCJzb3VyY2VSb290IjoiRDov5bel5L2cL2ZyZWVsb2ctcGF5LXNlcnZpY2Uvc3JjLyIsInNvdXJjZXMiOlsiY29uZmlnL2NvbmZpZy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQWlDO0FBRWpDLGtCQUFlLEdBQUcsRUFBRTtJQUNoQixNQUFNLE1BQU0sR0FBUSxFQUFFLENBQUM7SUFFdkIsTUFBTSxDQUFDLE9BQU8sR0FBRztRQUNiLE1BQU0sRUFBRTtZQUNKLElBQUksRUFBRSxJQUFJO1NBQ2I7S0FDSixDQUFDO0lBRUYsTUFBTSxDQUFDLEdBQUcsR0FBRztRQUNULElBQUksRUFBRSxPQUFPO1FBQ2IsSUFBSSxFQUFFLG1CQUFtQjtRQUN6QixJQUFJLEVBQUUsSUFBSTtRQUNWLFFBQVEsRUFBRSxNQUFNO1FBQ2hCLFFBQVEsRUFBRSxVQUFVO1FBQ3BCLFFBQVEsRUFBRSxrQkFBa0I7UUFDNUIsV0FBVyxFQUFFLElBQUk7UUFDakIsT0FBTyxFQUFFLElBQUk7UUFDYixRQUFRLEVBQUUsUUFBUTtLQUNyQixDQUFDO0lBRUYsTUFBTSxDQUFDLEtBQUssR0FBRztRQUNYLE1BQU0sRUFBRSxJQUFJO1FBQ1osUUFBUSxFQUFFLHFCQUFxQjtRQUMvQixRQUFRLEVBQUUsa0JBQVEsQ0FBQyxLQUFLO1FBQ3hCLE9BQU8sRUFBRSxDQUFDLHVCQUF1QixDQUFDO0tBQ3JDLENBQUM7SUFFRixPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDLENBQUMifQ==