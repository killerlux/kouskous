import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './document.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
  ) {}

  async create(driverId: string, kind: Document['kind'], url: string): Promise<Document> {
    const document = this.documentsRepository.create({
      driver: { id: driverId },
      kind,
      url,
      status: 'pending',
    });
    return this.documentsRepository.save(document);
  }
}

