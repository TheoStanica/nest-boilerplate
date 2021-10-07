import { BadRequestException, PipeTransform } from '@nestjs/common';

export class ActivationCodePipe implements PipeTransform {
  transform(value: any) {
    const regex = new RegExp(/(^[A-Fa-f0-9]{40,40}$)/);

    if (!regex.test(value)) {
      throw new BadRequestException('Invalid reset code');
    }

    return value;
  }
}
