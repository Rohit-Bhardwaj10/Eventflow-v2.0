import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CertificatesService } from './certificates.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('certificates')
@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  // POST /certificates/issue/:eventId — Admin issues certificates
  @Post('issue/:eventId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Issue certificates to all checked-in attendees for an event (Club Admin only)' })
  issueForEvent(
    @CurrentUser('id') userId: string,
    @Param('eventId') eventId: string,
  ) {
    return this.certificatesService.issueForEvent(userId, eventId);
  }

  // GET /certificates/my — User gets their certificates
  @Get('my')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all my certificates' })
  getMyCertificates(@CurrentUser('id') userId: string) {
    return this.certificatesService.getMyCertificates(userId);
  }

  // GET /certificates/verify/:token — Public verification
  @Get('verify/:token')
  @Public()
  @ApiOperation({ summary: 'Verify a certificate by token' })
  verifyCertificate(@Param('token') token: string) {
    return this.certificatesService.verifyCertificate(token);
  }
}
