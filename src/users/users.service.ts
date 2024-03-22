import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Builder, By, WebDriver, until } from 'selenium-webdriver';

@Injectable()
export class UsersService {
  private static driver: WebDriver;
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
    if (!UsersService.driver) {
      UsersService.driver = new Builder().forBrowser('chrome').build();
    }
  }

  async scrapeUserData(linkedinUrl: string, username: string) {
    try {
      await UsersService.driver.get(linkedinUrl);

      // Wait for the name element to be visible
      const nameElement = await UsersService.driver.wait(
        until.elementLocated(
          By.xpath('//h1[contains(@class, "text-heading-xlarge")]'),
        ),
      );
      const imageElement = await UsersService.driver.wait(
        until.elementLocated(By.css('.pv-top-card-profile-picture__image')),
      );

      const name = await nameElement.getText();
      const imageUrl = await imageElement.getAttribute('src');

      const user = this.userModel
        .findOneAndUpdate(
          { username },
          { name, profilePictureUrl: imageUrl, profile: linkedinUrl },
          { upsert: true, new: true },
        )
        .exec();

      return user;
      // // Extract other profile information similarly...
      // return {
      //   name,
      //   username,
      //   imageUrl,
      //   profile: linkedinUrl, // Assuming you want to include the LinkedIn URL in the profile data
      //   // Other profile data...
      // };
    } catch (error) {
      throw new Error(`Error scraping user data: ${error.message}`);
    }
  }

  async quitDriver() {
    if (UsersService.driver) {
      await UsersService.driver.quit();
      UsersService.driver = null; // Reset the driver instance
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (!createUserDto.password) {
      throw new Error('Password is required');
    }

    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User | null> {
    return this.userModel.findById(id, { password: 0 }).exec();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
