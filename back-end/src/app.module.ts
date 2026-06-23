import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AdminModule } from "./modules/admin/admin.module";
import { AuthModule } from "./modules/auth/auth.module";
import { BookingsModule } from "./modules/bookings/bookings.module";
import { ContractsModule } from "./modules/contracts/contracts.module";
import { DatabaseModule } from "./database/database.module";
import { HealthModule } from "./modules/health/health.module";
import { ListingsModule } from "./modules/listings/listings.module";
import { MessagesModule } from "./modules/messages/messages.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { OwnerModule } from "./modules/owner/owner.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { SavedModule } from "./modules/saved/saved.module";
import { UsersModule } from "./modules/users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    HealthModule,
    AuthModule,
    UsersModule,
    ListingsModule,
    BookingsModule,
    SavedModule,
    MessagesModule,
    PaymentsModule,
    ContractsModule,
    OwnerModule,
    AdminModule,
    NotificationsModule
  ]
})
export class AppModule {}
