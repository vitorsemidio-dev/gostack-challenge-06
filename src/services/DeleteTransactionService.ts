import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(idTransaction: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transaction = transactionsRepository.findOne(idTransaction);

    if (!transaction) {
      throw new AppError('Transactions does not found', 400);
    }

    await transactionsRepository.delete(idTransaction);
  }
}

export default DeleteTransactionService;
