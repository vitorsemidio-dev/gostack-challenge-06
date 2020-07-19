// import AppError from '../errors/AppError';
import { getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';

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
    const categoriesRepository = getCustomRepository(CategoriesRepository);

    let categoryAlreadyExists = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!categoryAlreadyExists) {
      categoryAlreadyExists = categoriesRepository.create({
        title: category,
      });
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
