import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClubsModule } from './clubs/clubs.module';
import { EventsModule } from './events/events.module';
import { RegistrationsModule } from './registrations/registrations.module';
import { TicketsModule } from './tickets/tickets.module';
import { CheckinModule } from './checkin/checkin.module';
import { PaymentsModule } from './payments/payments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { SearchModule } from './search/search.module';
import { CertificatesModule } from './certificates/certificates.module';
import { MediaModule } from './media/media.module';
import { AiModule } from './ai/ai.module';
import { AdminModule } from './admin/admin.module';
import configuration from './config/configuration';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env.local', '.env'],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 10,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 50,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 200,
      },
    ]),

    // Scheduling (BullMQ jobs)
    ScheduleModule.forRoot(),

    // Core infra
    PrismaModule,
    CommonModule,

    // Feature modules
    AuthModule,
    UsersModule,
    ClubsModule,
    EventsModule,
    RegistrationsModule,
    TicketsModule,
    CheckinModule,
    PaymentsModule,
    NotificationsModule,
    AnnouncementsModule,
    AnalyticsModule,
    SearchModule,
    CertificatesModule,
    MediaModule,
    AiModule,
    AdminModule,
  ],
})
export class AppModule {}
