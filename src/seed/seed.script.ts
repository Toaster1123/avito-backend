import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeedService } from './seed.service';

async function runSeed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seedService = app.get(SeedService);

  try {
    await seedService.run();
  } catch (error) {
    console.error('Error running seed:', error);
  } finally {
    await app.close();
  }
}

runSeed();
