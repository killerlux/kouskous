import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DepositsService } from '../src/modules/deposits/deposits.service';
import { Deposit } from '../src/modules/deposits/deposit.entity';
import { EarningsService } from '../src/modules/earnings/earnings.service';

describe('DepositsService', () => {
  let service: DepositsService;
  let repository: jest.Mocked<Repository<Deposit>>;
  let earningsService: jest.Mocked<any>;

  const mockDriverId = '123e4567-e89b-12d3-a456-426614174000';
  const mockAdminId = '223e4567-e89b-12d3-a456-426614174000';
  const mockDepositId = '323e4567-e89b-12d3-a456-426614174000';

  const mockDeposit = {
    id: mockDepositId,
    driver_id: mockDriverId,
    amount_cents: 100000,
    receipt_url: 'https://storage.example.com/receipt.jpg',
    status: 'submitted' as const,
    notes: null,
    created_at: new Date(),
    decided_at: null,
    decided_by: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepositsService,
        {
          provide: getRepositoryToken(Deposit),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: EarningsService,
          useValue: {
            checkDriverLock: jest.fn(),
            debitDeposit: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<DepositsService>(DepositsService);
    repository = module.get(getRepositoryToken(Deposit));
    earningsService = module.get(EarningsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('submitDeposit', () => {
    it('should create deposit submission when driver is locked', async () => {
      earningsService.checkDriverLock.mockResolvedValue({
        locked: true,
        balance_cents: 120000,
        threshold_cents: 100000,
      });
      repository.create.mockReturnValue(mockDeposit as any);
      repository.save.mockResolvedValue(mockDeposit as any);

      const result = await service.submitDeposit(
        mockDriverId,
        100000,
        'https://storage.example.com/receipt.jpg',
      );

      expect(earningsService.checkDriverLock).toHaveBeenCalledWith(mockDriverId);
      expect(repository.create).toHaveBeenCalledWith({
        driver_id: mockDriverId,
        amount_cents: 100000,
        receipt_url: 'https://storage.example.com/receipt.jpg',
        status: 'submitted',
      });
      expect(repository.save).toHaveBeenCalled();
      expect(result.status).toBe('submitted');
    });

    it('should reject deposit if driver is not locked', async () => {
      earningsService.checkDriverLock.mockResolvedValue({
        locked: false,
        balance_cents: 50000,
        threshold_cents: 100000,
      });

      await expect(
        service.submitDeposit(mockDriverId, 100000, 'https://example.com/receipt.jpg'),
      ).rejects.toThrow(BadRequestException);

      expect(repository.create).not.toHaveBeenCalled();
    });

    it('should reject negative amounts', async () => {
      earningsService.checkDriverLock.mockResolvedValue({
        locked: true,
        balance_cents: 120000,
        threshold_cents: 100000,
      });

      await expect(
        service.submitDeposit(mockDriverId, -1000, 'https://example.com/receipt.jpg'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject empty receipt URL', async () => {
      earningsService.checkDriverLock.mockResolvedValue({
        locked: true,
        balance_cents: 120000,
        threshold_cents: 100000,
      });

      await expect(
        service.submitDeposit(mockDriverId, 100000, ''),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findById', () => {
    it('should return deposit if found', async () => {
      repository.findOne.mockResolvedValue(mockDeposit as any);

      const result = await service.findById(mockDepositId);

      expect(result).toEqual(mockDeposit);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: mockDepositId },
        relations: ['driver'],
      });
    });

    it('should throw NotFoundException if deposit not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('approveDeposit', () => {
    it('should approve submitted deposit and debit earnings', async () => {
      const submittedDeposit = { ...mockDeposit, status: 'submitted' };
      repository.findOne.mockResolvedValue(submittedDeposit as any);
      repository.save.mockResolvedValue({
        ...submittedDeposit,
        status: 'approved',
        decided_at: new Date(),
        decided_by: mockAdminId,
      } as any);

      const result = await service.approveDeposit(mockDepositId, mockAdminId);

      expect(result.status).toBe('approved');
      expect(result.decided_at).toBeDefined();
      expect(result.decided_by).toBe(mockAdminId);
      expect(earningsService.debitDeposit).toHaveBeenCalledWith(
        mockDriverId,
        100000,
        expect.stringContaining('Approved deposit'),
      );
    });

    it('should reject approving already-decided deposit', async () => {
      const approvedDeposit = {
        ...mockDeposit,
        status: 'approved',
        decided_at: new Date(),
      };
      repository.findOne.mockResolvedValue(approvedDeposit as any);

      await expect(
        service.approveDeposit(mockDepositId, mockAdminId),
      ).rejects.toThrow(BadRequestException);

      expect(earningsService.debitDeposit).not.toHaveBeenCalled();
    });
  });

  describe('rejectDeposit', () => {
    it('should reject submitted deposit with reason', async () => {
      const submittedDeposit = { ...mockDeposit, status: 'submitted' };
      repository.findOne.mockResolvedValue(submittedDeposit as any);
      repository.save.mockResolvedValue({
        ...submittedDeposit,
        status: 'rejected',
        decided_at: new Date(),
        decided_by: mockAdminId,
        notes: 'Fraudulent receipt',
      } as any);

      const result = await service.rejectDeposit(
        mockDepositId,
        mockAdminId,
        'Fraudulent receipt',
      );

      expect(result.status).toBe('rejected');
      expect(result.decided_at).toBeDefined();
      expect(result.decided_by).toBe(mockAdminId);
      expect(result.notes).toBe('Fraudulent receipt');
      expect(earningsService.debitDeposit).not.toHaveBeenCalled();
    });

    it('should reject rejecting already-decided deposit', async () => {
      const rejectedDeposit = {
        ...mockDeposit,
        status: 'rejected',
        decided_at: new Date(),
      };
      repository.findOne.mockResolvedValue(rejectedDeposit as any);

      await expect(
        service.rejectDeposit(mockDepositId, mockAdminId, 'Reason'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getDriverDeposits', () => {
    it('should return deposits for a driver', async () => {
      const deposits = [
        mockDeposit,
        { ...mockDeposit, id: 'another-id', status: 'approved' as const },
      ];
      repository.find.mockResolvedValue(deposits as any);

      const result = await service.getDriverDeposits(mockDriverId);

      expect(result).toEqual(deposits);
      expect(repository.find).toHaveBeenCalledWith({
        where: { driver_id: mockDriverId },
        order: { created_at: 'DESC' },
      });
    });
  });

  describe('getPendingDeposits', () => {
    it('should return all submitted deposits', async () => {
      const pendingDeposits = [mockDeposit];
      repository.find.mockResolvedValue(pendingDeposits as any);

      const result = await service.getPendingDeposits();

      expect(result).toEqual(pendingDeposits);
      expect(repository.find).toHaveBeenCalledWith({
        where: { status: 'submitted' },
        order: { created_at: 'ASC' },
        relations: ['driver'],
      });
    });
  });
});

