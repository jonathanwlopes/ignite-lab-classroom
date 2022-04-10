import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthorizationGuard } from '../auth/authorization.guard';

@Controller('test')
export class TestController {
  @UseGuards(AuthorizationGuard)
  @Get('/ok')
  hello() {
    return 'Ok';
  }
}
