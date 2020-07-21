import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface IRequest {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: IRequest): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    let categoryAlreadyExists = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!categoryAlreadyExists) {
      categoryAlreadyExists = categoriesRepository.create({
        title: category,
      });
    }

    if (type === 'outcome') {
      const { total } = await transactionsRepository.getBalance();

      if (total < value) {
        throw new AppError('Invalid Balance', 400);
      }
    }

    await categoriesRepository.save(categoryAlreadyExists);

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: categoryAlreadyExists,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
