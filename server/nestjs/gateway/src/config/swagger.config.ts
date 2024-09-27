import { DocumentBuilder } from '@nestjs/swagger';

export const config = new DocumentBuilder()
  .setTitle('Test project')
  .setDescription('This is dumb project, made by silly developer')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
