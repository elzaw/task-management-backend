import { Injectable } from '@nestjs/common';
import { Builder, By, until, WebDriver } from 'selenium-webdriver';

@Injectable()
export class ProfileService {
  private static driver: WebDriver;

  constructor() {
    if (!ProfileService.driver) {
      ProfileService.driver = new Builder().forBrowser('chrome').build();
    }
  }

  async scrapeUserData(linkedinUrl: string) {
    try {
      await ProfileService.driver.get(linkedinUrl);

      // Wait for the name element to be visible
      const nameElement = await ProfileService.driver.wait(
        until.elementLocated(
          By.xpath('//h1[contains(@class, "text-heading-xlarge")]'),
        ),
      );
      const imageElement = await ProfileService.driver.wait(
        until.elementLocated(By.css('.pv-top-card-profile-picture__image')),
      );

      const name = await nameElement.getText();
      const imageUrl = await imageElement.getAttribute('src');

      // Extract other profile information similarly...
      return {
        name,
        imageUrl,
        profile: linkedinUrl, // Assuming you want to include the LinkedIn URL in the profile data
        // Other profile data...
      };
    } catch (error) {
      throw new Error(`Error scraping user data: ${error.message}`);
    }
  }

  async quitDriver() {
    if (ProfileService.driver) {
      await ProfileService.driver.quit();
      ProfileService.driver = null; // Reset the driver instance
    }
  }
}
