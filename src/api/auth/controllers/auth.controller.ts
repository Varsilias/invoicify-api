import {
  Controller,
  Post,
  Body,
  Put,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignUpDto, SignInDto } from '../dto';
import { Public } from 'src/common/decorators/public-request.decorator';
import { UpdateUserDto } from 'src/api/user/dto/update-user.dto';
import {
  CurrentUser,
  IDecoratorUser,
} from 'src/common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign_up')
  @Public()
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('sign_in')
  @HttpCode(HttpStatus.OK)
  @Public()
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Get('get_info')
  getUserInfo(@CurrentUser() user: IDecoratorUser) {
    const { firstname, lastname, email, street, city, postCode, country } =
      user;
    return { firstname, lastname, email, street, city, postCode, country };
  }

  @Put('update_info')
  updateUserInfo(
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: IDecoratorUser,
  ) {
    return this.authService.updateUser(updateUserDto, user);
  }
}
