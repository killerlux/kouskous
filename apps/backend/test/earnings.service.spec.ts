import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { EarningsService } from '../src/modules/earnings/earnings.service';
import { EarningsLedger } from '../src/modules/earnings/earnings-ledger.entity';
import { Driver } from '../src/modules/drivers/driver.entity';

describe('EarningsService', () => {
  let service: EarningsService;
  let ledgerRepo: jest.Mocked<Repository<EarningsLedger>>;
  let driverRepo: jest.Mocked<Repository<Driver>>;
  let dataSource: jest.Mocked<DataSource>;

  const mockDriverId = '123e4567-e89b-12d3-a456-426614174000';
  const mockRideId = '223e4567-e89b-12d3-a456-426614174000';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EarningsService,
        {
          provide: getRepositoryToken(EarningsLedger),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Driver),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {
            query: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EarningsService>(EarningsService);
    ledgerRepo = module.get(getRepositoryToken(EarningsLedger));
    driverRepo = module.get(getRepositoryToken(Driver));
    dataSource = module.get(DataSource);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('creditRide', () => {
    it('should create credit ledger entry for ride', async () => {
      const mockEntry = {
        id: 'entry-1',
        driver_id: mockDriverId,
        ride_id: mockRideId,
        amount_cents: 5000,
        direction: 'credit' as const,
        kind: 'ride_cash' as const,
        note: null,
        created_at: new Date(),
      };

      ledgerRepo.create.mockReturnValue(mockEntry as any);
      ledgerRepo.save.mockResolvedValue(mockEntry as any);
      dataSource.query.mockResolvedValue(undefined);

      await service.creditRide(mockDriverId, mockRideId, 5000);

      expect(ledgerRepo.create).toHaveBeenCalledWith({
        driver_id: mockDriverId,
        ride_id: mockRideId,
        amount_cents: 5000,
        direction: 'credit',
        kind: 'ride_cash',
      });
      expect(ledgerRepo.save).toHaveBeenCalled();
      expect(dataSource.query).toHaveBeenCalledWith(
        'SELECT refresh_driver_balances()',
      );
    });

    it('should reject negative amounts', async () => {
      await expect(
        service.creditRide(mockDriverId, mockRideId, -100),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getDriverBalance', () => {
    it('should return balance from materialized view', async () => {
      dataSource.query.mockResolvedValue([
        { driver_id: mockDriverId, balance_cents: 50000, last_tx_at: new Date() },
      ]);

      const result = await service.getDriverBalance(mockDriverId);

      expect(result.balance_cents).toBe(50000);
      expect(dataSource.query).toHaveBeenCalledWith(
        'SELECT * FROM driver_balances_mv WHERE driver_id = $1',
        [mockDriverId],
      );
    });

    it('should return zero balance if no transactions', async () => {
      dataSource.query.mockResolvedValue([]);

      const result = await service.getDriverBalance(mockDriverId);

      expect(result.balance_cents).toBe(0);
      expect(result.last_tx_at).toBeNull();
    });
  });

  describe('checkDriverLock', () => {
    it('should return locked=true when balance >= 100000 cents (1000 TND)', async () => {
      dataSource.query.mockResolvedValue([
        { driver_id: mockDriverId, balance_cents: 120000, last_tx_at: new Date() },
      ]);

      const result = await service.checkDriverLock(mockDriverId);

      expect(result.locked).toBe(true);
      expect(result.balance_cents).toBe(120000);
      expect(result.threshold_cents).toBe(100000);
    });

    it('should return locked=false when balance < 100000 cents', async () => {
      dataSource.query.mockResolvedValue([
        { driver_id: mockDriverId, balance_cents: 50000, last_tx_at: new Date() },
      ]);

      const result = await service.checkDriverLock(mockDriverId);

      expect(result.locked).toBe(false);
      expect(result.balance_cents).toBe(50000);
    });

    it('should return locked=false for zero balance', async () => {
      dataSource.query.mockResolvedValue([]);

      const result = await service.checkDriverLock(mockDriverId);

      expect(result.locked).toBe(false);
      expect(result.balance_cents).toBe(0);
    });
  });

  describe('debitDeposit', () => {
    it('should create debit ledger entry for deposit', async () => {
      const mockEntry = {
        id: 'entry-2',
        driver_id: mockDriverId,
        ride_id: null,
        amount_cents: 100000,
        direction: 'debit' as const,
        kind: 'deposit_lock' as const,
        note: 'Deposit to La Poste',
        created_at: new Date(),
      };

      ledgerRepo.create.mockReturnValue(mockEntry as any);
      ledgerRepo.save.mockResolvedValue(mockEntry as any);
      dataSource.query.mockResolvedValue(undefined);

      await service.debitDeposit(mockDriverId, 100000, 'Deposit to La Poste');

      expect(ledgerRepo.create).toHaveBeenCalledWith({
        driver_id: mockDriverId,
        // ride_id omitted for deposits
        amount_cents: 100000,
        direction: 'debit',
        kind: 'deposit_lock',
        note: 'Deposit to La Poste',
      });
      expect(ledgerRepo.save).toHaveBeenCalled();
      expect(dataSource.query).toHaveBeenCalledWith(
        'SELECT refresh_driver_balances()',
      );
    });
  });

  describe('getDriverLedger', () => {
    it('should return ledger entries for driver', async () => {
      const mockEntries = [
        {
          id: 'entry-1',
          driver_id: mockDriverId,
          amount_cents: 5000,
          direction: 'credit',
          kind: 'ride_cash',
          created_at: new Date(),
        },
        {
          id: 'entry-2',
          driver_id: mockDriverId,
          amount_cents: 100000,
          direction: 'debit',
          kind: 'deposit_lock',
          created_at: new Date(),
        },
      ];

      ledgerRepo.find.mockResolvedValue(mockEntries as any);

      const result = await service.getDriverLedger(mockDriverId, 10);

      expect(result).toEqual(mockEntries);
      expect(ledgerRepo.find).toHaveBeenCalledWith({
        where: { driver_id: mockDriverId },
        order: { created_at: 'DESC' },
        take: 10,
      });
    });
  });
});

