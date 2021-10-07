import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  serializeUser(
    user: UserDocument,
    done: (err: Error, user: any) => void,
  ): any {
    done(null, { id: user.id });
  }

  async deserializeUser(
    payload: { id: string },
    done: (err: Error, payload: UserDocument) => void,
  ) {
    const user = await this.userService.getById(payload.id);
    done(null, user);
  }
}
