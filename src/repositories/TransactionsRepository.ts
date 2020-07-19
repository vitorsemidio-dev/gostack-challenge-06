import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const [listIncome, listOutcome] = await Promise.all([
      this.find({ where: { type: 'income' } }),
      this.find({ where: { type: 'outcome' } }),
    ]);

    const sumIncome = listIncome.reduce((acc, cur) => {
      return Number(acc) + Number(cur.value);
    }, 0.0);

    const sumOutcome = listOutcome.reduce((acc, cur) => {
      return Number(acc) + Number(cur.value);
    }, 0.0);

    const total = sumIncome - sumOutcome;

    const balance = { income: sumIncome, outcome: sumOutcome, total };

    return balance;
  }
}

export default TransactionsRepository;
