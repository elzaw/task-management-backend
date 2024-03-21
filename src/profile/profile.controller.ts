// profile.controller.ts
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  async getUserProfile(@Body() requestBody: { linkedinUrl: string }) {
    const { linkedinUrl } = requestBody;
    const profileData = await this.profileService.scrapeUserData(linkedinUrl);
    return profileData;
  }
}
